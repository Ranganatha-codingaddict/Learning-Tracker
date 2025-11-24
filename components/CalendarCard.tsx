import React, { useState, useMemo } from 'react';
import { StudySession, Project } from '../types';
import { getFormattedDate } from '../utils/dateUtils';

interface CalendarCardProps {
  studySessions: StudySession[];
  projects: Project[];
}

const CalendarCard: React.FC<CalendarCardProps> = ({ studySessions, projects }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0 for Sunday, 1 for Monday

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const dayEvents = useMemo(() => {
    const events: { [date: string]: { study: boolean; projectMilestones: Project[] } } = {};

    studySessions.forEach(session => {
      const dateKey = session.date;
      if (!events[dateKey]) events[dateKey] = { study: false, projectMilestones: [] };
      events[dateKey].study = true;
    });

    projects.forEach(project => {
      if (project.milestoneDate) {
        const dateKey = project.milestoneDate;
        if (!events[dateKey]) events[dateKey] = { study: false, projectMilestones: [] };
        events[dateKey].projectMilestones.push(project);
      }
    });
    return events;
  }, [studySessions, projects]);

  const renderDays = () => {
    const days = [];
    const numDays = daysInMonth(currentMonth);
    const startDay = firstDayOfMonth(currentMonth); // Adjust to make Monday the first day (0 for Mon, 6 for Sun)
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1; // Convert 0 (Sun) to 6, others -1

    // Fill leading empty days
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(<div key={`empty-prev-${i}`} className="p-2 text-center text-gray-400 dark:text-gray-600"></div>);
    }

    // Fill days of the month
    for (let i = 1; i <= numDays; i++) {
      const date = new Date(year, currentMonth.getMonth(), i);
      const formattedDate = getFormattedDate(date);
      const event = dayEvents[formattedDate];
      const hasStudy = event?.study;
      const hasMilestone = event?.projectMilestones.length > 0;

      const isToday = formattedDate === getFormattedDate(new Date());

      days.push(
        <div
          key={`day-${i}`}
          className={`p-2 text-center relative border border-gray-200 dark:border-gray-700
            ${isToday ? 'bg-blue-100 dark:bg-blue-800 font-bold' : ''}
            ${hasStudy ? 'bg-green-100 dark:bg-green-800' : ''}
            ${hasMilestone ? 'bg-purple-100 dark:bg-purple-800' : ''}
            ${hasStudy && hasMilestone ? 'bg-gradient-to-br from-green-100 to-purple-100 dark:from-green-800 dark:to-purple-800' : ''}
            `}
        >
          <span className="text-sm md:text-base">{i}</span>
          {(hasStudy || hasMilestone) && (
            <div className="absolute top-1 right-1 flex space-x-1">
              {hasStudy && <span className="w-2 h-2 rounded-full bg-green-500" title="Study Session"></span>}
              {hasMilestone && <span className="w-2 h-2 rounded-full bg-purple-500" title="Project Milestone"></span>}
            </div>
          )}
          {event?.projectMilestones.length > 0 && (
            <div className="absolute bottom-1 left-1 right-1 text-xs text-center truncate">
              {event.projectMilestones.map(p => (
                <span key={p.id} className="block text-purple-700 dark:text-purple-300" title={p.name}>
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Calendar View</h2>
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">{monthName} {year}</h3>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 text-center font-medium text-gray-600 dark:text-gray-300 mb-2">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>
      <div className="grid grid-cols-7 flex-grow">
        {renderDays()}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span className="text-gray-700 dark:text-gray-300">Study Session</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
          <span className="text-gray-700 dark:text-gray-300">Project Milestone</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          <span className="text-gray-700 dark:text-gray-300">Today</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;