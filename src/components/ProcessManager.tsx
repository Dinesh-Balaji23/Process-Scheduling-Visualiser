import React from 'react';
import { Plus } from 'lucide-react';
import { Process } from '../types';

interface ProcessManagerProps {
  processes: Process[];
  onAddProcess: () => void;
}

export const ProcessManager: React.FC<ProcessManagerProps> = ({
  processes,
  onAddProcess,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Processes</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{processes.length} processes</span>
      </div>
      <div className="space-y-3">
        <button
          onClick={onAddProcess}
          className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
        >
          <Plus size={18} className="mr-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
          <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300">Add Process</span>
        </button>
      </div>
    </div>
  );
};