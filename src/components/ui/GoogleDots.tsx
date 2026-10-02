import React from 'react';

interface GoogleDotsProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const GoogleDots: React.FC<GoogleDotsProps> = ({ className = '', size = 'sm' }) => {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-hidden="true">
      <span className={`${dotSize} rounded-full bg-[#4285F4]`} title="Google Blue" />
      <span className={`${dotSize} rounded-full bg-[#EA4335]`} title="Google Red" />
      <span className={`${dotSize} rounded-full bg-[#FBBC05]`} title="Google Yellow" />
      <span className={`${dotSize} rounded-full bg-[#34A853]`} title="Google Green" />
    </div>
  );
};
