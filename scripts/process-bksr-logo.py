"""Process BKSR WhatsApp logo into transparent brand PNGs."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "logo" / "WhatsApp Image 2026-09-17 at 8.02.24 PM.jpeg"
OUT_DIR = ROOT / "public" / "brand"


def remove_black_bg(img: Image.Image, threshold: int = 28) -> Image.Image:
    """Make near-black background pixels transparent."""
    rgba = img.convert("RGBA")
    pixels = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                pixels[x, y] = (r, g, b, 0)
    return rgba


def crop_to_content(img: Image.Image, pad: int = 12) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(img.width, right + pad)
    bottom = min(img.height, bottom + pad)
    return img.crop((left, top, right, bottom))


def is_navy(r: int, g: int, b: int) -> bool:
    """BKSR wordmark / diamond navy-blue."""
    return b > 70 and b > r + 20 and b >= g and r < 90 and g < 120


def is_red_accent(r: int, g: int, b: int) -> bool:
    return r > 140 and g < 120 and b < 120 and r > g + 40 and r > b + 40


def make_light_variant(img: Image.Image, mark_end_x: int) -> Image.Image:
    """White wordmark for dark surfaces; keep coloured diamond mark."""
    rgba = img.copy()
    pixels = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 10:
                continue
            if x < mark_end_x:
                continue  # keep emblem as-is
            if is_red_accent(r, g, b):
                continue
            if r > 220 and g > 220 and b > 220:
                continue
            if is_navy(r, g, b):
                pixels[x, y] = (255, 255, 255, a)
            elif r < 100 and g < 100 and b < 130 and a > 100:
                # soft navy anti-alias → soft white
                intensity = max(r, g, b) / 130
                val = int(200 + 55 * intensity)
                pixels[x, y] = (val, val, val, a)
    return rgba


def extract_mark(img: Image.Image, mark_end_x: int) -> Image.Image:
    return img.crop((0, 0, min(mark_end_x, img.width), img.height))


def find_mark_end(img: Image.Image) -> int:
    """Find x where the diamond ends (gap before wordmark)."""
    pixels = img.load()
    w, h = img.size
    # Scan horizontal midline bands for first wide transparent gap after content starts
    started = False
    gap = 0
    for x in range(w):
        opaque = 0
        for y in range(h // 5, (4 * h) // 5, 2):
            if pixels[x, y][3] > 40:
                opaque += 1
        if opaque > 3:
            started = True
            gap = 0
        elif started:
            gap += 1
            if gap > 18:
                return x - gap + 8
    return int(h * 1.05)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC)
    print(f"Source: {SRC.name} {src.size} {src.mode}")

    color = crop_to_content(remove_black_bg(src))
    # Keep native resolution — source is already 1600px wide and crisp enough
    mark_end = find_mark_end(color)
    print(f"Mark ends ~x={mark_end}")

    light = make_light_variant(color, mark_end)
    mark = extract_mark(color, mark_end)

    color_path = OUT_DIR / "bksr-logo.png"
    light_path = OUT_DIR / "bksr-logo-light.png"
    mark_path = OUT_DIR / "bksr-mark.png"

    color.save(color_path, "PNG", optimize=True)
    light.save(light_path, "PNG", optimize=True)
    mark.save(mark_path, "PNG", optimize=True)

    print(f"Wrote {color_path.relative_to(ROOT)} {color.size}")
    print(f"Wrote {light_path.relative_to(ROOT)} {light.size}")
    print(f"Wrote {mark_path.relative_to(ROOT)} {mark.size}")


if __name__ == "__main__":
    main()
