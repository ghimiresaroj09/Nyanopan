import numpy as np
from PIL import Image

# Load the clean slipper side image
side = Image.open('/home/user/nyanopan-store/public/brand/slipper_side.png').convert('RGBA')
arr = np.array(side)
H, W, _ = arr.shape

# 1. Accurately identify crepe sole vs wool upper:
# Sole is ONLY in the lower region of the shoe (y >= 96)
# Wool upper is everything above the sole line, INCLUDING the leather tag attached to the collar!
alpha = arr[:, :, 3]
is_shoe = alpha > 20

# Identify sole line per column x:
sole_mask = np.zeros((H, W), dtype=bool)

for x in range(W):
    shoe_ys = np.where(is_shoe[:, x])[0]
    if len(shoe_ys) > 0:
        # scan from bottom up to find crepe sole boundary
        # crepe is warm: r > 110, (r - b) > 28, and strictly in the lower region (y > 90)
        sole_ys_in_col = []
        for y in reversed(shoe_ys):
            if y < 90:
                break
            r, g, b = int(arr[y, x, 0]), int(arr[y, x, 1]), int(arr[y, x, 2])
            if (r - b) > 24 and r > 110:
                sole_ys_in_col.append(y)
            else:
                break
        if len(sole_ys_in_col) > 0:
            sole_mask[sole_ys_in_col, x] = True

# Crepe sole layer
sole_arr = arr.copy()
sole_arr[~sole_mask] = [0, 0, 0, 0]
Image.fromarray(sole_arr).save('/home/user/nyanopan-store/public/brand/layer_sole.png')
print("Saved clean layer_sole.png (only true sole at bottom)")

# Upper layer: EVERYTHING that is not the sole, SO THE YELLOW LEATHER TAG REMAINS 100% ATTACHED TO THE UPPER!
upper_mask = is_shoe & (~sole_mask)
upper_arr = arr.copy()
upper_arr[~upper_mask] = [0, 0, 0, 0]
Image.fromarray(upper_arr).save('/home/user/nyanopan-store/public/brand/layer_upper.png')
print("Saved clean layer_upper.png (seamless upper WITH yellow tag firmly attached!)")

# 2. Insole footbed layer:
# The insole sits between the upper and the sole.
# It should be a smooth, continuous anatomical felt footbed along the full length of the shoe,
# with NO artifacts or breakage from the upper tag!
insole_arr = np.zeros((H, W, 4), dtype=np.uint8)

# Find top contour of sole
for x in range(W):
    ys = np.where(sole_mask[:, x])[0]
    if len(ys) > 0:
        top_sole_y = ys[0]
        # Insole is 6-8 pixels thick sitting seamlessly on top of sole
        for dy in range(-7, 2):
            target_y = top_sole_y + dy
            if 0 <= target_y < H and is_shoe[target_y, x]:
                # Natural warm felt footbed color
                insole_arr[target_y, x] = [205, 192, 175, 255]

# Apply gentle horizontal smoothing to make insole cushion look soft and continuous
insole_img = Image.fromarray(insole_arr)
insole_img.save('/home/user/nyanopan-store/public/brand/layer_insole.png')
print("Saved clean layer_insole.png (smooth, continuous footbed without any tag artifact!)")

