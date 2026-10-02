import React from 'react';
import { useScrollProgress, SECTIONS } from '@/hooks/useScrollProgress';

export const ProgressNav: React.FC = () => {
  const { progress, activeSection } = useScrollProgress();

  return (
    <aside
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-6"
      aria-label="Scroll Progress Navigation"
    >
      {/* Vertical Track Line */}
      <div className="relative w-[2px] h-44 bg-line rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-cobalt transition-all duration-150 ease-out"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      {/* Section Indicators */}
      <nav className="flex flex-col gap-3 font-mono text-[11px]">
        {SECTIONS.filter((s) => s.id !== 'hero').map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`flex items-center gap-2 transition-colors duration-200 ${
                isActive ? 'text-cobalt font-semibold' : 'text-muted hover:text-ink'
              }`}
            >
              <span className="opacity-70">{sec.number}</span>
              <span>{sec.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
};
