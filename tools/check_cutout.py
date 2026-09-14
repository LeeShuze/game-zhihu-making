from PIL import Image
from pathlib import Path
import numpy as np

p = Path(r"d:\Leeshuze\complite\game_making\assets\chars\sisi_front.png")
im = Image.open(p).convert("RGBA")
arr = np.asarray(im)
a = arr[:, :, 3]
print("size", im.size)
print("alpha min/max/mean", a.min(), a.max(), a.mean())
print("transparent pct", (a < 10).mean())
print("opaque pct", (a > 240).mean())
print("corner alphas", a[0,0], a[0,-1], a[-1,0], a[-1,-1])
print("corner rgba", arr[0,0], arr[5,5], arr[im.height//2, im.width//2])
# save preview on checkerboard
h, w = arr.shape[:2]
yy, xx = np.mgrid[0:h, 0:w]
check = (((xx // 16) + (yy // 16)) % 2) * 60 + 40
preview = np.dstack([check, check, check, np.full_like(check, 255)])
alpha = a.astype(np.float32) / 255
for c in range(3):
    preview[:, :, c] = (arr[:, :, c] * alpha + preview[:, :, c] * (1 - alpha)).astype(np.uint8)
Image.fromarray(preview.astype(np.uint8)).save(r"d:\Leeshuze\complite\game_making\tools\sisi_preview.png")
print("preview written")
