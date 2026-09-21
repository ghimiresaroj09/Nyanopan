import numpy as np
from PIL import Image

base = Image.open('/home/user/nyanopan-store/public/brand/slipper_side.png').convert('RGBA')
arr = np.array(base, dtype=np.float32)

alpha = arr[:, :, 3]
is_shoe = alpha > 20
H, W, _ = arr.shape

# Identify crepe sole strictly at bottom
is_sole = np.zeros((H, W), dtype=bool)
for x in range(W):
    ys = np.where(is_shoe[:, x])[0]
    for y in reversed(ys):
        if y < 90:
            break
        r, g, b = arr[y, x, 0], arr[y, x, 1], arr[y, x, 2]
        if (r - b) > 24 and r > 110:
            is_sole[y, x] = True
        else:
            break

# Leather tag mask (around x: 140..178, y: 30..65 where r>140 and (r-b)>30)
is_tag = np.zeros((H, W), dtype=bool)
for y in range(25, 70):
    for x in range(135, 185):
        if is_shoe[y, x]:
            r, g, b = arr[y, x, 0], arr[y, x, 1], arr[y, x, 2]
            if r > 140 and (r - b) > 28:
                is_tag[y, x] = True

# Wool felt is shoe, NOT sole, and NOT tag!
is_wool = is_shoe & (~is_sole) & (~is_tag)

# Greyscale luminance of the wool felt texture
luminance = (arr[:, :, 0] * 0.299 + arr[:, :, 1] * 0.587 + arr[:, :, 2] * 0.114) / 255.0

# 1. Himalayan (Vibrant, authentic pine / forest moss felt)
green_arr = arr.copy()
# Target tone: #385e44 (RGB ~ 56, 94, 68)
green_arr[is_wool, 0] = np.clip(luminance[is_wool] * 78.0, 0, 255)
green_arr[is_wool, 1] = np.clip(luminance[is_wool] * 128.0, 0, 255)
green_arr[is_wool, 2] = np.clip(luminance[is_wool] * 90.0, 0, 255)
Image.fromarray(green_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/slipper_brown.png')

# 2. Indigo Dusk Navy (Rich mountain indigo wool)
navy_arr = arr.copy()
# Target tone: #2a4365 (RGB ~ 42, 67, 101)
navy_arr[is_wool, 0] = np.clip(luminance[is_wool] * 58.0, 0, 255)
navy_arr[is_wool, 1] = np.clip(luminance[is_wool] * 88.0, 0, 255)
navy_arr[is_wool, 2] = np.clip(luminance[is_wool] * 148.0, 0, 255)
Image.fromarray(navy_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/slipper_navy.png')

# 3. Terracotta Earth (Warm Himalayan red clay)
terra_arr = arr.copy()
# Target tone: #b85434 (RGB ~ 184, 84, 52)
terra_arr[is_wool, 0] = np.clip(luminance[is_wool] * 215.0, 0, 255)
terra_arr[is_wool, 1] = np.clip(luminance[is_wool] * 98.0, 0, 255)
terra_arr[is_wool, 2] = np.clip(luminance[is_wool] * 68.0, 0, 255)
Image.fromarray(terra_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/slipper_terracotta.png')

print("Baked vivid colorways successfully!")
