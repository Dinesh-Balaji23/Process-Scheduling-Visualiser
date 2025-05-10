import { Algorithm, Process, SchedulingResult, ExecutionStep, ProcessCompletionData } from '../types';

export function calculateScheduling(
  algorithm: Algorithm, 
  processes: Process[], 
  timeQuantum: number = 2
): SchedulingResult {
  // Sort processes by arrival time to ensure they're processed in correct order
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // Skip execution if there are no processes
  if (sortedProcesses.length === 0) {
    return {
      executionSequence: [],
      averageTurnaroundTime: 0,
      averageWaitingTime: 0,
      processCompletionData: {}
    };
  }

  let executionSequence: ExecutionStep[] = [];
  let processCompletionData: ProcessCompletionData = {};

  // Execute the selected algorithm
  switch (algorithm) {
    case 'FIFO':
      executionSequence = fifoScheduling(sortedProcesses);
      break;
    case 'SJF':
      executionSequence = sjfScheduling(sortedProcesses);
      break;
    case 'SRTF':
      executionSequence = srtfScheduling(sortedProcesses);
      break;
    case 'RoundRobin':
      executionSequence = roundRobinScheduling(sortedProcesses, timeQuantum);
      break;
    case 'Priority':
      executionSequence = priorityScheduling(sortedProcesses);
      break;
    case 'PriorityRR':
      executionSequence = priorityRoundRobinScheduling(sortedProcesses, timeQuantum);
      break;
    default:
      // Default to FIFO if algorithm is not recognized
      executionSequence = fifoScheduling(sortedProcesses);
  }

  // Calculate metrics
  processCompletionData = calculateCompletionData(processes, executionSequence);
  const metrics = calculateMetrics(processes, processCompletionData);

  return {
    executionSequence,
    averageTurnaroundTime: metrics.averageTurnaroundTime,
    averageWaitingTime: metrics.averageWaitingTime,
    processCompletionData
  };
}

// FIFO (First In First Out) Scheduling Algorithm
function fifoScheduling(processes: Process[]): ExecutionStep[] {
  const executionSequence: ExecutionStep[] = [];
  let currentTime = 0;
  
  processes.forEach(process => {
    // If there's a gap before the next process arrives, add idle time
    if (process.arrivalTime > currentTime) {
      currentTime = process.arrivalTime;
    }
    
    executionSequence.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime
    });
    
    currentTime += process.burstTime;
  });
  
  return executionSequence;
}

// SJF (Shortest Job First) Scheduling Algorithm
function sjfScheduling(processes: Process[]): ExecutionStep[] {
  const executionSequence: ExecutionStep[] = [];
  const remainingProcesses = [...processes].map(p => ({ ...p, remainingTime: p.burstTime }));
  let currentTime = 0;
  
  while (remainingProcesses.length > 0) {
    // Find all processes that have arrived by the current time
    const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length === 0) {
      // No processes available, jump to the arrival time of the next process
      const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }
    
    // Find the process with the shortest burst time
    const shortestJob = availableProcesses.reduce((prev, curr) => 
      curr.burstTime < prev.burstTime ? curr : prev
    );
    
    // Execute the shortest job
    executionSequence.push({
      processId: shortestJob.id,
      startTime: currentTime,
      endTime: currentTime + shortestJob.burstTime
    });
    
    currentTime += shortestJob.burstTime;
    
    // Remove the completed process
    const index = remainingProcesses.findIndex(p => p.id === shortestJob.id);
    remainingProcesses.splice(index, 1);
  }
  
  return executionSequence;
}

// SRTF (Shortest Remaining Time First) Scheduling Algorithm
function srtfScheduling(processes: Process[]): ExecutionStep[] {
  const executionSequence: ExecutionStep[] = [];
  const remainingProcesses = [...processes].map(p => ({ ...p, remainingTime: p.burstTime }));
  let currentTime = 0;
  let currentProcess: (typeof remainingProcesses[0]) | null = null;
  let lastProcessId = '';
  let lastStartTime = 0;
  
  while (remainingProcesses.length > 0) {
    // Find all processes that have arrived by the current time
    const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length === 0) {
      // No processes available, jump to the arrival time of the next process
      const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      
      // If we were executing a process, add it to the sequence before jumping
      if (currentProcess && lastProcessId === currentProcess.id) {
        executionSequence.push({
          processId: currentProcess.id,
          startTime: lastStartTime,
          endTime: currentTime
        });
      }
      
      currentTime = nextArrival;
      currentProcess = null;
      lastProcessId = '';
      continue;
    }
    
    // Find the process with the shortest remaining time
    const shortestRemaining = availableProcesses.reduce((prev, curr) => 
      curr.remainingTime < prev.remainingTime ? curr : prev
    );
    
    // Check if we need to switch processes
    if (currentProcess === null || shortestRemaining.id !== currentProcess.id) {
      // If we were executing a different process, add it to the sequence
      if (currentProcess && lastProcessId === currentProcess.id) {
        executionSequence.push({
          processId: lastProcessId,
          startTime: lastStartTime,
          endTime: currentTime
        });
      }
      
      // Switch to the process with shortest remaining time
      currentProcess = shortestRemaining;
      lastProcessId = shortestRemaining.id;
      lastStartTime = currentTime;
    }
    
    // Find the next event time (either a new process arrival or current process completion)
    let nextEventTime = currentTime + currentProcess.remainingTime;
    
    // Check if any process arrives before the current process completes
    const nextArrival = remainingProcesses
      .filter(p => p.arrivalTime > currentTime)
      .map(p => p.arrivalTime)
      .sort((a, b) => a - b)[0];
    
    if (nextArrival !== undefined && nextArrival < nextEventTime) {
      nextEventTime = nextArrival;
    }
    
    // Update the remaining time of the current process
    const timeSlice = nextEventTime - currentTime;
    currentProcess.remainingTime -= timeSlice;
    
    // If the process has completed, remove it from the remainingProcesses
    if (currentProcess.remainingTime === 0) {
      executionSequence.push({
        processId: currentProcess.id,
        startTime: lastStartTime,
        endTime: nextEventTime
      });
      
      const index = remainingProcesses.findIndex(p => p.id === currentProcess!.id);
      remainingProcesses.splice(index, 1);
      
      currentProcess = null;
      lastProcessId = '';
    }
    
    currentTime = nextEventTime;
  }
  
  return executionSequence;
}

// Round Robin Scheduling Algorithm
function roundRobinScheduling(processes: Process[], timeQuantum: number): ExecutionStep[] {
  const executionSequence: ExecutionStep[] = [];
  const readyQueue: { id: string; remainingTime: number }[] = [];
  const remainingProcesses = [...processes].map(p => ({ ...p, remainingTime: p.burstTime }));
  let currentTime = 0;
  
  // Sort processes by arrival time
  remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // Handle the case where no processes are available
  if (remainingProcesses.length === 0) return [];
  
  // Initialize with the first arrived process
  if (remainingProcesses[0].arrivalTime > currentTime) {
    currentTime = remainingProcesses[0].arrivalTime;
  }
  
  // Add all processes that arrive at the initial time to the ready queue
  const initialProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
  readyQueue.push(...initialProcesses.map(p => ({ id: p.id, remainingTime: p.burstTime })));
  remainingProcesses.splice(0, initialProcesses.length);
  
  while (readyQueue.length > 0 || remainingProcesses.length > 0) {
    if (readyQueue.length === 0) {
      // If ready queue is empty but there are more processes to arrive
      const nextArrival = remainingProcesses[0].arrivalTime;
      currentTime = nextArrival;
      
      // Add all processes that arrive at this time to the ready queue
      const newProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
      readyQueue.push(...newProcesses.map(p => ({ id: p.id, remainingTime: p.burstTime })));
      remainingProcesses.splice(0, newProcesses.length);
      continue;
    }
    
    // Get the next process from the ready queue
    const currentProcess = readyQueue.shift()!;
    
    // Calculate how long this process will run
    const runTime = Math.min(timeQuantum, currentProcess.remainingTime);
    const endTime = currentTime + runTime;
    
    // Add to execution sequence
    executionSequence.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime
    });
    
    // Update remaining time for the current process
    currentProcess.remainingTime -= runTime;
    currentTime = endTime;
    
    // Check for any new process arrivals during this time slice
    const newArrivals = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    readyQueue.push(...newArrivals.map(p => ({ id: p.id, remainingTime: p.burstTime })));
    remainingProcesses.splice(0, newArrivals.length);
    
    // If the current process still has remaining time, add it back to the ready queue
    if (currentProcess.remainingTime > 0) {
      readyQueue.push(currentProcess);
    }
  }
  
  return executionSequence;
}

// Priority Scheduling Algorithm
function priorityScheduling(processes: Process[]): ExecutionStep[] {
  const executionSequence: ExecutionStep[] = [];
  const remainingProcesses = [...processes].map(p => ({ ...p, remainingTime: p.burstTime }));
  let currentTime = 0;
  
  while (remainingProcesses.length > 0) {
    // Find all processes that have arrived by the current time
    const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length === 0) {
      // No processes available, jump to the arrival time of the next process
      const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }
    
    // Find the process with the highest priority (lowest priority number)
    const highestPriorityProcess = availableProcesses.reduce((prev, curr) => 
      curr.priority < prev.priority ? curr : prev
    );
    
    // Execute the highest priority process
    executionSequence.push({
      processId: highestPriorityProcess.id,
      startTime: currentTime,
      endTime: currentTime + highestPriorityProcess.burstTime
    });
    
    currentTime += highestPriorityProcess.burstTime;
    
    // Remove the completed process
    const index = remainingProcesses.findIndex(p => p.id === highestPriorityProcess.id);
    remainingProcesses.splice(index, 1);
  }
  
  return executionSequence;
}

