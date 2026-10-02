import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('baydar_theme') as ThemeMode;
      if (stored) return stored;
    }
    return 'system';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      localStorage.removeItem('baydar_theme');
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      localStorage.setItem('baydar_theme', theme);
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-surface/80 p-1 backdrop-blur-md">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-colors ${
          theme === 'light' ? 'bg-paper text-accent shadow-sm' : 'text-muted hover:text-ink'
        }`}
        aria-label="Light Theme"
        title="Light Theme"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-colors ${
          theme === 'dark' ? 'bg-paper text-accent shadow-sm' : 'text-muted hover:text-ink'
        }`}
        aria-label="Dark Theme"
        title="Dark Theme"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-full transition-colors ${
          theme === 'system' ? 'bg-paper text-accent shadow-sm' : 'text-muted hover:text-ink'
        }`}
        aria-label="System Theme"
        title="System Theme"
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
