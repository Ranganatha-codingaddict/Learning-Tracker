
import React, { useCallback, useState, useEffect } from 'react';
import RoadmapExcelGrid from '../components/RoadmapExcelGrid';
import { FULL_LEARNING_ROADMAP } from '../constants';
import { RoadmapWeek, DailySchedule, ScheduleTask } from '../types';
import Button from '../components/Button';
import { useDataService } from '../services/dataService';
import { User } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

interface RoadmapPageProps {
  user: User;
  onNavigate: (page: string) => void;
}

const RoadmapPage: React.FC<RoadmapPageProps> = ({ user, onNavigate }) => {
  const { updateWeeklySchedule, getAppData, updateRoadmapTaskStatus } = useDataService();
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [scheduledTaskIds, setScheduledTaskIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const data = await getAppData(user.id);
        if (data) {
            if (data.completedRoadmapTaskIds) {
                setCompletedTaskIds(data.completedRoadmapTaskIds);
            }
            
            // Identify tasks currently in the weekly schedule
            const activeIds = new Set<string>();
            data.weeklySchedule.forEach(day => {
                day.tasks.forEach(task => {
                    if (task.originalRoadmapTaskId) {
                        activeIds.add(task.originalRoadmapTaskId);
                    }
                });
            });
            setScheduledTaskIds(Array.from(activeIds));
        }
        setLoading(false);
    };
    fetchData();
  }, [user.id, getAppData]);

  const handleSyncWeek = useCallback(async (week: RoadmapWeek) => {
    if (window.confirm(`Are you sure you want to load Week ${week.weekNumber} into your main dashboard? This will replace your current weekly schedule.`)) {
        // Transform RoadmapWeek to DailySchedule[]
        const newSchedule: DailySchedule[] = week.days.map(rDay => {
            const tasks: ScheduleTask[] = rDay.tasks.map((rTask, index) => ({
                id: `sync-w${week.weekNumber}-${rDay.day}-${index}-${Date.now()}`,
                name: `${rTask.domain}: ${rTask.topic} - ${rTask.taskDescription}`,
                estimatedTime: rTask.durationHours,
                isCompleted: false, // Start as not completed when synced to dashboard
                notes: `Source: Month ${Math.ceil(week.weekNumber / 4)}, Week ${week.weekNumber}`,
                originalRoadmapTaskId: rTask.id // Link back to original static ID
            }));
            return {
                day: rDay.day,
                tasks: tasks
            };
        });

        // Ensure all 7 days exist even if roadmap data is partial
        const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const fullSchedule: DailySchedule[] = days.map(dayName => {
            const existing = newSchedule.find(d => d.day === dayName);
            return existing || { day: dayName as any, tasks: [] };
        });

        await updateWeeklySchedule(user.id, fullSchedule);
        alert(`Week ${week.weekNumber} loaded successfully!`);
        onNavigate('dashboard');
    }
  }, [user.id, updateWeeklySchedule, onNavigate]);

  const handleToggleTaskCompletion = useCallback(async (taskId: string, isCompleted: boolean) => {
    // Update local state immediately for responsiveness
    setCompletedTaskIds(prev => 
        isCompleted ? [...prev, taskId] : prev.filter(id => id !== taskId)
    );
    // Persist to backend
    await updateRoadmapTaskStatus(user.id, taskId, isCompleted);
  }, [user.id, updateRoadmapTaskStatus]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">12-Month Learning Roadmap</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
                Full-stack + Cloud + DevOps + GenAI (6 hours/day)
            </p>
        </div>
        <Button onClick={() => onNavigate('dashboard')} variant="secondary">
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Current Phase: Phase 1 (Months 1–4)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Focus on core Full-stack skills, Java/Spring Boot, AWS basics, and introductory Generative AI with Python.
            </p>
        </div>
      </div>

      <RoadmapExcelGrid 
        roadmap={FULL_LEARNING_ROADMAP} 
        onSyncWeek={handleSyncWeek} 
        completedTaskIds={completedTaskIds}
        scheduledTaskIds={scheduledTaskIds}
        onToggleTaskCompletion={handleToggleTaskCompletion}
      />
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Tip: Click "Sync Week" to load a week's tasks into your Dashboard.</p>
        <p>
            <span className="inline-block w-3 h-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 mr-1 rounded-sm"></span>
            Highlighted tasks are currently scheduled in your Dashboard.
        </p>
        <p>Marking tasks as done here (or in Dashboard) updates your progress everywhere.</p>
      </div>
    </div>
  );
};

export default RoadmapPage;
