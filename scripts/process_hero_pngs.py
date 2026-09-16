from PIL import Image

# 1. Clean solo.webp (side profile) with transparent background
solo = Image.open('/home/user/nyanopan-store/public/hero/solo.webp').convert('RGBA')
datas = solo.getdata()
new_data = []
for item in datas:
    if item[0] < 12 and item[1] < 12 and item[2] < 12:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)
solo.putdata(new_data)
bbox = solo.getbbox()
if bbox:
    solo = solo.crop(bbox)
solo.save('/home/user/nyanopan-store/public/hero/solo_clean.png')
print('solo_clean.png saved:', solo.size)

# 2. Clean side.webp (angled pair)
side = Image.open('/home/user/nyanopan-store/public/hero/side.webp').convert('RGBA')
datas = side.getdata()
new_data = []
for item in datas:
    if item[0] < 12 and item[1] < 12 and item[2] < 12:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)
side.putdata(new_data)
bbox = side.getbbox()
if bbox:
    side = side.crop(bbox)
side.save('/home/user/nyanopan-store/public/hero/side_clean.png')
print('side_clean.png saved:', side.size)

# 3. Clean two-top.jpg (white background to transparent or clean)
two_top = Image.open('/home/user/nyanopan-store/public/hero/two-top.jpg').convert('RGBA')
datas = two_top.getdata()
new_data = []
for item in datas:
    # white background
    if item[0] > 248 and item[1] > 248 and item[2] > 248:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)
two_top.putdata(new_data)
bbox = two_top.getbbox()
if bbox:
    two_top = two_top.crop(bbox)
two_top.save('/home/user/nyanopan-store/public/hero/two_top_clean.png')
print('two_top_clean.png saved:', two_top.size)

# 4. Clean one-up-one-side.jpg (white background to transparent)
one_up = Image.open('/home/user/nyanopan-store/public/hero/one-up-one-side.jpg').convert('RGBA')
datas = one_up.getdata()
new_data = []
for item in datas:
    if item[0] > 248 and item[1] > 248 and item[2] > 248:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)
one_up.putdata(new_data)
bbox = one_up.getbbox()
if bbox:
    one_up = one_up.crop(bbox)
one_up.save('/home/user/nyanopan-store/public/hero/one_up_clean.png')
print('one_up_clean.png saved:', one_up.size)
