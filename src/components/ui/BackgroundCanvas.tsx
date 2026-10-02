import React, { useEffect, useRef, useState } from 'react';
import { SceneManager } from '@/engine/scene-manager';

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pointer, setPointer] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setPointer({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sceneManager = new SceneManager(canvas);
    
    let animationFrameId: number;
    let lastTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      
      // Determine active section based on scroll
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      let currentSection = 'hero';
      if (scrollY > height * 0.8) currentSection = 'work';
      
      // We pass a rough scroll progress mapping
      sceneManager.updateScroll(scrollY / height, currentSection);
      sceneManager.render(time, dt, pointer);
      
      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pointer]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-30 mix-blend-screen"
      aria-hidden="true"
    />
  );
};
