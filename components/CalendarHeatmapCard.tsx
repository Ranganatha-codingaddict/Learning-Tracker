import React, { useMemo, useCallback } from 'react';
import { StudySession, DSATracker } from '../types';
import { getFormattedDate, isSameDay } from '../utils/dateUtils'; // Assuming isSameDay is available

interface CalendarHeatmapCardProps {
  studySessions: StudySession[];
  dailyDsaSolved: { date: string; count: number }[];
}

// Define a type for a single cell in the heatmap
interface HeatmapCell {
  date: Date;
  activityLevel: number;
  tooltip: string;
}

const CalendarHeatmapCard: React.FC<CalendarHeatmapCardProps> = ({ studySessions, dailyDsaSolved }) => {
  const getDayOfWeek = (date: Date) => {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return day === 0 ? 6 : day - 1; // Adjust to make Monday index 0
  };

  const heatmapData = useMemo(() => {
    const data: { [date: string]: { studyHours: number; dsaCount: number; totalActivity: number } } = {};
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() + 1); // Start from tomorrow one year ago

    // Initialize all days in the last year with zero activity
    let currentDate = new Date(oneYearAgo);
    while (currentDate <= today) {
      const formattedDate = getFormattedDate(currentDate);
      data[formattedDate] = { studyHours: 0, dsaCount: 0, totalActivity: 0 };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Populate with study sessions
    studySessions.forEach(session => {
      if (data[session.date]) {
        data[session.date].studyHours += session.duration / (1000 * 60 * 60); // Convert ms to hours
        data[session.date].totalActivity += session.duration / (1000 * 60); // Use minutes for activity scale
      }
    });

    // Populate with DSA solved counts
    dailyDsaSolved.forEach(entry => {
      if (data[entry.date]) {
        data[entry.date].dsaCount += entry.count;
        data[entry.date].totalActivity += entry.count * 10; // Give DSA problems a weight (e.g., 1 problem = 10 min activity)
      }
    });

    return data;
  }, [studySessions, dailyDsaSolved]);

  const getActivityLevel = useCallback((totalActivity: number) => {
    if (totalActivity === 0) return 0;
    if (totalActivity < 60) return 1;    // < 1 hour total activity
    if (totalActivity < 180) return 2;   // < 3 hours total activity
    if (totalActivity < 360) return 3;   // < 6 hours total activity
    return 4;                            // >= 6 hours total activity
  }, []);

  const getCellColor = useCallback((level: number) => {
    switch (level) {
      case 0: return 'bg-gray-200 dark:bg-gray-700'; // No activity
      case 1: return 'bg-green-100 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-700';
      case 3: return 'bg-green-500 dark:bg-green-500';
      case 4: return 'bg-green-700 dark:bg-green-300';
      default: return 'bg-gray-200 dark:bg-gray-700';
    }
  }, []);

  const months = useMemo(() => {
    const current = new Date();
    const m = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
      d.setHours(0,0,0,0); // Normalize date to avoid timezone issues when comparing
      m.unshift(d.toLocaleString('default', { month: 'short' }));
    }
    return m;
  }, []);

  const weeks = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize today for comparison

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() + 1); // Start from tomorrow one year ago
    oneYearAgo.setHours(0,0,0,0); // Normalize

    // Start from the first Monday of the range to align weeks
    let startDate = new Date(oneYearAgo);
    const dayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday
    if (dayOfWeek !== 1) { // If not Monday, go back to previous Monday
      startDate.setDate(startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    }
    startDate.setHours(0,0,0,0); // Normalize


    let current = new Date(startDate);
    const tempWeeks: HeatmapCell[][] = [];
    let currentWeek: HeatmapCell[] = [];

    while (current.getTime() <= today.getTime()) {
      const formattedDate = getFormattedDate(current);
      const dayActivity = heatmapData[formattedDate] || { studyHours: 0, dsaCount: 0, totalActivity: 0 };
      const level = getActivityLevel(dayActivity.totalActivity);
      const tooltip = `${formattedDate}\nStudy: ${dayActivity.studyHours.toFixed(1)} hrs\nDSA: ${dayActivity.dsaCount} problems`;

      currentWeek.push({ date: new Date(current), activityLevel: level, tooltip });

      if (getDayOfWeek(current) === 6) { // End of week (Sunday after adjustment for Mon=0)
        tempWeeks.push(currentWeek);
        currentWeek = []; // Reset for the next week
      }

      current.setDate(current.getDate() + 1);
      current.setHours(0,0,0,0); // Normalize
    }
    if (currentWeek.length > 0) { // Add last partial week if it exists
      tempWeeks.push(currentWeek);
    }
    return tempWeeks;
  }, [heatmapData, getActivityLevel]);


  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Activity Heatmap (Last Year)</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Daily activity based on study hours and DSA problems.</p>

      <div className="flex flex-col flex-grow">
        <div className="flex justify-end pr-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
          {months.map((month, idx) => (
            <span key={idx} className="relative inline-block w-[calc(4.5*10px)] ml-[0.5rem] text-center">
              {month}
            </span>
          ))}
        </div>
        <div className="flex-grow flex items-stretch">
          <div className="flex flex-col justify-around text-xs text-gray-500 dark:text-gray-400 mr-1">
            <span>M</span>
            <span></span> {/* Tue */}
            <span>W</span>
            <span></span> {/* Thu */}
            <span>F</span>
            <span></span> {/* Sat */}
            <span>S</span> {/* Sun */}
          </div>
          <div className="flex flex-1 overflow-x-auto p-1 border border-gray-200 dark:border-gray-700 rounded-md">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col justify-between mr-1">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const dayCell: HeatmapCell | undefined = week[dayIdx]; // Explicitly type dayCell
                  return (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      className={`w-3 h-3 rounded-[2px] ${dayCell ? getCellColor(dayCell.activityLevel) : 'bg-gray-100 dark:bg-gray-800'} 
                        ${dayCell && isSameDay(dayCell.date, new Date()) ? 'border-2 border-blue-500 dark:border-blue-400' : ''}
                        relative group`}
                      title={dayCell ? dayCell.tooltip : 'No activity'}
                    >
                      {/* Tooltip on hover */}
                      {dayCell && (
                        <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 -translate-y-full px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-pre z-50">
                          {dayCell.tooltip}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end items-center text-xs text-gray-500 dark:text-gray-400">
        Less
        <div className="flex ml-2 space-x-1">
          <div className="w-3 h-3 rounded-[2px] bg-gray-200 dark:bg-gray-700"></div>
          <div className="w-3 h-3 rounded-[2px] bg-green-100 dark:bg-green-900"></div>
          <div className="w-3 h-3 rounded-[2px] bg-green-300 dark:bg-green-700"></div>
          <div className="w-3 h-3 rounded-[2px] bg-green-500 dark:bg-green-500"></div>
          <div className="w-3 h-3 rounded-[2px] bg-green-700 dark:bg-green-300"></div>
        </div>
        <span className="ml-2">More</span>
      </div>
    </div>
  );
};

export default CalendarHeatmapCard;