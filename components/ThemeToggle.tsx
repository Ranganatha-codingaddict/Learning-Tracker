import React from 'react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-700"
      role="switch"
      aria-checked={isDarkMode}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        aria-hidden="true"
        className={`${
          isDarkMode ? 'translate-x-5' : 'translate-x-0'
        }
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-gray-200 shadow transform ring-0 transition ease-in-out duration-200`}
      >
        <svg
          className={`${
            isDarkMode ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
          }
            absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h1M3 12H2m15.354 5.354l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <svg
          className={`${
            isDarkMode ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
          }
            absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;