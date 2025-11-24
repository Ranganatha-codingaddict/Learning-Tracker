
import React, { useMemo } from 'react';
import { Progress, DailySchedule, SkillTree, SkillNode } from '../types';
import { SKILL_TREE_DATA } from '../constants'; // Import the full skill tree data
import Button from '../components/Button';

interface SkillTreePageProps {
  progress: Progress;
  weeklySchedule: DailySchedule[];
  skillTreeData: typeof SKILL_TREE_DATA; // Use typeof to ensure correct type
  onNavigate: (page: string) => void;
}

const SkillTreePage: React.FC<SkillTreePageProps> = ({
  progress,
  weeklySchedule,
  skillTreeData,
  onNavigate,
}) => {
  // Memoize the processed skill tree to determine completion status
  const processedSkillTree = useMemo(() => {
    const allCompletedTaskIds = new Set<string>();
    weeklySchedule.forEach(day => {
      day.tasks.filter(task => task.isCompleted).forEach(task => allCompletedTaskIds.add(task.id));
    });

    const categories: { [key: string]: SkillNode[] } = {};

    Object.keys(skillTreeData).forEach(categoryKey => {
      const nodes = skillTreeData[categoryKey as keyof typeof skillTreeData];
      categories[categoryKey] = nodes.map(node => {
        let isNodeCompleted = false;

        // Rule 1: Completion based on related tasks
        if (node.relatedTasks && node.relatedTasks.every(taskId => allCompletedTaskIds.has(taskId))) {
          isNodeCompleted = true;
        }

        // Rule 2: Completion based on progress field (if progress > 0 for this area)
        if (node.relatedProgressField && progress[node.relatedProgressField] > 0) {
          isNodeCompleted = true;
        }

        // Rule 3: For categories without specific tasks/progress, consider as a tree: children completion
        // (This can be more complex, e.g., all children completed, or specific children)
        // For this mock, we'll keep it simple: if tasks/progress exist, use that.
        // Otherwise, it's just a label.

        return { ...node, isCompleted: isNodeCompleted };
      });
    });

    // Simple prerequisite check: If a node has prereqs, its actual completion implies prereqs are met.
    // For visual purposes, we can grey out if prereqs are not completed.
    const nodesMap = new Map<string, SkillNode>();
    Object.values(categories).flat().forEach(node => nodesMap.set(node.id, node));

    Object.values(categories).flat().forEach(node => {
        if (node.prerequisites && node.prerequisites.length > 0) {
            const allPrereqsMet = node.prerequisites.every(preId => nodesMap.get(preId)?.isCompleted);
            // If a node itself is completed, it implies its prereqs were met.
            // If its prereqs are NOT met, we might visually show it as unachievable yet.
            // For now, `isCompleted` is driven by tasks/progress.
            // We can add a `isAchievable` flag if needed for deeper logic.
        }
    });


    return categories;
  }, [progress, weeklySchedule, skillTreeData]);

  // Recursively render skill nodes
  const renderSkillNode = (node: SkillNode, level: number) => (
    <div key={node.id} className={`relative flex items-center mb-2 ml-${level * 4}`}>
      <div
        className={`w-4 h-4 rounded-full mr-2 flex-shrink-0
          ${node.isCompleted ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}
        title={node.isCompleted ? 'Completed' : 'Pending'}
      ></div>
      <span className={`text-sm font-medium ${node.isCompleted ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
        {node.name}
      </span>
    </div>
  );


  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Skill Tree View</h1>
        <Button onClick={() => onNavigate('dashboard')} variant="secondary">
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(processedSkillTree).map(([category, nodes]: [string, SkillNode[]]) => (
          <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">{category}</h2>
            <div className="space-y-2">
              {nodes.map(node => renderSkillNode(node, 0))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
        <p className="font-semibold mb-2">How skill completion is determined:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>A skill is marked completed if all its related weekly tasks are done.</li>
          <li>A skill is also marked completed if its associated progress field (e.g., 'Full-Stack' progress) is greater than 0.</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillTreePage;