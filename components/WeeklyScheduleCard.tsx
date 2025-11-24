import React, { useState, Fragment, useCallback } from 'react';
import { DailySchedule, DayOfWeek, AppSettings } from '../types';
import Button from './Button';
import ThemeToggle from './ThemeToggle'; // Assuming ThemeToggle can be repurposed or a new toggle component is made.

interface WeeklyScheduleCardProps {
  weeklySchedule: DailySchedule[];
  onToggleTaskCompletion: (day: DayOfWeek, taskId: string) => void;
  onUpdateTaskNotes: (day: DayOfWeek, taskId: string, newNotes: string) => void;
  appSettings: AppSettings; // New prop for app settings
  onUpdateAppSettings: (newSettings: AppSettings) => void; // New prop for updating settings
}

const WeeklyScheduleCard: React.FC<WeeklyScheduleCardProps> = ({
  weeklySchedule,
  onToggleTaskCompletion,
  onUpdateTaskNotes,
  appSettings,
  onUpdateAppSettings,
}) => {
  const [activeDay, setActiveDay] = useState<DayOfWeek | null>(null);
  const [editingNoteTaskId, setEditingNoteTaskId] = useState<string | null>(null);
  const [currentNoteValue, setCurrentNoteValue] = useState<string>('');
  const [videoTooltip, setVideoTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
    url: string;
    platform: string;
  } | null>(null);

  const getPlatformName = (url: string): string => {
    if (url.includes('youtube.com')) return 'YouTube';
    if (url.includes('udemy.com')) return 'Udemy';
    if (url.includes('tapacademy.com')) return 'Tap Academy';
    return 'External Link';
  };

  const handleVideoMouseEnter = useCallback((e: React.MouseEvent, url: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setVideoTooltip({
      visible: true,
      x: rect.right + 10, // Position to the right of the button
      y: rect.top + window.scrollY,
      content: url,
      url: url,
      platform: getPlatformName(url),
    });
  }, []);

  const handleVideoMouseLeave = useCallback(() => {
    setVideoTooltip(null);
  }, []);

  const toggleDay = useCallback((day: DayOfWeek) => {
    setActiveDay(prevDay => (prevDay === day ? null : day));
    setEditingNoteTaskId(null); // Close any open note editors when collapsing a day
    setVideoTooltip(null); // Hide any open video tooltips
  }, []);

  const handleEditNoteClick = useCallback((taskId: string, notes: string | undefined) => {
    setEditingNoteTaskId(taskId);
    setCurrentNoteValue(notes || '');
  }, []);

  const handleSaveNote = useCallback((day: DayOfWeek, taskId: string) => {
    onUpdateTaskNotes(day, taskId, currentNoteValue);
    setEditingNoteTaskId(null);
    setCurrentNoteValue('');
  }, [onUpdateTaskNotes, currentNoteValue]);

  const handleCancelNote = useCallback(() => {
    setEditingNoteTaskId(null);
    setCurrentNoteValue('');
  }, []);

  const toggleAutoReschedule = useCallback(() => {
    onUpdateAppSettings({ ...appSettings, isAutoRescheduleEnabled: !appSettings.isAutoRescheduleEnabled });
  }, [appSettings, onUpdateAppSettings]);


  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 h-full relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Weekly Study Schedule</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Auto Reschedule Missed Tasks:</span>
          <ThemeToggle // Using ThemeToggle's visual component, but for auto-reschedule logic
            isDarkMode={appSettings.isAutoRescheduleEnabled}
            toggleTheme={toggleAutoReschedule}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {weeklySchedule.map(daily => (
          <div key={daily.day} className="border border-gray-200 dark:border-gray-700 rounded-md">
            <button
              onClick={() => toggleDay(daily.day)}
              className="flex justify-between items-center w-full p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-md focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">{daily.day}</h3>
              <svg
                className={`w-5 h-5 text-gray-600 dark:text-gray-300 transform transition-transform duration-200 ${
                  activeDay === daily.day ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {activeDay === daily.day && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <ul className="space-y-3">
                  {daily.tasks.map(task => (
                    <li key={task.id} className="flex flex-col sm:flex-row sm:items-start justify-between">
                      <div className="flex items-start flex-grow mr-2 mb-2 sm:mb-0">
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => onToggleTaskCompletion(daily.day, task.id)}
                          className="mr-3 mt-1 h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <div className="flex flex-col">
                            <span className={`text-gray-800 dark:text-gray-100 font-medium ${task.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''} flex items-center`}>
                                {task.name}
                                {task.videoLink && (
                                    <a
                                        href={task.videoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center"
                                        aria-label={`Start learning for ${task.name}`}
                                        title={`Start learning: ${task.name}`}
                                        onMouseEnter={(e) => handleVideoMouseEnter(e, task.videoLink!)}
                                        onMouseLeave={handleVideoMouseLeave}
                                    >
                                        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.362 1.627-.935l14.25 7.125c.683.342.683 1.288 0 1.63l-14.25 7.125c-.71.427-1.627-.078-1.627-.935V5.653Z" />
                                        </svg>
                                        Learn
                                    </a>
                                )}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {task.estimatedTime} hours
                            </span>
                             {editingNoteTaskId === task.id ? (
                                <div className="mt-2 flex flex-col sm:flex-row sm:items-center w-full">
                                    <textarea
                                        className="block w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm flex-grow"
                                        value={currentNoteValue}
                                        onChange={(e) => setCurrentNoteValue(e.target.value)}
                                        rows={2}
                                        placeholder="Add notes..."
                                    />
                                    <div className="flex mt-2 sm:mt-0 sm:ml-2 space-x-1">
                                        <Button size="sm" onClick={() => handleSaveNote(daily.day, task.id)}>Save</Button>
                                        <Button variant="secondary" size="sm" onClick={handleCancelNote}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center mt-1">
                                    {task.notes && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 italic">
                                            Notes: {task.notes}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleEditNoteClick(task.id, task.notes)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        title="Edit Note"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                      </div>
                      <Button
                        onClick={() => onToggleTaskCompletion(daily.day, task.id)}
                        variant={task.isCompleted ? 'secondary' : 'primary'}
                        size="sm"
                        className="flex-shrink-0"
                      >
                        {task.isCompleted ? 'Undo' : 'Mark Done'}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {videoTooltip && videoTooltip.visible && (
        <div
          className="absolute z-50 px-3 py-2 bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900 text-sm rounded-md shadow-lg pointer-events-none"
          style={{
            left: videoTooltip.x,
            top: videoTooltip.y,
            transform: 'translateX(0%) translateY(-50%)', // Align vertically with cursor
            whiteSpace: 'nowrap', // Prevent content from wrapping
          }}
        >
          <p className="font-semibold">{videoTooltip.platform}</p>
          <p className="truncate max-w-xs">{videoTooltip.url}</p> {/* Truncate long URLs */}
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleCard;