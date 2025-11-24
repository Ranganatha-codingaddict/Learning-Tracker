import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Progress, DSATracker, Project, DailySchedule, AIRecommendation } from '../types';
import Button from './Button';

interface AIRecommendationsCardProps {
  progress: Progress;
  dsaTracker: DSATracker;
  projects: Project[];
  weeklySchedule: DailySchedule[];
}

const AIRecommendationsCard: React.FC<AIRecommendationsCardProps> = ({
  progress,
  dsaTracker,
  projects,
  weeklySchedule,
}) => {
  const [currentRecommendations, setCurrentRecommendations] = useState<AIRecommendation[]>([]);

  const generateRecommendations = useCallback(() => {
    const recommendations: AIRecommendation[] = [];

    // 1. Weak Topics (based on low progress or incomplete tasks)
    const weakProgressAreas = Object.keys(progress).filter(
      (key) => progress[key as keyof Progress] < 70 && key !== 'dsa' // DSA is count-based
    );
    if (weakProgressAreas.length > 0) {
      const topic = weakProgressAreas[Math.floor(Math.random() * weakProgressAreas.length)];
      recommendations.push({
        type: 'weakTopic',
        title: `Focus on ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
        description: `Your ${topic} progress is below 70%. Review core concepts or tackle related tasks.`,
        link: '#progress',
      });
    }

    // 2. What to study today (incomplete tasks)
    const currentDayName = new Date().toLocaleString('en-US', { weekday: 'long' });
    const todaySchedule = weeklySchedule.find(daily => daily.day === currentDayName);
    const incompleteTasks = todaySchedule?.tasks.filter(task => !task.isCompleted) || [];

    if (incompleteTasks.length > 0) {
      const task = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
      recommendations.push({
        type: 'study',
        title: `Complete "${task.name}"`,
        description: `You have an incomplete task scheduled for today. Estimated time: ${task.estimatedTime} hours.`,
        link: '#weekly-schedule',
      });
    }

    // 3. Recommended DSA problems (based on target/streak)
    if (dsaTracker.todayProblems < 3 && dsaTracker.weeklyTarget > dsaTracker.totalSolved) {
      recommendations.push({
        type: 'dsa',
        title: 'Solve more DSA problems!',
        description: `You've solved ${dsaTracker.todayProblems} today. Aim for your weekly target of ${dsaTracker.weeklyTarget}.`,
        link: 'https://leetcode.com/',
      });
    }

    // 4. Project task to finish
    const projectsInProgress = projects.filter(p => p.status === 'In Progress');
    if (projectsInProgress.length > 0) {
      const project = projectsInProgress[Math.floor(Math.random() * projectsInProgress.length)];
      const incompleteProjectTasks = project.tasks.filter(t => !t.isCompleted);
      if (incompleteProjectTasks.length > 0) {
        const task = incompleteProjectTasks[Math.floor(Math.random() * incompleteProjectTasks.length)];
        recommendations.push({
          type: 'project',
          title: `Work on "${task.description}" for ${project.name}`,
          description: `This task is part of your "${project.name}" project. Let's make progress!`,
          link: '#project-tracker',
        });
      }
    }

    // Fallback if no specific recommendations
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'study',
        title: 'Keep up the great work!',
        description: 'You\'re on track! Consider reviewing past topics or exploring new ones.',
        link: '#dashboard',
      });
    }

    setCurrentRecommendations(recommendations);
  }, [progress, dsaTracker, projects, weeklySchedule]);

  useEffect(() => {
    generateRecommendations(); // Generate on initial load
    // Re-generate if relevant data changes (can be optimized if too frequent)
  }, [progress, dsaTracker, projects, weeklySchedule, generateRecommendations]);


  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">AI Study Recommendations</h2>

      {currentRecommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-gray-500 dark:text-gray-400">
          <p className="mb-2">Generating personalized insights...</p>
          {/* A simple spinner here would be good */}
        </div>
      ) : (
        <div className="space-y-4">
          {currentRecommendations.map((rec, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{rec.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{rec.description}</p>
              {rec.link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(rec.link, '_blank')}
                  className="mt-3 text-xs"
                >
                  Go to Resource
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      <Button onClick={generateRecommendations} variant="secondary" size="sm" className="mt-4 w-full">
        Refresh Recommendations
      </Button>
    </div>
  );
};

export default AIRecommendationsCard;