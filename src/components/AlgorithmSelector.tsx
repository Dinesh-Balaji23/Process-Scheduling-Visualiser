import React from 'react';
import { Info } from 'lucide-react';
import { Algorithm } from '../types';

interface AlgorithmSelectorProps {
  selectedAlgorithm: Algorithm;
  onSelectAlgorithm: (algorithm: Algorithm) => void;
  onOpenInfo: () => void;
}

const algorithmOptions: { value: Algorithm; label: string }[] = [
  { value: 'FIFO', label: 'First-In, First-Out (FIFO)' },
  { value: 'SJF', label: 'Shortest Job First (SJF)' },
  { value: 'SRTF', label: 'Shortest Remaining Time First (SRTF)' },
  { value: 'RoundRobin', label: 'Round Robin (RR)' },
  { value: 'Priority', label: 'Priority Scheduling' },
  { value: 'PriorityRR', label: 'Priority with Round Robin' },
];

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm,
  onOpenInfo,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Select Algorithm</h2>
        <button 
          onClick={onOpenInfo}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Algorithm Information"
        >
          <Info size={18} />
        </button>
      </div>
      
      <div className="space-y-2">
        {algorithmOptions.map((option) => (
          <div 
            key={option.value}
            className={`p-3 rounded-md cursor-pointer transition-all duration-200 ${
              selectedAlgorithm === option.value
                ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            onClick={() => onSelectAlgorithm(option.value)}
          >
            <span className="font-medium">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};