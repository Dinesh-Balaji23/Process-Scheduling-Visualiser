// Available scheduling algorithms
export type Algorithm = 'FIFO' | 'SJF' | 'SRTF' | 'RoundRobin' | 'Priority' | 'PriorityRR';

// Process definition
export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

// Process execution data for Gantt chart
export interface ExecutionStep {
  processId: string;
  startTime: number;
  endTime: number;
}

// Process completion data
export interface ProcessCompletionData {
  [processId: string]: {
    completionTime: number;
    turnaroundTime: number;
    waitingTime: number;
  };
}

// Result of scheduling algorithm
export interface SchedulingResult {
  executionSequence: ExecutionStep[];
  averageTurnaroundTime: number;
  averageWaitingTime: number;
  processCompletionData: ProcessCompletionData;
}