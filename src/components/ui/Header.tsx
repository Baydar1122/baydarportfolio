import React from 'react';
import { siteConfig } from '@/data/site';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GoogleDots } from '@/components/ui/GoogleDots';

export const Header: React.FC = () => {
  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-cobalt focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-xl"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-line bg-surface/75 backdrop-blur-md transition-colors">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Link */}
          <a href="#hero" className="flex items-center gap-2.5 font-bold text-ink text-base tracking-tight hover:opacity-80 transition-opacity">
            <GoogleDots size="sm" />
            <span>{siteConfig.name}</span>
          </a>

          {/* Nav & Theme Toggle */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 font-mono text-xs">
              <a href="#work" className="text-muted hover:text-ink transition-colors">
                Work
              </a>
              <a href="#about" className="text-muted hover:text-ink transition-colors">
                About
              </a>
              <a href="#community" className="text-muted hover:text-ink transition-colors">
                Community
              </a>
              <a href="#contact" className="text-muted hover:text-ink transition-colors">
                Contact
              </a>
            </nav>

            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
};
