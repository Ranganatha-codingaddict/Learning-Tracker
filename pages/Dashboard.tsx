import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import WeeklyScheduleCard from '../components/WeeklyScheduleCard';
import StudyTimerCard from '../components/StudyTimerCard';
import ProgressCard from '../components/ProgressCard';
import DSACounterCard from '../components/DSACounterCard';
import ProjectTrackerCard from '../components/ProjectTrackerCard';
import LinkedInReminderCard from '../components/LinkedInReminderCard';
import CalendarCard from '../components/CalendarCard';
import OverallStreakCard from '../components/OverallStreakCard';
import WeeklyProgressSummaryCard from '../components/WeeklyProgressSummaryCard';
import AIRecommendationsCard from '../components/AIRecommendationsCard';
import WeeklyReportsCard from '../components/WeeklyReportsCard';
import CalendarHeatmapCard from '../components/CalendarHeatmapCard';
import SkillTreePage from './SkillTreePage';
import ProjectsKanbanPage from './ProjectsKanbanPage';
import { useDataService } from '../services/dataService';
import {
  User,
  DailySchedule,
  StudySession,
  Progress,
  DSATracker,
  Project,
  LinkedInReminder,
  ScheduleTask,
  WeeklySummary,
  AppData,
  PomodoroSession,
  WeeklyReport,
  AppSettings,
} from '../types';
import { getFormattedDate, getStartOfWeek, getEndOfWeek } from '../utils/dateUtils';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  INITIAL_DSA_TRACKER,
  INITIAL_LINKEDIN_REMINDER,
  INITIAL_OVERALL_STREAK,
  INITIAL_PROGRESS,
  INITIAL_WEEKLY_PROGRESS_STATE,
  WEEKLY_SCHEDULE,
  INITIAL_POMODORO_SESSIONS,
  INITIAL_APP_SETTINGS,
  INITIAL_PAST_WEEKLY_REPORTS,
  SKILL_TREE_DATA,
} from '../constants';

interface DashboardProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, currentPage, onNavigate }) => {
  const {
    getAppData,
    updateWeeklySchedule,
    addStudySession,
    addPomodoroSession,
    updateProgress,
    updateDSATracker,
    addProject,
    updateProject,
    deleteProject,
    updateLinkedInReminder,
    updateOverallLearningStreak,
    updateFullAppData,
    updateAppSettings,
  } = useDataService();

