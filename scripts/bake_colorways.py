import numpy as np
from PIL import Image

# Reference side view clean
base = Image.open('/home/user/nyanopan-store/public/brand/clean_TF3001-42_1_842x_crop_center@2x.png').convert('RGBA')
arr = np.array(base, dtype=np.float32)

# Separate wool from crepe sole:
# In crepe sole, (R - B) > 30 and R > 100
# In grey wool, R ~= G ~= B
alpha = arr[:, :, 3]
is_shoe = alpha > 20
is_crepe = is_shoe & ((arr[:, :, 0] - arr[:, :, 2]) > 32) & (arr[:, :, 0] > 110)
is_wool = is_shoe & (~is_crepe)

# Generate colorways:
# 1. Forest Green
green_arr = arr.copy()
# Tint wool towards deep olive / forest green
grey_val = (green_arr[is_wool, 0] + green_arr[is_wool, 1] + green_arr[is_wool, 2]) / (3.0 * 255.0)
green_arr[is_wool, 0] = np.clip(grey_val * 65.0, 0, 255)
green_arr[is_wool, 1] = np.clip(grey_val * 95.0, 0, 255)
green_arr[is_wool, 2] = np.clip(grey_val * 70.0, 0, 255)
Image.fromarray(green_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/shoe_side_forest_green.png')

# 2. Indigo Dusk Navy
navy_arr = arr.copy()
navy_arr[is_wool, 0] = np.clip(grey_val * 45.0, 0, 255)
navy_arr[is_wool, 1] = np.clip(grey_val * 65.0, 0, 255)
navy_arr[is_wool, 2] = np.clip(grey_val * 105.0, 0, 255)
Image.fromarray(navy_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/shoe_side_indigo_navy.png')

# 3. Terracotta Earth
terra_arr = arr.copy()
terra_arr[is_wool, 0] = np.clip(grey_val * 175.0, 0, 255)
terra_arr[is_wool, 1] = np.clip(grey_val * 85.0, 0, 255)
terra_arr[is_wool, 2] = np.clip(grey_val * 60.0, 0, 255)
Image.fromarray(terra_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/shoe_side_terracotta.png')

# 4. Original Natural Oat
Image.fromarray(arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/shoe_side_mountain_grey.png')

print("Generated authentic colorways directly matching user reference shoe!")
