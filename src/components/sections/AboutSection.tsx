import React from 'react';
import { siteConfig } from '@/data/site';
import { TextReveal } from '@/components/motion/TextReveal';
import { GraduationCap, Code2, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 border-t border-line">
      <div className="max-w-5xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cobalt">
            02 • Background & Philosophy
          </span>
          <TextReveal as="h2" className="text-3xl md:text-5xl font-bold tracking-tight text-ink">
            Crafting Web Software & Building Communities
          </TextReveal>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6 text-base md:text-lg text-muted leading-relaxed">
            {siteConfig.aboutText.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Key Pillars Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Education Card */}
            <div className="rounded-xl border border-line bg-surface/70 p-6 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-3 text-cobalt font-mono text-xs font-semibold uppercase">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Education</span>
              </div>
              <h3 className="text-lg font-bold text-ink">{siteConfig.education.degree}</h3>
              <p className="text-xs font-mono text-muted">{siteConfig.education.institution}</p>
              <p className="text-xs text-muted">{siteConfig.education.location}</p>
            </div>

            {/* Engineering Pillars */}
            <div className="rounded-xl border border-line bg-surface/70 p-6 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-3 text-cobalt font-mono text-xs font-semibold uppercase">
                <Code2 className="w-4 h-4" />
                <span>Technical Focus</span>
              </div>
              <ul className="space-y-2 text-xs font-mono text-ink">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
                  Type-Safe Full-Stack Systems (TypeScript, Next.js, Prisma)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
                  High-Performance WebGL Shader Interactive Canvas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
                  Developer Advocacy & Open-Source Documentation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
