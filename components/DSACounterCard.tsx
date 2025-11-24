import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DSATracker } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import Button from './Button';
import InputField from './InputField';
import ManualDSASyncModal from './ManualDSASyncModal'; // New component
import { getFormattedDate } from '../utils/dateUtils';

interface DSACounterCardProps {
  dsaTracker: DSATracker;
  onUpdateDSATracker: (dsaTracker: DSATracker) => void;
}

const DSACounterCard: React.FC<DSACounterCardProps> = ({ dsaTracker, onUpdateDSATracker }) => {
  const [easyCount, setEasyCount] = useState(dsaTracker.easy);
  const [mediumCount, setMediumCount] = useState(dsaTracker.medium);
  const [hardCount, setHardCount] = useState(dsaTracker.hard);
  const [todayProblems, setTodayProblems] = useState(dsaTracker.todayProblems);
  const [weeklyTarget, setWeeklyTarget] = useState(dsaTracker.weeklyTarget);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false); // State for sync modal


  // Use a ref to prevent `useEffect` from creating an infinite loop
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only update internal states when `dsaTracker` prop changes from outside,
    // but not during the initial render or when internal updates cause `dsaTracker` to change.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setEasyCount(dsaTracker.easy);
    setMediumCount(dsaTracker.medium);
    setHardCount(dsaTracker.hard);
    setTodayProblems(dsaTracker.todayProblems);
    setWeeklyTarget(dsaTracker.weeklyTarget);
  }, [dsaTracker]);

  const handleUpdate = useCallback((type: 'easy' | 'medium' | 'hard' | 'today' | 'weekly', value: number) => {
    const newEasy = type === 'easy' ? value : easyCount;
    const newMedium = type === 'medium' ? value : mediumCount;
    const newHard = type === 'hard' ? value : hardCount;
    const newToday = type === 'today' ? value : todayProblems;
    const newWeeklyTarget = type === 'weekly' ? value : weeklyTarget;

    const newTotalSolved = newEasy + newMedium + newHard;

    const updatedTracker: DSATracker = {
      ...dsaTracker,
      easy: newEasy,
      medium: newMedium,
      hard: newHard,
      todayProblems: newToday,
      totalSolved: newTotalSolved,
      weeklyTarget: newWeeklyTarget,
    };
    onUpdateDSATracker(updatedTracker);
  }, [easyCount, mediumCount, hardCount, todayProblems, weeklyTarget, dsaTracker, onUpdateDSATracker]);

  const incrementCount = useCallback((type: 'easy' | 'medium' | 'hard') => {
    if (type === 'easy') {
      const newCount = easyCount + 1;
      setEasyCount(newCount);
      setTodayProblems(todayProblems + 1);
      handleUpdate('easy', newCount);
      handleUpdate('today', todayProblems + 1);
    } else if (type === 'medium') {
      const newCount = mediumCount + 1;
      setMediumCount(newCount);
      setTodayProblems(todayProblems + 1);
      handleUpdate('medium', newCount);
      handleUpdate('today', todayProblems + 1);
    } else if (type === 'hard') {
      const newCount = hardCount + 1;
      setHardCount(newCount);
      setTodayProblems(todayProblems + 1);
      handleUpdate('hard', newCount);
      handleUpdate('today', todayProblems + 1);
    }
  }, [easyCount, mediumCount, hardCount, todayProblems, handleUpdate]);

  const handleManualSync = useCallback((easy: number, medium: number, hard: number, todayCount: number) => {
    const updatedTracker: DSATracker = {
      ...dsaTracker,
      easy: easy,
      medium: medium,
      hard: hard,
      todayProblems: todayCount,
      totalSolved: easy + medium + hard,
    };
    onUpdateDSATracker(updatedTracker);
    setIsSyncModalOpen(false);
  }, [dsaTracker, onUpdateDSATracker]);

  const dailySolvedData = useMemo(() => {
    // Ensure all days in the last 30 days are present, with 0 if no data
    const dataMap = new Map<string, number>();
    dsaTracker.dailySolved.forEach(entry => dataMap.set(entry.date, entry.count));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // Start from 29 days ago to include today

    const chartData: { date: string; count: number }[] = [];
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(thirtyDaysAgo);
      currentDate.setDate(thirtyDaysAgo.getDate() + i);
      const formattedDate = getFormattedDate(currentDate);
      chartData.push({
        date: formattedDate.substring(5), // M-D format
        count: dataMap.get(formattedDate) || 0,
      });
    }
    return chartData;
  }, [dsaTracker.dailySolved]);


  const difficultyProgressData = useMemo(() => {
    const dataMap = new Map<string, { easy: number; medium: number; hard: number }>();
    dsaTracker.difficultyProgressHistory.forEach(entry =>
      dataMap.set(entry.date, { easy: entry.easy, medium: entry.medium, hard: entry.hard })
    );

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 59); // Start from 59 days ago to include today

    const chartData: { date: string; easy: number; medium: number; hard: number }[] = [];
    let lastKnownEasy = 0;
    let lastKnownMedium = 0;
    let lastKnownHard = 0;

    for (let i = 0; i < 60; i++) {
      const currentDate = new Date(sixtyDaysAgo);
      currentDate.setDate(sixtyDaysAgo.getDate() + i);
      const formattedDate = getFormattedDate(currentDate);

      const entry = dataMap.get(formattedDate);
      if (entry) {
        lastKnownEasy = entry.easy;
        lastKnownMedium = entry.medium;
        lastKnownHard = entry.hard;
      }
      chartData.push({
        date: formattedDate.substring(5), // M-D format
        easy: lastKnownEasy,
        medium: lastKnownMedium,
        hard: lastKnownHard,
      });
    }
    return chartData;
  }, [dsaTracker.difficultyProgressHistory]);


  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">DSA Problem Tracker</h2>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="text-center bg-blue-50 dark:bg-blue-900 p-3 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Solved</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dsaTracker.totalSolved}</p>
        </div>
        <div className="text-center bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">Today's Problems</p>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{dsaTracker.todayProblems}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex flex-col items-center">
          <InputField
            type="number"
            label="Easy"
            value={easyCount}
            onChange={(e) => setEasyCount(parseInt(e.target.value))}
            onBlur={() => handleUpdate('easy', easyCount)}
            className="w-20 text-center"
          />
          <Button size="sm" onClick={() => incrementCount('easy')} className="mt-2 bg-green-500 hover:bg-green-600 focus:ring-green-300">
            +1
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <InputField
            type="number"
            label="Medium"
            value={mediumCount}
            onChange={(e) => setMediumCount(parseInt(e.target.value))}
            onBlur={() => handleUpdate('medium', mediumCount)}
            className="w-20 text-center"
          />
          <Button size="sm" onClick={() => incrementCount('medium')} className="mt-2 bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300">
            +1
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <InputField
            type="number"
            label="Hard"
            value={hardCount}
            onChange={(e) => setHardCount(parseInt(e.target.value))}
            onBlur={() => handleUpdate('hard', hardCount)}
            className="w-20 text-center"
          />
          <Button size="sm" onClick={() => incrementCount('hard')} className="mt-2 bg-red-500 hover:bg-red-600 focus:ring-red-300">
            +1
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <InputField
          type="number"
          label="Weekly Target"
          value={weeklyTarget}
          onChange={(e) => setWeeklyTarget(parseInt(e.target.value))}
          onBlur={() => handleUpdate('weekly', weeklyTarget)}
          min="0"
        />
      </div>

      <div className="mb-4 text-center bg-purple-50 dark:bg-purple-900 p-3 rounded-md">
        <p className="text-sm text-gray-600 dark:text-gray-300">DSA Streak</p>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{dsaTracker.dsaStreak} days</p>
        <div className="flex justify-center space-x-2 mt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open('https://leetcode.com/', '_blank')}
          >
            Go to LeetCode
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSyncModalOpen(true)}
          >
            Manual Sync
          </Button>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-end mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">Daily Solved (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailySolvedData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgb(31 41 55)', borderColor: 'rgb(75 85 99)', borderRadius: '8px' }}
              itemStyle={{ color: '#E5E7EB' }}
              labelFormatter={(label) => `Date: ${label}`}
              formatter={(value: number) => [`${value} Problems Solved`]}
            />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-grow flex flex-col justify-end">
        <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">Difficulty Progress Over Time (Last 60 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={difficultyProgressData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgb(107 114 128)' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'rgb(107 114 128)' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgb(31 41 55)', borderColor: 'rgb(75 85 99)', borderRadius: '8px' }}
              itemStyle={{ color: '#E5E7EB' }}
              labelFormatter={(label) => `Date: ${label}`}
              formatter={(value: number, name: string) => [`${value} ${name} Problems`]}
            />
            <Legend />
            <Line type="monotone" dataKey="easy" stroke="#10B981" strokeWidth={2} name="Easy" />
            <Line type="monotone" dataKey="medium" stroke="#FBBF24" strokeWidth={2} name="Medium" />
            <Line type="monotone" dataKey="hard" stroke="#EF4444" strokeWidth={2} name="Hard" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ManualDSASyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSave={handleManualSync}
        initialEasy={dsaTracker.easy}
        initialMedium={dsaTracker.medium}
        initialHard={dsaTracker.hard}
        initialTodayProblems={dsaTracker.todayProblems}
      />
    </div>
  );
};

export default DSACounterCard;