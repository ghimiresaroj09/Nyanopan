from PIL import Image

def clean_and_save(src_path, dst_path, is_black_bg=False):
    im = Image.open(src_path).convert('RGBA')
    datas = im.getdata()
    new_data = []
    for p in datas:
        if is_black_bg:
            if p[0] < 15 and p[1] < 15 and p[2] < 15:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(p)
        else:
            if p[0] > 245 and p[1] > 245 and p[2] > 245:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(p)
    im.putdata(new_data)
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(dst_path)
    print(f"Saved: {dst_path} {im.size}")

clean_and_save('/home/user/uploads/solo.webp', '/home/user/nyanopan-store/public/brand/story_solo.png', is_black_bg=True)
clean_and_save('/home/user/uploads/side.webp', '/home/user/nyanopan-store/public/brand/story_pair_angled.png', is_black_bg=True)
clean_and_save('/home/user/uploads/One top.jpg', '/home/user/nyanopan-store/public/brand/story_one_top.png', is_black_bg=False)
clean_and_save('/home/user/uploads/two top.jpg', '/home/user/nyanopan-store/public/brand/story_two_top.png', is_black_bg=False)
clean_and_save('/home/user/uploads/One Up, One Side.jpg', '/home/user/nyanopan-store/public/brand/story_one_up_one_side.png', is_black_bg=False)