// Priority with Round Robin Scheduling Algorithm
function priorityRoundRobinScheduling(processes: Process[], timeQuantum: number): ExecutionStep[] {
  const executionSequence: ExecutionStep[] = [];
  const remainingProcesses = [...processes].map(p => ({ ...p, remainingTime: p.burstTime }));
  let currentTime = 0;
  
  while (remainingProcesses.length > 0) {
    // Find all processes that have arrived by the current time
    const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length === 0) {
      // No processes available, jump to the arrival time of the next process
      const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }
    
    // Group processes by priority
    const priorityGroups = new Map<number, typeof availableProcesses>();
    
    availableProcesses.forEach(process => {
      if (!priorityGroups.has(process.priority)) {
        priorityGroups.set(process.priority, []);
      }
      priorityGroups.get(process.priority)!.push(process);
    });
    
    // Sort priorities (lowest number = highest priority)
    const sortedPriorities = [...priorityGroups.keys()].sort((a, b) => a - b);
    
    // Process each priority group with Round Robin
    for (const priority of sortedPriorities) {
      const priorityProcesses = priorityGroups.get(priority)!;
      
      // Apply Round Robin to this priority group
      let roundRobinQueue = [...priorityProcesses];
      let allProcessed = false;
      
      while (!allProcessed) {
        const processesToRequeue = [];
        
        for (let i = 0; i < roundRobinQueue.length; i++) {
          const process = roundRobinQueue[i];
          
          // Calculate execution time for this quantum
          const executionTime = Math.min(timeQuantum, process.remainingTime);
          
          // Add to execution sequence
          executionSequence.push({
            processId: process.id,
            startTime: currentTime,
            endTime: currentTime + executionTime
          });
          
          // Update remaining time and current time
          process.remainingTime -= executionTime;
          currentTime += executionTime;
          
          // Check for new arrivals during this time slice
          const newArrivals = remainingProcesses
            .filter(p => !availableProcesses.includes(p) && p.arrivalTime <= currentTime);
          
          if (newArrivals.length > 0) {
            // If new processes with higher priority arrive, break this round robin cycle
            const higherPriorityArrival = newArrivals.some(p => p.priority < priority);
            
            if (higherPriorityArrival) {
              // Add the current process back to requeue if it's not finished
              if (process.remainingTime > 0) {
                processesToRequeue.push(process);
              }
              
              // Break out of the loop and recalculate available processes
              allProcessed = true;
              break;
            }
          }
          
          // If the process still has remaining time, add it to the requeue list
          if (process.remainingTime > 0) {
            processesToRequeue.push(process);
          } else {
            // Remove the completed process from remainingProcesses
            const index = remainingProcesses.findIndex(p => p.id === process.id);
            if (index !== -1) {
              remainingProcesses.splice(index, 1);
            }
          }
        }
        
        // If no processes need to be requeued, we're done with this priority group
        if (processesToRequeue.length === 0) {
          allProcessed = true;
        } else {
          roundRobinQueue = processesToRequeue;
        }
      }
    }
  }
  
  return executionSequence;
}

// Calculate completion time, turnaround time, and waiting time for each process
function calculateCompletionData(
  processes: Process[], 
  executionSequence: ExecutionStep[]
): ProcessCompletionData {
  const processData: ProcessCompletionData = {};
  
  // Initialize data for each process
  processes.forEach(process => {
    processData[process.id] = {
      completionTime: 0,
      turnaroundTime: 0,
      waitingTime: 0
    };
  });
  
  // Find completion time for each process (the end time of its last execution step)
  executionSequence.forEach(step => {
    if (step.endTime > processData[step.processId].completionTime) {
      processData[step.processId].completionTime = step.endTime;
    }
  });
  
  // Calculate turnaround time and waiting time
  processes.forEach(process => {
    const data = processData[process.id];
    // Turnaround time = completion time - arrival time
    data.turnaroundTime = data.completionTime - process.arrivalTime;
    // Waiting time = turnaround time - burst time
    data.waitingTime = data.turnaroundTime - process.burstTime;
    
    // Ensure waiting time is not negative (can happen with rounding errors)
    data.waitingTime = Math.max(0, data.waitingTime);
  });
  
  return processData;
}

// Calculate average metrics
function calculateMetrics(processes: Process[], processData: ProcessCompletionData) {
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;
  
  processes.forEach(process => {
    const data = processData[process.id];
    totalTurnaroundTime += data.turnaroundTime;
    totalWaitingTime += data.waitingTime;
  });
  
  const averageTurnaroundTime = processes.length > 0 ? totalTurnaroundTime / processes.length : 0;
  const averageWaitingTime = processes.length > 0 ? totalWaitingTime / processes.length : 0;
  
  return {
    averageTurnaroundTime,
    averageWaitingTime
  };
}