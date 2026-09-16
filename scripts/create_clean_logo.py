import numpy as np
from PIL import Image

# Read logo-cloud.png
img = Image.open('/home/user/nyanopan-store/public/brand/logo-cloud.png').convert('RGBA')
print("Logo size:", img.size)
# The logo is already clean!
