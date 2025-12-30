import { ParsedTheme, ParsedValue, ColorValue, DimensionValue, VARIABLE_GROUPS } from '../shared/types';

// Layout constants
const PADDING = 64;
const SECTION_GAP = 48;
const ITEM_GAP = 16;
const SWATCH_SIZE = 80;
const SWATCH_GAP = 24;

// Colors for the style guide frame itself
const FRAME_BG = { r: 0.98, g: 0.98, b: 0.98 };
const SECTION_BG = { r: 1, g: 1, b: 1 };
const TEXT_COLOR = { r: 0.1, g: 0.1, b: 0.1 };
const MUTED_TEXT = { r: 0.5, g: 0.5, b: 0.5 };

interface StyleGuideResult {
  frame: FrameNode;
}

/**
 * Generate a complete style guide frame from a parsed theme
 */
export async function generateStyleGuide(
  theme: ParsedTheme,
  collection: VariableCollection,
  lightModeId: string
): Promise<StyleGuideResult> {
  // Load fonts first
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  // Create main frame
  const frame = figma.createFrame();
  frame.name = '🎨 Theme Style Guide';
  frame.resize(1200, 100); // Height will auto-adjust
  frame.fills = [{ type: 'SOLID', color: FRAME_BG }];
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'FIXED';
  frame.paddingTop = PADDING;
  frame.paddingBottom = PADDING;
  frame.paddingLeft = PADDING;
  frame.paddingRight = PADDING;
  frame.itemSpacing = SECTION_GAP;

  // Add header
  const header = createHeader();
  frame.appendChild(header);

  // Add color palette section
  const colorSection = await createColorPaletteSection(theme, collection, lightModeId);
  frame.appendChild(colorSection);

  // Add typography section
  const typographySection = createTypographySection(theme);
  frame.appendChild(typographySection);

  // Add effects section
  const effectsSection = createEffectsSection(theme);
  frame.appendChild(effectsSection);

  // Add button variants section
  const buttonsSection = await createButtonsSection(theme, collection, lightModeId);
  frame.appendChild(buttonsSection);

  // Position frame in viewport
  const viewportCenter = figma.viewport.center;
  frame.x = viewportCenter.x - frame.width / 2;
  frame.y = viewportCenter.y - frame.height / 2;

  // Select and zoom to the frame
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);

  return { frame };
}

/**
 * Create the header section
 */
function createHeader(): FrameNode {
  const header = figma.createFrame();
  header.name = 'Header';
  header.layoutMode = 'HORIZONTAL';
  header.primaryAxisSizingMode = 'AUTO';
  header.counterAxisSizingMode = 'AUTO';
  header.fills = [];

  const title = figma.createText();
  title.characters = 'Theme Style Guide';
  title.fontSize = 32;
  title.fontName = { family: 'Inter', style: 'Bold' };
  title.fills = [{ type: 'SOLID', color: TEXT_COLOR }];
  header.appendChild(title);

  return header;
}

/**
 * Create a section container
 */
function createSection(name: string, title: string): FrameNode {
  const section = figma.createFrame();
  section.name = name;
  section.layoutMode = 'VERTICAL';
  section.primaryAxisSizingMode = 'AUTO';
  section.counterAxisSizingMode = 'FIXED';
  section.layoutAlign = 'STRETCH';
  section.fills = [{ type: 'SOLID', color: SECTION_BG }];
  section.cornerRadius = 12;
  section.paddingTop = 32;
  section.paddingBottom = 32;
  section.paddingLeft = 32;
  section.paddingRight = 32;
  section.itemSpacing = 24;

  // Add shadow
  section.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.08 },
      offset: { x: 0, y: 2 },
      radius: 8,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
  ];

  // Section title
  const titleText = figma.createText();
  titleText.characters = title;
  titleText.fontSize = 20;
  titleText.fontName = { family: 'Inter', style: 'Bold' };
  titleText.fills = [{ type: 'SOLID', color: TEXT_COLOR }];
  section.appendChild(titleText);

  return section;
}

/**
 * Create the color palette section
 */
async function createColorPaletteSection(
  theme: ParsedTheme,
  collection: VariableCollection,
  lightModeId: string
): Promise<FrameNode> {
  const section = createSection('Color Palette', 'Color Palette');

  // Create color groups
  const colorGroups = [
    { name: 'Base', keys: ['background', 'foreground', 'border', 'input', 'ring'] },
    { name: 'Primary', keys: ['primary', 'primary-foreground'] },
    { name: 'Secondary', keys: ['secondary', 'secondary-foreground'] },
    { name: 'Accent', keys: ['accent', 'accent-foreground'] },
    { name: 'Muted', keys: ['muted', 'muted-foreground'] },
    { name: 'Destructive', keys: ['destructive', 'destructive-foreground'] },
    { name: 'Card', keys: ['card', 'card-foreground'] },
    { name: 'Popover', keys: ['popover', 'popover-foreground'] },
  ];

  for (const group of colorGroups) {
    const groupFrame = createColorGroup(group.name, group.keys, theme.light, collection, lightModeId);
    section.appendChild(groupFrame);
  }

  return section;
}

/**
 * Create a color group (row of swatches)
 */
function createColorGroup(
  name: string,
  keys: string[],
  values: Record<string, ParsedValue>,
  collection: VariableCollection,
  lightModeId: string
): FrameNode {
  const group = figma.createFrame();
  group.name = `${name} Colors`;
  group.layoutMode = 'VERTICAL';
  group.primaryAxisSizingMode = 'AUTO';
  group.counterAxisSizingMode = 'AUTO';
  group.fills = [];
  group.itemSpacing = 12;

  // Group label
  const label = figma.createText();
  label.characters = name;
  label.fontSize = 14;
  label.fontName = { family: 'Inter', style: 'Medium' };
  label.fills = [{ type: 'SOLID', color: MUTED_TEXT }];
  group.appendChild(label);

  // Swatches row
  const swatchesRow = figma.createFrame();
  swatchesRow.name = 'Swatches';
  swatchesRow.layoutMode = 'HORIZONTAL';
  swatchesRow.primaryAxisSizingMode = 'AUTO';
  swatchesRow.counterAxisSizingMode = 'AUTO';
  swatchesRow.fills = [];
  swatchesRow.itemSpacing = SWATCH_GAP;

  for (const key of keys) {
    const value = values[key];
    if (value && value.type === 'color') {
      const swatch = createColorSwatch(key, value.value as ColorValue, collection, lightModeId);
      swatchesRow.appendChild(swatch);
    }
  }

  group.appendChild(swatchesRow);
  return group;
}

/**
 * Create a single color swatch with label
 */
function createColorSwatch(
  name: string,
  color: ColorValue,
  collection: VariableCollection,
  lightModeId: string
): FrameNode {
  const swatch = figma.createFrame();
  swatch.name = name;
  swatch.layoutMode = 'VERTICAL';
  swatch.primaryAxisSizingMode = 'AUTO';
  swatch.counterAxisSizingMode = 'AUTO';
  swatch.fills = [];
  swatch.itemSpacing = 8;

  // Color rectangle
  const rect = figma.createRectangle();
  rect.name = 'Color';
  rect.resize(SWATCH_SIZE, SWATCH_SIZE);
  rect.cornerRadius = 8;

  // Try to bind to variable
  const variableName = getGroupedColorName(name);
  const variable = findVariableByName(collection, variableName);

  if (variable) {
    // Bind fill to variable
    rect.fills = [
      figma.variables.setBoundVariableForPaint(
        { type: 'SOLID', color: { r: color.r, g: color.g, b: color.b } },
        'color',
        variable
      ),
    ];
  } else {
    // Fallback to static color
    rect.fills = [{ type: 'SOLID', color: { r: color.r, g: color.g, b: color.b } }];
  }

  // Add subtle border
  rect.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.1 }];
  rect.strokeWeight = 1;

  swatch.appendChild(rect);

  // Color name label
  const nameLabel = figma.createText();
  nameLabel.characters = name;
  nameLabel.fontSize = 12;
  nameLabel.fontName = { family: 'Inter', style: 'Medium' };
  nameLabel.fills = [{ type: 'SOLID', color: TEXT_COLOR }];
  swatch.appendChild(nameLabel);

  // Hex value label
  const hexLabel = figma.createText();
  hexLabel.characters = color.hex;
  hexLabel.fontSize = 10;
  hexLabel.fontName = { family: 'Inter', style: 'Regular' };
  hexLabel.fills = [{ type: 'SOLID', color: MUTED_TEXT }];
  swatch.appendChild(hexLabel);

  return swatch;
}

/**
 * Create the typography section
 */
