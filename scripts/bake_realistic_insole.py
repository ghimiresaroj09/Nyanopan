import numpy as np
from PIL import Image, ImageFilter

# Create a beautiful, realistic textured felt insole matching the slipper's natural footbed
side = Image.open('/home/user/nyanopan-store/public/brand/slipper_side.png').convert('RGBA')
arr = np.array(side)
H, W, _ = arr.shape

sole = Image.open('/home/user/nyanopan-store/public/brand/layer_sole.png').convert('RGBA')
sole_arr = np.array(sole)
is_sole = sole_arr[:, :, 3] > 20

# Sample texture from the upper felt to give the insole real wool fiber grain
upper = Image.open('/home/user/nyanopan-store/public/brand/layer_upper.png').convert('RGBA')
upper_arr = np.array(upper)

insole_arr = np.zeros((H, W, 4), dtype=np.uint8)

for x in range(W):
    ys = np.where(is_sole[:, x])[0]
    if len(ys) > 0:
        sole_top_y = ys[0]
        # Insole is an anatomical layer of thickness 8-10 pixels
        for dy in range(-9, 1):
            y = sole_top_y + dy
            if 0 <= y < H:
                # Sample grey wool lightness from nearby upper to give authentic felt grain
                sample_y = max(0, min(H - 1, sole_top_y - 18 + (dy % 4)))
                grain = upper_arr[sample_y, x]
                if grain[3] > 20:
                    val = int(grain[0] * 0.95)
                    # Natural felt insole hue (slightly warm/natural oat tone)
                    insole_arr[y, x] = [min(255, val + 15), min(255, val + 10), min(255, val + 4), 255]
                else:
                    insole_arr[y, x] = [198, 188, 175, 255]

insole_img = Image.fromarray(insole_arr)
insole_img.save('/home/user/nyanopan-store/public/brand/layer_insole.png')
print("Successfully generated realistic, continuous, unbroken felt insole footbed!")
