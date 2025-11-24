

import React from 'react';
import { User } from '../types';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center space-x-3">
         {/* Small mobile-only or extra avatar if wanted, keeping standard layout */}
         <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center md:hidden">
            {user.photoUrl ? (
                <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <span className="text-sm font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
            )}
         </div>
         <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
            Welcome, {user.name || user.email.split('@')[0]}!
         </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Button onClick={onLogout} variant="secondary" size="sm">
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;