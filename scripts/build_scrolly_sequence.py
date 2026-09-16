import math
import numpy as np
from PIL import Image

# Split TF3001-42_2 into Left Shoe (top view) and Right Sole (bottom view)
img2 = Image.open('/home/user/nyanopan-store/public/brand/clean_TF3001-42_2_408x_crop_center@2x.png')
w, h = img2.size
# Left shoe top view
left_top = img2.crop((0, 0, int(w * 0.49), h))
left_top_bbox = left_top.getbbox()
if left_top_bbox:
    left_top = left_top.crop(left_top_bbox)
left_top.save('/home/user/nyanopan-store/public/brand/clean_top_view.png')

# Right sole view
right_sole = img2.crop((int(w * 0.51), 0, w, h))
right_sole_bbox = right_sole.getbbox()
if right_sole_bbox:
    right_sole = right_sole.crop(right_sole_bbox)
right_sole.save('/home/user/nyanopan-store/public/brand/clean_sole_view.png')

print("Created clean_top_view.png and clean_sole_view.png")
