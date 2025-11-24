import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  colorClass?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, colorClass = 'bg-blue-600', className = '' }) => {
  const percentage = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 ${className}`}>
      <div
        className={`h-2.5 rounded-full ${colorClass} transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  );
};

export default ProgressBar;