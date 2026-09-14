from PIL import Image
from pathlib import Path
from collections import deque
import numpy as np

chars = Path(r"d:\Leeshuze\complite\game_making\assets\chars")
bak = chars / "_bak_opaque"


def remove_bg(src: Path, out: Path, tol=32):
    im = Image.open(src).convert("RGBA")
    arr = np.asarray(im).copy()
    h, w = arr.shape[:2]

    corners = np.vstack(
        [
            arr[0:12, 0:12, :3].reshape(-1, 3),
            arr[0:12, -12:, :3].reshape(-1, 3),
            arr[-12:, 0:12, :3].reshape(-1, 3),
            arr[-12:, -12:, :3].reshape(-1, 3),
        ]
    ).astype(np.float32)
    bg = np.median(corners, axis=0)
    rgb = arr[:, :, :3].astype(np.float32)
    dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))

    # Also treat near-black "FRONT" area / residual as removable if edge connected
    mask_bg = (dist < (tol + 14)) | ((arr[:, :, :3].max(axis=2) < 40) & (arr[:, :, 1] < 50))

    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if mask_bg[y, x] and not visited[y, x]:
                visited[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if mask_bg[y, x] and not visited[y, x]:
                visited[y, x] = True
                q.append((y, x))

    while q:
        y, x = q.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and mask_bg[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

    soft = ((dist - (tol - 8)) / 20.0).clip(0, 1)
    edge_alpha = (soft * 255).astype(np.uint8)
    out_a = np.full((h, w), 255, dtype=np.uint8)
    out_a[visited] = np.minimum(out_a[visited], edge_alpha[visited])

    # drop bottom band that often contains FRONT label (lower ~9%)
    cut = int(h * 0.91)
    out_a[cut:, :] = 0

    arr[:, :, 3] = out_a

    opaque = out_a > 18
    ys, xs = np.where(opaque)
    if len(xs) == 0:
        Image.fromarray(arr, "RGBA").save(out)
        return
    pad = 6
    x0 = max(0, int(xs.min()) - pad)
    y0 = max(0, int(ys.min()) - pad)
    x1 = min(w - 1, int(xs.max()) + pad)
    y1 = min(h - 1, int(ys.max()) + pad)
    arr = arr[y0 : y1 + 1, x0 : x1 + 1]
    Image.fromarray(arr, "RGBA").save(out)
    print("wrote", out.name, arr.shape)


fronts = sorted(chars.glob("*_front.png"))
for p in fronts:
    src = bak / p.name
    if not src.exists():
        # already overwritten; skip if no backup
        print("missing backup", p.name)
        continue
    remove_bg(src, p)

print("done")
