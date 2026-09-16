/**
 * Vitest setup. jsdom does not expose Web Crypto's `subtle` API, so the
 * Node.js implementation is provided for tests that hash passwords.
 */
import { webcrypto } from "node:crypto";

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: true,
  });
}
