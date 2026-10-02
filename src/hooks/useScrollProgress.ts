import { useState, useEffect } from 'react';

export interface SectionMarker {
  id: string;
  number: string;
  label: string;
}

export const SECTIONS: SectionMarker[] = [
  { id: 'hero', number: '00', label: 'Intro' },
  { id: 'work', number: '01', label: 'Work' },
  { id: 'about', number: '02', label: 'About' },
  { id: 'community', number: '03', label: 'Community' },
  { id: 'contact', number: '04', label: 'Contact' },
];

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      setProgress(pct);

      // Section intersection detection
      const sectionElements = SECTIONS.map((sec) => document.getElementById(sec.id)).filter(Boolean);
      const viewportCenter = window.innerHeight / 3;

      for (const el of sectionElements) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          setActiveSection(el.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, activeSection };
}
