"""
실사 폰 사진 -> 화면·바깥이 투명한 폰 프레임 PNG

  src/assets/phone-source.png (어두운 배경 위 아이폰 사진)
    -> src/assets/phone-frame.png
  - 화면: 가운데와 이어진 밝은 영역에 둥근 사각형을 맞춰 투명 처리 (다이내믹 아일랜드는 남김)
  - 바깥: 폰의 어두운 외곽선을 따라 (화면과 동심인) 둥근 사각형으로 잘라 투명 처리
          측면 버튼은 살리고 빛 번짐은 버림

화면 영역의 위치·크기·모서리 반경을 프레임 대비 %로 출력합니다.
원본 사진을 바꿨다면 출력된 값으로 src/styles/components.css 의 .phone / .phone__display /
.statusbar 값을 갱신하세요.

필요: Python 3.10+, pip install pillow numpy scipy
사용 (프로젝트 루트에서):
  python scripts/make_phone_frame.py [src.png] [out.png] [--preview DIR]
  --preview DIR 를 주면 DIR 에 frame-metrics.json 과 확인용 합성 이미지를 저장합니다.
"""
import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument("src", nargs="?", default=str(ROOT / "src/assets/phone-source.png"))
ap.add_argument("out", nargs="?", default=str(ROOT / "src/assets/phone-frame.png"))
ap.add_argument("--preview", metavar="DIR", help="frame-metrics.json 과 미리보기 이미지를 저장할 폴더")
args = ap.parse_args()
SRC, OUT, PREVIEW_DIR = args.src, args.out, args.preview
SS = 4  # supersampling factor for anti-aliased shapes

img = Image.open(SRC).convert("RGB")
rgb = np.asarray(img).astype(np.float32)
H, W, _ = rgb.shape
lum = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
cx, cy = W // 2, H // 2

