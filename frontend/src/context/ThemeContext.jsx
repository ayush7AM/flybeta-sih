import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ── Theme Definitions ───────────────────────────────────────────────────
// Each theme is a map of CSS custom property → value.
// Only override the tokens that change; the rest stay as defined in index.css.

const THEMES = {
  'neo-brutalism': {
    label: 'Neo-Brutalism',
    icon: '🏗️',
    vars: {
      // Base theme — these match index.css defaults, listed for explicitness
      '--color-ink': '#111111',
      '--color-canvas': '#F9F8F6',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#E52E2E',
      '--color-primary-dark': '#C41E1E',
      '--color-muted': '#6B7280',
      '--color-border': '#111111',
      '--color-border-light': '#E5E2E1',
      '--shadow-brutal': '6px 6px 0px 0px #111111',
      '--shadow-brutal-sm': '4px 4px 0px 0px #111111',
      '--shadow-brutal-lg': '10px 10px 0px 0px #111111',
      '--font-heading': '"Anton", "Impact", sans-serif',
    },
  },
  'doraemon': {
    label: 'Doraemon',
    icon: '🤖',
    vars: {
      '--color-ink': '#1a365d',
      '--color-canvas': '#ebf8ff',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#3182ce',
      '--color-primary-dark': '#2b6cb0',
      '--color-muted': '#718096',
      '--color-border': '#2b6cb0',
      '--color-border-light': '#bee3f8',
      '--shadow-brutal': '5px 5px 0px 0px #2b6cb0',
      '--shadow-brutal-sm': '3px 3px 0px 0px #2b6cb0',
      '--shadow-brutal-lg': '8px 8px 0px 0px #2b6cb0',
      '--font-heading': '"Anton", "Impact", sans-serif',
    },
  },
  'shinchan': {
    label: 'Shinchan',
    icon: '🖍️',
    vars: {
      '--color-ink': '#1c1917',
      '--color-canvas': '#FFFBEB',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#FDE047',
      '--color-primary-dark': '#FACC15',
      '--color-muted': '#78716C',
      '--color-border': '#DC2626',
      '--color-border-light': '#FECACA',
      '--shadow-brutal': '6px 6px 0px 0px #DC2626',
      '--shadow-brutal-sm': '4px 4px 0px 0px #DC2626',
      '--shadow-brutal-lg': '10px 10px 0px 0px #DC2626',
      '--font-heading': '"Anton", "Impact", sans-serif',
    },
  },
  'princess': {
    label: 'Princess',
    icon: '👑',
    vars: {
      '--color-ink': '#3B0764',
      '--color-canvas': '#FDF4FF',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#A21CAF',
      '--color-primary-dark': '#86198F',
      '--color-muted': '#9CA3AF',
      '--color-border': '#A21CAF',
      '--color-border-light': '#FDE68A',
      '--shadow-brutal': '6px 6px 0px 0px #A21CAF',
      '--shadow-brutal-sm': '4px 4px 0px 0px #A21CAF',
      '--shadow-brutal-lg': '10px 10px 0px 0px #A21CAF',
      '--font-heading': '"Anton", "Impact", sans-serif',
    },
  },
  'anime': {
    label: 'Anime',
    icon: '⚔️',
    vars: {
      '--color-ink': '#0F172A',
      '--color-canvas': '#FFF7ED',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#F97316',
      '--color-primary-dark': '#EA580C',
      '--color-muted': '#64748B',
      '--color-border': '#0F172A',
      '--color-border-light': '#E2E8F0',
      '--shadow-brutal': '6px 6px 0px 0px #0F172A',
      '--shadow-brutal-sm': '4px 4px 0px 0px #0F172A',
      '--shadow-brutal-lg': '10px 10px 0px 0px #0F172A',
      '--font-heading': '"Anton", "Impact", sans-serif',
    },
  },
};

const THEME_KEYS = Object.keys(THEMES);
const STORAGE_KEY = 'flybeta-theme';
const DEFAULT_THEME = 'neo-brutalism';

// ── Context ─────────────────────────────────────────────────────────────

const ThemeContext = createContext(null);

function applyTheme(themeKey) {
  const theme = THEMES[themeKey];
  if (!theme) return;

  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });
}

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && THEMES[saved] ? saved : DEFAULT_THEME;
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(themeKey);
    localStorage.setItem(STORAGE_KEY, themeKey);
  }, [themeKey]);

  const setTheme = useCallback((key) => {
    if (THEMES[key]) {
      setThemeKey(key);
    }
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeKey((prev) => {
      const idx = THEME_KEYS.indexOf(prev);
      return THEME_KEYS[(idx + 1) % THEME_KEYS.length];
    });
  }, []);

  return (
    <ThemeContext.Provider value={{
      themeKey,
      theme: THEMES[themeKey],
      themes: THEMES,
      themeKeys: THEME_KEYS,
      setTheme,
      cycleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
