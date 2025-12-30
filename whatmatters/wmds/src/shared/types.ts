// Message types between UI and Plugin
export type MessageToPlugin =
  | { type: 'GENERATE_THEME'; css: string }
  | { type: 'CANCEL' };

export type MessageToUI =
  | { type: 'GENERATION_COMPLETE'; variableCount: number }
  | { type: 'GENERATION_ERROR'; error: string }
  | { type: 'PROGRESS'; message: string }
  | { type: 'EXISTING_VARIABLES'; count: number };

// Parsed CSS types
export interface ParsedTheme {
  light: Record<string, ParsedValue>;
  dark: Record<string, ParsedValue>;
}

export interface ParsedValue {
  raw: string;
  type: 'color' | 'dimension' | 'font' | 'shadow' | 'unknown';
  value: ColorValue | DimensionValue | string;
}

export interface ColorValue {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
  a: number; // 0-1
  hex: string;
  hsl?: { h: number; s: number; l: number };
  oklch?: { l: number; c: number; h: number };
}

export interface DimensionValue {
  value: number;
  unit: 'px' | 'rem' | 'em' | '%';
}

// Variable grouping for organization
export const VARIABLE_GROUPS = {
  colors: {
    base: ['background', 'foreground', 'border', 'input', 'ring'],
    primary: ['primary', 'primary-foreground'],
    secondary: ['secondary', 'secondary-foreground'],
    accent: ['accent', 'accent-foreground'],
    muted: ['muted', 'muted-foreground'],
    destructive: ['destructive', 'destructive-foreground'],
    card: ['card', 'card-foreground'],
    popover: ['popover', 'popover-foreground'],
    sidebar: [
      'sidebar',
      'sidebar-foreground',
      'sidebar-primary',
      'sidebar-primary-foreground',
      'sidebar-accent',
      'sidebar-accent-foreground',
      'sidebar-border',
      'sidebar-ring',
    ],
    chart: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'],
  },
  typography: {
    fontSize: [
      'text-xs',
      'text-sm',
      'text-base',
      'text-lg',
      'text-xl',
      'text-2xl',
      'text-3xl',
      'text-4xl',
      'text-5xl',
    ],
    fontFamily: ['font-sans', 'font-serif', 'font-mono'],
  },
  effects: {
    radius: ['radius', 'radius-sm', 'radius-md', 'radius-lg', 'radius-xl'],
    shadow: ['shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'],
  },
} as const;

// Default theme (shadcn default)
export const DEFAULT_THEME_CSS = `:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(0 0% 10%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(0 0% 10%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(0 0% 10%);
  --primary: hsl(222.2 47.4% 11.2%);
  --primary-foreground: hsl(210 40% 98%);
  --secondary: hsl(210 40% 96.1%);
  --secondary-foreground: hsl(222.2 47.4% 11.2%);
  --muted: hsl(210 40% 96.1%);
  --muted-foreground: hsl(215.4 16.3% 46.9%);
  --accent: hsl(210 40% 96.1%);
  --accent-foreground: hsl(222.2 47.4% 11.2%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(210 40% 98%);
  --border: hsl(214.3 31.8% 91.4%);
  --input: hsl(214.3 31.8% 91.4%);
  --ring: hsl(222.2 47.4% 11.2%);
  --radius: 0.5rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --font-sans: Poppins, ui-sans-serif, system-ui, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, Times New Roman, Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --sidebar: hsl(0 0% 100%);
  --sidebar-foreground: hsl(0 0% 10%);
  --sidebar-primary: hsl(222.2 47.4% 11.2%);
  --sidebar-primary-foreground: hsl(210 40% 98%);
  --sidebar-accent: hsl(210 40% 96.1%);
  --sidebar-accent-foreground: hsl(222.2 47.4% 11.2%);
  --sidebar-border: hsl(214.3 31.8% 91.4%);
  --sidebar-ring: hsl(222.2 47.4% 11.2%);
  --chart-1: hsl(209 100% 60%);
  --chart-2: hsl(203 100% 50%);
  --chart-3: hsl(266 100% 60%);
  --chart-4: hsl(126 100% 60%);
  --chart-5: hsl(116 100% 60%);
}

.dark {
  --background: hsl(0 0% 10%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(0 0% 13%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(0 0% 13%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: hsl(210 40% 98%);
  --primary-foreground: hsl(222.2 47.4% 11.2%);
  --secondary: hsl(217.2 32.6% 17.5%);
  --secondary-foreground: hsl(210 40% 98%);
  --muted: hsl(217.2 32.6% 17.5%);
  --muted-foreground: hsl(215 20.2% 65.1%);
  --accent: hsl(217.2 32.6% 17.5%);
  --accent-foreground: hsl(210 40% 98%);
  --destructive: hsl(0 62.8% 30.6%);
  --destructive-foreground: hsl(210 40% 98%);
  --border: hsl(217.2 32.6% 17.5%);
  --input: hsl(217.2 32.6% 17.5%);
  --ring: hsl(212.7 26.8% 83.9%);
  --sidebar: hsl(0 0% 13%);
  --sidebar-foreground: hsl(0 0% 98%);
  --sidebar-primary: hsl(265 85% 60%);
  --sidebar-primary-foreground: hsl(0 0% 100%);
  --sidebar-accent: hsl(217.2 32.6% 17.5%);
  --sidebar-accent-foreground: hsl(0 0% 98%);
  --sidebar-border: hsl(217.2 32.6% 17.5%);
  --sidebar-ring: hsl(212.7 26.8% 83.9%);
  --chart-1: hsl(263 70% 50%);
  --chart-2: hsl(166 70% 50%);
  --chart-3: hsl(60 70% 50%);
  --chart-4: hsl(313 70% 50%);
  --chart-5: hsl(6 70% 50%);
}`;
