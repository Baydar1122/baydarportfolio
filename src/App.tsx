import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { useCursor } from '@/hooks/useCursor';
import { ProjectItem } from '@/data/projects';
import { Header } from '@/components/ui/Header';
import { BackgroundCanvas } from '@/components/ui/BackgroundCanvas';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ProgressNav } from '@/components/ui/ProgressNav';
import { TechMarquee } from '@/components/ui/TechMarquee';
import { HeroSection } from '@/components/sections/HeroSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceCommunitySection } from '@/components/sections/ExperienceCommunitySection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';
import { ProjectDetailModal } from '@/components/ui/ProjectDetailModal';

export function App() {
  const { cursor, setCursorLabel, resetCursor } = useCursor();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-paper text-ink transition-colors duration-300">
      {/* Interactive Custom Cursor */}
      <CustomCursor cursor={cursor} />

      {/* Background Engine Canvas */}
      <BackgroundCanvas />

      {/* Vertical Progress Navigation */}
      <ProgressNav />

      {/* Site Header */}
      <Header />

      {/* Main Content Sections */}
      <main id="main-content">
        <HeroSection setCursorLabel={setCursorLabel} resetCursor={resetCursor} />
        <TechMarquee />
        <WorkSection
          onSelectProject={setSelectedProject}
          setCursorLabel={setCursorLabel}
          resetCursor={resetCursor}
        />
        <AboutSection />
        <ExperienceCommunitySection />
        <ContactSection />
      </main>

      {/* Site Footer */}
      <Footer setCursorLabel={setCursorLabel} resetCursor={resetCursor} />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

export default App;
