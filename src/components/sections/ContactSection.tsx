import React from 'react';
import { siteConfig } from '@/data/site';
import { TextReveal } from '@/components/motion/TextReveal';
import { Mail, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-24 border-t border-line">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="space-y-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cobalt">
            04 • Get in Touch
          </span>
          <TextReveal as="h2" className="text-3xl md:text-5xl font-bold tracking-tight text-ink">
            Collaborate & Build Together
          </TextReveal>
        </div>

        <div className="max-w-2xl space-y-6 text-base md:text-lg text-muted leading-relaxed">
          <p>
            Whether you are interested in discussing full-stack web platforms, agency work at Alpha Labs, or developer community advocacy for Google Developer Groups (GDG), feel free to reach out.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 rounded-xl bg-cobalt px-6 py-3.5 font-sans text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="w-4 h-4" />
              <span>Email Baydar Ahmed</span>
            </a>

            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/70 px-5 py-3.5 font-sans text-sm font-semibold text-ink backdrop-blur-md hover:border-cobalt hover:text-cobalt transition-colors"
            >
              <span>GitHub Profile</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/70 px-5 py-3.5 font-sans text-sm font-semibold text-ink backdrop-blur-md hover:border-cobalt hover:text-cobalt transition-colors"
            >
              <span>LinkedIn Profile</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
