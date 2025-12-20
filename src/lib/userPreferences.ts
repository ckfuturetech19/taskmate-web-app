// User preferences storage (matching Flutter's paletteIndex behavior)
// Stores paletteIndex in localStorage (defaults to 0 - Classic palette)

const PALETTE_INDEX_KEY = 'taskmate_palette_index';

/**
 * Get the current palette index from localStorage
 * @returns Palette index (0-2, defaults to 0)
 */
export const getPaletteIndex = (): number => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return 0; // Default to Classic palette for SSR
  }
  
  try {
    const stored = localStorage.getItem(PALETTE_INDEX_KEY);
    if (stored !== null) {
      const index = parseInt(stored, 10);
      if (index >= 0 && index <= 2) {
        return index;
      }
    }
  } catch (error) {
    console.error('Error reading palette index:', error);
  }
  return 0; // Default to Classic palette (matching Flutter)
};

/**
 * Save the palette index to localStorage
 * @param index - Palette index (0-2)
 */
export const setPaletteIndex = (index: number): void => {
  try {
    if (index >= 0 && index <= 2) {
      localStorage.setItem(PALETTE_INDEX_KEY, index.toString());
    }
  } catch (error) {
    console.error('Error saving palette index:', error);
  }
};

