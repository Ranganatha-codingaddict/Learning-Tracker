import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getFormattedDate } from '../utils/dateUtils';

interface OverallStreakCardProps {
  overallLearningStreak: number;
  isCurrentDayTasksCompleted: boolean;
  overallStreakHistory: { date: string; streak: number }[]; // New prop for streak history
}

const OverallStreakCard: React.FC<OverallStreakCardProps> = ({
  overallLearningStreak,
  isCurrentDayTasksCompleted,
  overallStreakHistory,
}) => {
  const streakStatusColor = isCurrentDayTasksCompleted ? 'bg-green-500' : 'bg-red-500';
  const message = isCurrentDayTasksCompleted
    ? `Great job! Streak maintained.`
    : `Complete all tasks to maintain your streak.`;

  const chartData = useMemo(() => {
    // Ensure data is sorted by date and only shows the last 90 days.
    // Dashboard handles trimming, but a final sort here is good practice.
    return [...overallStreakHistory]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: entry.date.substring(5), // Format to MM-DD
        streak: entry.streak,
      }));
  }, [overallStreakHistory]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col h-full overflow-hidden">
      <div className={`w-full h-2 ${streakStatusColor}`}></div> {/* Streak status bar */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Overall Learning Streak</h2>
          <p className="text-5xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">
            {overallLearningStreak} <span className="text-3xl text-gray-600 dark:text-gray-300">day{overallLearningStreak !== 1 ? 's' : ''}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{message}</p>
        </div>
        {overallLearningStreak === 0 && !isCurrentDayTasksCompleted && (
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Start a new streak by completing all tasks today!
          </p>
        )}

        {chartData.length > 1 && ( // Only show chart if there's enough data to draw a line
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">Streak Trend (Last 90 Days)</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgb(107 114 128)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'rgb(107 114 128)' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgb(31 41 55)', borderColor: 'rgb(75 85 99)', borderRadius: '8px' }}
                  itemStyle={{ color: '#E5E7EB' }}
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value: number) => [`${value} Day Streak`]}
                />
                <Line type="monotone" dataKey="streak" stroke="#8A2BE2" strokeWidth={2} dot={false} /> {/* Purple line */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverallStreakCard;