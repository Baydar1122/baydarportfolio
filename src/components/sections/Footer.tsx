import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { Copy, Check, Github, Linkedin, ArrowUp } from 'lucide-react';

interface FooterProps {
  setCursorLabel: (label: string | null, variant?: 'default' | 'view' | 'link' | 'copy') => void;
  resetCursor: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCursorLabel, resetCursor }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-20 border-t border-line bg-surface/30 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 space-y-16">
        {/* Large "Let's talk" Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-ink">
              Let's talk.
            </h2>
            <p className="text-muted font-mono text-sm">
              Open for software projects, agency engagements, and full-time opportunities.
            </p>
          </div>

          {/* Magnetic Copy Email Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCopyEmail}
            onPointerEnter={() => setCursorLabel(copied ? 'COPIED' : 'COPY', 'copy')}
            onPointerLeave={resetCursor}
            className="group relative inline-flex items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-4 font-mono text-sm font-semibold text-ink shadow-md transition-all hover:border-cobalt hover:shadow-lg"
          >
            <span>{siteConfig.email}</span>
            {copied ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-emerald-500"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            ) : (
              <Copy className="w-4 h-4 text-muted group-hover:text-cobalt transition-colors" />
            )}
          </motion.button>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-line text-xs font-mono text-muted">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Baydar Ahmed</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">IST Islamabad</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cobalt transition-colors flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cobalt transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <button
              onClick={scrollToTop}
              className="hover:text-cobalt transition-colors flex items-center gap-1"
              aria-label="Scroll to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
