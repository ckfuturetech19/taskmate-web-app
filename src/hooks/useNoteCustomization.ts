import { useState, useEffect } from 'react';

export interface NoteCustomization {
  theme: 'light' | 'dark' | 'sepia' | 'forest' | 'ocean';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: 'inter' | 'serif' | 'mono';
  lineHeight: 'compact' | 'normal' | 'relaxed' | 'spacious';
  colorAccent: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  showBorders: boolean;
  showGrid: boolean;
  darkMode: boolean;
}

const DEFAULT_CUSTOMIZATION: NoteCustomization = {
  theme: 'light',
  fontSize: 'md',
  fontFamily: 'inter',
  lineHeight: 'normal',
  colorAccent: 'blue',
  showBorders: false,
  showGrid: false,
  darkMode: false,
};

export const useNoteCustomization = (noteId: string) => {
  const [customization, setCustomization] = useState<NoteCustomization>(DEFAULT_CUSTOMIZATION);

  // Load customization from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`note-customization-${noteId}`);
    if (saved) {
      try {
        setCustomization(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load customization:', e);
      }
    }
  }, [noteId]);

  // Save customization to localStorage
  const updateCustomization = (updates: Partial<NoteCustomization>) => {
    const newCustomization = { ...customization, ...updates };
    setCustomization(newCustomization);
    localStorage.setItem(`note-customization-${noteId}`, JSON.stringify(newCustomization));
  };

  const getThemeClasses = () => {
    const themes = {
      light: 'bg-white text-gray-900',
      dark: 'bg-gray-900 text-white',
      sepia: 'bg-amber-50 text-amber-950',
      forest: 'bg-green-50 text-green-950',
      ocean: 'bg-blue-50 text-blue-950',
    };
    return themes[customization.theme];
  };

  const getFontSizeClass = () => {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };
    return sizes[customization.fontSize];
  };

  const getFontFamilyClass = () => {
    const families = {
      inter: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono',
    };
    return families[customization.fontFamily];
  };

  const getLineHeightClass = () => {
    const heights = {
      compact: 'leading-tight',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      spacious: 'leading-loose',
    };
    return heights[customization.lineHeight];
  };

  const getAccentColor = () => {
    const colors = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#a855f7',
      orange: '#f97316',
      red: '#ef4444',
    };
    return colors[customization.colorAccent];
  };

  return {
    customization,
    updateCustomization,
    getThemeClasses,
    getFontSizeClass,
    getFontFamilyClass,
    getLineHeightClass,
    getAccentColor,
  };
};