  const [weeklySchedule, setWeeklySchedule] = useState<DailySchedule[]>(WEEKLY_SCHEDULE);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>(INITIAL_POMODORO_SESSIONS);
  const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);
  const [dsaTracker, setDsaTracker] = useState<DSATracker>(INITIAL_DSA_TRACKER);
  const [projects, setProjects] = useState<Project[]>([]);
  const [linkedInReminder, setLinkedInReminder] = useState<LinkedInReminder>(INITIAL_LINKEDIN_REMINDER);
  const [overallLearningStreak, setOverallLearningStreak] = useState<number>(INITIAL_OVERALL_STREAK.overallLearningStreak);
  const [lastOverallStreakCheckDate, setLastOverallStreakCheckDate] = useState<string | null>(INITIAL_OVERALL_STREAK.lastOverallStreakCheckDate);
  const [overallStreakHistory, setOverallStreakHistory] = useState<{ date: string; streak: number }[]>(INITIAL_OVERALL_STREAK.overallStreakHistory);
  const [isCurrentDayTasksCompleted, setIsCurrentDayTasksCompleted] = useState<boolean>(false);
  const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummary[]>(INITIAL_WEEKLY_PROGRESS_STATE.weeklySummaries);
  const [currentWeekNumber, setCurrentWeekNumber] = useState<number>(INITIAL_WEEKLY_PROGRESS_STATE.currentWeekNumber);
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState<string>(INITIAL_WEEKLY_PROGRESS_STATE.currentWeekStartDate);
  const [pastWeeklyReports, setPastWeeklyReports] = useState<WeeklyReport[]>(INITIAL_PAST_WEEKLY_REPORTS);
  const [appSettings, setAppSettings] = useState<AppSettings>(INITIAL_APP_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  // Refs for current streak values to avoid stale closures in effects/callbacks
  const overallLearningStreakRef = useRef(overallLearningStreak);
  const lastOverallStreakCheckDateRef = useRef(lastOverallStreakCheckDate);
  const weeklyScheduleRef = useRef(weeklySchedule);
  const overallStreakHistoryRef = useRef(overallStreakHistory);
  const weeklySummariesRef = useRef(weeklySummaries);
  const currentWeekNumberRef = useRef(currentWeekNumber);
  const currentWeekStartDateRef = useRef(currentWeekStartDate);
  const pastWeeklyReportsRef = useRef(pastWeeklyReports);
  const appSettingsRef = useRef(appSettings);

  useEffect(() => { overallLearningStreakRef.current = overallLearningStreak; }, [overallLearningStreak]);
  useEffect(() => { lastOverallStreakCheckDateRef.current = lastOverallStreakCheckDate; }, [lastOverallStreakCheckDate]);
  useEffect(() => { weeklyScheduleRef.current = weeklySchedule; }, [weeklySchedule]);
  useEffect(() => { overallStreakHistoryRef.current = overallStreakHistory; }, [overallStreakHistory]);
  useEffect(() => { weeklySummariesRef.current = weeklySummaries; }, [weeklySummaries]);
  useEffect(() => { currentWeekNumberRef.current = currentWeekNumber; }, [currentWeekNumber]);
  useEffect(() => { currentWeekStartDateRef.current = currentWeekStartDate; }, [currentWeekStartDate]);
  useEffect(() => { pastWeeklyReportsRef.current = pastWeeklyReports; }, [pastWeeklyReports]);
  useEffect(() => { appSettingsRef.current = appSettings; }, [appSettings]);


  // Fetch initial data and handle weekly rollover
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAppData(user.id);
      if (data) {
        let loadedWeeklySchedule = data.weeklySchedule;
        let loadedWeeklySummaries = data.weeklySummaries || INITIAL_WEEKLY_PROGRESS_STATE.weeklySummaries;
        let loadedCurrentWeekNumber = data.currentWeekNumber || INITIAL_WEEKLY_PROGRESS_STATE.currentWeekNumber;
        let loadedCurrentWeekStartDate = data.currentWeekStartDate || INITIAL_WEEKLY_PROGRESS_STATE.currentWeekStartDate;
        let loadedPastWeeklyReports = data.pastWeeklyReports || INITIAL_PAST_WEEKLY_REPORTS;
        let loadedAppSettings = data.appSettings || INITIAL_APP_SETTINGS;


        const today = new Date();
        const startOfCurrentCalendarWeek = getFormattedDate(getStartOfWeek(today));

        // Check for week rollover
        if (loadedCurrentWeekStartDate !== startOfCurrentCalendarWeek) {
          // A new week has started
          console.log("New week detected! Performing rollover...");

          const previousWeekStartDate = loadedCurrentWeekStartDate;
          const previousWeekEndDate = getFormattedDate(getEndOfWeek(new Date(previousWeekStartDate)));

          // Calculate summary for the just-finished week (using the *old* schedule)
          const totalTasksInPreviousWeek = loadedWeeklySchedule.reduce((sum, daily) => sum + daily.tasks.length, 0);
          const completedTasksInPreviousWeek = loadedWeeklySchedule.reduce((sum, daily) =>
            sum + daily.tasks.filter(task => task.isCompleted).length, 0);
          const percentageCompletedInPreviousWeek = totalTasksInPreviousWeek > 0
            ? Math.round((completedTasksInPreviousWeek / totalTasksInPreviousWeek) * 100)
            : 0;

          const previousWeekSummary: WeeklySummary = {
            id: `week-${loadedCurrentWeekNumber}`,
            weekNumber: loadedCurrentWeekNumber,
            startDate: previousWeekStartDate,
            endDate: previousWeekEndDate,
            totalTasks: totalTasksInPreviousWeek,
            completedTasks: completedTasksInPreviousWeek,
            percentageCompleted: percentageCompletedInPreviousWeek,
            isWeekCompleted: percentageCompletedInPreviousWeek === 100,
          };

          // Generate Weekly Report for the just-finished week
          const totalStudyHoursLastWeek = data.studySessions
            .filter(s => new Date(s.date) >= new Date(previousWeekStartDate) && new Date(s.date) <= new Date(previousWeekEndDate))
            .reduce((sum, s) => sum + s.duration, 0) / (1000 * 60 * 60); // In hours

          const weeklyDsaSolved = data.dsaTracker.dailySolved
            .filter(ds => new Date(ds.date) >= new Date(previousWeekStartDate) && new Date(ds.date) <= new Date(previousWeekEndDate))
            .reduce((sum, ds) => sum + ds.count, 0);

          const lastReportedDifficultyProgress = data.dsaTracker.difficultyProgressHistory
            .filter(dp => new Date(dp.date) <= new Date(previousWeekEndDate))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || {easy: 0, medium: 0, hard: 0};


          const previousWeeklyReport: WeeklyReport = {
            id: `report-${loadedCurrentWeekNumber}`,
            weekNumber: loadedCurrentWeekNumber,
            startDate: previousWeekStartDate,
            endDate: previousWeekEndDate,
            totalStudyHours: parseFloat(totalStudyHoursLastWeek.toFixed(1)),
            dsaTotalSolved: weeklyDsaSolved,
            dsaEasy: lastReportedDifficultyProgress.easy,
            dsaMedium: lastReportedDifficultyProgress.medium,
            dsaHard: lastReportedDifficultyProgress.hard,
            overallLearningStreakAtEndOfWeek: data.overallLearningStreak, // Streak at the end of the previous week
            tasksCompletedPercentage: percentageCompletedInPreviousWeek,
            isWeekCompleted: percentageCompletedInPreviousWeek === 100,
          };

          // Add to summaries and reports
          loadedWeeklySummaries = [...loadedWeeklySummaries, previousWeekSummary];
          loadedPastWeeklyReports = [...loadedPastWeeklyReports, previousWeeklyReport].slice(-4); // Keep last 4 reports

          loadedCurrentWeekNumber++;
          loadedCurrentWeekStartDate = startOfCurrentCalendarWeek;

          // Reset weekly schedule for the new week, and handle auto rescheduling if enabled
          let newWeeklySchedule: DailySchedule[] = WEEKLY_SCHEDULE.map(day => ({
            ...day,
            // Fix: Explicitly cast `notes: undefined` to `string | undefined` to satisfy `ScheduleTask` type
            tasks: day.tasks.map(task => ({ ...task, isCompleted: false, notes: undefined })),
          }));

          if (loadedAppSettings.isAutoRescheduleEnabled) {
            const missedTasks: ScheduleTask[] = [];
            loadedWeeklySchedule.forEach(day => {
              day.tasks.forEach(task => {
                if (!task.isCompleted) {
                  missedTasks.push({
                    id: task.id,
                    name: task.name,
                    estimatedTime: task.estimatedTime,
                    isCompleted: false,
                    // The literal `Rescheduled from ${day.day}` is already a string.
                    // Removing the `as string | undefined` resolves the type conflict
                    // where the parameter type for `push` expected `notes: string`.
                    notes: `Rescheduled from ${day.day}`,
                    videoLink: task.videoLink,
                  });
                }
              });
            });

            // Distribute missed tasks to upcoming days (simplistic distribution for mock)
            let taskIndex = 0;
            for (let i = 0; i < newWeeklySchedule.length && taskIndex < missedTasks.length; i++) {
              const day = newWeeklySchedule[i];
              const todayDayName = today.toLocaleString('en-US', { weekday: 'long' });
              // Only add to future days or today if it's the current day of the week and it's not already past
              if (new Date(loadedCurrentWeekStartDate) <= today && day.day === todayDayName) {
                // If it's today, only add if current time allows for it, or simply skip for today if it's considered "past"
                // For simplicity in mock, just ensure we don't add to days that are logically "behind"
                // The current iteration ensures we add to *upcoming* days in the *new* schedule
              } else {
                const tasksToAdd = Math.ceil((missedTasks.length - taskIndex) / (newWeeklySchedule.length - i));
                for (let j = 0; j < tasksToAdd && taskIndex < missedTasks.length; j++) {
                  day.tasks.push(missedTasks[taskIndex]);
                  taskIndex++;
                }
              }
            }
            loadedWeeklySchedule = newWeeklySchedule;
          } else {
            loadedWeeklySchedule = newWeeklySchedule;
          }


          // Persist all rollover changes immediately
          await updateFullAppData(user.id, {
            ...data,
            weeklySchedule: loadedWeeklySchedule,
            weeklySummaries: loadedWeeklySummaries,
            currentWeekNumber: loadedCurrentWeekNumber,
            currentWeekStartDate: loadedCurrentWeekStartDate,
            pastWeeklyReports: loadedPastWeeklyReports,
          });
        }

        setWeeklySchedule(loadedWeeklySchedule);
        setStudySessions(data.studySessions);
        setPomodoroSessions(data.pomodoroSessions || INITIAL_POMODORO_SESSIONS);
        setProgress(data.progress);
        setDsaTracker(data.dsaTracker);
        setProjects(data.projects);
        setLinkedInReminder(data.linkedInReminder);
        setOverallLearningStreak(data.overallLearningStreak || INITIAL_OVERALL_STREAK.overallLearningStreak);
        setLastOverallStreakCheckDate(data.lastOverallStreakCheckDate || INITIAL_OVERALL_STREAK.lastOverallStreakCheckDate);
        setOverallStreakHistory(data.overallStreakHistory || INITIAL_OVERALL_STREAK.overallStreakHistory);
        setWeeklySummaries(loadedWeeklySummaries);
        setCurrentWeekNumber(loadedCurrentWeekNumber);
        setCurrentWeekStartDate(loadedCurrentWeekStartDate);
        setPastWeeklyReports(loadedPastWeeklyReports);
        setAppSettings(loadedAppSettings);
      }
      setLoading(false);
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, updateFullAppData, getAppData]);


  // --- Overall Learning Streak Logic ---
  const triggerOverallStreakCheck = useCallback(async () => {
    const currentDate = getFormattedDate(new Date());
    const yesterdayDate = getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 1)));
    const currentDayName = new Date().toLocaleString('en-US', { weekday: 'long' });

    const todaySchedule = weeklyScheduleRef.current.find(daily => daily.day === currentDayName);
    const areTodayTasksCompleted = todaySchedule?.tasks.every(task => task.isCompleted) || false;
    setIsCurrentDayTasksCompleted(areTodayTasksCompleted);

    let newOverallLearningStreak = overallLearningStreakRef.current;
    let newLastOverallStreakCheckDate = lastOverallStreakCheckDateRef.current;
    let newOverallStreakHistory = [...overallStreakHistoryRef.current];

    // Check streak only if it hasn't been processed for today or if task completion status changed for today
    // if (newLastOverallStreakCheckDate !== currentDate || areTodayTasksCompleted !== isCurrentDayTasksCompletedRef.current) {
      if (areTodayTasksCompleted) {
        if (newLastOverallStreakCheckDate === yesterdayDate) {
          newOverallLearningStreak = overallLearningStreakRef.current + 1;
        } else if (newLastOverallStreakCheckDate !== currentDate) {
          newOverallLearningStreak = 1; // New streak starts
        }
        newLastOverallStreakCheckDate = currentDate;
      } else { // Tasks are NOT completed today
        if (overallLearningStreakRef.current > 0 &&
            newLastOverallStreakCheckDate !== currentDate && // Not the current day where streak was last checked
            newLastOverallStreakCheckDate !== yesterdayDate // Not yesterday where streak was last checked (meaning a day was missed)
        ) {
          // Streak was active, but a day was missed
          newOverallLearningStreak = 0;
        }
      }

      // Update streak history
      const historyEntryIndex = newOverallStreakHistory.findIndex(entry => entry.date === currentDate);
      if (historyEntryIndex !== -1) {
        newOverallStreakHistory[historyEntryIndex] = { date: currentDate, streak: newOverallLearningStreak };
      } else {
        newOverallStreakHistory.push({ date: currentDate, streak: newOverallLearningStreak });
      }

      // Trim history to last 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      newOverallStreakHistory = newOverallStreakHistory.filter(entry => new Date(entry.date) >= ninetyDaysAgo);


      if (newOverallLearningStreak !== overallLearningStreakRef.current ||
          newLastOverallStreakCheckDate !== lastOverallStreakCheckDateRef.current ||
          JSON.stringify(newOverallStreakHistory) !== JSON.stringify(overallStreakHistoryRef.current))
      {
        setOverallLearningStreak(newOverallLearningStreak);
        setLastOverallStreakCheckDate(newLastOverallStreakCheckDate);
        setOverallStreakHistory(newOverallStreakHistory);
        await updateOverallLearningStreak(user.id, {
          overallLearningStreak: newOverallLearningStreak,
          lastOverallStreakCheckDate: newLastOverallStreakCheckDate,
          overallStreakHistory: newOverallStreakHistory,
        });
      }
    // }
  }, [user.id, updateOverallLearningStreak]);

  useEffect(() => {
    const checkAndSetInitialCompletion = () => {
      const currentDayName = new Date().toLocaleString('en-US', { weekday: 'long' });
      const todaySchedule = weeklyScheduleRef.current.find(daily => daily.day === currentDayName);
      const areTodayTasksCompleted = todaySchedule?.tasks.every(task => task.isCompleted) || false;
      setIsCurrentDayTasksCompleted(areTodayTasksCompleted);
    };

    // Initial check on mount
    checkAndSetInitialCompletion();

    // Trigger streak check whenever weeklySchedule changes (i.e., a task is marked done/undone)
    triggerOverallStreakCheck();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklySchedule]);


  // Handle Weekly Schedule updates
  const handleToggleTaskCompletion = useCallback(async (day: string, taskId: string) => {
    setWeeklySchedule(prevSchedule => {
      const updatedSchedule = prevSchedule.map(daily => {
        if (daily.day === day) {
          const updatedTasks = daily.tasks.map(task =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
          );
          updateWeeklySchedule(user.id, updatedSchedule);
          return { ...daily, tasks: updatedTasks };
        }
        return daily;
      });
      return updatedSchedule;
    });
  }, [user.id, updateWeeklySchedule]);

  const handleUpdateTaskNotes = useCallback(async (day: string, taskId: string, newNotes: string) => {
    setWeeklySchedule(prevSchedule => {
      const updatedSchedule = prevSchedule.map(daily => {
        if (daily.day === day) {
          const updatedTasks = daily.tasks.map(task =>
            task.id === taskId ? { ...task, notes: newNotes } : task
          );
          updateWeeklySchedule(user.id, updatedSchedule);
          return { ...daily, tasks: updatedTasks };
        }
        return daily;
      });
      return updatedSchedule;
    });
  }, [user.id, updateWeeklySchedule]);

  // Handle Study Session updates
  const handleAddStudySession = useCallback(async (duration: number) => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      userId: user.id,
      date: getFormattedDate(new Date()),
      duration: duration,
    };
    setStudySessions(prevSessions => {
      const updatedSessions = [...prevSessions, newSession];
      addStudySession(user.id, updatedSessions);
      return updatedSessions;
    });
  }, [user.id, addStudySession]);

  // Handle Pomodoro Session updates
  const handleAddPomodoroSession = useCallback(async (duration: number, type: 'focus' | 'short-break' | 'long-break') => {
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      userId: user.id,
      date: getFormattedDate(new Date()),
      duration: duration,
      type: type,
      completedAt: new Date().toISOString(),
    };
    setPomodoroSessions(prevSessions => {
      const updatedSessions = [...prevSessions, newSession];
      addPomodoroSession(user.id, updatedSessions);
      return updatedSessions;
    });
  }, [user.id, addPomodoroSession]);


  // Handle Progress updates (manual update for now, could be tied to task completion)
  const handleUpdateProgress = useCallback(async (newProgress: Partial<Progress>) => {
    setProgress(prevProgress => {
      const updatedProgress = { ...prevProgress, ...newProgress };
      updateProgress(user.id, updatedProgress);
      return updatedProgress;
    });
  }, [user.id, updateProgress]);

  // Handle DSA Tracker updates
  const handleUpdateDSATracker = useCallback(async (newDsaTracker: DSATracker) => {
    setDsaTracker(prevTracker => {
      const today = getFormattedDate(new Date());

      // --- Update dailySolved for bar chart ---
      let updatedDailySolved = [...prevTracker.dailySolved];
      const todayDailyEntryIndex = updatedDailySolved.findIndex(entry => entry.date === today);

      if (todayDailyEntryIndex !== -1) {
        updatedDailySolved[todayDailyEntryIndex] = { date: today, count: newDsaTracker.todayProblems };
      } else {
        updatedDailySolved.push({ date: today, count: newDsaTracker.todayProblems });
      }

      updatedDailySolved = updatedDailySolved.filter(entry => {
        const entryDate = new Date(entry.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        return entryDate >= thirtyDaysAgo;
      });

      // --- Calculate DSA Streak ---
      let newDsaStreak = 0;
      const solvedDates = updatedDailySolved.filter(entry => entry.count > 0).map(entry => entry.date).sort();
      if (solvedDates.length > 0) {
        let currentStreak = 0;
        let lastDate = new Date(solvedDates[0]);
        for (let i = 0; i < solvedDates.length; i++) {
          const currentDate = new Date(solvedDates[i]);
          // Check for consecutive days (allowing for multiple entries on same day, though dailySolved should have one per day)
          // Difference in ms should be 24 hours (1 day) or 0 (same day, if multiple updates)
          const dayDiff = Math.round((currentDate.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));

          if (i === 0 || dayDiff === 1) { // If first entry or consecutive day
            currentStreak++;
          } else if (dayDiff > 1) { // If a gap, reset streak
            currentStreak = 1;
          }
          lastDate = currentDate;
        }
        newDsaStreak = currentStreak;
      }
      
      // If today has problems and the last entry in updatedDailySolved is today,
      // ensure the streak logic accounts for it being today.
      const lastSolvedDate = solvedDates[solvedDates.length - 1];
      if (newDsaTracker.todayProblems > 0 && lastSolvedDate === today) {
        // Streak is correctly calculated including today if problems were solved.
      } else if (newDsaTracker.todayProblems === 0 && lastSolvedDate === today && prevTracker.todayProblems > 0) {
        // If today's problems went from >0 to 0, and today was the last day, streak might be broken.
        // Recalculate streak excluding today's (now 0) entry.
        const prevDay = getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 1)));
        const prevDayEntry = updatedDailySolved.find(entry => entry.date === prevDay);
        if (!(prevDayEntry && prevDayEntry.count > 0)) {
          newDsaStreak = 0;
        }
      }


      // --- Update difficultyProgressHistory for line chart ---
      let updatedDifficultyHistory = [...prevTracker.difficultyProgressHistory];
      const todayDifficultyEntryIndex = updatedDifficultyHistory.findIndex(entry => entry.date === today);

      const latestCumulativeEasy = newDsaTracker.easy;
      const latestCumulativeMedium = newDsaTracker.medium;
      const latestCumulativeHard = newDsaTracker.hard;

      if (todayDifficultyEntryIndex !== -1) {
        // Update existing entry for today with new cumulative counts
        updatedDifficultyHistory[todayDifficultyEntryIndex] = {
          date: today,
          easy: latestCumulativeEasy,
          medium: latestCumulativeMedium,
          hard: latestCumulativeHard,
        };
      } else {
        // Add new entry for today with new cumulative counts
        updatedDifficultyHistory.push({
          date: today,
          easy: latestCumulativeEasy,
          medium: latestCumulativeMedium,
          hard: latestCumulativeHard,
        });
      }

      // Trim difficultyProgressHistory to last 60 days
      updatedDifficultyHistory = updatedDifficultyHistory.filter(entry => {
        const entryDate = new Date(entry.date);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 59);
        return entryDate >= sixtyDaysAgo;
      });

      const finalDSATracker = {
        ...newDsaTracker,
        dailySolved: updatedDailySolved,
        dsaStreak: newDsaStreak,
        difficultyProgressHistory: updatedDifficultyHistory,
      };

      updateDSATracker(user.id, finalDSATracker);
      return finalDSATracker;
    });
  }, [user.id, updateDSATracker]);


  // Handle Project updates
  const handleAddProject = useCallback(async (project: Omit<Project, 'id' | 'userId'>) => {
    const newProject: Project = { ...project, id: Date.now().toString(), userId: user.id };
    setProjects(prevProjects => {
      const updatedProjects = [...prevProjects, newProject];
      addProject(user.id, updatedProjects);
      return updatedProjects;
    });
  }, [user.id, addProject]);

  const handleUpdateProject = useCallback(async (updatedProject: Project) => {
    setProjects(prevProjects => {
      const updatedList = prevProjects.map(p => (p.id === updatedProject.id ? updatedProject : p));
      updateProject(user.id, updatedList);
      return updatedList;
    });
  }, [user.id, updateProject]);

  const handleDeleteProject = useCallback(async (projectId: string) => {
    setProjects(prevProjects => {
      const updatedList = prevProjects.filter(p => p.id !== projectId);
      deleteProject(user.id, updatedList);
      return updatedList;
    });
  }, [user.id, deleteProject]);

  // Handle LinkedIn Reminder updates
  const handleUpdateLinkedInReminder = useCallback(async (newReminder: LinkedInReminder) => {
    setLinkedInReminder(prevReminder => {
      const updatedReminder = { ...prevReminder, ...newReminder };
      updateLinkedInReminder(user.id, updatedReminder);
      return updatedReminder;
    });
  }, [user.id, updateLinkedInReminder]);

  // Handle App Settings updates
  const handleUpdateAppSettings = useCallback(async (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    await updateAppSettings(user.id, newSettings);
  }, [user.id, updateAppSettings]);


  const totalStudyTime = useMemo(() => {
    return studySessions.reduce((total, session) => total + session.duration, 0);
  }, [studySessions]);

  const currentWeekSummary = useMemo(() => {
    const totalTasks = weeklySchedule.reduce((sum, daily) => sum + daily.tasks.length, 0);
    const completedTasks = weeklySchedule.reduce((sum, daily) =>
      sum + daily.tasks.filter(task => task.isCompleted).length, 0);
    const percentageCompleted = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const isWeekCompleted = percentageCompleted === 100;

    return {
      id: `current-week-${currentWeekNumber}`,
      weekNumber: currentWeekNumber,
      startDate: currentWeekStartDate,
      endDate: getFormattedDate(getEndOfWeek(new Date(currentWeekStartDate))),
      totalTasks,
      completedTasks,
      percentageCompleted,
      isWeekCompleted,
    };
  }, [weeklySchedule, currentWeekNumber, currentWeekStartDate]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  // Conditional rendering for different "pages"
  if (currentPage === 'projects-kanban') {
    return (
      <ProjectsKanbanPage
        projects={projects}
        onUpdateProject={handleUpdateProject}
        onNavigate={onNavigate}
      />
    );
  }

  if (currentPage === 'skill-tree') {
    return (
      <SkillTreePage
        progress={progress}
        weeklySchedule={weeklySchedule}
        skillTreeData={SKILL_TREE_DATA}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
      {/* AI Recommendations Card (Feature 1) */}
      <div id="ai-recommendations" className="lg:col-span-2 xl:col-span-2">
        <AIRecommendationsCard
          progress={progress}
          dsaTracker={dsaTracker}
          projects={projects}
          weeklySchedule={weeklySchedule}
        />
      </div>

      <div id="weekly-schedule" className="md:col-span-2 lg:col-span-3 xl:col-span-4">
        <WeeklyScheduleCard
          weeklySchedule={weeklySchedule}
          onToggleTaskCompletion={handleToggleTaskCompletion}
          onUpdateTaskNotes={handleUpdateTaskNotes}
          appSettings={appSettings}
          onUpdateAppSettings={handleUpdateAppSettings}
        />
      </div>

      <div id="weekly-progress-summary" className="md:col-span-2 lg:col-span-3 xl:col-span-4">
        <WeeklyProgressSummaryCard
          currentWeekSummary={currentWeekSummary}
          weeklySummaries={weeklySummaries}
        />
      </div>

      {/* Weekly Reports Card (Feature 2) */}
      <div id="weekly-reports" className="lg:col-span-2 xl:col-span-2">
        <WeeklyReportsCard
          pastWeeklyReports={pastWeeklyReports}
        />
      </div>

      <div id="study-timer">
        <StudyTimerCard
          onAddStudySession={handleAddStudySession}
          totalStudyTime={totalStudyTime}
          studySessions={studySessions}
          onAddPomodoroSession={handleAddPomodoroSession}
          pomodoroSessions={pomodoroSessions}
        />
      </div>

      <div id="progress">
        <ProgressCard progress={progress} onUpdateProgress={handleUpdateProgress} />
      </div>

      <div id="dsa-tracker">
        <DSACounterCard dsaTracker={dsaTracker} onUpdateDSATracker={handleUpdateDSATracker} />
      </div>

      <div id="overall-streak">
        <OverallStreakCard
          overallLearningStreak={overallLearningStreak}
          isCurrentDayTasksCompleted={isCurrentDayTasksCompleted}
          overallStreakHistory={overallStreakHistory}
        />
      </div>

      <div id="project-tracker" className="md:col-span-2 lg:col-span-1 xl:col-span-2">
        <ProjectTrackerCard
          projects={projects}
          onAddProject={handleAddProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          aiGenerateSubtasks={(taskName) => {
            // Mock AI logic for subtask generation (Feature 7)
            const generated = [
              { id: `sub-${Date.now()}-1`, description: `Research ${taskName} concepts`, isCompleted: false },
              { id: `sub-${Date.now()}-2`, description: `Outline implementation for ${taskName}`, isCompleted: false },
              { id: `sub-${Date.now()}-3`, description: `Code initial module for ${taskName}`, isCompleted: false },
              { id: `sub-${Date.now()}-4`, description: `Test ${taskName} functionality`, isCompleted: false },
            ];
            return generated;
          }}
        />
      </div>

      <div id="linkedin">
        <LinkedInReminderCard
          linkedInReminder={linkedInReminder}
          onUpdateLinkedInReminder={handleUpdateLinkedInReminder}
          weeklySchedule={weeklySchedule}
          studySessions={studySessions}
        />
      </div>

      <div id="calendar" className="md:col-span-2 lg:col-span-3 xl:col-span-2">
        <CalendarCard studySessions={studySessions} projects={projects} />
      </div>

      {/* Calendar Heatmap Card (Feature 9) */}
      <div id="calendar-heatmap" className="md:col-span-2 lg:col-span-3 xl:col-span-2">
        <CalendarHeatmapCard
          studySessions={studySessions}
          dailyDsaSolved={dsaTracker.dailySolved}
        />
      </div>
    </div>
  );
};

export default Dashboard;