function createTypographySection(theme: ParsedTheme): FrameNode {
  const section = createSection('Typography', 'Typography Scale');

  const sizes = [
    { name: 'text-5xl', label: 'Display', fallback: 48 },
    { name: 'text-4xl', label: 'Heading 1', fallback: 36 },
    { name: 'text-3xl', label: 'Heading 2', fallback: 30 },
    { name: 'text-2xl', label: 'Heading 3', fallback: 24 },
    { name: 'text-xl', label: 'Large', fallback: 20 },
    { name: 'text-lg', label: 'Body Large', fallback: 18 },
    { name: 'text-base', label: 'Body', fallback: 16 },
    { name: 'text-sm', label: 'Small', fallback: 14 },
    { name: 'text-xs', label: 'Extra Small', fallback: 12 },
  ];

  for (const size of sizes) {
    const row = figma.createFrame();
    row.name = size.name;
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisSizingMode = 'AUTO';
    row.counterAxisSizingMode = 'AUTO';
    row.fills = [];
    row.itemSpacing = 24;
    row.counterAxisAlignItems = 'CENTER';

    // Get actual font size from theme
    const themeValue = theme.light[size.name];
    let fontSize = size.fallback;
    if (themeValue && themeValue.type === 'dimension') {
      const dim = themeValue.value as DimensionValue;
      fontSize = dim.unit === 'rem' ? dim.value * 16 : dim.value;
    }

    // Sample text
    const sample = figma.createText();
    sample.characters = size.label;
    sample.fontSize = fontSize;
    sample.fontName = { family: 'Inter', style: 'Regular' };
    sample.fills = [{ type: 'SOLID', color: TEXT_COLOR }];
    row.appendChild(sample);

    // Size info
    const info = figma.createText();
    info.characters = `--${size.name} (${fontSize}px)`;
    info.fontSize = 12;
    info.fontName = { family: 'Inter', style: 'Regular' };
    info.fills = [{ type: 'SOLID', color: MUTED_TEXT }];
    row.appendChild(info);

    section.appendChild(row);
  }

  // Font family info
  const fontFamilyValue = theme.light['font-sans'];
  if (fontFamilyValue) {
    const fontInfo = figma.createText();
    fontInfo.characters = `Font: ${(fontFamilyValue.value as string).split(',')[0].trim()}`;
    fontInfo.fontSize = 14;
    fontInfo.fontName = { family: 'Inter', style: 'Medium' };
    fontInfo.fills = [{ type: 'SOLID', color: MUTED_TEXT }];
    section.appendChild(fontInfo);
  }

  return section;
}

/**
 * Create the effects section (radius, shadows)
 */
