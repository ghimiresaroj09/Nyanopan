import numpy as np
from PIL import Image

# 1. High-definition felt texture from reference photo
side = Image.open('/home/user/nyanopan-store/public/brand/ref_side_crop.png').convert('RGB')
felt_patch = side.crop((450, 160, 962, 360))
felt_tex = felt_patch.resize((1024, 1024), Image.Resampling.LANCZOS)
felt_tex.save('/home/user/nyanopan-store/public/brand/wool-felt-diffuse.jpg', quality=95)

# 2. Crepe sole honey texture from side
crepe_patch = side.crop((300, 390, 1100, 480))
crepe_tex = crepe_patch.resize((1024, 512), Image.Resampling.LANCZOS)
crepe_tex.save('/home/user/nyanopan-store/public/brand/crepe-sole-diffuse.jpg', quality=95)

# 3. Crepe sole bottom tread from reference sole
sole = Image.open('/home/user/nyanopan-store/public/brand/ref_sole_crop.png').convert('RGB')
sole_tex = sole.resize((512, 1024), Image.Resampling.LANCZOS)
sole_tex.save('/home/user/nyanopan-store/public/brand/crepe-bottom-diffuse.jpg', quality=95)

print("Baked high-definition authentic textures successfully!")
