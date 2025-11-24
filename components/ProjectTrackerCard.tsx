import React, { useState, useCallback, useMemo } from 'react';
import { Project, ProjectStatus, ProjectTask } from '../types';
import Button from './Button';
import Modal from './Modal';
import InputField from './InputField';
import { getFormattedDate } from '../utils/dateUtils';

interface ProjectTrackerCardProps {
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id' | 'userId'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  aiGenerateSubtasks: (taskName: string) => ProjectTask[]; // New prop for AI subtask generation
}

const ProjectTrackerCard: React.FC<ProjectTrackerCardProps> = ({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  aiGenerateSubtasks,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('Not Started');
  const [githubLink, setGithubLink] = useState('');
  const [projectMilestoneDate, setProjectMilestoneDate] = useState('');
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const openAddModal = useCallback(() => {
    setEditingProject(null);
    setProjectName('');
    setProjectDescription('');
    setProjectStatus('Not Started');
    setGithubLink('');
    setProjectMilestoneDate('');
    setProjectTasks([]);
    setNewTaskDescription('');
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description);
    setProjectStatus(project.status);
    setGithubLink(project.githubLink || '');
    setProjectMilestoneDate(project.milestoneDate || '');
    setProjectTasks(project.tasks || []);
    setNewTaskDescription('');
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSaveProject = useCallback(() => {
    if (!projectName.trim()) return;

    const projectData: Omit<Project, 'id' | 'userId'> = {
      name: projectName,
      description: projectDescription,
      status: projectStatus,
      githubLink: githubLink || undefined,
      tasks: projectTasks,
      milestoneDate: projectMilestoneDate || undefined,
    };

    if (editingProject) {
      onUpdateProject({ ...editingProject, ...projectData });
    } else {
      onAddProject(projectData);
    }
    closeModal();
  }, [
    projectName,
    projectDescription,
    projectStatus,
    githubLink,
    projectTasks,
    projectMilestoneDate,
    editingProject,
    onAddProject,
    onUpdateProject,
    closeModal,
  ]);

  const handleAddTask = useCallback(() => {
    if (newTaskDescription.trim()) {
      setProjectTasks(prev => [...prev, { id: Date.now().toString(), description: newTaskDescription, isCompleted: false }]);
      setNewTaskDescription('');
    }
  }, [newTaskDescription]);

  const handleGenerateSubtasks = useCallback(() => {
    if (projectName.trim() && aiGenerateSubtasks) {
      const generated = aiGenerateSubtasks(projectName.trim());
      setProjectTasks(prev => [...prev, ...generated]);
    }
  }, [projectName, aiGenerateSubtasks]);

  const handleToggleTaskCompletion = useCallback((taskId: string) => {
    setProjectTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task))
    );
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setProjectTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Not Started':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const sortedProjects = useMemo(() => {
    const statusOrder: { [key in ProjectStatus]: number } = {
      'In Progress': 1,
      'Not Started': 2,
      'Completed': 3,
    };
    return [...projects].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [projects]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Project Tracker</h2>
        <Button onClick={openAddModal} size="sm">
          Add Project
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {sortedProjects.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No projects added yet.</p>
        ) : (
          <div className="space-y-4">
            {sortedProjects.map((project) => (
              <div key={project.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{project.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => openEditModal(project)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDeleteProject(project.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                {project.description && <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{project.description}</p>}
                {project.githubLink && (
                  <p className="text-sm mb-2">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      GitHub Link
                    </a>
                  </p>
                )}
                {project.milestoneDate && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Milestone: {project.milestoneDate}
                  </p>
                )}
                {project.tasks && project.tasks.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-gray-700 dark:text-gray-300">Tasks:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                      {project.tasks.map(task => (
                        <li key={task.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => handleToggleTaskCompletion(task.id)}
                            className="mr-2 rounded dark:bg-gray-600 dark:border-gray-500 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={task.isCompleted ? 'line-through text-gray-400' : ''}>
                            {task.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProject ? 'Edit Project' : 'Add New Project'}>
        <div className="p-4">
          <InputField
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          {/* Replaced InputField with native textarea as InputField does not support 'as="textarea"' prop */}
          <div className="mb-4">
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="projectStatus"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value as ProjectStatus)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <InputField
            label="GitHub Link"
            type="url"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
          <InputField
            label="Milestone Date"
            type="date"
            value={projectMilestoneDate}
            onChange={(e) => setProjectMilestoneDate(e.target.value)}
          />

          <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mt-4 mb-2">Project Tasks</h4>
          <div className="flex items-center mb-4">
            <InputField
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Add new task..."
              className="flex-grow mr-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTask();
                }
              }}
            />
            <Button onClick={handleAddTask}>Add Task</Button>
          </div>
          {projectName.trim() && ( // Only show AI button if project name is entered
            <Button
              onClick={handleGenerateSubtasks}
              variant="secondary"
              size="sm"
              className="w-full mb-4"
              disabled={!projectName.trim()}
            >
              Break Down with AI
            </Button>
          )}

          {projectTasks.length > 0 && (
            <ul className="space-y-2 mb-4">
              {projectTasks.map(task => (
                <li key={task.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleToggleTaskCompletion(task.id)}
                      className="mr-2 rounded dark:bg-gray-600 dark:border-gray-500 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}>
                      {task.description}
                    </span>
                  </label>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <Button onClick={handleSaveProject} className="w-full mt-4">
            {editingProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectTrackerCard;