import React from 'react';
import { Trash2 } from 'lucide-react';
import { Process, Algorithm } from '../types';
import { getProcessColor } from './ProcessForm';

interface ProcessTableProps {
  processes: Process[];
  onUpdateProcess: (process: Process) => void;
  onDeleteProcess: (id: string) => void;
  algorithm: Algorithm;
}

export const ProcessTable: React.FC<ProcessTableProps> = ({
  processes,
  onUpdateProcess,
  onDeleteProcess,
  algorithm,
}) => {
  const showPriority = algorithm === 'Priority' || algorithm === 'PriorityRR';

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b-2 border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Process Details</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700">Process</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700">Arrival Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700">Burst Time</th>
              {showPriority && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700">Priority</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-700">
            {processes.map((process) => (
              <tr key={process.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: getProcessColor(process.id) }}
                    />
                    <span>P{process.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    value={process.arrivalTime}
                    onChange={(e) => onUpdateProcess({
                      ...process,
                      arrivalTime: parseInt(e.target.value) || 0
                    })}
                    className="w-20 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 bg-white shadow-sm"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="number"
                    min="1"
                    value={process.burstTime}
                    onChange={(e) => onUpdateProcess({
                      ...process,
                      burstTime: parseInt(e.target.value) || 1
                    })}
                    className="w-20 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 bg-white shadow-sm"
                  />
                </td>
                {showPriority && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="number"
                      min="1"
                      value={process.priority}
                      onChange={(e) => onUpdateProcess({
                        ...process,
                        priority: parseInt(e.target.value) || 1
                      })}
                      className="w-20 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 bg-white shadow-sm"
                    />
                  </td>
                )}
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => onDeleteProcess(process.id)}
                    className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500 transition-colors"
                    aria-label="Delete process"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};