import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CursorState } from '@/hooks/useCursor';

interface CustomCursorProps {
  cursor: CursorState;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ cursor }) => {
  if (!cursor.active) return null;

  const hasLabel = Boolean(cursor.label);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden lg:flex items-center justify-center rounded-full mix-blend-difference"
      animate={{
        x: cursor.x - (hasLabel ? 36 : 8),
        y: cursor.y - (hasLabel ? 36 : 8),
        width: hasLabel ? 72 : 16,
        height: hasLabel ? 72 : 16,
        scale: hasLabel ? 1 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 450,
        damping: 35,
        mass: 0.5,
      }}
    >
      <div className="w-full h-full rounded-full bg-white transition-all">
        {/* Text label removed as requested, just the hover expansion remains */}
      </div>
    </motion.div>
  );
};
