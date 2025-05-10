import React from 'react';
import { Process, ProcessCompletionData } from '../types';
import { getProcessColor } from './ProcessForm';

interface MetricsDisplayProps {
  averageTurnaroundTime: number;
  averageWaitingTime: number;
  processes: Process[];
  completionData: ProcessCompletionData;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  averageTurnaroundTime,
  averageWaitingTime,
  processes,
  completionData,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Turnaround Time</h3>
          <p className="text-2xl font-bold">{averageTurnaroundTime.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Waiting Time</h3>
          <p className="text-2xl font-bold">{averageWaitingTime.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Process</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completion Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Turnaround Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Waiting Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {processes.map((process) => {
              const data = completionData[process.id] || { 
                completionTime: 0, 
                turnaroundTime: 0, 
                waitingTime: 0 
              };
              
              return (
                <tr key={process.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: getProcessColor(process.id) }} 
                      />
                      <span>P{process.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{data.completionTime}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{data.turnaroundTime}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{data.waitingTime}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};