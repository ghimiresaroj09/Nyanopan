import numpy as np
from PIL import Image

def fast_process(src, dst, is_black=False):
    im = Image.open(src).convert('RGBA')
    arr = np.array(im)
    if is_black:
        mask = (arr[:, :, 0] < 15) & (arr[:, :, 1] < 15) & (arr[:, :, 2] < 15)
    else:
        mask = (arr[:, :, 0] > 240) & (arr[:, :, 1] > 240) & (arr[:, :, 2] > 240)
    arr[mask, 3] = 0
    res = Image.fromarray(arr)
    bbox = res.getbbox()
    if bbox:
        res = res.crop(bbox)
    res.save(dst)
    print(f"Saved {dst}: {res.size}")

fast_process('/home/user/uploads/solo.webp', '/home/user/nyanopan-store/public/brand/slipper_side.png', is_black=True)
fast_process('/home/user/uploads/side.webp', '/home/user/nyanopan-store/public/brand/slipper_pair.png', is_black=True)
fast_process('/home/user/uploads/One top.jpg', '/home/user/nyanopan-store/public/brand/slipper_profile.png', is_black=False)
fast_process('/home/user/uploads/One Up, One Side.jpg', '/home/user/nyanopan-store/public/brand/slipper_sole.png', is_black=False)
fast_process('/home/user/uploads/two top.jpg', '/home/user/nyanopan-store/public/brand/slipper_top.png', is_black=False)

# Colorways & layers
base = Image.open('/home/user/nyanopan-store/public/brand/slipper_side.png').convert('RGBA')
arr = np.array(base, dtype=np.float32)
alpha = arr[:, :, 3]
is_shoe = alpha > 20
is_crepe = is_shoe & ((arr[:, :, 0] - arr[:, :, 2]) > 30) & (arr[:, :, 0] > 110)
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

# Upper & sole
u_arr = arr.copy()
u_arr[~is_wool] = [0, 0, 0, 0]
Image.fromarray(u_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/layer_upper.png')

s_arr = arr.copy()
s_arr[~is_crepe] = [0, 0, 0, 0]
Image.fromarray(s_arr.astype(np.uint8)).save('/home/user/nyanopan-store/public/brand/layer_sole.png')

# Insole
insole_arr = np.zeros_like(arr, dtype=np.uint8)
y_indices, x_indices = np.where(is_crepe)
if len(y_indices) > 0:
    for x in range(x_indices.min(), x_indices.max()):
        ys = np.where(is_crepe[:, x])[0]
        if len(ys) > 0:
            top_y = ys[0]
            for dy in range(-12, 4):
                if 0 <= top_y + dy < arr.shape[0]:
                    insole_arr[top_y + dy, x] = [190, 172, 145, 255]
Image.fromarray(insole_arr).save('/home/user/nyanopan-store/public/brand/layer_insole.png')

print("Done fast process!")
