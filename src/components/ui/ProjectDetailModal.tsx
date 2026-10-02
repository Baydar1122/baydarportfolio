import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink } from 'lucide-react';
import { ProjectItem } from '@/data/projects';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/60 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-line bg-paper p-6 md:p-10 shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full border border-line bg-surface text-muted hover:text-ink hover:border-cobalt transition-colors"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="space-y-4 pr-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-cobalt font-semibold uppercase tracking-wider">
                {project.role || 'Software Project'}
              </span>
              <span className="text-muted">•</span>
              <span className="font-mono text-xs text-muted">
                {project.year || '2026'}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-ink">
              {project.title}
            </h2>

            <p className="text-base md:text-lg text-muted leading-relaxed">
              {project.description}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {project.html_url && (
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-cobalt px-4 py-2.5 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              )}
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 font-sans text-sm font-semibold text-ink hover:border-cobalt hover:text-cobalt transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Website</span>
                </a>
              )}
            </div>
          </div>

          <div className="my-8 border-t border-line" />

          {/* Technical Breakdown */}
          {project.details ? (
            <div className="space-y-6 text-sm text-ink leading-relaxed">
              <div>
                <h3 className="font-mono text-xs uppercase text-cobalt tracking-wider font-semibold mb-2">
                  Project Scope
                </h3>
                <p>{project.details.whatItIs}</p>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase text-cobalt tracking-wider font-semibold mb-2">
                  Architecture & Implementation
                </h3>
                <p>{project.details.whatIBuilt}</p>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase text-cobalt tracking-wider font-semibold mb-2">
                  Technical Learnings
                </h3>
                <p>{project.details.whatILearned}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Built using {project.topics.join(', ')}. Full source code available on GitHub.
            </p>
          )}

          {/* Tech Stack List */}
          <div className="mt-8 pt-6 border-t border-line">
            <h4 className="font-mono text-xs uppercase text-muted tracking-wider mb-3">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.topics.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-line bg-surface px-3 py-1 font-mono text-xs text-ink"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
