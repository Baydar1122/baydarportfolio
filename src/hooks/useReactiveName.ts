import { useState, useEffect, useRef } from 'react';

export function useReactiveName(text: string) {
  const [letterWeights, setLetterWeights] = useState<number[]>(() => text.split('').map(() => 400));
  const [isAnimatingIntro, setIsAnimatingIntro] = useState(false);
  const containerRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const hasVisited = sessionStorage.getItem('baydar_hero_animated');

    if (!hasVisited) {
      sessionStorage.setItem('baydar_hero_animated', 'true');
      setIsAnimatingIntro(true);

      // Intro resolution animation from 100 to 700 weight in < 1.2s
      const startTime = performance.now();
      const duration = 1100;

      const animateIntro = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic easeOut

        const currentWeight = 100 + (700 - 100) * easeProgress;
        setLetterWeights(text.split('').map((_, i) => Math.round(currentWeight + Math.sin(i + progress * 6) * 40)));

        if (progress < 1) {
          requestAnimationFrame(animateIntro);
        } else {
          setIsAnimatingIntro(false);
        }
      };

      requestAnimationFrame(animateIntro);
    } else {
      setLetterWeights(text.split('').map(() => 700));
    }

    // Touch devices fallback: gentle wave animation
    if (!isFinePointer) {
      let waveAngle = 0;
      const animateWave = () => {
        waveAngle += 0.05;
        setLetterWeights(
          text.split('').map((_, i) => Math.round(400 + Math.sin(waveAngle + i * 0.4) * 250))
        );
        requestAnimationFrame(animateWave);
      };
      const frameId = requestAnimationFrame(animateWave);
      return () => cancelAnimationFrame(frameId);
    }

    // Desktop cursor distance reactive variable font weight adjustment
    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current || isAnimatingIntro) return;
      const letters = containerRef.current.querySelectorAll<HTMLElement>('.reactive-letter');
      if (!letters.length) return;

      const newWeights: number[] = [];
      letters.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;
        const dx = e.clientX - letterCenterX;
        const dy = e.clientY - letterCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const maxDist = 280;
        const weightFactor = Math.max(0, 1 - dist / maxDist);
        // Weight maps between 200 and 900
        const weight = 300 + Math.round(weightFactor * 580);
        newWeights.push(weight);
      });

      setLetterWeights(newWeights);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [text, isAnimatingIntro]);

  return { letterWeights, containerRef, isAnimatingIntro };
}
