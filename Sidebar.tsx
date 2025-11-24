
import React, { useCallback } from 'react';
import { User } from '../types';

interface SidebarProps {
  user: User;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onNavigate, currentPage }) => {
  const navLinks = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Roadmap (12-Mo)', id: 'roadmap' }, // New navigation item
    { name: 'Weekly Schedule', id: 'weekly-schedule' },
    { name: 'Study Timer', id: 'study-timer' },
    { name: 'Progress', id: 'progress' },
    { name: 'DSA Tracker', id: 'dsa-tracker' },
    { name: 'Project Tracker', id: 'project-tracker' },
    { name: 'Kanban Board', id: 'projects-kanban' }, 
    { name: 'LinkedIn', id: 'linkedin' },
    { name: 'Calendar', id: 'calendar' },
    { name: 'Skill Tree', id: 'skill-tree' },
  ];

  const handleNavLinkClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    // These IDs correspond to full pages or significant views that handle their own routing/scrolling
    if (id === 'projects-kanban' || id === 'skill-tree' || id === 'dashboard' || id === 'roadmap') {
      onNavigate(id); 
    } else {
      // For sections within the dashboard, scroll to them
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      onNavigate('dashboard'); // Ensure dashboard is active for internal scrolls
    }
  }, [onNavigate]);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-800 dark:bg-gray-900 text-gray-100 p-4 shadow-xl">
      <div className="flex items-center justify-center h-16 border-b border-gray-700 dark:border-gray-800 mb-4">
        <h2 className="text-2xl font-bold text-blue-400">Roadmap Tracker</h2>
      </div>

      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700 dark:bg-gray-800 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">
          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold">{user.name || user.email.split('@')[0]}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleNavLinkClick(e, link.id)}
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-200 dark:text-gray-300
              ${(currentPage === link.id || (link.id === 'dashboard' && currentPage === 'dashboard')) ? 'bg-blue-600 dark:bg-blue-700 text-white' : 'hover:bg-gray-700 dark:hover:bg-gray-700'}`}
          >
            {/* You can add icons here for each module */}
            <span className="ml-3 text-sm font-medium">{link.name}</span>
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700 dark:border-gray-800 text-xs text-gray-400 text-center">
        &copy; {new Date().getFullYear()} My Learning Roadmap
      </div>
    </aside>
  );
};

export default Sidebar;
