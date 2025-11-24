import React, { useState, useCallback } from 'react';
import { Project, ProjectStatus } from '../types';
import Button from '../components/Button'; // Assuming Button component is available

interface ProjectsKanbanPageProps {
  projects: Project[];
  onUpdateProject: (project: Project) => void;
  onNavigate: (page: string) => void;
}

const ProjectsKanbanPage: React.FC<ProjectsKanbanPageProps> = ({ projects, onUpdateProject, onNavigate }) => {
  const [draggingProject, setDraggingProject] = useState<Project | null>(null);

  const columns: { status: ProjectStatus; title: string; color: string }[] = [
    { status: 'Not Started', title: 'To Do', color: 'bg-gray-200 dark:bg-gray-700' },
    { status: 'In Progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900' },
    { status: 'Completed', title: 'Done', color: 'bg-green-100 dark:bg-green-900' },
  ];

  const handleDragStart = useCallback((e: React.DragEvent, project: Project) => {
    setDraggingProject(project);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, newStatus: ProjectStatus) => {
      e.preventDefault();
      if (draggingProject) {
        if (draggingProject.status !== newStatus) {
          const updatedProject = { ...draggingProject, status: newStatus };
          onUpdateProject(updatedProject);
        }
        setDraggingProject(null);
      }
    },
    [draggingProject, onUpdateProject],
  );

  const getStatusColorClass = (status: ProjectStatus) => {
    switch (status) {
      case 'Not Started': return 'text-gray-800 dark:text-gray-200';
      case 'In Progress': return 'text-blue-800 dark:text-blue-200';
      case 'Completed': return 'text-green-800 dark:text-green-200';
      default: return '';
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Projects Kanban Board</h1>
        <Button onClick={() => onNavigate('dashboard')} variant="secondary">
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.status}
            className={`rounded-lg shadow-md p-4 ${column.color}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <h2 className={`text-xl font-semibold mb-4 ${getStatusColorClass(column.status)}`}>
              {column.title} ({projects.filter((p) => p.status === column.status).length})
            </h2>
            <div className="space-y-4 min-h-[100px]">
              {projects
                .filter((p) => p.status === column.status)
                .map((project) => (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, project)}
                    className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {project.description.substring(0, 100)}
                        {project.description.length > 100 ? '...' : ''}
                      </p>
                    )}
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full
                                        ${column.status === 'Not Started' ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300' : ''}
                                        ${column.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' : ''}
                                        ${column.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : ''}
                                    `}
                    >
                      {project.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsKanbanPage;