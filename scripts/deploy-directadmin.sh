#!/usr/bin/env bash
set -Eeuo pipefail

fail() {
  printf '[deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

validate_target() {
  local app_root="$1"
  local release_id="$2"

  [[ "$app_root" == "/home2/nyanopan/nyanopan-storefront" ]] || fail "Unexpected application root"
  [[ ! "$app_root" =~ (^|/)\.\.(/|$) ]] || fail "Application root contains a parent-directory segment"
  [[ "$release_id" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]] || fail "Invalid release identifier"
  [[ -d "$app_root" && ! -L "$app_root" ]] || fail "Application root must already exist and must not be a symlink"
}

restart_passenger() {
  local app_root="$1"
  mkdir -p "$app_root/tmp"
  touch "$app_root/tmp/restart.txt"
}

operation="${1:-}"
app_root="${2:-}"
release_id="${3:-}"

[[ "$operation" =~ ^(activate|rollback|finalize)$ ]] || fail "Expected activate, rollback, or finalize operation"
validate_target "$app_root" "$release_id"

releases="$app_root/releases"
current="$releases/current"
state="$app_root/.deploy-state-$release_id"
archive="$app_root/.deploy-$release_id.tar.gz"
wrapper_source="$app_root/.deploy-app-$release_id.js"
deploy_script="$app_root/.deploy-script-$release_id.sh"
release="$releases/$release_id"

case "$operation" in
  activate)
    [[ -f "$archive" && ! -L "$archive" ]] || fail "Uploaded release archive is missing"
    [[ -f "$wrapper_source" && ! -L "$wrapper_source" ]] || fail "Uploaded Passenger wrapper is missing"
    [[ -f "$app_root/app.js" && ! -L "$app_root/app.js" ]] || fail "Expected a regular existing app.js; refusing to replace an unknown file type"
    [[ ! -e "$release" ]] || fail "Release already exists; use a new GitHub Actions run"

    mkdir -p "$releases"
    stage="$releases/.staging-$release_id"
    [[ ! -e "$stage" ]] || fail "Release staging directory already exists"
    mkdir -m 700 "$stage"
    cleanup_stage() {
      if [[ -n "${stage:-}" && -d "$stage" ]]; then
        rm -rf -- "$stage"
      fi
    }
    trap cleanup_stage EXIT

    tar -tzf "$archive" | while IFS= read -r member; do
      normalized="$member"
      while [[ "$normalized" == ./* ]]; do
        normalized="${normalized#./}"
      done
      [[ -z "$normalized" ]] && continue
      [[ "$normalized" != /* ]] || fail "Archive contains an absolute path"
      case "/$normalized/" in
        */../*) fail "Archive contains a parent-directory path" ;;
      esac
    done
    tar -xzf "$archive" --no-same-owner -C "$stage"
    [[ -f "$stage/server.js" ]] || fail "Archive does not contain standalone server.js"
    [[ -d "$stage/node_modules" && -f "$stage/node_modules/next/package.json" ]] || fail "Archive does not contain standalone node_modules"
    [[ -f "$stage/.next/BUILD_ID" && -d "$stage/.next/static" ]] || fail "Archive is missing Next.js build or static assets"
    [[ -d "$stage/public" ]] || fail "Archive is missing the public assets directory"
    [[ -f "$stage/.next/static/deployment-id-$release_id.txt" ]] || fail "Archive is missing its deployment verification marker"

    previous=""
    if [[ -L "$current" ]]; then
      previous="$(readlink "$current")"
      [[ "$previous" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]] || fail "Current release symlink has an unexpected target"
      [[ -d "$releases/$previous" ]] || fail "Current release target does not exist"
    elif [[ -e "$current" ]]; then
      fail "Current release path exists but is not a symlink"
    fi

    legacy_created=0
    backup="$app_root/deploy-backups/app.js.before-standalone"
    if cmp -s "$wrapper_source" "$app_root/app.js"; then
      [[ -n "$previous" ]] || fail "Passenger wrapper exists without a current release"
    else
      [[ ! -e "$backup" ]] || fail "app.js differs from the managed wrapper and a legacy backup already exists; refusing to overwrite it"
      mkdir -p "$app_root/deploy-backups"
      cp -p "$app_root/app.js" "$backup"
      legacy_created=1
      printf '[deploy] Preserved the existing app.js at deploy-backups/app.js.before-standalone\n'
    fi

    mv "$stage" "$release"
    stage=""
    state_tmp="$app_root/.deploy-state-$release_id.tmp"
    printf '%s\n%s\n' "$previous" "$legacy_created" > "$state_tmp"
    mv "$state_tmp" "$state"

    next_link="$releases/.current-$release_id"
    ln -s "$release_id" "$next_link"
    mv -Tf "$next_link" "$current"

    wrapper_tmp="$app_root/.app.js-$release_id.tmp"
    cp "$wrapper_source" "$wrapper_tmp"
    chmod 644 "$wrapper_tmp"
    mv -f "$wrapper_tmp" "$app_root/app.js"
    restart_passenger "$app_root"
    printf '[deploy] Activated release %s; the prior release is retained at %s\n' "$release_id" "${previous:-<legacy app.js backup>}"
    ;;

  rollback)
    if [[ ! -f "$state" ]]; then
      printf '[deploy] No activation state found; nothing to roll back\n'
      printf 'ROLLBACK_RELEASE=unchanged\n'
      exit 0
    fi
    mapfile -t state_values < "$state"
    previous="${state_values[0]:-}"
    legacy_created="${state_values[1]:-0}"
    [[ "$legacy_created" == 0 || "$legacy_created" == 1 ]] || fail "Invalid rollback state"

    active=""
    if [[ -L "$current" ]]; then
      active="$(readlink "$current")"
    fi
    if [[ "$active" != "$release_id" ]]; then
      if [[ -z "$previous" && -z "$active" ]] || [[ -n "$previous" && "$active" == "$previous" ]]; then
        printf '[deploy] Activation did not switch the active release; leaving the existing application unchanged\n'
        rm -f -- "$state"
        printf 'ROLLBACK_RELEASE=unchanged\n'
        exit 0
      fi
      fail "Active release changed; refusing to roll back a different deployment"
    fi

    if [[ -n "$previous" ]]; then
      [[ "$previous" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ && -d "$releases/$previous" ]] || fail "Previous release is unavailable"
      rollback_link="$releases/.rollback-$release_id"
      ln -s "$previous" "$rollback_link"
      mv -Tf "$rollback_link" "$current"
      printf '[deploy] Restored previous release %s\n' "$previous"
      printf 'ROLLBACK_RELEASE=%s\n' "$previous"
    else
      rm -- "$current"
      if [[ "$legacy_created" == 1 ]]; then
        backup="$app_root/deploy-backups/app.js.before-standalone"
        [[ -f "$backup" ]] || fail "Original app.js backup is missing"
        restore_tmp="$app_root/.app.js-restore-$release_id"
        cp -p "$backup" "$restore_tmp"
        mv -f "$restore_tmp" "$app_root/app.js"
        printf '[deploy] Restored the original Passenger app.js\n'
        printf 'ROLLBACK_RELEASE=legacy\n'
      else
        fail "No previous release or original app.js backup is available"
      fi
    fi

    restart_passenger "$app_root"
    rm -f -- "$state"
    ;;

  finalize)
    rm -f -- "$archive" "$wrapper_source" "$state" "$app_root/.deploy-state-$release_id.tmp"
    rm -f -- "$deploy_script"
    printf '[deploy] Removed temporary deployment files; retained release %s and all previous releases\n' "$release_id"
    ;;
esac
