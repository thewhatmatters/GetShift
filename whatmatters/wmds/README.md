# WMDS - Theme Generator

A Figma plugin that converts CSS theme variables into Figma variables and generates visual style guides. Perfect for bridging the gap between your code-based design system and Figma.

## Features

- **CSS Parsing**: Parses `:root` and `.dark` CSS blocks for light/dark mode support
- **Color Format Support**: HSL, OKLCH, RGB, and Hex color values
- **Figma Variables**: Creates organized Figma variable collections with proper modes
- **Style Guide Generation**: Automatically generates visual documentation of your theme
- **shadcn/Tailwind Compatible**: Built to work seamlessly with shadcn/ui themes

## Supported CSS Variables

### Colors
- Base: `background`, `foreground`, `border`, `input`, `ring`
- Semantic: `primary`, `secondary`, `accent`, `muted`, `destructive`
- Components: `card`, `popover`, `sidebar`
- Data Visualization: `chart-1` through `chart-5`

### Typography
- Font Sizes: `text-xs` through `text-5xl`
- Font Families: `font-sans`, `font-serif`, `font-mono`

### Effects
- Border Radius: `radius`, `radius-sm`, `radius-md`, `radius-lg`, `radius-xl`
- Shadows: `shadow`, `shadow-sm` through `shadow-2xl`

## Installation

### Development Setup

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Watch for changes during development
npm run watch
```

### Loading in Figma

1. Open Figma Desktop
2. Go to **Plugins** > **Development** > **Import plugin from manifest...**
3. Select the `manifest.json` file from this directory

## Usage

1. Open the plugin in Figma
2. Paste your CSS theme (or use the default shadcn theme)
3. Click **Generate Style Guide**

### Example CSS Input

```css
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(0 0% 10%);
  --primary: hsl(222.2 47.4% 11.2%);
  --primary-foreground: hsl(210 40% 98%);
  --secondary: hsl(210 40% 96.1%);
  --secondary-foreground: hsl(222.2 47.4% 11.2%);
  --radius: 0.5rem;
}

.dark {
  --background: hsl(0 0% 10%);
  --foreground: hsl(0 0% 98%);
  --primary: hsl(210 40% 98%);
  --primary-foreground: hsl(222.2 47.4% 11.2%);
}
```

## Project Structure

```
wmds/
├── src/
│   ├── plugin/
│   │   ├── main.ts        # Plugin entry point
│   │   ├── parser.ts      # CSS parsing logic
│   │   ├── variables.ts   # Figma variable creation
│   │   └── styleGuide.ts  # Style guide generation
│   ├── shared/
│   │   └── types.ts       # Shared TypeScript types
│   └── ui/
│       └── main.ts        # Plugin UI logic
├── dist/
│   ├── plugin.js          # Compiled plugin code
│   └── ui.html            # Plugin UI
├── manifest.json          # Figma plugin manifest
├── package.json
└── tsconfig.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build both UI and plugin |
| `npm run build:ui` | Build only the UI |
| `npm run build:plugin` | Build only the plugin |
| `npm run watch` | Watch and rebuild on changes |
| `npm run typecheck` | Run TypeScript type checking |

## Technical Details

### Color Conversion

The plugin handles multiple color formats and converts them to Figma's RGB format:

- **HSL**: `hsl(222.2 47.4% 11.2%)` or `hsl(222.2, 47.4%, 11.2%)`
- **OKLCH**: `oklch(0.9882 0.0024 95.7755)`
- **RGB**: `rgb(255, 255, 255)` or `rgb(255 255 255)`
- **Hex**: `#RRGGBB` or `#RGB`

### Variable Modes

The plugin creates a variable collection named "Theme" with two modes:
- **Light**: Values from `:root` block
- **Dark**: Values from `.dark` block

## License

MIT
