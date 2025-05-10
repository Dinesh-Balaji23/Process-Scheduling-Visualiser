import React from 'react';
import { X } from 'lucide-react';
import { Algorithm } from '../types';

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  algorithm: Algorithm;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ isOpen, onClose, algorithm }) => {
  if (!isOpen) return null;

  const algorithmInfo = getAlgorithmInfo(algorithm);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div 
        className="w-full max-w-md bg-white dark:bg-gray-800 h-full overflow-y-auto shadow-xl transform transition-transform duration-300"
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">{algorithmInfo.title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{algorithmInfo.description}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">How it works</h3>
            <p className="text-gray-700 dark:text-gray-300">{algorithmInfo.howItWorks}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Advantages</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {algorithmInfo.advantages.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Disadvantages</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {algorithmInfo.disadvantages.map((disadv, i) => (
                <li key={i}>{disadv}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Parameters</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {algorithmInfo.parameters.map((param, i) => (
                <li key={i}><span className="font-medium">{param.name}:</span> {param.description}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

function getAlgorithmInfo(algorithm: Algorithm) {
  switch (algorithm) {
    case 'FIFO':
      return {
        title: 'First-In, First-Out (FIFO)',
        description: 'Also known as First-Come, First-Served (FCFS), this is the simplest scheduling algorithm where processes are executed in the order they arrive in the ready queue.',
        howItWorks: 'Processes are executed in the exact order they arrive in the ready queue, without any preemption. Once a process gets the CPU, it runs until it completes its burst time.',
        advantages: [
          'Simple to implement',
          'Easy to understand',
          'No starvation as every process gets a chance to execute'
        ],
        disadvantages: [
          'Can lead to the convoy effect, where short processes wait behind long processes',
          'Not optimal for turnaround time',
          'Average waiting time can be high'
        ],
        parameters: [
          { name: 'Arrival Time', description: 'When the process arrives and is ready for execution' },
          { name: 'Burst Time', description: 'The total CPU time required by the process' }
        ]
      };
    
    case 'SJF':
      return {
        title: 'Shortest Job First (SJF)',
        description: 'A non-preemptive scheduling algorithm that selects the process with the smallest execution time to execute next.',
        howItWorks: 'The process with the smallest burst time is selected from the ready queue. If two processes have the same burst time, FCFS is used to break the tie.',
        advantages: [
          'Provides minimum average waiting time among all scheduling algorithms',
          'Good for batch systems where process times are known in advance'
        ],
        disadvantages: [
          'May cause starvation for longer processes if short processes keep arriving',
          'Requires knowledge of burst time in advance, which is often not available',
          'Non-preemptive, so not optimized for interactive systems'
        ],
        parameters: [
          { name: 'Arrival Time', description: 'When the process arrives and is ready for execution' },
          { name: 'Burst Time', description: 'The total CPU time required by the process' }
        ]
      };
      
    case 'SRTF':
      return {
        title: 'Shortest Remaining Time First (SRTF)',
        description: 'A preemptive version of SJF where the process with the smallest remaining time is executed next.',
        howItWorks: 'Whenever a new process arrives, its burst time is compared with the remaining time of the currently running process. If the new process has a smaller burst time, the current process is preempted.',
        advantages: [
          'Optimal for minimizing average waiting time',
          'Responsive to short processes',
          'Efficient for time-sharing systems'
        ],
        disadvantages: [
          'High overhead due to frequent context switching',
          'Starvation for longer processes in a heavy system load',
          'Requires continuous monitoring of remaining burst times'
        ],
        parameters: [
          { name: 'Arrival Time', description: 'When the process arrives and is ready for execution' },
          { name: 'Burst Time', description: 'The total CPU time required by the process' }
        ]
      };
      
    case 'RoundRobin':
      return {
        title: 'Round Robin (RR)',
        description: 'A preemptive scheduling algorithm that assigns a fixed time slice (quantum) to each process in a circular queue.',
        howItWorks: 'Each process is assigned a fixed time slice called a quantum. Processes are executed in a circular queue. If a process does not complete within its time quantum, it is preempted and added to the back of the ready queue.',
        advantages: [
          'Fair allocation of CPU to all processes',
          'Good for time-sharing systems',
          'No starvation as each process gets a fair share of CPU',
          'Good response time for short processes'
        ],
        disadvantages: [
          'Performance heavily depends on the choice of time quantum',
          'Higher average waiting time compared to SJF',
          'If quantum is too large, it behaves like FCFS',
          'If quantum is too small, too much overhead from context switching'
        ],
        parameters: [
          { name: 'Arrival Time', description: 'When the process arrives and is ready for execution' },
          { name: 'Burst Time', description: 'The total CPU time required by the process' },
          { name: 'Time Quantum', description: 'The maximum time a process can use the CPU before being preempted' }
        ]
      };
      
    case 'Priority':
      return {
        title: 'Priority Scheduling',
        description: 'A scheduling algorithm where each process is assigned a priority and the process with the highest priority is executed first.',
        howItWorks: 'Each process is assigned a priority value. The process with the highest priority (lowest priority number) is selected next. If priorities are equal, FCFS is used as a tie-breaker.',
        advantages: [
          'Allows important processes to be executed first',
          'Suitable for real-time systems',
          'Flexible as priorities can be determined by many factors'
        ],
        disadvantages: [
          'Can lead to starvation for low-priority processes',
          'Priority inversion can occur if not managed properly',
          'Difficult to determine appropriate priorities'
        ],
        parameters: [
          { name: 'Arrival Time', description: 'When the process arrives and is ready for execution' },
          { name: 'Burst Time', description: 'The total CPU time required by the process' },
          { name: 'Priority', description: 'The importance value assigned to the process (lower value means higher priority)' }
        ]
      };
      
    case 'PriorityRR':
      return {
        title: 'Priority with Round Robin',
        description: 'A combination of Priority Scheduling and Round Robin where processes with the same priority are scheduled using Round Robin.',
        howItWorks: 'Processes are first sorted by priority. For processes with the same priority, Round Robin scheduling is applied using the specified time quantum.',
        advantages: [
          'Combines benefits of priority scheduling and round robin',
          'Prevents starvation within a priority level',
          'Suitable for both real-time and time-sharing systems'
        ],
        disadvantages: [
          'More complex to implement',
          'Still can cause starvation for lower priority processes',
          'Performance depends on both priority assignment and time quantum selection'
        ],
        parameters: [
          { name: 'Arrival Time', description: 'When the process arrives and is ready for execution' },
          { name: 'Burst Time', description: 'The total CPU time required by the process' },
          { name: 'Priority', description: 'The importance value assigned to the process (lower value means higher priority)' },
          { name: 'Time Quantum', description: 'The maximum time a process can use the CPU before being preempted' }
        ]
      };
      
    default:
      return {
        title: 'Algorithm Information',
        description: 'Information about the selected algorithm.',
        howItWorks: 'Select an algorithm to see details on how it works.',
        advantages: ['Select an algorithm to see its advantages.'],
        disadvantages: ['Select an algorithm to see its disadvantages.'],
        parameters: [
          { name: 'Parameters', description: 'Select an algorithm to see its required parameters.' }
        ]
      };
  }
}