import React, { useState, useEffect, useCallback } from 'react';
import { LinkedInReminder, DailySchedule, StudySession } from '../types';
import Button from './Button';
import Modal from './Modal';
import { getFormattedDate } from '../utils/dateUtils';

interface LinkedInReminderCardProps {
  linkedInReminder: LinkedInReminder;
  onUpdateLinkedInReminder: (reminder: LinkedInReminder) => void;
  weeklySchedule: DailySchedule[]; // New prop for AI post generation
  studySessions: StudySession[]; // New prop for AI post generation
}

const LinkedInReminderCard: React.FC<LinkedInReminderCardProps> = ({
  linkedInReminder,
  onUpdateLinkedInReminder,
  weeklySchedule,
  studySessions,
}) => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<string | null>(null); // State for AI generated post
  const today = getFormattedDate(new Date());

  const hasPostedToday = linkedInReminder.lastPostedDate === today;

  const calculateStreak = useCallback(() => {
    if (!linkedInReminder.lastPostedDate) return 0;

    let currentStreak = 0;
    let checkDate = new Date(linkedInReminder.lastPostedDate);

    // Check if posted today
    if (getFormattedDate(checkDate) === today) {
        currentStreak = 1;
    }

    // Check previous days
    let prevDate = new Date(checkDate);
    prevDate.setDate(prevDate.getDate() - 1); // Go back one day

    while (
        getFormattedDate(prevDate) === getFormattedDate(new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate() - currentStreak))
    ) {
        currentStreak++;
        prevDate.setDate(prevDate.getDate() - 1);
    }
    return currentStreak;
  }, [linkedInReminder.lastPostedDate, today]);


  // Only update streak if it changes, not on every render
  useEffect(() => {
    const newStreak = calculateStreak();
    if (newStreak !== linkedInReminder.streak) {
      onUpdateLinkedInReminder({ ...linkedInReminder, streak: newStreak });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedInReminder.lastPostedDate, today, calculateStreak]); // Only recalculate if lastPostedDate or today changes

  const markAsPosted = useCallback(() => {
    let newStreak = linkedInReminder.streak;
    if (linkedInReminder.lastPostedDate === getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 1)))) {
      // Posted yesterday, increment streak
      newStreak++;
    } else if (linkedInReminder.lastPostedDate !== today) {
      // Not posted today or yesterday, start new streak if posted today
      newStreak = 1;
    } // If already posted today, streak doesn't change

    onUpdateLinkedInReminder({
      ...linkedInReminder,
      lastPostedDate: today,
      streak: newStreak,
      dailyTemplate: generatedPost || linkedInReminder.dailyTemplate, // Save generated post as new template
    });
    setGeneratedPost(null); // Clear generated post after marking as posted
    setShowReminderModal(false);
  }, [linkedInReminder, onUpdateLinkedInReminder, today, generatedPost]);

  const generateAIPost = useCallback(() => {
    const currentDayName = new Date().toLocaleString('en-US', { weekday: 'long' });
    const todaySchedule = weeklySchedule.find(daily => daily.day === currentDayName);
    const completedTasks = todaySchedule?.tasks.filter(task => task.isCompleted).map(task => task.name) || [];
    const todayStudyDurationMs = studySessions.filter(session => session.date === today)
                                              .reduce((sum, session) => sum + session.duration, 0);
    const todayStudyHours = (todayStudyDurationMs / (1000 * 60 * 60)).toFixed(1);

    let post = "Today's learning journey:\n\n";
    if (completedTasks.length > 0) {
      post += "🚀 Completed tasks:\n";
      completedTasks.forEach(task => post += `- ${task}\n`);
    } else {
      post += "📚 Focused on foundational concepts and planning.\n";
    }

    if (parseFloat(todayStudyHours) > 0) {
      post += `\n⏰ Spent ${todayStudyHours} hours diving deep into coding and concepts.\n`;
    }

    post += "\nFeeling productive and ready for the next challenge! #CodingJourney #DeveloperLife #LearningAndGrowing";
    setGeneratedPost(post);
  }, [weeklySchedule, studySessions, today]);

  const copyTemplate = useCallback(() => {
    const textToCopy = generatedPost || linkedInReminder.dailyTemplate;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  }, [linkedInReminder.dailyTemplate, generatedPost]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">LinkedIn Reminder</h2>
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Posting Streak: <span className="font-bold text-blue-600 dark:text-blue-400">{linkedInReminder.streak} days</span>
          </p>
          {hasPostedToday ? (
            <p className="text-green-600 dark:text-green-400 font-medium">You've posted today! Keep up the great work.</p>
          ) : (
            <p className="text-red-600 dark:text-red-400 font-medium">Don't forget to post on LinkedIn today!</p>
          )}
        </div>
      </div>
      <Button
        onClick={() => setShowReminderModal(true)}
        className="w-full mt-4"
        variant={hasPostedToday ? 'secondary' : 'primary'}
      >
        {hasPostedToday ? 'View Post Ideas' : 'Daily Post Reminder'}
      </Button>

      <Modal isOpen={showReminderModal} onClose={() => setShowReminderModal(false)} title="LinkedIn Daily Post">
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">Daily Post Template:</p>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-4 relative">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{generatedPost || linkedInReminder.dailyTemplate}</pre>
            <Button
              size="sm"
              variant="outline"
              onClick={copyTemplate}
              className="absolute top-2 right-2 px-2 py-1 text-xs"
            >
              {copiedTemplate ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          {!hasPostedToday && (
            <Button
              onClick={generateAIPost}
              variant="secondary"
              className="w-full mb-4"
            >
              Generate Today's Post with AI
            </Button>
          )}

          <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">Post Ideas:</p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 mb-4">
            {linkedInReminder.postIdeas.map((idea, index) => (
              <li key={index} className="mb-1 text-sm">{idea}</li>
            ))}
          </ul>

          <Button
            onClick={markAsPosted}
            className="w-full"
            variant={hasPostedToday ? 'secondary' : 'primary'}
            disabled={hasPostedToday}
          >
            {hasPostedToday ? 'Already Posted Today' : 'Mark as Posted Today'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default LinkedInReminderCard;