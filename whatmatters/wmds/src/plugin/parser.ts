import { ParsedTheme, ParsedValue, ColorValue, DimensionValue } from '../shared/types';

/**
 * Parse a complete CSS theme string containing :root and .dark blocks
 */
export function parseThemeCSS(css: string): ParsedTheme {
  const theme: ParsedTheme = {
    light: {},
    dark: {},
  };

  // Extract :root block (light mode)
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/s);
  if (rootMatch) {
    theme.light = parseVariableBlock(rootMatch[1]);
  }

  // Extract .dark block
  const darkMatch = css.match(/\.dark\s*\{([^}]+)\}/s);
  if (darkMatch) {
    theme.dark = parseVariableBlock(darkMatch[1]);
  }

  return theme;
}

/**
 * Parse a block of CSS variables
 */
function parseVariableBlock(block: string): Record<string, ParsedValue> {
  const variables: Record<string, ParsedValue> = {};

  // Match CSS custom properties: --name: value;
  const varRegex = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let match;

  while ((match = varRegex.exec(block)) !== null) {
    const name = match[1];
    const rawValue = match[2].trim();
    variables[name] = parseValue(rawValue);
  }

  return variables;
}

/**
 * Parse a single CSS value and determine its type
 */
function parseValue(raw: string): ParsedValue {
  // Try to parse as color (HSL, OKLCH, RGB, Hex)
  const colorValue = parseColor(raw);
  if (colorValue) {
    return { raw, type: 'color', value: colorValue };
  }

  // Try to parse as dimension (rem, px, em, %)
  const dimensionValue = parseDimension(raw);
  if (dimensionValue) {
    return { raw, type: 'dimension', value: dimensionValue };
  }

  // Check if it's a shadow value
  if (raw.includes('rgb') && raw.includes('px')) {
    return { raw, type: 'shadow', value: raw };
  }

  // Check if it's a font family
  if (raw.includes(',') || raw.includes('sans') || raw.includes('serif') || raw.includes('mono')) {
    return { raw, type: 'font', value: raw };
  }

  return { raw, type: 'unknown', value: raw };
}

/**
 * Parse color values: HSL, OKLCH, RGB, Hex
 */
function parseColor(raw: string): ColorValue | null {
  // HSL: hsl(222.2 47.4% 11.2%) or hsl(222.2, 47.4%, 11.2%)
  const hslMatch = raw.match(/hsl\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)%?\s*[,\s]\s*([\d.]+)%?\s*\)/i);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    return hslToColorValue(h, s, l);
  }

  // OKLCH: oklch(0.9882 0.0024 95.7755)
  const oklchMatch = raw.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/i);
  if (oklchMatch) {
    const l = parseFloat(oklchMatch[1]);
    const c = parseFloat(oklchMatch[2]);
    const h = parseFloat(oklchMatch[3]);
    return oklchToColorValue(l, c, h);
  }

  // RGB: rgb(255, 255, 255) or rgb(255 255 255)
  const rgbMatch = raw.match(/rgb\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*\)/i);
  if (rgbMatch) {
    const r = parseFloat(rgbMatch[1]) / 255;
    const g = parseFloat(rgbMatch[2]) / 255;
    const b = parseFloat(rgbMatch[3]) / 255;
    return {
      r, g, b, a: 1,
      hex: rgbToHex(r, g, b),
    };
  }

  // Hex: #RRGGBB or #RGB
  const hexMatch = raw.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    return hexToColorValue(hexMatch[1]);
  }

  return null;
}

/**
 * Parse dimension values
 */
function parseDimension(raw: string): DimensionValue | null {
  const match = raw.match(/^([\d.]+)(rem|px|em|%)$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2] as DimensionValue['unit'],
    };
  }
  return null;
}

/**
 * Convert HSL to ColorValue
 */
function hslToColorValue(h: number, s: number, l: number): ColorValue {
  // Normalize s and l to 0-1
  const sNorm = s / 100;
  const lNorm = l / 100;

  const { r, g, b } = hslToRgb(h, sNorm, lNorm);

  return {
    r, g, b, a: 1,
    hex: rgbToHex(r, g, b),
    hsl: { h, s, l },
  };
}

/**
 * Convert OKLCH to ColorValue
 */
function oklchToColorValue(l: number, c: number, h: number): ColorValue {
  const { r, g, b } = oklchToRgb(l, c, h);

  return {
    r, g, b, a: 1,
    hex: rgbToHex(r, g, b),
    oklch: { l, c, h },
  };
}

/**
 * Convert Hex to ColorValue
 */
function hexToColorValue(hex: string): ColorValue {
  let r: number, g: number, b: number;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16) / 255;
    g = parseInt(hex[1] + hex[1], 16) / 255;
    b = parseInt(hex[2] + hex[2], 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16) / 255;
    g = parseInt(hex.slice(2, 4), 16) / 255;
    b = parseInt(hex.slice(4, 6), 16) / 255;
  } else {
    r = g = b = 0;
  }

  return {
    r, g, b, a: 1,
    hex: `#${hex.toUpperCase()}`,
  };
}

/**
 * HSL to RGB conversion
 * h: 0-360, s: 0-1, l: 0-1
 * returns r, g, b in 0-1 range
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.max(0, Math.min(1, r + m)),
    g: Math.max(0, Math.min(1, g + m)),
    b: Math.max(0, Math.min(1, b + m)),
  };
}

/**
 * OKLCH to RGB conversion
 * This is a simplified implementation
 */
function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  // Convert OKLCH to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab to linear sRGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bVal = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  // Apply gamma correction (linear to sRGB)
  const toSrgb = (x: number) => {
    if (x <= 0.0031308) {
      return 12.92 * x;
    }
    return 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  };

  return {
    r: Math.max(0, Math.min(1, toSrgb(r))),
    g: Math.max(0, Math.min(1, toSrgb(g))),
    b: Math.max(0, Math.min(1, toSrgb(bVal))),
  };
}

/**
 * RGB to Hex conversion
 * r, g, b in 0-1 range
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Check if a variable name is a color variable
 */
export function isColorVariable(name: string): boolean {
  const colorPatterns = [
    'background', 'foreground', 'primary', 'secondary', 'accent',
    'muted', 'destructive', 'border', 'input', 'ring', 'card',
    'popover', 'sidebar', 'chart',
  ];
  return colorPatterns.some(pattern => name.includes(pattern));
}

/**
 * Check if a variable name is a radius variable
 */
export function isRadiusVariable(name: string): boolean {
  return name.startsWith('radius');
}

/**
 * Check if a variable name is a shadow variable
 */
export function isShadowVariable(name: string): boolean {
  return name.startsWith('shadow');
}

/**
 * Check if a variable name is a typography variable
 */
export function isTypographyVariable(name: string): boolean {
  return name.startsWith('text-') || name.startsWith('font-');
}
