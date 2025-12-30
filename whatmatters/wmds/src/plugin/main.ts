import { MessageToPlugin, MessageToUI, DEFAULT_THEME_CSS } from '../shared/types';
import { parseThemeCSS } from './parser';
import { createVariablesFromTheme, getExistingThemeVariables } from './variables';
import { generateStyleGuide } from './styleGuide';

// Show the UI
figma.showUI(__html__, {
  width: 480,
  height: 600,
  title: 'WMDS - Theme Generator',
  themeColors: true,
});

// Send progress message to UI
function sendProgress(message: string): void {
  const msg: MessageToUI = { type: 'PROGRESS', message };
  figma.ui.postMessage(msg);
}

// Send error message to UI
function sendError(error: string): void {
  const msg: MessageToUI = { type: 'GENERATION_ERROR', error };
  figma.ui.postMessage(msg);
}

// Send completion message to UI
function sendComplete(variableCount: number): void {
  const msg: MessageToUI = { type: 'GENERATION_COMPLETE', variableCount };
  figma.ui.postMessage(msg);
}

// Handle messages from the UI
figma.ui.onmessage = async (msg: MessageToPlugin) => {
  if (msg.type === 'GENERATE_THEME') {
    try {
      sendProgress('Parsing CSS theme...');

      // Use default theme if empty
      const css = msg.css.trim() || DEFAULT_THEME_CSS;

      // Parse the CSS
      const theme = parseThemeCSS(css);

      if (Object.keys(theme.light).length === 0 && Object.keys(theme.dark).length === 0) {
        sendError('No valid CSS variables found. Make sure your CSS includes :root { } or .dark { } blocks.');
        return;
      }

      sendProgress(`Found ${Object.keys(theme.light).length} light mode variables, ${Object.keys(theme.dark).length} dark mode variables`);

      // Create Figma variables
      sendProgress('Creating Figma variables...');
      const { collection, lightModeId, darkModeId, variableCount } = await createVariablesFromTheme(theme);

      sendProgress(`Created ${variableCount} variables`);

      // Generate style guide
      sendProgress('Generating style guide...');
      await generateStyleGuide(theme, collection, lightModeId);

      sendProgress('Done!');
      sendComplete(variableCount);

    } catch (error) {
      console.error('Error generating theme:', error);
      sendError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  } else if (msg.type === 'CANCEL') {
    figma.closePlugin();
  }
};

// Check for existing theme variables on load
const existingVariables = getExistingThemeVariables();
if (existingVariables.length > 0) {
  figma.ui.postMessage({
    type: 'EXISTING_VARIABLES',
    count: existingVariables.length,
  });
}
