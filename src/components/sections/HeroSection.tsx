import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Sparkles } from 'lucide-react';
import { siteConfig } from '@/data/site';
import { ContourRenderer } from '@/lib/webgl-contour';
import { useReactiveName } from '@/hooks/useReactiveName';

interface HeroSectionProps {
  setCursorLabel: (label: string | null, variant?: 'default' | 'view' | 'link' | 'copy') => void;
  resetCursor: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setCursorLabel, resetCursor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { letterWeights, containerRef } = useReactiveName(siteConfig.name);

  useEffect(() => {
    if (!canvasRef.current || shouldReduceMotion) return;

    const getCssVarColor = (name: string): [number, number, number] => {
      const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      if (hex.startsWith('#')) {
        const c = hex.slice(1);
        const num = parseInt(c.length === 3 ? c.split('').map(x=>x+x).join('') : c, 16);
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
      }
      return [47, 91, 255];
    };

    const renderer = new ContourRenderer({
      canvas: canvasRef.current,
      getAccentColor: () => getCssVarColor('--accent'),
      getBgColor: () => getCssVarColor('--bg'),
      isReducedMotion: () => Boolean(shouldReduceMotion),
    });

    renderer.start();

    return () => {
      renderer.destroy();
    };
  }, [shouldReduceMotion]);

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-12 overflow-hidden select-none">
      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-6">
        <div className="space-y-8 max-w-3xl">
          {/* Badge & Role removed as requested */}

          {/* Reactive Variable Name Header */}
          <div className="space-y-2">
            <h1
              ref={containerRef}
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-ink flex flex-wrap"
              aria-label={siteConfig.name}
            >
              {siteConfig.name.split('').map((char, i) => (
                <span
                  key={i}
                  className="reactive-letter inline-block transition-all duration-75"
                  style={{
                    fontVariationSettings: `'wght' ${letterWeights[i] || 700}, 'wdth' 100`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>

          {/* Tagline & Value Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed"
          >
            <p className="font-medium text-ink">
              {siteConfig.tagline}
            </p>
            <p className="text-base sm:text-lg">
              {siteConfig.valueStatement}
            </p>
          </motion.div>

          {/* Quick Action Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <a
              href="#work"
              onPointerEnter={() => setCursorLabel('EXPLORE', 'link')}
              onPointerLeave={resetCursor}
              className="inline-flex items-center gap-2 rounded-xl bg-cobalt px-6 py-3 font-sans text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Selected Work</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => setCursorLabel('GITHUB', 'link')}
              onPointerLeave={resetCursor}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/80 px-5 py-3 font-sans text-sm font-semibold text-ink backdrop-blur-md transition-colors hover:border-cobalt hover:text-cobalt"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => setCursorLabel('LINKEDIN', 'link')}
              onPointerLeave={resetCursor}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/80 px-5 py-3 font-sans text-sm font-semibold text-ink backdrop-blur-md transition-colors hover:border-cobalt hover:text-cobalt"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer Indicator */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 flex items-center justify-between text-xs font-mono text-muted pt-12">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Available for software projects & opportunities
        </span>
        <span className="hidden sm:inline">IST Islamabad • Zyphr Labs</span>
      </div>
    </section>
  );
};
