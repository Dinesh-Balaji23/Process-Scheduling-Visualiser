import React from 'react';
import { ExecutionStep, Process, Algorithm } from '../types';
import { getProcessColor } from './ProcessForm';

interface GanttChartProps {
  executionSequence: ExecutionStep[];
  processes: Process[];
  algorithm: Algorithm;
  timeQuantum?: number;
}

export const GanttChart: React.FC<GanttChartProps> = ({ 
  executionSequence, 
  processes,
  algorithm,
  timeQuantum 
}) => {
  if (executionSequence.length === 0) {
    return <div className="text-center py-8 text-gray-500">No execution data available</div>;
  }

  const totalExecutionTime = executionSequence[executionSequence.length - 1].endTime;
  
  const getAlgorithmExplanation = () => {
    const processDetails = processes.map(p => 
      `P${p.id} (Burst Time: ${p.burstTime}${p.arrivalTime > 0 ? `, Arrival: ${p.arrivalTime}` : ''}${algorithm.includes('Priority') ? `, Priority: ${p.priority}` : ''})`
    ).join(', ');

    switch (algorithm) {
      case 'FIFO':
        return `In First-In-First-Out scheduling, processes (${processDetails}) are executed strictly in the order they arrive. Each process runs to completion before the next process begins.`;
      
      case 'SJF':
        return `Shortest Job First selects the process with the smallest burst time from (${processDetails}). The scheduler picks the shortest available job each time the CPU becomes available.`;
      
      case 'SRTF':
        return `Shortest Remaining Time First preemptively schedules processes (${processDetails}). When a new process arrives, if it has a shorter remaining time than the current process, it preempts the CPU.`;
      
      case 'RoundRobin':
        return `Round Robin gives each process (${processDetails}) a time quantum of ${timeQuantum} units. Processes are executed in a circular manner, and if a process doesn't complete within its time quantum, it's moved to the back of the queue.`;
      
      case 'Priority':
        return `Priority Scheduling executes processes (${processDetails}) based on their priority values (lower number = higher priority). The process with the highest priority is selected when the CPU becomes available.`;
      
      case 'PriorityRR':
        return `Priority with Round Robin combines priority scheduling with time quantum of ${timeQuantum} units. Processes (${processDetails}) are first grouped by priority, then within each priority level, Round Robin scheduling is applied.`;
      
      default:
        return 'Select an algorithm to see the execution explanation.';
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto pb-4">
        <div className="min-w-full" style={{ minWidth: '600px' }}>
          <div className="relative h-16 mb-4">
            {executionSequence.map((step, index) => {
              const width = ((step.endTime - step.startTime) / totalExecutionTime) * 100;
              const left = (step.startTime / totalExecutionTime) * 100;
              
              return (
                <div
                  key={index}
                  className="absolute top-0 h-full flex flex-col items-center justify-center border-r border-gray-300 dark:border-gray-600 overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    width: `${width}%`,
                    left: `${left}%`,
                    backgroundColor: getProcessColor(step.processId),
                    color: 'white'
                  }}
                >
                  <div className="font-medium truncate text-sm md:text-base">P{step.processId}</div>
                  <div className="text-xs truncate">{step.startTime}-{step.endTime}</div>
                </div>
              );
            })}
          </div>
          
          <div className="relative h-6">
            {Array.from({ length: totalExecutionTime + 1 }).map((_, index) => {
              const position = (index / totalExecutionTime) * 100;
              return (
                <div 
                  key={index}
                  className="absolute w-px h-3 bg-gray-400 dark:bg-gray-500"
                  style={{ left: `${position}%` }}
                >
                  <div className="absolute -left-2 top-4 text-xs text-gray-600 dark:text-gray-400">
                    {index}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-medium mb-3">Execution Explanation</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{getAlgorithmExplanation()}</p>
        
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <h4 className="font-medium mb-2">How to Read the Chart:</h4>
          <ul className="space-y-1">
            <li>• Each colored block shows when a process is using the CPU</li>
            <li>• The numbers at the bottom represent time units</li>
            <li>• Process IDs (P1, P2, etc.) are shown in each execution block</li>
            <li>• The start and end time of each execution is shown within the blocks</li>
          </ul>
        </div>
      </div>
    </div>
  );
};