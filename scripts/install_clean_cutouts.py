import os
import numpy as np
from PIL import Image

# 1. Load each of the user's transparent images
# Crop tight to the bounding box
def process_cutout(src_name, dst_name):
    img = Image.open(f'/home/user/uploads/{src_name}').convert('RGBA')
    bbox = img.getbbox()
    if bbox:
        cropped = img.crop(bbox)
    else:
        cropped = img
    dst_path = f'/home/user/nyanopan-store/public/brand/{dst_name}'
    cropped.save(dst_path)
    print(f"Saved {dst_path}: {cropped.size}")

process_cutout('solo-removebg-preview.png', 'slipper_side.png')
process_cutout('side-removebg-preview.png', 'slipper_pair.png')
process_cutout('One_top-removebg-preview.png', 'slipper_profile.png')
process_cutout('One_Up__One_Side-removebg-preview.png', 'slipper_sole.png')
process_cutout('two_top-removebg-preview.png', 'slipper_top.png')

# 2. Re-bake colorways based on the new clean transparent slipper_side.png
base = Image.open('/home/user/nyanopan-store/public/brand/slipper_side.png').convert('RGBA')
arr = np.array(base, dtype=np.float32)

alpha = arr[:, :, 3]
is_shoe = alpha > 20
is_crepe = is_shoe & ((arr[:, :, 0] - arr[:, :, 2]) > 25) & (arr[:, :, 0] > 100)
is_wool = is_shoe & (~is_crepe)
grey_val = (arr[is_wool, 0] + arr[is_wool, 1] + arr[is_wool, 2]) / (3.0 * 255.0)

# Green
green_arr = arr.copy()
green_arr[is_wool, 0] = np.clip(grey_val * 62.0, 0, 255)
green_arr[is_wool, 1] = np.clip(grey_val * 96.0, 0, 255)
green_arr[is_wool, 2] = np.clip(grey_val * 68.0, 0, 255)
Image.fromarray(green_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/slipper_green.png')

# Navy
navy_arr = arr.copy()
navy_arr[is_wool, 0] = np.clip(grey_val * 42.0, 0, 255)
navy_arr[is_wool, 1] = np.clip(grey_val * 62.0, 0, 255)
navy_arr[is_wool, 2] = np.clip(grey_val * 108.0, 0, 255)
Image.fromarray(navy_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/slipper_navy.png')

# Terracotta
terra_arr = arr.copy()
terra_arr[is_wool, 0] = np.clip(grey_val * 178.0, 0, 255)
terra_arr[is_wool, 1] = np.clip(grey_val * 84.0, 0, 255)
terra_arr[is_wool, 2] = np.clip(grey_val * 58.0, 0, 255)
Image.fromarray(terra_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/slipper_terracotta.png')

# 3. Layer splits for exploded view
u_arr = arr.copy()
u_arr[~is_wool] = [0, 0, 0, 0]
Image.fromarray(u_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/layer_upper.png')

s_arr = arr.copy()
s_arr[~is_crepe] = [0, 0, 0, 0]
Image.fromarray(s_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/layer_sole.png')

# Insole layer
insole_arr = np.zeros_like(arr, dtype=np.uint8)
y_indices, x_indices = np.where(is_crepe)
if len(y_indices) > 0:
    for x in range(x_indices.min(), x_indices.max()):
        ys = np.where(is_crepe[:, x])[0]
        if len(ys) > 0:
            top_y = ys[0]
            for dy in range(-8, 3):
                if 0 <= top_y + dy < arr.shape[0]:
                    insole_arr[top_y + dy, x] = [190, 172, 145, 255]
Image.fromarray(insole_arr).save('/home/user/nyanopan-store/public/brand/layer_insole.png')

print("All transparent cutouts and dependent layers processed successfully.")