function createEffectsSection(theme: ParsedTheme): FrameNode {
  const section = createSection('Effects', 'Effects');

  // Radius examples
  const radiusContainer = figma.createFrame();
  radiusContainer.name = 'Radius';
  radiusContainer.layoutMode = 'VERTICAL';
  radiusContainer.primaryAxisSizingMode = 'AUTO';
  radiusContainer.counterAxisSizingMode = 'AUTO';
  radiusContainer.fills = [];
  radiusContainer.itemSpacing = 12;

  const radiusLabel = figma.createText();
  radiusLabel.characters = 'Border Radius';
  radiusLabel.fontSize = 14;
  radiusLabel.fontName = { family: 'Inter', style: 'Medium' };
  radiusLabel.fills = [{ type: 'SOLID', color: MUTED_TEXT }];
  radiusContainer.appendChild(radiusLabel);

  const radiusRow = figma.createFrame();
  radiusRow.name = 'Radius Examples';
  radiusRow.layoutMode = 'HORIZONTAL';
  radiusRow.primaryAxisSizingMode = 'AUTO';
  radiusRow.counterAxisSizingMode = 'AUTO';
  radiusRow.fills = [];
  radiusRow.itemSpacing = 16;

  const radiusSizes = [
    { name: 'radius-sm', fallback: 6 },
    { name: 'radius-md', fallback: 8 },
    { name: 'radius', fallback: 8 },
    { name: 'radius-lg', fallback: 12 },
    { name: 'radius-xl', fallback: 16 },
  ];

  for (const radius of radiusSizes) {
    const themeValue = theme.light[radius.name];
    let radiusValue = radius.fallback;
    if (themeValue && themeValue.type === 'dimension') {
      const dim = themeValue.value as DimensionValue;
      radiusValue = dim.unit === 'rem' ? dim.value * 16 : dim.value;
    }

    const item = figma.createFrame();
    item.name = radius.name;
    item.layoutMode = 'VERTICAL';
    item.primaryAxisSizingMode = 'AUTO';
    item.counterAxisSizingMode = 'AUTO';
    item.fills = [];
    item.itemSpacing = 8;
    item.counterAxisAlignItems = 'CENTER';

    const rect = figma.createRectangle();
    rect.resize(48, 48);
    rect.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.95 } }];
    rect.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.8 } }];
    rect.strokeWeight = 1;
    rect.cornerRadius = radiusValue;
    item.appendChild(rect);

    const label = figma.createText();
    label.characters = radius.name.replace('radius-', '').replace('radius', 'default');
    label.fontSize = 10;
    label.fontName = { family: 'Inter', style: 'Regular' };
    label.fills = [{ type: 'SOLID', color: MUTED_TEXT }];
    item.appendChild(label);

    radiusRow.appendChild(item);
  }

  radiusContainer.appendChild(radiusRow);
  section.appendChild(radiusContainer);

  // Shadow examples
  const shadowContainer = figma.createFrame();
  shadowContainer.name = 'Shadows';
  shadowContainer.layoutMode = 'VERTICAL';
  shadowContainer.primaryAxisSizingMode = 'AUTO';
  shadowContainer.counterAxisSizingMode = 'AUTO';
  shadowContainer.fills = [];
  shadowContainer.itemSpacing = 12;

  const shadowLabel = figma.createText();
  shadowLabel.characters = 'Shadows';
  shadowLabel.fontSize = 14;
  shadowLabel.fontName = { family: 'Inter', style: 'Medium' };
  shadowLabel.fills = [{ type: 'SOLID', color: MUTED_TEXT }];
  shadowContainer.appendChild(shadowLabel);

  const shadowRow = figma.createFrame();
  shadowRow.name = 'Shadow Examples';
  shadowRow.layoutMode = 'HORIZONTAL';
  shadowRow.primaryAxisSizingMode = 'AUTO';
  shadowRow.counterAxisSizingMode = 'AUTO';
  shadowRow.fills = [];
  shadowRow.itemSpacing = 24;
  shadowRow.paddingTop = 16;
  shadowRow.paddingBottom = 16;

  const shadows = [
    { name: 'sm', blur: 2, y: 1, opacity: 0.05 },
    { name: 'md', blur: 6, y: 4, opacity: 0.1 },
    { name: 'lg', blur: 15, y: 10, opacity: 0.1 },
    { name: 'xl', blur: 25, y: 20, opacity: 0.1 },
    { name: '2xl', blur: 50, y: 25, opacity: 0.25 },
  ];

  for (const shadow of shadows) {
    const item = figma.createFrame();
    item.name = `shadow-${shadow.name}`;
    item.layoutMode = 'VERTICAL';
    item.primaryAxisSizingMode = 'AUTO';
    item.counterAxisSizingMode = 'AUTO';
    item.fills = [];
    item.itemSpacing = 8;
    item.counterAxisAlignItems = 'CENTER';

    const rect = figma.createRectangle();
    rect.resize(64, 48);
    rect.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    rect.cornerRadius = 8;
    rect.effects = [
      {
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: shadow.opacity },
        offset: { x: 0, y: shadow.y },
        radius: shadow.blur,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
      },
    ];
    item.appendChild(rect);

    const label = figma.createText();
    label.characters = shadow.name;
    label.fontSize = 10;
    label.fontName = { family: 'Inter', style: 'Regular' };
    label.fills = [{ type: 'SOLID', color: MUTED_TEXT }];
    item.appendChild(label);

    shadowRow.appendChild(item);
  }

  shadowContainer.appendChild(shadowRow);
  section.appendChild(shadowContainer);

  return section;
}

/**
 * Create button variants section
 */
