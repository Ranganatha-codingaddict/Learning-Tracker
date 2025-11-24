

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StudySession, PomodoroSession } from '../types';
import Button from './Button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { getFormattedDate, formatDuration } from '../utils/dateUtils';
import useSound from '../utils/audioUtils'; // New hook for sounds

interface StudyTimerCardProps {
  onAddStudySession: (duration: number) => void;
  totalStudyTime: number; // Total duration in milliseconds
  studySessions: StudySession[];
  onAddPomodoroSession: (duration: number, type: 'focus' | 'short-break' | 'long-break') => void; // New prop
  pomodoroSessions: PomodoroSession[]; // New prop
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF69B4', '#5F9EA0']; // Distinct colors for each day
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const POMODORO_DURATIONS = {
  FOCUS: 25 * 60 * 1000, // 25 minutes
  SHORT_BREAK: 5 * 60 * 1000, // 5 minutes
  LONG_BREAK: 15 * 60 * 1000, // 15 minutes
};

const StudyTimerCard: React.FC<StudyTimerCardProps> = ({
  onAddStudySession,
  totalStudyTime,
  studySessions,
  onAddPomodoroSession,
  pomodoroSessions,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in milliseconds
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Pomodoro states
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const [pomodoroRound, setPomodoroRound] = useState(1);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(POMODORO_DURATIONS.FOCUS);
  const pomodoroTimerRef = useRef<number | null>(null);
  const playSound = useSound(); // Initialize useSound hook


  const startRegularTimer = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      timerRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 1000);
      setIsRunning(true);
    }
  }, [isRunning, elapsedTime]);

  const stopRegularTimer = useCallback(() => {
    if (isRunning) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      setIsRunning(false);
      onAddStudySession(elapsedTime);
      setElapsedTime(0); // Reset for next session
    }
  }, [isRunning, elapsedTime, onAddStudySession]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (pomodoroTimerRef.current) {
        window.clearInterval(pomodoroTimerRef.current);
      }
    };
  }, []);

  // Pomodoro Logic
  const startPomodoroTimer = useCallback(() => {
    if (pomodoroTimerRef.current) window.clearInterval(pomodoroTimerRef.current);

    const targetTime = Date.now() + pomodoroTimeLeft;
    pomodoroTimerRef.current = window.setInterval(() => {
      const remaining = targetTime - Date.now();
      if (remaining <= 0) {
        window.clearInterval(pomodoroTimerRef.current!);
        playSound('alert'); // Play sound on phase change

        // Log the completed pomodoro session
        const duration = POMODORO_DURATIONS[pomodoroPhase.toUpperCase() as keyof typeof POMODORO_DURATIONS];
        onAddPomodoroSession(duration, pomodoroPhase);

        // Transition to next phase
        if (pomodoroPhase === 'focus') {
          if (pomodoroRound < 4) {
            setPomodoroPhase('short-break');
            setPomodoroTimeLeft(POMODORO_DURATIONS.SHORT_BREAK);
          } else {
            setPomodoroPhase('long-break');
            setPomodoroTimeLeft(POMODORO_DURATIONS.LONG_BREAK);
          }
        } else { // break phases
          setPomodoroPhase('focus');
          setPomodoroRound(prev => prev < 4 ? prev + 1 : 1); // Reset rounds after a long break
          setPomodoroTimeLeft(POMODORO_DURATIONS.FOCUS);
        }
        startPomodoroTimer(); // Start next phase automatically
      } else {
        setPomodoroTimeLeft(remaining);
      }
    }, 1000);
    setIsRunning(true); // Indicate timer is running
  }, [pomodoroTimeLeft, pomodoroPhase, pomodoroRound, onAddPomodoroSession, playSound]);

  const stopPomodoroTimer = useCallback(() => {
    if (pomodoroTimerRef.current) window.clearInterval(pomodoroTimerRef.current);
    pomodoroTimerRef.current = null;
    setIsRunning(false);
    // Do not reset time left or phase, allow resuming or explicit reset
  }, []);

  const resetPomodoroTimer = useCallback(() => {
    stopPomodoroTimer();
    setPomodoroPhase('focus');
    setPomodoroRound(1);
    setPomodoroTimeLeft(POMODORO_DURATIONS.FOCUS);
  }, [stopPomodoroTimer]);


  const displayedTimerTime = isPomodoroMode ? pomodoroTimeLeft : elapsedTime;

  const dailyStudyHours = useMemo(() => {
    const today = getFormattedDate(new Date());
    const totalTodayMs = studySessions
      .filter(session => session.date === today)
      .reduce((sum, session) => sum + session.duration, 0);
    const totalTodayPomodoroMs = pomodoroSessions
      .filter(session => session.date === today && session.type === 'focus')
      .reduce((sum, session) => sum + session.duration, 0);

    return (totalTodayMs + totalTodayPomodoroMs) / (1000 * 60 * 60); // Convert ms to hours
  }, [studySessions, pomodoroSessions]);

  const weeklyStudyData = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6); // Last 7 days

    const dailyTotals: { [date: string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(oneWeekAgo);
      date.setDate(oneWeekAgo.getDate() + i);
      dailyTotals[getFormattedDate(date)] = 0;
    }

    studySessions.forEach(session => {
      if (dailyTotals[session.date] !== undefined) {
        dailyTotals[session.date] += session.duration;
      }
    });
    pomodoroSessions.forEach(session => {
        if (session.type === 'focus' && dailyTotals[session.date] !== undefined) {
            dailyTotals[session.date] += session.duration;
        }
    });

    return Object.keys(dailyTotals).sort().map(date => ({
      date: date.substring(5), // M-D format
      hours: (dailyTotals[date] / (1000 * 60 * 60)).toFixed(1), // Convert ms to hours, one decimal
    }));
  }, [studySessions, pomodoroSessions]);

  const dailyDistributionData = useMemo(() => {
    const dailyTotals: { [key: string]: number } = {}; // key is day of week (e.g., 'Monday')

    studySessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dayIndex = sessionDate.getDay(); // 0 for Sunday, 1 for Monday
      const dayName = DAYS_OF_WEEK[dayIndex === 0 ? 6 : dayIndex - 1]; // Adjust to make Monday index 0

      dailyTotals[dayName] = (dailyTotals[dayName] || 0) + session.duration;
    });
    pomodoroSessions.forEach(session => {
        if (session.type === 'focus') {
            const sessionDate = new Date(session.date);
            const dayIndex = sessionDate.getDay();
            const dayName = DAYS_OF_WEEK[dayIndex === 0 ? 6 : dayIndex - 1];
            dailyTotals[dayName] = (dailyTotals[dayName] || 0) + session.duration;
        }
    });

    return Object.keys(dailyTotals)
      .map(dayName => ({
        name: dayName,
        value: Math.round(dailyTotals[dayName] / (1000 * 60)), // Convert ms to minutes
      }))
      .filter(item => item.value > 0); // Only include days with study time
  }, [studySessions, pomodoroSessions]);


  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Daily Study Timer</h2>

      <div className="flex justify-center mb-4">
        <Button
          onClick={() => {
            if (isRunning) { // Stop current timer if running before switching mode
                if (isPomodoroMode) stopPomodoroTimer();
                else stopRegularTimer();
            }
            setIsPomodoroMode(false);
            setElapsedTime(0); // Reset elapsed time when switching
            resetPomodoroTimer(); // Reset pomodoro when switching out
          }}
          variant={!isPomodoroMode ? 'primary' : 'secondary'}
          className="mr-2"
        >
          Free Study Mode
        </Button>
        <Button
          onClick={() => {
            if (isRunning) { // Stop current timer if running before switching mode
                if (isPomodoroMode) stopPomodoroTimer();
                else stopRegularTimer();
            }
            setIsPomodoroMode(true);
            setElapsedTime(0); // Reset elapsed time when switching
            resetPomodoroTimer(); // Ensure pomodoro is reset when switching in
          }}
          variant={isPomodoroMode ? 'primary' : 'secondary'}
        >
          Pomodoro Mode
        </Button>
      </div>

      <div className="flex-grow flex flex-col justify-between">
        {isPomodoroMode && (
          <div className="text-center mb-4">
            <p className={`text-xl font-medium ${pomodoroPhase === 'focus' ? 'text-blue-500 dark:text-blue-300' : 'text-purple-500 dark:text-purple-300'}`}>
              {pomodoroPhase.toUpperCase()} - Round {pomodoroRound}
            </p>
          </div>
        )}
        <div className="text-center mb-6">
          <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">
            {formatDuration(displayedTimerTime)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {isPomodoroMode ? 'Time Remaining' : 'Current Session'}
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {isPomodoroMode ? (
            <>
              <Button onClick={startPomodoroTimer} disabled={isRunning}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.121C14.195 10.635 13.332 10.5 12.5 10.5s-1.695.135-2.252.621A2.25 2.25 0 0010.5 14.25c0 .72.247 1.391.675 1.916.557.697 1.252.834 2.25.834s1.693-.137 2.25-.834c.428-.525.675-1.196.675-1.916a2.25 2.25 0 00-.75-1.916zM12 11.25V9m-3.75 6.75h7.5M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z"></path></svg>
                Start
              </Button>
              <Button onClick={stopPomodoroTimer} disabled={!isRunning} variant="danger">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg>
                Stop
              </Button>
              <Button onClick={resetPomodoroTimer} variant="secondary">
                Reset
              </Button>
            </>
          ) : (
            <>
              <Button onClick={startRegularTimer} disabled={isRunning}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.121C14.195 10.635 13.332 10.5 12.5 10.5s-1.695.135-2.252.621A2.25 2.25 0 0010.5 14.25c0 .72.247 1.391.675 1.916.557.697 1.252.834 2.25.834s1.693-.137 2.25-.834c.428-.525.675-1.196.675-1.916a2.25 2.25 0 00-.75-1.916zM12 11.25V9m-3.75 6.75h7.5M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z"></path></svg>
                Start Study
              </Button>
              <Button onClick={stopRegularTimer} disabled={!isRunning} variant="danger">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg>
                Stop Study
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Today</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{dailyStudyHours.toFixed(1)} hrs</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">Overall Total</p>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-200">{(totalStudyTime / (1000 * 60 * 60)).toFixed(1)} hrs</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">Weekly Study Hours</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyStudyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgb(107 114 128)' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'rgb(107 114 128)' }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgb(31 41 55)', borderColor: 'rgb(75 85 99)', borderRadius: '8px' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Line type="monotone" dataKey="hours" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {dailyDistributionData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">Study Time Distribution (Minutes)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dailyDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dailyDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgb(31 41 55)', borderColor: 'rgb(75 85 99)', borderRadius: '8px' }}
                  itemStyle={{ color: '#E5E7EB' }}
                  formatter={(value: number, name: string) => [`${value} min`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTimerCard;