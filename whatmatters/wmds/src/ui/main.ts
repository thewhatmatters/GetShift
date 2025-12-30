import { MessageToPlugin, MessageToUI, DEFAULT_THEME_CSS } from '../shared/types';

// Get DOM elements
const textarea = document.getElementById('css-input') as HTMLTextAreaElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;
const loadDefaultBtn = document.getElementById('load-default-btn') as HTMLButtonElement;
const statusEl = document.getElementById('status') as HTMLDivElement;
const existingBanner = document.getElementById('existing-banner') as HTMLDivElement;

// State
let isGenerating = false;

// Update status message
function setStatus(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.style.display = message ? 'block' : 'none';
}

// Update button states
function setGenerating(generating: boolean): void {
  isGenerating = generating;
  generateBtn.disabled = generating;
  generateBtn.textContent = generating ? 'Generating...' : 'Generate Style Guide';
  textarea.disabled = generating;
}

// Send message to plugin
function postMessage(msg: MessageToPlugin): void {
  parent.postMessage({ pluginMessage: msg }, '*');
}

// Handle messages from plugin
window.onmessage = (event: MessageEvent) => {
  const msg = event.data.pluginMessage as MessageToUI;
  if (!msg) return;

  switch (msg.type) {
    case 'PROGRESS':
      setStatus(msg.message, 'info');
      break;

    case 'GENERATION_COMPLETE':
      setGenerating(false);
      setStatus(`Success! Created ${msg.variableCount} variables and style guide.`, 'success');
      break;

    case 'GENERATION_ERROR':
      setGenerating(false);
      setStatus(`Error: ${msg.error}`, 'error');
      break;

    case 'EXISTING_VARIABLES':
      existingBanner.style.display = 'block';
      existingBanner.innerHTML = `
        <strong>Existing theme detected</strong><br>
        Found ${msg.count} variables in the Theme collection.<br>
        Generating will update existing variables.
      `;
      break;
  }
};

// Generate button click
generateBtn.addEventListener('click', () => {
  const css = textarea.value.trim();

  if (!css) {
    // Use default theme if empty
    if (confirm('No CSS provided. Would you like to use the default shadcn theme?')) {
      textarea.value = DEFAULT_THEME_CSS;
    } else {
      return;
    }
  }

  setGenerating(true);
  setStatus('Starting...', 'info');
  postMessage({ type: 'GENERATE_THEME', css: textarea.value });
});

// Cancel button click
cancelBtn.addEventListener('click', () => {
  postMessage({ type: 'CANCEL' });
});

// Load default button click
loadDefaultBtn.addEventListener('click', () => {
  textarea.value = DEFAULT_THEME_CSS;
  setStatus('Default theme loaded. Click Generate to create style guide.', 'info');
});

// Initialize with placeholder
textarea.placeholder = `Paste your shadcn/Tailwind CSS theme here...

Example:
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(0 0% 10%);
  --primary: hsl(222.2 47.4% 11.2%);
  ...
}

.dark {
  --background: hsl(0 0% 10%);
  --foreground: hsl(0 0% 98%);
  ...
}`;