# ---------------------------------------------------------------- screen
# Bright pixels connected to the centre-ish screen background.
bright = lum > 200
labels, _ = ndimage.label(bright)
# pick the component under a known-bright seed near the screen centre (search outward)
seed = None
for dy in range(0, H // 3, 4):
    for y in (cy + dy, cy - dy):
        if bright[y, cx]:
            seed = (y, cx)
            break
    if seed:
        break
screen_comp = labels == labels[seed]
ys, xs = np.nonzero(screen_comp)
sx0, sx1, sy0, sy1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1  # exclusive max
print(f"screen bbox (bright component): x {sx0}..{sx1}, y {sy0}..{sy1}")

# Fill holes (cards, text) then use per-row left extent near the top corner to fit the radius.
filled = ndimage.binary_fill_holes(screen_comp)


def fit_radius(rows_left, y_top, x_left):
    best = None
    for r in range(20, 200):
        err, n = 0.0, 0
        for y, xl in rows_left:
            dy = (y_top + r) - (y + 0.5)
            if dy <= 0 or dy > r:
                continue
            pred = x_left + r - np.sqrt(max(r * r - dy * dy, 0))
            err += (pred - xl) ** 2
            n += 1
        if n > 10:
            e = err / n
            if best is None or e < best[1]:
                best = (r, e)
    return best


rows = []
for y in range(sy0, sy0 + 200):
    xs_row = np.nonzero(filled[y, : W // 2])[0]
    if xs_row.size:
        rows.append((y, xs_row.min()))
r_tl = fit_radius(rows, sy0, sx0)
# bottom-left corner (mirror vertically)
rows_b = []
for y in range(sy1 - 200, sy1):
    xs_row = np.nonzero(filled[y, : W // 2])[0]
    if xs_row.size:
        rows_b.append((sy1 - 1 - y + sy0, xs_row.min()))
r_bl = fit_radius(rows_b, sy0, sx0)
print("screen radius fit (top-left, bottom-left):", r_tl, r_bl)
r_screen = round((r_tl[0] + r_bl[0]) / 2)

# ---------------------------------------------------------------- outer outline
# Scan outward from the screen edge; the outermost "much darker than the local background"
# pixel within ~45px is the phone's dark outer outline.
def outer_edge(line_vals, bg_val):
    idx = np.nonzero(line_vals < 0.6 * bg_val)[0]
    return idx.max() if idx.size else None


lefts, rights, tops, bottoms = [], [], [], []
for y in range(sy0 + 300, sy1 - 300, 7):  # avoid corners
    # left: walk from screen edge outward
    seg = lum[y, sx0 - 45 : sx0][::-1]
    bg = lum[y, sx0 - 70]
    e = outer_edge(seg, bg)
    if e is not None:
        lefts.append(sx0 - 1 - e)
    seg = lum[y, sx1 : sx1 + 45]
    bg = lum[y, sx1 + 70]
    e = outer_edge(seg, bg)
    if e is not None:
        rights.append(sx1 + e + 1)
for x in range(sx0 + 200, sx1 - 200, 7):
    seg = lum[sy0 - 45 : sy0, x][::-1]
    bg = lum[sy0 - 60, x]
    e = outer_edge(seg, bg)
    if e is not None:
        tops.append(sy0 - 1 - e)
    seg = lum[sy1 : sy1 + 45, x]
    bg = lum[sy1 + 60, x]
    e = outer_edge(seg, bg)
    if e is not None:
        bottoms.append(sy1 + e + 1)

ox0 = int(np.median(lefts))
ox1 = int(np.median(rights))
oy0 = int(np.median(tops))
oy1 = int(np.median(bottoms))
bezel = np.median([sx0 - ox0, ox1 - sx1, sy0 - oy0, oy1 - sy1])
r_outer = r_screen + bezel
print(f"outer box: x {ox0}..{ox1}, y {oy0}..{oy1}  (bezel ~{bezel}px, outer radius ~{r_outer})")
print("  edge spreads (px):", np.ptp(lefts), np.ptp(rights), np.ptp(tops), np.ptp(bottoms))

# ---------------------------------------------------------------- side buttons
# Rows where the strip just outside the outline differs clearly from the background further out.
def button_rows(side):
    found = []
    for y in range(oy0 + 150, oy1 - 150):
        if side == "left":
            strip = rgb[y, ox0 - 10 : ox0]
            ref = rgb[y, ox0 - 30]
        else:
            strip = rgb[y, ox1 : ox1 + 10]
            ref = rgb[y, ox1 + 30]
        diff = np.abs(strip - ref).sum(axis=1)
        hits = np.nonzero(diff > 60)[0]
        if hits.size:
            depth = 10 - hits.min() if side == "left" else hits.max() + 1
            found.append((y, int(depth)))
    return found


def to_runs(found, min_len=25):
    runs, cur = [], []
    for y, d in found:
        if cur and y != cur[-1][0] + 1:
            runs.append(cur)
            cur = []
        cur.append((y, d))
    if cur:
        runs.append(cur)
    out = []
    for run in runs:
        if len(run) >= min_len:
            depth = int(np.median([d for _, d in run]))
            out.append((run[0][0], run[-1][0] + 1, depth))
    return out


buttons = {"left": to_runs(button_rows("left")), "right": to_runs(button_rows("right"))}
print("side buttons (y0, y1, depth px):", buttons)

# ---------------------------------------------------------------- build alpha (supersampled)
def rrect_mask(box, radius, size=(W, H)):
    m = Image.new("L", (size[0] * SS, size[1] * SS), 0)
    x0, y0, x1, y1 = box
    ImageDraw.Draw(m).rounded_rectangle(
        [x0 * SS, y0 * SS, x1 * SS - 1, y1 * SS - 1], radius=radius * SS, fill=255
    )
    return m.resize(size, Image.LANCZOS)


outer = np.asarray(rrect_mask((ox0, oy0, ox1, oy1), r_outer)).astype(np.float32) / 255
for side, runs in buttons.items():
    for y0, y1, depth in runs:
        if side == "left":
            box = (ox0 - depth, y0, ox0 + 6, y1)
        else:
            box = (ox1 - 6, y0, ox1 + depth, y1)
        btn = np.asarray(rrect_mask(box, min(depth, 4))).astype(np.float32) / 255
        outer = np.maximum(outer, btn)

# screen hole: fitted rounded rect, grown 1px into the black bezel so no white fringe survives
grow = 1
hole_box = (sx0 - grow, sy0 - grow, sx1 + grow, sy1 + grow)
hole_r = r_screen + grow
hole = np.asarray(rrect_mask(hole_box, hole_r)).astype(np.float32) / 255

# dynamic island: dark component inside the top of the screen, near the centre line
dark = lum < 60
region = np.zeros_like(dark)
region[sy0 : sy0 + 160, sx0 + 150 : sx1 - 150] = True
lab_i, _ = ndimage.label(dark & region)
counts = np.bincount(lab_i.ravel())
counts[0] = 0
island = lab_i == counts.argmax()
# the camera lens has bright reflections inside the pill: fill them so the pill stays solid
island = ndimage.binary_fill_holes(island)
iy, ix = np.nonzero(island)
print(f"dynamic island bbox: x {ix.min()}..{ix.max()+1}, y {iy.min()}..{iy.max()+1}")
# soft edge: keep pixels darker than the screen white, within the dilated island
island_soft = ndimage.binary_dilation(island, iterations=2)
island_alpha = np.where(island_soft, np.clip((245 - lum) / (245 - 60), 0, 1), 0)
island_alpha = np.maximum(island_alpha, island.astype(np.float32))

alpha = outer * (1 - hole) + hole * island_alpha
alpha = np.clip(alpha, 0, 1)

# ---------------------------------------------------------------- crop + save
pad = 2
lx = min([ox0] + [ox0 - d for _, _, d in buttons["left"]]) - pad
rx = max([ox1] + [ox1 + d for _, _, d in buttons["right"]]) + pad
ty, by = oy0 - pad, oy1 + pad
rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
frame = Image.fromarray(rgba, "RGBA").crop((lx, ty, rx, by))
frame.save(OUT, optimize=True)
fw, fh = frame.size

hx0, hy0, hx1, hy1 = hole_box
hw, hh = hx1 - hx0, hy1 - hy0
ix0, ix1 = ix.min() - lx, ix.max() + 1 - lx
iy0, iy1 = iy.min() - ty, iy.max() + 1 - ty
result = {
    "frame_px": [fw, fh],
    "frame_aspect_w_over_h": round(fw / fh, 5),
    "screen_px": {"left": hx0 - lx, "top": hy0 - ty, "width": hw, "height": hh, "radius": hole_r},
    "screen_pct_of_frame": {
        "left": round((hx0 - lx) / fw * 100, 3),
        "top": round((hy0 - ty) / fh * 100, 3),
        "width": round(hw / fw * 100, 3),
        "height": round(hh / fh * 100, 3),
    },
    "screen_radius_pct": {"of_screen_width": round(hole_r / hw * 100, 3), "of_screen_height": round(hole_r / hh * 100, 3)},
    "island_pct_of_screen": {
        "top": round((iy0 - (hy0 - ty)) / hh * 100, 3),
        "height": round((iy1 - iy0) / hh * 100, 3),
        "center_y": round(((iy0 + iy1) / 2 - (hy0 - ty)) / hh * 100, 3),
        "left": round((ix0 - (hx0 - lx)) / hw * 100, 3),
        "width": round((ix1 - ix0) / hw * 100, 3),
    },
}
print(json.dumps(result, indent=1, default=lambda o: o.item()))
print(f"saved {OUT}")
if not PREVIEW_DIR:
    raise SystemExit(0)
Path(PREVIEW_DIR).mkdir(parents=True, exist_ok=True)
with open(f"{PREVIEW_DIR}/frame-metrics.json", "w") as f:
    json.dump(result, f, indent=1, default=lambda o: o.item())

# ---------------------------------------------------------------- previews
checker = Image.new("RGB", frame.size, "#ffffff")
d = ImageDraw.Draw(checker)
for yy in range(0, fh, 24):
    for xx in range(0, fw, 24):
        if (xx // 24 + yy // 24) % 2:
            d.rectangle([xx, yy, xx + 23, yy + 23], fill="#d9d9d9")
checker.paste(frame, (0, 0), frame)
checker.save(f"{PREVIEW_DIR}/preview-checker.png")
magenta = Image.new("RGB", frame.size, "#ff00ff")
magenta.paste(frame, (0, 0), frame)
magenta.save(f"{PREVIEW_DIR}/preview-magenta.png")
