import numpy as np
from PIL import Image, ImageFilter

# Load reference images
side = Image.open('/home/user/nyanopan-store/public/brand/ref_side_crop.png').convert('RGBA')
top = Image.open('/home/user/nyanopan-store/public/brand/ref_top_crop.png').convert('RGBA')
sole = Image.open('/home/user/nyanopan-store/public/brand/ref_sole_crop.png').convert('RGBA')

# In top reference, replace "tofvel." on the label with clean felt or "nyanopan."
# Label is located in the inner heel area of the footbed.
# Let's inspect where the label is in top:
top_arr = np.array(top)
H_t, W_t, _ = top_arr.shape
print(f"Top size: {W_t} x {H_t}")

# Create UV Texture Atlas (2048 x 2048):
# Section 0: Side view outer profile (upper felt + crepe sole) mapped seamlessly to the lateral and medial flanks
# Section 1: Top-down vamp & collar view
# Section 2: Bottom crepe sole tread with authentic textured crepe rubber

atlas = Image.new('RGBA', (2048, 2048), (200, 200, 200, 255))

# We can also generate a dedicated texture map for the Wool Upper and a dedicated texture map for the Crepe Sole!
# Wool texture: 1024x1024 genuine grey felt extracted from the real high-res photo TF3001-42_1_842x_crop_center@2x.webp
wool_patch = side.crop((400, 150, 912, 350)) # pure felt patch without background or sole
wool_tex = wool_patch.resize((1024, 1024), Image.Resampling.LANCZOS)
wool_tex.save('/home/user/nyanopan-store/public/brand/authentic_felt.png')
print("Saved authentic_felt.png")

# Sole texture: genuine honey crepe rubber extracted from the sole
sole_patch = side.crop((200, 370, 1100, 490))
sole_tex = sole_patch.resize((1024, 512), Image.Resampling.LANCZOS)
sole_tex.save('/home/user/nyanopan-store/public/brand/authentic_crepe.png')
print("Saved authentic_crepe.png")

# Also save bottom sole texture:
sole_bottom = sole.resize((512, 1024), Image.Resampling.LANCZOS)
sole_bottom.save('/home/user/nyanopan-store/public/brand/authentic_sole_bottom.png')
print("Saved authentic_sole_bottom.png")
