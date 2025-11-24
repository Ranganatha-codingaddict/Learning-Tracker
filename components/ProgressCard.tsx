import React, { useState, useCallback, useRef } from 'react';
import { Progress } from '../types';
import ProgressBar from './ProgressBar';
import InputField from './InputField';
import Button from './Button';

interface ProgressCardProps {
  progress: Progress;
  onUpdateProgress: (newProgress: Partial<Progress>) => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ progress, onUpdateProgress }) => {
  const [editingField, setEditingField] = useState<keyof Progress | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);
  const [hoveredField, setHoveredField] = useState<keyof Progress | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);


  const progressLabels: { [key in keyof Progress]: string } = {
    fullStack: 'Full-Stack Development',
    dsa: 'DSA (Problems)',
    aiMl: 'AI/ML',
    cloud: 'Cloud',
    devOps: 'DevOps',
    systemDesign: 'System Design',
  };

  const isPercentageBased = (key: keyof Progress) => key !== 'dsa';

  const handleEditClick = useCallback((field: keyof Progress) => {
    setEditingField(field);
    setTempValue(progress[field]);
  }, [progress]);

  const handleSave = useCallback(() => {
    if (editingField) {
      const valueToSave = Math.max(0, isPercentageBased(editingField) ? Math.min(100, tempValue) : tempValue);
      onUpdateProgress({ [editingField]: valueToSave });
      setEditingField(null);
    }
  }, [editingField, tempValue, onUpdateProgress, isPercentageBased]);

  const handleCancel = useCallback(() => {
    setEditingField(null);
  }, []);

  const handleMouseEnter = useCallback((field: keyof Progress, e: React.MouseEvent) => {
    setHoveredField(field);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredField(null);
    setTooltipPosition(null);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full relative">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Overall Progress</h2>

      <div className="space-y-4 flex-grow">
        {(Object.keys(progress) as Array<keyof Progress>).map((key) => (
          <div
            key={key}
            className="flex flex-col"
            onMouseEnter={(e) => handleMouseEnter(key, e)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{progressLabels[key]}</span>
              <div className="flex items-center">
                {editingField === key ? (
                  <InputField
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(parseInt(e.target.value))}
                    onBlur={handleSave}
                    min="0"
                    max={isPercentageBased(key) ? "100" : undefined}
                    className="w-20 text-right text-sm px-2 py-1"
                    autoFocus
                  />
                ) : (
                  <span className="text-gray-800 dark:text-gray-100 text-sm font-semibold mr-2">
                    {progress[key]}{isPercentageBased(key) ? '%' : ''}
                  </span>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => (editingField === key ? handleSave() : handleEditClick(key))}
                  className="px-2 py-1 text-xs"
                >
                  {editingField === key ? 'Save' : 'Edit'}
                </Button>
              </div>
            </div>
            <ProgressBar progress={isPercentageBased(key) ? progress[key] : Math.min(100, progress[key])} />
          </div>
        ))}
      </div>

      {hoveredField && tooltipPosition && (
        <div
          className="absolute z-50 px-3 py-2 bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900 text-sm rounded-md shadow-lg pointer-events-none"
          style={{
            left: tooltipPosition.x + 15,
            top: tooltipPosition.y + 15,
            transform: 'translateY(-100%)', // Position above the cursor
          }}
        >
          <p className="font-semibold">{progressLabels[hoveredField]}</p>
          <p>{progress[hoveredField]}{isPercentageBased(hoveredField) ? '%' : ''}</p>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;