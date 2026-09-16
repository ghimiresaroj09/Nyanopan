import numpy as np
from PIL import Image

# Use story_solo.png as our baseline
base = Image.open('/home/user/nyanopan-store/public/brand/story_solo.png').convert('RGBA')
arr = np.array(base, dtype=np.float32)

alpha = arr[:, :, 3]
is_shoe = alpha > 20
is_crepe = is_shoe & ((arr[:, :, 0] - arr[:, :, 2]) > 30) & (arr[:, :, 0] > 110)
is_wool = is_shoe & (~is_crepe)

grey_val = (arr[is_wool, 0] + arr[is_wool, 1] + arr[is_wool, 2]) / (3.0 * 255.0)

# 1. Natural Mountain Grey
Image.fromarray(arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/story_color_grey.png')

# 2. Himalayan Forest Green
green_arr = arr.copy()
green_arr[is_wool, 0] = np.clip(grey_val * 62.0, 0, 255)
green_arr[is_wool, 1] = np.clip(grey_val * 96.0, 0, 255)
green_arr[is_wool, 2] = np.clip(grey_val * 68.0, 0, 255)
Image.fromarray(green_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/story_color_green.png')

# 3. Indigo Dusk Navy
navy_arr = arr.copy()
navy_arr[is_wool, 0] = np.clip(grey_val * 42.0, 0, 255)
navy_arr[is_wool, 1] = np.clip(grey_val * 62.0, 0, 255)
navy_arr[is_wool, 2] = np.clip(grey_val * 108.0, 0, 255)
Image.fromarray(navy_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/story_color_navy.png')

# 4. Terracotta Earth
terra_arr = arr.copy()
terra_arr[is_wool, 0] = np.clip(grey_val * 178.0, 0, 255)
terra_arr[is_wool, 1] = np.clip(grey_val * 84.0, 0, 255)
terra_arr[is_wool, 2] = np.clip(grey_val * 58.0, 0, 255)
Image.fromarray(terra_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/story_color_terracotta.png')

# Also create upper layer and sole layer for exploded view
wool_layer = arr.copy()
wool_layer[~is_wool] = [0, 0, 0, 0]
Image.fromarray(wool_layer.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/story_layer_upper.png')

crepe_layer = arr.copy()
crepe_layer[~is_crepe] = [0, 0, 0, 0]
Image.fromarray(crepe_layer.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/story_layer_sole.png')

print("Successfully baked story colorways and layer splits.")
