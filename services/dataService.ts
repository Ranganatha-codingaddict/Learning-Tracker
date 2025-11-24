

import { useState, useEffect, useCallback } from 'react';
import {
  AppData,
  DailySchedule,
  StudySession,
  Progress,
  DSATracker,
  Project,
  LinkedInReminder,
  PomodoroSession, // Import PomodoroSession
  AppSettings, // Import AppSettings
  WeeklyReport, // Import WeeklyReport
} from '../types';
import {
  WEEKLY_SCHEDULE,
  INITIAL_PROGRESS,
  INITIAL_DSA_TRACKER,
  INITIAL_LINKEDIN_REMINDER,
  INITIAL_OVERALL_STREAK,
  INITIAL_WEEKLY_PROGRESS_STATE, // Import new initial state
  INITIAL_POMODORO_SESSIONS, // Import initial Pomodoro sessions
  INITIAL_APP_SETTINGS, // Import initial app settings
  INITIAL_PAST_WEEKLY_REPORTS, // Import initial past weekly reports
} from '../constants';
import { getFormattedDate, getStartOfWeek } from '../utils/dateUtils'; // Import date utils

const DATA_STORAGE_KEY_PREFIX = 'roadmap_tracker_data_';

/**
 * Mocks a backend data service using localStorage.
 * In a real application, these would be API calls to a server.
 */
