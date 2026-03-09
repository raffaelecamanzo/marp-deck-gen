#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path


PNG_MAGIC = b"\x89PNG\r\n\x1a\n"


def read_png_dimensions(path: Path) -> tuple[int, int]:
    data = path.read_bytes()
    if len(data) < 24 or data[:8] != PNG_MAGIC:
        raise ValueError("not a valid PNG")
    width = int.from_bytes(data[16:20], "big")
    height = int.from_bytes(data[20:24], "big")
    if width <= 0 or height <= 0:
        raise ValueError("invalid PNG IHDR dimensions")
    return width, height


def classify_aspect_ratio(ratio: float) -> tuple[str, str]:
    """
    Returns (fit_band, recommended_modifier).

    fit_band:
      - target: 1.1 <= r <= 2.6
      - borderline: otherwise

    recommended_modifier:
      - image-wide if r > 2.8
      - image-tall if r < 0.8
      - empty string otherwise
    """
    fit_band = "target" if 1.1 <= ratio <= 2.6 else "borderline"
    if ratio > 2.8:
        return fit_band, "image-wide"
    if ratio < 0.8:
        return fit_band, "image-tall"
    return fit_band, ""


@dataclass(frozen=True)
class CheckResult:
    name: str
    source: Path
    asset: Path
    width: int | None = None
    height: int | None = None
    ratio: float | None = None
    fit_band: str | None = None
    modifier: str | None = None


def iter_diagram_sources(diagrams_dir: Path) -> list[Path]:
    sources: list[Path] = []
    for pattern in ("*.mmd", "*.mermaid"):
        sources.extend(sorted(diagrams_dir.glob(pattern)))
    return sources


def check_one(source: Path, assets_dir: Path, ext: str) -> CheckResult:
    name = source.stem
    asset = assets_dir / f"{name}.{ext}"
    if not asset.exists():
        return CheckResult(name=name, source=source, asset=asset)

    if ext.lower() != "png":
        return CheckResult(name=name, source=source, asset=asset)

    width, height = read_png_dimensions(asset)
    ratio = width / height
    fit_band, modifier = classify_aspect_ratio(ratio)
    return CheckResult(
        name=name,
        source=source,
        asset=asset,
        width=width,
        height=height,
        ratio=ratio,
        fit_band=fit_band,
        modifier=modifier,
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate Mermaid-rendered assets exist and report PNG aspect ratios."
    )
    parser.add_argument("--diagrams-dir", default="diagrams")
    parser.add_argument("--assets-dir", default="assets")
    parser.add_argument("--ext", default="png")
    parser.add_argument(
        "--file",
        help="Validate a single diagram source path (e.g., diagrams/foo.mmd).",
    )
    args = parser.parse_args()

    diagrams_dir = Path(args.diagrams_dir)
    assets_dir = Path(args.assets_dir)
    ext = args.ext

    if args.file:
        sources = [Path(args.file)]
    else:
        sources = iter_diagram_sources(diagrams_dir)

    if not sources:
        print("No Mermaid diagram sources found (expected .mmd or .mermaid).")
        return 0

    missing_assets: list[Path] = []
    parse_errors: list[tuple[Path, str]] = []

    for source in sources:
        res = check_one(source, assets_dir=assets_dir, ext=ext)
        if not res.asset.exists():
            missing_assets.append(res.asset)
            print(f"ERROR missing asset: {res.asset} (source: {source})", file=sys.stderr)
            continue

        if ext.lower() != "png":
            print(f"{res.name}: OK ({res.asset})")
            continue

        try:
            assert res.width is not None and res.height is not None and res.ratio is not None
        except AssertionError:
            parse_errors.append((res.asset, "missing dimension fields"))
            print(f"ERROR could not read PNG dimensions: {res.asset}", file=sys.stderr)
            continue

        suggested = "visual-split"
        if res.modifier:
            suggested = f"visual-split {res.modifier}"

        ratio_s = f"{res.ratio:.2f}"
        print(
            f"{res.name}: {res.width}x{res.height} ratio={ratio_s} fit={res.fit_band} suggest='{suggested}'"
        )

    if missing_assets or parse_errors:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

