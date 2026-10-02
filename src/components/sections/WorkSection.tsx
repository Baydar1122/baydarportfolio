import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { allProjects, allTags, ProjectItem } from '@/data/projects';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { TextReveal } from '@/components/motion/TextReveal';

interface WorkSectionProps {
  onSelectProject: (project: ProjectItem) => void;
  setCursorLabel: (label: string | null, variant?: 'default' | 'view' | 'link' | 'copy') => void;
  resetCursor: () => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({
  onSelectProject,
  setCursorLabel,
  resetCursor,
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredProjects = selectedTag
    ? allProjects.filter((p) => p.topics.includes(selectedTag))
    : allProjects;

  return (
    <section id="work" className="py-24 border-t border-line">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cobalt">
              01 • Selected Work
            </span>
            <TextReveal as="h2" className="text-3xl md:text-5xl font-bold tracking-tight text-ink">
              Production Code & Digital Platforms
            </TextReveal>
          </div>

          <p className="max-w-md text-sm text-muted leading-relaxed">
            Full-stack web applications, custom digital agency solutions at Alpha Labs, and developer tooling.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-line">
          <button
            onClick={() => setSelectedTag(null)}
            className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
              selectedTag === null
                ? 'bg-cobalt text-white font-semibold'
                : 'bg-surface text-muted hover:text-ink hover:border-cobalt'
            }`}
          >
            All Projects ({allProjects.length})
          </button>
          {allTags.map((tag) => {
            const count = allProjects.filter((p) => p.topics.includes(tag)).length;
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`rounded-full border border-line px-3.5 py-1.5 font-mono text-xs transition-colors ${
                  isSelected
                    ? 'bg-cobalt text-white font-semibold border-cobalt'
                    : 'bg-surface/60 text-muted hover:text-ink hover:border-cobalt/40'
                }`}
              >
                {tag} ({count})
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id || project.name}
              project={project}
              index={idx}
              onSelect={onSelectProject}
              setCursorLabel={setCursorLabel}
              resetCursor={resetCursor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