const mockDataApi = {
  getAppData: async (userId: string): Promise<AppData | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedData = localStorage.getItem(`${DATA_STORAGE_KEY_PREFIX}${userId}`);
    if (storedData) {
      const parsedData = JSON.parse(storedData) as AppData;
      // Ensure new fields are initialized for existing users
      return {
        ...parsedData,
        overallLearningStreak: parsedData.overallLearningStreak ?? INITIAL_OVERALL_STREAK.overallLearningStreak,
        lastOverallStreakCheckDate: parsedData.lastOverallStreakCheckDate ?? INITIAL_OVERALL_STREAK.lastOverallStreakCheckDate,
        overallStreakHistory: parsedData.overallStreakHistory ?? INITIAL_OVERALL_STREAK.overallStreakHistory, // Initialize new field
        dsaTracker: {
          ...parsedData.dsaTracker,
          difficultyProgressHistory: parsedData.dsaTracker.difficultyProgressHistory ?? INITIAL_DSA_TRACKER.difficultyProgressHistory,
        },
        weeklySummaries: parsedData.weeklySummaries ?? INITIAL_WEEKLY_PROGRESS_STATE.weeklySummaries,
        currentWeekNumber: parsedData.currentWeekNumber ?? INITIAL_WEEKLY_PROGRESS_STATE.currentWeekNumber,
        currentWeekStartDate: parsedData.currentWeekStartDate ?? INITIAL_WEEKLY_PROGRESS_STATE.currentWeekStartDate,
        pomodoroSessions: parsedData.pomodoroSessions ?? INITIAL_POMODORO_SESSIONS, // Initialize new field
        appSettings: parsedData.appSettings ?? INITIAL_APP_SETTINGS, // Initialize new field
        pastWeeklyReports: parsedData.pastWeeklyReports ?? INITIAL_PAST_WEEKLY_REPORTS, // Initialize new field
        completedRoadmapTaskIds: parsedData.completedRoadmapTaskIds ?? [], // Initialize new field
        // Ensure weeklySchedule is up-to-date with any new default tasks if it's older
        weeklySchedule: parsedData.weeklySchedule.map(day => {
          const defaultDay = WEEKLY_SCHEDULE.find(wsDay => wsDay.day === day.day);
          return {
            ...day,
            tasks: defaultDay?.tasks.map(wsTask => {
              const existingTask = day.tasks.find(t => t.id === wsTask.id);
              // Merge existing task properties with default, prioritize existing completion/notes
              return existingTask ? { ...wsTask, ...existingTask } : wsTask;
            }) || day.tasks // If default tasks are missing for a day, keep existing
          };
        })
      };
    }
    // Return initial data if nothing is stored
    return {
      userId,
      weeklySchedule: WEEKLY_SCHEDULE.map(day => ({
        ...day,
        tasks: day.tasks.map(task => ({ ...task, isCompleted: false, notes: undefined })) // Ensure tasks are fresh
      })),
      studySessions: [],
      pomodoroSessions: INITIAL_POMODORO_SESSIONS, // Initialize
      progress: INITIAL_PROGRESS,
      dsaTracker: INITIAL_DSA_TRACKER,
      projects: [],
      linkedInReminder: INITIAL_LINKEDIN_REMINDER,
      overallLearningStreak: INITIAL_OVERALL_STREAK.overallLearningStreak,
      lastOverallStreakCheckDate: INITIAL_OVERALL_STREAK.lastOverallStreakCheckDate,
      overallStreakHistory: INITIAL_OVERALL_STREAK.overallStreakHistory, // Initialize
      weeklySummaries: INITIAL_WEEKLY_PROGRESS_STATE.weeklySummaries,
      currentWeekNumber: INITIAL_WEEKLY_PROGRESS_STATE.currentWeekNumber,
      currentWeekStartDate: INITIAL_WEEKLY_PROGRESS_STATE.currentWeekStartDate,
      pastWeeklyReports: INITIAL_PAST_WEEKLY_REPORTS, // Initialize
      appSettings: INITIAL_APP_SETTINGS, // Initialize
      completedRoadmapTaskIds: [], // Initialize
    };
  },

  updateAppData: async (userId: string, data: AppData): Promise<AppData> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    localStorage.setItem(`${DATA_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(data));
    return data;
  },
};

export const useDataService = () => {
  // Although the components fetch data, this hook provides the persistence logic.
  // The actual state management is done in Dashboard.tsx

  // This function is for partial updates, merging with existing data
  const updateDataInLocalStorage = useCallback(async (userId: string, newData: Partial<AppData>) => {
    const currentData = await mockDataApi.getAppData(userId);
    const updatedData: AppData = {
      ...currentData,
      ...newData,
      userId, // Ensure userId is always set
    } as AppData; // Cast to AppData, assuming newData completes the structure

    await mockDataApi.updateAppData(userId, updatedData);
  }, []);

  // This function is for full AppData updates, used during week rollovers
  const updateFullAppData = useCallback(async (userId: string, fullData: AppData): Promise<AppData> => {
    return await mockDataApi.updateAppData(userId, fullData);
  }, []);

  const getAppData = useCallback(async (userId: string): Promise<AppData | null> => {
    return await mockDataApi.getAppData(userId);
  }, []);


  const updateWeeklySchedule = useCallback(async (userId: string, weeklySchedule: DailySchedule[]) => {
    // When schedule updates, also check for roadmap task completions
    const currentData = await mockDataApi.getAppData(userId);
    const completedIds = new Set(currentData?.completedRoadmapTaskIds || []);

    weeklySchedule.forEach(day => {
        day.tasks.forEach(task => {
            if (task.originalRoadmapTaskId) {
                if (task.isCompleted) {
                    completedIds.add(task.originalRoadmapTaskId);
                } else {
                    completedIds.delete(task.originalRoadmapTaskId);
                }
            }
        });
    });

    await updateDataInLocalStorage(userId, { 
        weeklySchedule, 
        completedRoadmapTaskIds: Array.from(completedIds) 
    });
  }, [updateDataInLocalStorage]);

  // New function to toggle roadmap tasks directly
  const updateRoadmapTaskStatus = useCallback(async (userId: string, taskId: string, isCompleted: boolean) => {
    const currentData = await mockDataApi.getAppData(userId);
    if (!currentData) return;

    // Update the set of completed IDs
    const completedIds = new Set(currentData.completedRoadmapTaskIds || []);
    if (isCompleted) {
      completedIds.add(taskId);
    } else {
      completedIds.delete(taskId);
    }

    // Also try to find this task in the weekly schedule and update it if present to ensure consistency
    const updatedWeeklySchedule = currentData.weeklySchedule.map(day => ({
        ...day,
        tasks: day.tasks.map(task => {
            if (task.originalRoadmapTaskId === taskId) {
                return { ...task, isCompleted };
            }
            return task;
        })
    }));

    await updateDataInLocalStorage(userId, {
      completedRoadmapTaskIds: Array.from(completedIds),
      weeklySchedule: updatedWeeklySchedule
    });
  }, [updateDataInLocalStorage]);

  const addStudySession = useCallback(async (userId: string, studySessions: StudySession[]) => {
    await updateDataInLocalStorage(userId, { studySessions });
  }, [updateDataInLocalStorage]);

  const addPomodoroSession = useCallback(async (userId: string, pomodoroSessions: PomodoroSession[]) => {
    await updateDataInLocalStorage(userId, { pomodoroSessions });
  }, [updateDataInLocalStorage]);

  const updateProgress = useCallback(async (userId: string, progress: Progress) => {
    await updateDataInLocalStorage(userId, { progress });
  }, [updateDataInLocalStorage]);

  const updateDSATracker = useCallback(async (userId: string, dsaTracker: DSATracker) => {
    await updateDataInLocalStorage(userId, { dsaTracker });
  }, [updateDataInLocalStorage]);

  const addProject = useCallback(async (userId: string, projects: Project[]) => {
    await updateDataInLocalStorage(userId, { projects });
  }, [updateDataInLocalStorage]);

  const updateProject = useCallback(async (userId: string, projects: Project[]) => {
    await updateDataInLocalStorage(userId, { projects });
  }, [updateDataInLocalStorage]);

  const deleteProject = useCallback(async (userId: string, projects: Project[]) => {
    await updateDataInLocalStorage(userId, { projects });
  }, [updateDataInLocalStorage]);

  const updateLinkedInReminder = useCallback(async (userId: string, linkedInReminder: LinkedInReminder) => {
    await updateDataInLocalStorage(userId, { linkedInReminder });
  }, [updateDataInLocalStorage]);

  const updateOverallLearningStreak = useCallback(async (userId: string, streakData: { overallLearningStreak: number; lastOverallStreakCheckDate: string | null; overallStreakHistory: { date: string; streak: number }[] }) => {
    await updateDataInLocalStorage(userId, { ...streakData });
  }, [updateDataInLocalStorage]);

  const updateAppSettings = useCallback(async (userId: string, appSettings: AppSettings) => {
    await updateDataInLocalStorage(userId, { appSettings });
  }, [updateDataInLocalStorage]);

  return {
    getAppData,
    updateFullAppData, // Expose full app data update for week rollover
    updateWeeklySchedule,
    updateRoadmapTaskStatus, // Expose new function
    addStudySession,
    addPomodoroSession, // Expose new function
    updateProgress,
    updateDSATracker,
    addProject,
    updateProject,
    deleteProject,
    updateLinkedInReminder,
    updateOverallLearningStreak,
    updateAppSettings, // Expose new function
  };
};
