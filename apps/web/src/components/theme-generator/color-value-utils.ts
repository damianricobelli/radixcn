import { normalizeHexColor } from "@/lib/theme-generator/color";

export function normalizeColorPickerValue(value: string) {
  const normalizedHex = normalizeHexColor(value);
  if (normalizedHex) return normalizedHex;

  const rgbMatch = value.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i,
  );
  if (rgbMatch) {
    return rgbToHex({
      r: Number.parseInt(rgbMatch[1] ?? "0", 10),
      g: Number.parseInt(rgbMatch[2] ?? "0", 10),
      b: Number.parseInt(rgbMatch[3] ?? "0", 10),
    });
  }

  const hslMatch = value.match(
    /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/i,
  );
  if (hslMatch) {
    return rgbToHex(
      hslToRgb({
        h: Number.parseInt(hslMatch[1] ?? "0", 10),
        s: Number.parseInt(hslMatch[2] ?? "0", 10),
        l: Number.parseInt(hslMatch[3] ?? "0", 10),
      }),
    );
  }

  const hsbMatch = value.match(
    /^hsba?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/i,
  );
  if (hsbMatch) {
    return rgbToHex(
      hsvToRgb({
        h: Number.parseInt(hsbMatch[1] ?? "0", 10),
        s: Number.parseInt(hsbMatch[2] ?? "0", 10),
        v: Number.parseInt(hsbMatch[3] ?? "0", 10),
      }),
    );
  }

  return null;
}

function rgbToHex({ r, g, b }: RgbColor) {
  const toHex = (channel: number) =>
    Math.min(Math.max(Math.round(channel), 0), 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hslToRgb({ h, s, l }: HslColor) {
  const hue = (((h % 360) + 360) % 360) / 360;
  const saturation = Math.min(Math.max(s, 0), 100) / 100;
  const lightness = Math.min(Math.max(l, 0), 100) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue * 6) % 2) - 1));
  const m = lightness - chroma / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 1 / 6) {
    r = chroma;
    g = x;
  } else if (hue < 2 / 6) {
    r = x;
    g = chroma;
  } else if (hue < 3 / 6) {
    g = chroma;
    b = x;
  } else if (hue < 4 / 6) {
    g = x;
    b = chroma;
  } else if (hue < 5 / 6) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
}

function hsvToRgb({ h, s, v }: HsvColor) {
  const hue = (((h % 360) + 360) % 360) / 60;
  const saturation = Math.min(Math.max(s, 0), 100) / 100;
  const value = Math.min(Math.max(v, 0), 100) / 100;
  const chroma = value * saturation;
  const x = chroma * (1 - Math.abs((hue % 2) - 1));
  const m = value - chroma;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 1) {
    r = chroma;
    g = x;
  } else if (hue < 2) {
    r = x;
    g = chroma;
  } else if (hue < 3) {
    g = chroma;
    b = x;
  } else if (hue < 4) {
    g = x;
    b = chroma;
  } else if (hue < 5) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
}

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

type HslColor = {
  h: number;
  s: number;
  l: number;
};

type HsvColor = {
  h: number;
  s: number;
  v: number;
};
