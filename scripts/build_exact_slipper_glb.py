import struct
import json
import math
import numpy as np
from PIL import Image

# 1. Load the real cropped textures from the user reference photos
side_img = Image.open('/home/user/nyanopan-store/public/brand/ref_side_crop.png').convert('RGBA')
top_img = Image.open('/home/user/nyanopan-store/public/brand/ref_top_crop.png').convert('RGBA')
sole_img = Image.open('/home/user/nyanopan-store/public/brand/ref_sole_crop.png').convert('RGBA')

# Analyze silhouette profiles from the real side elevation photo
# side_img size: width = 1384 (X axis, heel to toe), height = 540 (Y axis, bottom of sole to peak of collar)
side_arr = np.array(side_img)
W_side, H_side = side_img.size

# Extract top boundary and bottom boundary for each vertical column x in side view
profile_x = []
top_y = []
bot_y = []
sole_line_y = [] # border between sole and wool felt

for x in range(0, W_side, 8):
    col = side_arr[:, x]
    non_black = np.where((col[:, 0] > 15) | (col[:, 1] > 15) | (col[:, 2] > 15))[0]
    if len(non_black) > 0:
        profile_x.append(x)
        top_y.append(non_black[0])
        bot_y.append(non_black[-1])
        # Find transition from yellow crepe sole to grey wool felt
        # Crepe sole has high red/green (~180-220, ~140-170) and lower blue (~70-110), whereas wool is neutral grey (R~=G~=B)
        found_sole = non_black[-1]
        for y in reversed(non_black):
            r, g, b = col[y, 0], col[y, 1], col[y, 2]
            # crepe is distinctly warm/yellow-brown: r > 120 and (r - b) > 40
            if (int(r) - int(b)) > 35:
                found_sole = y
            else:
                break
        sole_line_y.append(found_sole)

print(f"Extracted {len(profile_x)} profile slices from real side elevation photo.")

# Create an anatomical 3D mesh:
# We build cross-sectional rings along the length of the slipper (Z axis from Heel to Toe).
# In 3D space:
# Length: Z from -1.35 (heel) to +1.45 (toe), total length ~ 2.8 units
# Height: Y from -0.45 (sole bottom) to +0.55 (collar top)
# Width: X from -0.65 to +0.65 (across foot)

