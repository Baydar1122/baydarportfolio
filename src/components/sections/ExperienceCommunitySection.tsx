import React from 'react';
import { siteConfig } from '@/data/site';
import { TextReveal } from '@/components/motion/TextReveal';
import { Briefcase, Users, CheckCircle2 } from 'lucide-react';

export const ExperienceCommunitySection: React.FC = () => {
  const hasExperience = siteConfig.experience.length > 0;
  const hasCommunity = siteConfig.community.length > 0;

  if (!hasExperience && !hasCommunity) return null;

  return (
    <section id="community" className="py-24 border-t border-line">
      <div className="max-w-5xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cobalt">
            03 • Professional Experience
          </span>
          <TextReveal as="h2" className="text-3xl md:text-5xl font-bold tracking-tight text-ink">
            Experience & Agency
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Experience / Alpha Labs */}
          {hasExperience && (
            <div className="rounded-2xl border border-line bg-surface/70 p-8 backdrop-blur-md space-y-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-cobalt" />
                <h3 className="text-xl font-bold text-ink">Experience & Agency</h3>
              </div>

              {siteConfig.experience.map((exp, idx) => (
                <div key={idx} className="space-y-4 pt-2">
                  <div className="flex items-baseline justify-between border-b border-line pb-3">
                    <div>
                      <h4 className="font-bold text-ink text-base">{exp.title}</h4>
                      <span className="font-mono text-xs text-cobalt font-medium">{exp.organization}</span>
                    </div>
                    <span className="font-mono text-xs text-muted">{exp.period}</span>
                  </div>

                  <p className="text-sm text-muted leading-relaxed">{exp.description}</p>

                  <ul className="space-y-2 font-sans text-xs text-muted">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cobalt shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Community & GDG */}
          {hasCommunity && (
            <div className="rounded-2xl border border-line bg-surface/70 p-8 backdrop-blur-md space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-cobalt" />
                  <h3 className="text-xl font-bold text-ink">Developer Advocacy</h3>
                </div>

                {siteConfig.community.map((comm, idx) => (
                  <div key={idx} className="space-y-3 pt-2">
                    <h4 className="font-bold text-ink text-base">{comm.title}</h4>
                    <span className="font-mono text-xs text-cobalt font-medium block">
                      {comm.organization}
                    </span>
                    <p className="text-sm text-muted leading-relaxed">{comm.description}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-cobalt/30 bg-cobalt/5 p-4 mt-6">
                <p className="font-mono text-xs text-cobalt font-medium">
                  Applying to Google Developer Groups (GDG) to lead workshops, publish developer tutorials, and empower student engineers at IST Islamabad.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
