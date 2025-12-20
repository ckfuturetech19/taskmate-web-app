// Color palettes matching Flutter app (palettes.dart)
// Supports both light and dark themes

export interface ColorPalette {
  name: string;
  colors: string[]; // Light mode colors
  darkColors: string[]; // Dark mode colors
}

export const colorPalettes: ColorPalette[] = [
  {
    name: 'Classic',
    colors: [
      '#E57373', '#F06292', '#BA68C8', '#64B5F6',
      '#81C784', '#4DB6AC', '#81C784', '#AED581',
      '#FFB74D', '#FFD54F', '#FF8A65', '#7986CB'
    ],
    darkColors: [
      '#D32F2F', '#C2185B', '#7B1FA2', '#1976D2',
      '#388E3C', '#00796B', '#388E3C', '#689F38',
      '#F57C00', '#FF8F00', '#E64A19', '#3F51B5'
    ]
  },
  {
    name: 'Pastel',
    colors: [
      '#FFB3BA', '#FFDFBA', '#FFFBAA', '#BAFFC9',
      '#BAE1FF', '#D5BAFF', '#FFBAED', '#BAFFD9',
      '#FFE1BA', '#BAE1FF', '#D5FFBA', '#FFBAD5'
    ],
    darkColors: [
      '#B26D6D', '#B29B6D', '#B2B26D', '#6DB27D',
      '#6D8FB2', '#7D6DB2', '#B26D9B', '#6DB28F',
      '#B29B6D', '#6D8FB2', '#7DB26D', '#B26D7D'
    ]
  },
  {
    name: 'Vibrant',
    colors: [
      '#FF5252', '#FFC107', '#4CAF50', '#2196F3',
      '#9C27B0', '#FF9800', '#00BCD4', '#8BC34A',
      '#FFEB3B', '#3F51B5', '#FF5722', '#009688'
    ],
    darkColors: [
      '#B71C1C', '#FF6F00', '#1B5E20', '#0D47A1',
      '#4A148C', '#E65100', '#006064', '#33691E',
      '#FBC02D', '#1A237E', '#E64A19', '#004D40'
    ]
  }
];

/**
 * Get the color for a task based on colorIndex, paletteIndex, and theme
 * Matches Flutter's behavior: palette.colors[colorIndex % colors.length]
 * @param colorIndex - The color index (can be 0-11 local or 0-35 global, will be modulo'd)
 * @param paletteIndex - The palette index (0-2, defaults to 0)
 * @param theme - 'light' or 'dark'
 * @returns The hex color string
 */
export const getTaskColor = (
  colorIndex: number,
  paletteIndex: number = 0,
  theme: 'light' | 'dark' = 'light'
): string => {
  // Ensure paletteIndex is valid
  const validPaletteIndex = Math.max(0, Math.min(paletteIndex, colorPalettes.length - 1));
  const palette = colorPalettes[validPaletteIndex];
  
  // Get the color array based on theme
  const colorArray = theme === 'dark' ? palette.darkColors : palette.colors;
  
  // Flutter uses: palette.colors[colorIndex % colors.length]
  // This works whether colorIndex is local (0-11) or global (0-35)
  const colorInPalette = colorIndex % colorArray.length;
  
  return colorArray[colorInPalette];
};

/**
 * Calculate global colorIndex from paletteIndex and local colorIndex
 * Used when creating new tasks to store in Firestore
 * @param paletteIndex - The palette index (0-2)
 * @param localColorIndex - The color index within the palette (0-11)
 * @returns Global color index (0-35)
 */
export const calculateGlobalColorIndex = (paletteIndex: number, localColorIndex: number): number => {
  return (paletteIndex * 12) + (localColorIndex % 12);
};

/**
 * Get palette and color indices from a global colorIndex
 * @param colorIndex - The global color index (0-35)
 * @returns Object with paletteIndex and colorInPalette
 */
export const getPaletteIndices = (colorIndex: number): { paletteIndex: number; colorInPalette: number } => {
  const paletteIndex = Math.floor(colorIndex / 12);
  const colorInPalette = colorIndex % 12;
  return {
    paletteIndex: Math.min(paletteIndex, colorPalettes.length - 1),
    colorInPalette
  };
};

