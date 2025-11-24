
import React, { useState } from 'react';
import { RoadmapMonth, RoadmapWeek } from '../types';
import Button from './Button';

interface RoadmapExcelGridProps {
  roadmap: RoadmapMonth[];
  onSyncWeek: (week: RoadmapWeek) => void;
  completedTaskIds: string[];
  scheduledTaskIds?: string[]; // New prop to track tasks currently in dashboard
  onToggleTaskCompletion?: (taskId: string, isCompleted: boolean) => void;
}

const RoadmapExcelGrid: React.FC<RoadmapExcelGridProps> = ({ roadmap, onSyncWeek, completedTaskIds, scheduledTaskIds = [], onToggleTaskCompletion }) => {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(1); // Default Month 1 open

  const toggleMonth = (monthNumber: number) => {
    setExpandedMonth(expandedMonth === monthNumber ? null : monthNumber);
  };

  // Helper to calculate completion stats for a month
  const getMonthStats = (month: RoadmapMonth) => {
    let total = 0;
    let completed = 0;
    month.weeks.forEach(week => {
        week.days.forEach(day => {
            day.tasks.forEach(task => {
                total++;
                if (completedTaskIds.includes(task.id)) completed++;
            });
        });
    });
    return { total, completed, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Curriculum Tracker</h2>
        <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
          12-Month Plan
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 font-medium uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b dark:border-gray-700">Week</th>
              <th className="px-4 py-3 border-b dark:border-gray-700">Day</th>
              <th className="px-4 py-3 border-b dark:border-gray-700">Domain</th>
              <th className="px-4 py-3 border-b dark:border-gray-700">Topic & Task</th>
              <th className="px-4 py-3 border-b dark:border-gray-700 text-center">Hrs</th>
              <th className="px-4 py-3 border-b dark:border-gray-700 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {roadmap.map((month) => {
              const stats = getMonthStats(month);
              // Determine progress bar color based on completion percentage
              const progressBarColor = stats.percent === 100 ? 'bg-green-500' : 'bg-blue-600';

              return (
              <React.Fragment key={month.monthNumber}>
                {/* Month Header Row */}
                <tr className="bg-blue-50 dark:bg-gray-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors" onClick={() => toggleMonth(month.monthNumber)}>
                  <td colSpan={6} className="px-4 py-3 font-bold text-gray-800 dark:text-gray-100">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                            <span className={`transform transition-transform mr-2 ${expandedMonth === month.monthNumber ? 'rotate-90' : ''}`}>▶</span>
                            {month.title} <span className="ml-2 text-xs font-normal text-gray-500 bg-white dark:bg-gray-600 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-500">{month.phase}</span>
                        </div>
                        <div className="text-xs font-normal text-gray-600 dark:text-gray-400">
                            {stats.completed}/{stats.total} Tasks ({stats.percent}%)
                        </div>
                    </div>
                    {/* Monthly Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className={`${progressBarColor} h-2 rounded-full transition-all duration-500`} style={{ width: `${stats.percent}%` }}></div>
                    </div>
                  </td>
                </tr>

                {/* Weeks and Days Rows (only if expanded) */}
                {expandedMonth === month.monthNumber && month.weeks.length === 0 && (
                   <tr><td colSpan={6} className="px-8 py-4 text-gray-500 italic">Content coming soon for this month...</td></tr>
                )}

                {expandedMonth === month.monthNumber && month.weeks.map((week) => {
                    // Calculate total rows for this week: 1 (header) + sum of tasks per day
                    const totalWeekRows = week.days.reduce((acc, day) => acc + day.tasks.length, 0) + 1;

                    return (
                  <React.Fragment key={week.weekNumber}>
                     <tr className="bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 align-top pt-4 bg-gray-50 dark:bg-gray-800" rowSpan={totalWeekRows}>
                             Week {week.weekNumber}
                             <div className="mt-2">
                                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onSyncWeek(week); }} className="text-xs px-2 py-1 w-full bg-white dark:bg-gray-700">
                                    Sync Week
                                </Button>
                             </div>
                        </td>
                        {/* Empty cells for the rest of the week header row */}
                        <td colSpan={5} className="bg-gray-50 dark:bg-gray-800"></td>
                     </tr>
                    {week.days && week.days.length > 0 ? week.days.map((day, dIdx) => (
                      <React.Fragment key={`${week.weekNumber}-${day.day}`}>
                        {day.tasks.map((task, tIdx) => {
                          const isCompleted = completedTaskIds.includes(task.id);
                          const isScheduled = scheduledTaskIds.includes(task.id);
                          
                          let rowClass = "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors";
                          if (isCompleted) {
                              rowClass += " bg-green-50/50 dark:bg-green-900/20";
                          } else if (isScheduled) {
                              rowClass += " bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-l-blue-400";
                          }

                          return (
                          <tr key={`${week.weekNumber}-${day.day}-${tIdx}`} className={rowClass}>
                            {/* Day cell only rendered for first task of day */}
                            {tIdx === 0 && (
                              <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 align-top bg-white dark:bg-gray-800" rowSpan={day.tasks.length}>
                                {day.day}
                              </td>
                            )}
                            <td className="px-4 py-2 text-gray-600 dark:text-gray-400 border-r border-gray-100 dark:border-gray-800">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold
                                    ${task.domain.includes('React') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                                    ${task.domain.includes('Java') ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : ''}
                                    ${task.domain.includes('AWS') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                                    ${task.domain.includes('DSA') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                                    ${task.domain.includes('GenAI') ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                                    ${!['React', 'Java', 'AWS', 'DSA', 'GenAI'].some(k => task.domain.includes(k)) ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : ''}
                                `}>
                                    {task.domain}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                <div className={`font-medium text-xs ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>{task.topic}</div>
                                <div className={`text-xs text-gray-500 dark:text-gray-400 ${isCompleted ? 'line-through' : ''}`}>{task.taskDescription}</div>
                                {isScheduled && !isCompleted && <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider ml-1">(In Dashboard)</span>}
                            </td>
                            <td className="px-4 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">{task.durationHours}h</td>
                            <td className="px-4 py-2 text-center align-middle">
                                <div className="flex justify-center items-center h-full">
                                    <input 
                                        type="checkbox" 
                                        checked={isCompleted} 
                                        onChange={(e) => onToggleTaskCompletion && onToggleTaskCompletion(task.id, e.target.checked)}
                                        className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:bg-gray-600 dark:border-gray-500 cursor-pointer"
                                    />
                                </div>
                            </td>
                          </tr>
                        )})}
                      </React.Fragment>
                    )) : (
                        <tr><td colSpan={5} className="px-4 py-2 text-gray-400 italic">No detailed tasks for this week yet.</td></tr>
                    )}
                  </React.Fragment>
                )})}
              </React.Fragment>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoadmapExcelGrid;
