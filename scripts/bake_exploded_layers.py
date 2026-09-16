import numpy as np
from PIL import Image, ImageFilter

base = Image.open('/home/user/nyanopan-store/public/brand/shoe_side_mountain_grey.png')
arr = np.array(base, dtype=np.uint8)

alpha = arr[:, :, 3]
is_shoe = alpha > 20
is_crepe = is_shoe & ((arr[:, :, 0].astype(int) - arr[:, :, 2].astype(int)) > 30) & (arr[:, :, 0] > 105)
is_wool = is_shoe & (~is_crepe)

# 1. Wool Upper layer
wool_layer = arr.copy()
wool_layer[~is_wool] = [0, 0, 0, 0]
Image.fromarray(wool_layer).save('/home/user/nyanopan-store/public/brand/layer_wool_upper.png')

# 2. Crepe Sole layer
crepe_layer = arr.copy()
crepe_layer[~is_crepe] = [0, 0, 0, 0]
Image.fromarray(crepe_layer).save('/home/user/nyanopan-store/public/brand/layer_crepe_sole.png')

# 3. Ergonomic Footbed Layer (interior felt + jute cushion)
# Cutout the boundary between wool upper and crepe sole
footbed = Image.new('RGBA', base.size, (0, 0, 0, 0))
# Create cushioned anatomical midsole shape matching the contour
fb_arr = np.array(footbed)
y_indices, x_indices = np.where(is_crepe)
if len(y_indices) > 0:
    min_x, max_x = x_indices.min(), x_indices.max()
    for x in range(min_x, max_x):
        ys = np.where(is_crepe[:, x])[0]
        if len(ys) > 0:
            top_y = ys[0]
            # 14 pixels thick footbed
            for dy in range(-12, 4):
                if 0 <= top_y + dy < base.size[1]:
                    fb_arr[top_y + dy, x] = [190, 172, 145, 255] # natural jute & felt footbed
Image.fromarray(fb_arr).save('/home/user/nyanopan-store/public/brand/layer_footbed.png')

print("Created 3 separate physical layers from the authentic reference shoe!")
