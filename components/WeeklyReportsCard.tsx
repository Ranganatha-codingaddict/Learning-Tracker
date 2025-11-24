import React from 'react';
import { WeeklyReport } from '../types';
import ProgressBar from './ProgressBar';

interface WeeklyReportsCardProps {
  pastWeeklyReports: WeeklyReport[];
}

const WeeklyReportsCard: React.FC<WeeklyReportsCardProps> = ({ pastWeeklyReports }) => {
  const latestReport = pastWeeklyReports[pastWeeklyReports.length - 1];
  const historicalReports = pastWeeklyReports.slice(0, -1).reverse(); // All except latest, reversed for chronological order

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Weekly Insights & Reports</h2>

      {latestReport ? (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">Latest Report (Week {latestReport.weekNumber})</h3>
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span className="font-semibold">{latestReport.startDate} to {latestReport.endDate}</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <p>Total Study: <span className="font-bold text-blue-700 dark:text-blue-300">{latestReport.totalStudyHours} hrs</span></p>
              <p>DSA Solved: <span className="font-bold text-green-700 dark:text-green-300">{latestReport.dsaTotalSolved} problems</span></p>
              <p>Overall Streak: <span className="font-bold text-purple-700 dark:text-purple-300">{latestReport.overallLearningStreakAtEndOfWeek} days</span></p>
              <p>Tasks Done: <span className="font-bold text-teal-700 dark:text-teal-300">{latestReport.tasksCompletedPercentage}%</span></p>
            </div>
            <p className={`font-semibold text-sm ${latestReport.isWeekCompleted ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
              {latestReport.isWeekCompleted ? '🥳 All tasks completed this week!' : 'Keep pushing for 100% completion!'}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-6">No weekly reports available yet. Complete your first week to see insights!</p>
      )}

      {historicalReports.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">Past Reports</h3>
          <div className="space-y-3">
            {historicalReports.map(report => (
              <div key={report.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Week {report.weekNumber}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{report.startDate} - {report.endDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{report.tasksCompletedPercentage}%</span>
                  <ProgressBar progress={report.tasksCompletedPercentage} className="w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReportsCard;