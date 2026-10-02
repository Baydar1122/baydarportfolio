import { useState, useEffect } from 'react';

export interface CursorState {
  x: number;
  y: number;
  label: string | null;
  active: boolean;
  variant: 'default' | 'view' | 'link' | 'copy' | 'hidden';
}

export function useCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    label: null,
    active: false,
    variant: 'default',
  });

  useEffect(() => {
    // Only enable custom cursor for fine pointers (desktop mouse)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    document.body.classList.add('custom-cursor-active');

    const handlePointerMove = (e: PointerEvent) => {
      setCursor((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        active: true,
      }));
    };

    const handlePointerLeave = () => {
      setCursor((prev) => ({ ...prev, active: false }));
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  const setCursorLabel = (label: string | null, variant: CursorState['variant'] = 'view') => {
    setCursor((prev) => ({ ...prev, label, variant }));
  };

  const resetCursor = () => {
    setCursor((prev) => ({ ...prev, label: null, variant: 'default' }));
  };

  return { cursor, setCursorLabel, resetCursor };
}
