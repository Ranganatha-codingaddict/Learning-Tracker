
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import SkillTreePage from './pages/SkillTreePage'; // Ensure imports
import ProjectsKanbanPage from './pages/ProjectsKanbanPage'; // Ensure imports
import RoadmapPage from './pages/RoadmapPage'; // Import RoadmapPage
import AuthForm from './components/AuthForm';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './services/authService';
import { User } from './types';
import { SKILL_TREE_DATA } from './constants'; // Import constants if needed for direct page props

const App: React.FC = () => {
  const { user, loading, login, signup, logout, checkAuth } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [currentPage, setCurrentPage] = useState<string>('dashboard'); // State for controlling pages

  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <AuthForm onLogin={login} onSignup={signup} />
      </div>
    );
  }

  // Helper to render current page content
  const renderContent = () => {
      switch (currentPage) {
          case 'roadmap':
              return <RoadmapPage user={user} onNavigate={handleNavigate} />;
          case 'dashboard':
              return <Dashboard user={user} currentPage={currentPage} onNavigate={handleNavigate} />;
          // Note: Dashboard usually handles its own sub-routing for these if passed as props, 
          // but if we want distinct full-page views we can render them here too.
          // However, Dashboard.tsx handles "skill-tree" and "projects-kanban" internally based on props,
          // OR we can lift them up here. 
          // The current Dashboard implementation looks at `currentPage` prop to conditionally render.
          // So passing `dashboard` (or `skill-tree`) to the Dashboard component handles it.
          // BUT, to be cleaner, let's route explicitly if Dashboard doesn't catch it.
          default:
              return <Dashboard user={user} currentPage={currentPage} onNavigate={handleNavigate} />;
      }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} onNavigate={handleNavigate} currentPage={currentPage} />
      <div className="flex flex-col flex-1 overflow-auto">
        <Header user={user} onLogout={logout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
           {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
