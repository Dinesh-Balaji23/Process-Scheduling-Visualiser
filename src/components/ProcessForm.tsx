import React from 'react';
import { Trash2 } from 'lucide-react';
import { Process, Algorithm } from '../types';

interface ProcessFormProps {
  process: Process;
  onUpdateProcess: (process: Process) => void;
  onDeleteProcess: (id: string) => void;
  algorithm: Algorithm;
}

export const ProcessForm: React.FC<ProcessFormProps> = ({
  process,
  onUpdateProcess,
  onDeleteProcess,
  algorithm,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === 'id' ? value : parseInt(value) || 0;
    
    onUpdateProcess({
      ...process,
      [name]: updatedValue,
    });
  };

  const showPriority = algorithm === 'Priority' || algorithm === 'PriorityRR';

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative group">
      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDeleteProcess(process.id)}
          className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
          aria-label="Delete process"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="text-lg font-medium mb-3 flex items-center">
        <div 
          className="w-4 h-4 rounded-full mr-2" 
          style={{ backgroundColor: getProcessColor(process.id) }} 
        />
        Process {process.id}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Arrival Time
          </label>
          <input
            type="number"
            name="arrivalTime"
            value={process.arrivalTime}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Burst Time
          </label>
          <input
            type="number"
            name="burstTime"
            value={process.burstTime}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        {showPriority && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority (lower value = higher priority)
            </label>
            <input
              type="number"
              name="priority"
              value={process.priority}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Generate colors based on process id for consistent coloring
export const getProcessColor = (id: string): string => {
  const colors = [
    '#4299E1', // blue
    '#F6AD55', // orange
    '#68D391', // green
    '#F687B3', // pink
    '#9F7AEA', // purple
    '#4FD1C5', // teal
    '#FC8181', // red
    '#B794F4', // light purple
    '#90CDF4', // light blue
    '#F6E05E', // yellow
  ];
  
  const index = (parseInt(id) - 1) % colors.length;
  return colors[index];
};