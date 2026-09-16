from PIL import Image
import numpy as np

img = Image.open('/home/user/uploads/Gemini_Generated_Image_l8qbxql8qbxql8qb-removebg-preview.png').convert('RGBA')

# Layer 1: Wool Upper
# Y: 73 to 221
upper_crop = img.crop((20, 73, 479, 222))
upper_bbox = upper_crop.getbbox()
if upper_bbox:
    upper_crop = upper_crop.crop(upper_bbox)
upper_crop.save('/home/user/nyanopan-store/public/brand/crafted_upper.png')
print("Saved crafted_upper.png:", upper_crop.size)

# Layer 2: Cushioned Wool Insole Footbed
# Y: 243 to 313
insole_crop = img.crop((20, 243, 479, 314))
insole_bbox = insole_crop.getbbox()
if insole_bbox:
    insole_crop = insole_crop.crop(insole_bbox)
insole_crop.save('/home/user/nyanopan-store/public/brand/crafted_insole.png')
print("Saved crafted_insole.png:", insole_crop.size)

# Layer 3: Crepe Rubber Outsole
# Y: 329 to 415
sole_crop = img.crop((20, 329, 479, 416))
sole_bbox = sole_crop.getbbox()
if sole_bbox:
    sole_crop = sole_crop.crop(sole_bbox)
sole_crop.save('/home/user/nyanopan-store/public/brand/crafted_sole.png')
print("Saved crafted_sole.png:", sole_crop.size)

# Also save the full combined exploded image
full_bbox = img.getbbox()
full_crop = img.crop(full_bbox)
full_crop.save('/home/user/nyanopan-store/public/brand/crafted_all_layers.png')
print("Saved crafted_all_layers.png:", full_crop.size)