async function createButtonsSection(
  theme: ParsedTheme,
  collection: VariableCollection,
  lightModeId: string
): Promise<FrameNode> {
  const section = createSection('Button Variants', 'Button Variants');

  const buttonsRow = figma.createFrame();
  buttonsRow.name = 'Buttons';
  buttonsRow.layoutMode = 'HORIZONTAL';
  buttonsRow.primaryAxisSizingMode = 'AUTO';
  buttonsRow.counterAxisSizingMode = 'AUTO';
  buttonsRow.fills = [];
  buttonsRow.itemSpacing = 16;

  const variants = [
    { name: 'Primary', bg: 'primary', fg: 'primary-foreground' },
    { name: 'Secondary', bg: 'secondary', fg: 'secondary-foreground' },
    { name: 'Destructive', bg: 'destructive', fg: 'destructive-foreground' },
    { name: 'Outline', bg: null, fg: 'foreground', border: 'border' },
    { name: 'Ghost', bg: null, fg: 'foreground' },
  ];

  for (const variant of variants) {
    const button = createButton(variant, theme.light, collection, lightModeId);
    buttonsRow.appendChild(button);
  }

  section.appendChild(buttonsRow);
  return section;
}

/**
 * Create a single button
 */
function createButton(
  variant: { name: string; bg: string | null; fg: string; border?: string },
  values: Record<string, ParsedValue>,
  collection: VariableCollection,
  lightModeId: string
): FrameNode {
  const button = figma.createFrame();
  button.name = `Button / ${variant.name}`;
  button.layoutMode = 'HORIZONTAL';
  button.primaryAxisSizingMode = 'AUTO';
  button.counterAxisSizingMode = 'AUTO';
  button.paddingTop = 10;
  button.paddingBottom = 10;
  button.paddingLeft = 16;
  button.paddingRight = 16;
  button.cornerRadius = 8;
  button.primaryAxisAlignItems = 'CENTER';
  button.counterAxisAlignItems = 'CENTER';

  // Background
  if (variant.bg) {
    const bgValue = values[variant.bg];
    if (bgValue && bgValue.type === 'color') {
      const color = bgValue.value as ColorValue;
      const variable = findVariableByName(collection, getGroupedColorName(variant.bg));

      if (variable) {
        button.fills = [
          figma.variables.setBoundVariableForPaint(
            { type: 'SOLID', color: { r: color.r, g: color.g, b: color.b } },
            'color',
            variable
          ),
        ];
      } else {
        button.fills = [{ type: 'SOLID', color: { r: color.r, g: color.g, b: color.b } }];
      }
    }
  } else {
    button.fills = [];
  }

  // Border
  if (variant.border) {
    const borderValue = values[variant.border];
    if (borderValue && borderValue.type === 'color') {
      const color = borderValue.value as ColorValue;
      button.strokes = [{ type: 'SOLID', color: { r: color.r, g: color.g, b: color.b } }];
      button.strokeWeight = 1;
    }
  }

  // Text
  const text = figma.createText();
  text.characters = variant.name;
  text.fontSize = 14;
  text.fontName = { family: 'Inter', style: 'Medium' };

  const fgValue = values[variant.fg];
  if (fgValue && fgValue.type === 'color') {
    const color = fgValue.value as ColorValue;
    const variable = findVariableByName(collection, getGroupedColorName(variant.fg));

    if (variable) {
      text.fills = [
        figma.variables.setBoundVariableForPaint(
          { type: 'SOLID', color: { r: color.r, g: color.g, b: color.b } },
          'color',
          variable
        ),
      ];
    } else {
      text.fills = [{ type: 'SOLID', color: { r: color.r, g: color.g, b: color.b } }];
    }
  } else {
    text.fills = [{ type: 'SOLID', color: TEXT_COLOR }];
  }

  button.appendChild(text);
  return button;
}

/**
 * Find a variable by name in the collection
 */
function findVariableByName(collection: VariableCollection, name: string): Variable | null {
  const variables = figma.variables.getLocalVariables();
  return variables.find(v => v.name === name && v.variableCollectionId === collection.id) || null;
}

/**
 * Get a grouped name for color variables
 */
function getGroupedColorName(name: string): string {
  if (name.startsWith('sidebar-')) {
    return `colors/sidebar/${name}`;
  }
  if (name.startsWith('chart-')) {
    return `colors/chart/${name}`;
  }
  if (name.includes('primary')) {
    return `colors/primary/${name}`;
  }
  if (name.includes('secondary')) {
    return `colors/secondary/${name}`;
  }
  if (name.includes('destructive')) {
    return `colors/destructive/${name}`;
  }
  if (name.includes('accent')) {
    return `colors/accent/${name}`;
  }
  if (name.includes('muted')) {
    return `colors/muted/${name}`;
  }
  if (name.includes('card')) {
    return `colors/card/${name}`;
  }
  if (name.includes('popover')) {
    return `colors/popover/${name}`;
  }
  return `colors/base/${name}`;
}
