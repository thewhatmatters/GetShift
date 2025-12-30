import { ParsedTheme, ParsedValue, ColorValue, DimensionValue } from '../shared/types';
import { isColorVariable, isRadiusVariable, isShadowVariable, isTypographyVariable } from './parser';

const COLLECTION_NAME = 'Theme';
const LIGHT_MODE_NAME = 'Light';
const DARK_MODE_NAME = 'Dark';

interface VariableResult {
  collection: VariableCollection;
  lightModeId: string;
  darkModeId: string;
  variableCount: number;
}

/**
 * Create or get the Theme variable collection with Light and Dark modes
 */
export async function getOrCreateCollection(): Promise<{
  collection: VariableCollection;
  lightModeId: string;
  darkModeId: string;
}> {
  // Check if collection already exists
  const existingCollections = figma.variables.getLocalVariableCollections();
  let collection = existingCollections.find(c => c.name === COLLECTION_NAME);

  if (collection) {
    // Find or create modes
    let lightMode = collection.modes.find(m => m.name === LIGHT_MODE_NAME);
    let darkMode = collection.modes.find(m => m.name === DARK_MODE_NAME);

    // If we have exactly one mode with the default name, rename it to Light
    if (collection.modes.length === 1 && !lightMode) {
      collection.renameMode(collection.modes[0].modeId, LIGHT_MODE_NAME);
      lightMode = collection.modes[0];
    }

    // Add Dark mode if it doesn't exist
    if (!darkMode && collection.modes.length < 4) {
      darkMode = { modeId: collection.addMode(DARK_MODE_NAME), name: DARK_MODE_NAME };
    }

    return {
      collection,
      lightModeId: lightMode?.modeId || collection.modes[0].modeId,
      darkModeId: darkMode?.modeId || collection.modes[1]?.modeId || collection.modes[0].modeId,
    };
  }

  // Create new collection
  collection = figma.variables.createVariableCollection(COLLECTION_NAME);

  // Rename the default mode to Light
  collection.renameMode(collection.modes[0].modeId, LIGHT_MODE_NAME);

  // Add Dark mode
  const darkModeId = collection.addMode(DARK_MODE_NAME);

  return {
    collection,
    lightModeId: collection.modes[0].modeId,
    darkModeId,
  };
}

/**
 * Create or update a variable in the collection
 */
function getOrCreateVariable(
  collection: VariableCollection,
  name: string,
  type: VariableResolvedDataType
): Variable {
  // Check if variable already exists
  const existingVariables = figma.variables.getLocalVariables();
  const existing = existingVariables.find(
    v => v.name === name && v.variableCollectionId === collection.id
  );

  if (existing) {
    return existing;
  }

  return figma.variables.createVariable(name, collection.id, type);
}

/**
 * Convert ParsedValue to Figma-compatible value
 */
function toFigmaColor(colorValue: ColorValue): RGB {
  return {
    r: colorValue.r,
    g: colorValue.g,
    b: colorValue.b,
  };
}

/**
 * Convert rem to pixels (assuming 16px base)
 */
function remToPx(rem: number): number {
  return rem * 16;
}

/**
 * Create all variables from a parsed theme
 */
export async function createVariablesFromTheme(theme: ParsedTheme): Promise<VariableResult> {
  const { collection, lightModeId, darkModeId } = await getOrCreateCollection();
  let variableCount = 0;

  // Get all unique variable names from both modes
  const allNames = new Set([
    ...Object.keys(theme.light),
    ...Object.keys(theme.dark),
  ]);

  for (const name of allNames) {
    const lightValue = theme.light[name];
    const darkValue = theme.dark[name];

    // Use light value as reference, fall back to dark
    const referenceValue = lightValue || darkValue;
    if (!referenceValue) continue;

    try {
      if (isColorVariable(name) && referenceValue.type === 'color') {
        // Create color variable
        const groupedName = getGroupedColorName(name);
        const variable = getOrCreateVariable(collection, groupedName, 'COLOR');

        if (lightValue?.type === 'color') {
          variable.setValueForMode(lightModeId, toFigmaColor(lightValue.value as ColorValue));
        }
        if (darkValue?.type === 'color') {
          variable.setValueForMode(darkModeId, toFigmaColor(darkValue.value as ColorValue));
        }

        variableCount++;
      } else if (isRadiusVariable(name) && referenceValue.type === 'dimension') {
        // Create number variable for radius
        const groupedName = `effects/${name}`;
        const variable = getOrCreateVariable(collection, groupedName, 'FLOAT');
        const dimValue = referenceValue.value as DimensionValue;
        const pxValue = dimValue.unit === 'rem' ? remToPx(dimValue.value) : dimValue.value;

        // Radius is typically the same in both modes
        variable.setValueForMode(lightModeId, pxValue);
        variable.setValueForMode(darkModeId, pxValue);

        variableCount++;
      } else if (name.startsWith('text-') && referenceValue.type === 'dimension') {
        // Create number variable for font size
        const groupedName = `typography/${name}`;
        const variable = getOrCreateVariable(collection, groupedName, 'FLOAT');
        const dimValue = referenceValue.value as DimensionValue;
        const pxValue = dimValue.unit === 'rem' ? remToPx(dimValue.value) : dimValue.value;

        variable.setValueForMode(lightModeId, pxValue);
        variable.setValueForMode(darkModeId, pxValue);

        variableCount++;
      } else if (name.startsWith('font-') && referenceValue.type === 'font') {
        // Create string variable for font family
        const groupedName = `typography/${name}`;
        const variable = getOrCreateVariable(collection, groupedName, 'STRING');

        // Extract just the first font name for cleaner display
        const fontValue = referenceValue.value as string;
        const primaryFont = fontValue.split(',')[0].trim().replace(/['"]/g, '');

        variable.setValueForMode(lightModeId, primaryFont);
        variable.setValueForMode(darkModeId, primaryFont);

        variableCount++;
      }
      // Note: Shadow variables are skipped as Figma doesn't support effect variables directly
      // They would need to be created as Effect Styles instead
    } catch (error) {
      console.error(`Failed to create variable ${name}:`, error);
    }
  }

  return {
    collection,
    lightModeId,
    darkModeId,
    variableCount,
  };
}

/**
 * Get a grouped name for color variables (e.g., "primary" -> "colors/primary/primary")
 */
function getGroupedColorName(name: string): string {
  // Determine the group based on the variable name
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

  // Base colors (background, foreground, border, input, ring)
  return `colors/base/${name}`;
}

/**
 * Get existing variables from the Theme collection
 */
export function getExistingThemeVariables(): Variable[] {
  const collections = figma.variables.getLocalVariableCollections();
  const themeCollection = collections.find(c => c.name === COLLECTION_NAME);

  if (!themeCollection) {
    return [];
  }

  return figma.variables.getLocalVariables().filter(
    v => v.variableCollectionId === themeCollection.id
  );
}

/**
 * Delete all variables in the Theme collection (for reset functionality)
 */
export async function clearThemeVariables(): Promise<void> {
  const variables = getExistingThemeVariables();
  for (const variable of variables) {
    variable.remove();
  }
}
