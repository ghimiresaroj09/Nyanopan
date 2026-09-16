import os
import glob

# The only logo file in use across the entire application:
# src/components/layout/header.tsx: src="/brand/logo-cloud.png?v=2"
# src/components/layout/footer.tsx: src="/brand/logo-cloud.png?v=2"
# src/components/layout/mobile-menu.tsx: src="/brand/logo-cloud.png?v=2"
# And in hero-story: /brand/logo-cloud.png (we will update the link to /brand/logo-cloud.png)

KEPT_FILES = {
    "/home/user/nyanopan-store/public/brand/logo-cloud.png",
}

# Scan all files in /home/user/nyanopan-store/public
all_public_files = []
for root, dirs, files in os.walk("/home/user/nyanopan-store/public"):
    for file in files:
        full_path = os.path.join(root, file)
        all_public_files.append(full_path)

deleted_count = 0
for f in all_public_files:
    if f not in KEPT_FILES:
        os.remove(f)
        deleted_count += 1
        print(f"Deleted: {f}")

# Also clean up empty directories under public
for root, dirs, files in os.walk("/home/user/nyanopan-store/public", topdown=False):
    for d in dirs:
        dir_path = os.path.join(root, d)
        if not os.listdir(dir_path):
            os.rmdir(dir_path)
            print(f"Removed empty dir: {dir_path}")

print(f"\nCleanup complete! Deleted {deleted_count} unused files. Kept only used logo: logo-cloud.png")
