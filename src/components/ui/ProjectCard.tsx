import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '@/data/projects';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  onSelect: (project: ProjectItem) => void;
  setCursorLabel: (label: string | null, variant?: 'default' | 'view' | 'link' | 'copy') => void;
  resetCursor: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onSelect,
  setCursorLabel,
  resetCursor,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current || shouldReduceMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spotlight percentages
    setSpotlightPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });

    // 3D Tilt calculations (max 4 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 4;
    const rotateX = -((y - centerY) / centerY) * 4;

    setTilt({ rx: rotateX, ry: rotateY });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    resetCursor();
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setCursorLabel('VIEW', 'view')}
      onPointerLeave={handlePointerLeave}
      onClick={() => onSelect(project)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="group relative cursor-pointer rounded-xl border border-line bg-surface/70 p-6 md:p-8 backdrop-blur-md transition-shadow hover:shadow-xl hover:border-cobalt/40 overflow-hidden"
    >
      {/* Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(var(--accent-rgb), 0.12), transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
        {/* Header metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            {project.pinned && (
              <span className="rounded-full bg-cobalt/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-cobalt uppercase">
                Featured
              </span>
            )}
          </div>
          <span className="font-mono text-xs text-muted">
            {project.year || '2026'}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-ink group-hover:text-cobalt transition-colors flex items-center justify-between">
            <span>{project.title}</span>
            <ArrowUpRight className="w-5 h-5 text-muted opacity-0 group-hover:opacity-100 group-hover:text-cobalt group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </h3>
          <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Stack Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.topics.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-line bg-paper/60 px-2.5 py-1 font-mono text-[11px] text-muted group-hover:border-cobalt/30 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Direct Link Icons */}
        <div className="flex items-center gap-3 pt-2">
          {project.html_url && (
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onPointerEnter={() => setCursorLabel('GITHUB', 'link')}
              onPointerLeave={() => setCursorLabel('VIEW', 'view')}
              className="p-1.5 rounded-md hover:bg-paper text-muted hover:text-cobalt transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onPointerEnter={() => setCursorLabel('LIVE', 'link')}
              onPointerLeave={() => setCursorLabel('VIEW', 'view')}
              className="p-1.5 rounded-md hover:bg-paper text-muted hover:text-cobalt transition-colors"
              aria-label="Live Project Website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
