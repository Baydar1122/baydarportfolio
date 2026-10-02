import React, { useEffect, useState } from 'react';

const TECH_ITEMS = [
  'TypeScript',
  'React',
  'Next.js',
  'Prisma ORM',
  'WebGL GLSL',
  'Tailwind CSS',
  'Node.js',
  'Astro',
  'Git & GitHub',
  'Developer Advocacy',
  'Google Developer Groups',
  'Alpha Labs',
];

export const TechMarquee: React.FC = () => {
  const [scrollSpeed, setScrollSpeed] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      const deltaTime = now - lastTime;

      if (deltaTime > 0) {
        const speed = (deltaY / deltaTime) * 15;
        setScrollSpeed(Math.max(Math.min(speed, 25), -25));
      }

      lastScrollY = currentScrollY;
      lastTime = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="w-full overflow-hidden py-4 border-y border-line bg-surface/40 backdrop-blur-sm select-none"
      style={{
        transform: `skewX(${scrollSpeed * 0.25}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      <div className="flex w-max animate-marquee gap-8 font-mono text-xs uppercase tracking-widest text-muted">
        {[...TECH_ITEMS, ...TECH_ITEMS, ...TECH_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="hover:text-cobalt transition-colors">{item}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt/40" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
