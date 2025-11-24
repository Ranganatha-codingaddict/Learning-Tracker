import React from 'react';
import { WeeklySummary } from '../types';
import ProgressBar from './ProgressBar';

interface WeeklyProgressSummaryCardProps {
  currentWeekSummary: WeeklySummary;
  weeklySummaries: WeeklySummary[];
}

const WeeklyProgressSummaryCard: React.FC<WeeklyProgressSummaryCardProps> = ({
  currentWeekSummary,
  weeklySummaries,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Weekly Progress Summary</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">Current Week (Week {currentWeekSummary.weekNumber})</h3>
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span className="font-semibold">{currentWeekSummary.startDate} to {currentWeekSummary.endDate}</span>
          </p>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-800 dark:text-gray-100 font-medium">
              {currentWeekSummary.completedTasks} / {currentWeekSummary.totalTasks} tasks completed
            </p>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {currentWeekSummary.percentageCompleted}%
            </span>
          </div>
          <ProgressBar progress={currentWeekSummary.percentageCompleted} />
          {currentWeekSummary.isWeekCompleted ? (
            <p className="mt-3 text-green-600 dark:text-green-400 font-medium">🥳 All tasks completed!</p>
          ) : (
            <p className="mt-3 text-orange-600 dark:text-orange-400 font-medium">Keep pushing to hit your weekly goal!</p>
          )}
        </div>
      </div>

      {weeklySummaries.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">Past Weeks</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 -mr-2"> {/* Scrollable area for past weeks */}
            {weeklySummaries.map(summary => (
              <div key={summary.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Week {summary.weekNumber}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{summary.startDate} - {summary.endDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{summary.percentageCompleted}%</span>
                  <ProgressBar progress={summary.percentageCompleted} className="w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyProgressSummaryCard;