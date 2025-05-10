import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { ProcessManager } from './components/ProcessManager';
import { GanttChart } from './components/GanttChart';
import { MetricsDisplay } from './components/MetricsDisplay';
import { ProcessTable } from './components/ProcessTable';
import { calculateScheduling } from './utils/schedulingAlgorithms';
import { Algorithm, Process, SchedulingResult } from './types';
import { InfoPanel } from './components/InfoPanel';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('FIFO');
  const [processes, setProcesses] = useState<Process[]>([]);
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);

  const results: SchedulingResult = calculateScheduling(selectedAlgorithm, processes, timeQuantum);

  const addProcess = () => {
    const newId = (processes.length + 1).toString();
    setProcesses([
      ...processes,
      { id: newId, arrivalTime: 0, burstTime: 1, priority: 1 }
    ]);
  };

  const updateProcess = (updatedProcess: Process) => {
    setProcesses(
      processes.map(process => 
        process.id === updatedProcess.id ? updatedProcess : process
      )
    );
  };

  const deleteProcess = (id: string) => {
    setProcesses(processes.filter(process => process.id !== id));
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">CPU Scheduling Algorithms Visualizer</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Visualize and understand different scheduling algorithms in operating systems
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <AlgorithmSelector 
              selectedAlgorithm={selectedAlgorithm} 
              onSelectAlgorithm={setSelectedAlgorithm} 
              onOpenInfo={() => setInfoOpen(true)}
            />
            
            {(selectedAlgorithm === 'RoundRobin' || selectedAlgorithm === 'PriorityRR') && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="font-medium mb-3">Time Quantum</h3>
                <input
                  type="number"
                  min="1"
                  value={timeQuantum}
                  onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            )}
            
            <ProcessManager 
              processes={processes}
              onAddProcess={addProcess}
            />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {processes.length > 0 ? (
              <>
                <ProcessTable
                  processes={processes}
                  onUpdateProcess={updateProcess}
                  onDeleteProcess={deleteProcess}
                  algorithm={selectedAlgorithm}
                />

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 className="text-xl font-semibold mb-4">Gantt Chart</h2>
                  <GanttChart 
                    executionSequence={results.executionSequence} 
                    processes={processes}
                    algorithm={selectedAlgorithm}
                    timeQuantum={timeQuantum}
                  />
                </div>
                
                <MetricsDisplay 
                  averageTurnaroundTime={results.averageTurnaroundTime}
                  averageWaitingTime={results.averageWaitingTime}
                  processes={processes}
                  completionData={results.processCompletionData}
                />
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Get Started</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add processes using the "Add Process" button to visualize the scheduling algorithm.
                </p>
                <button
                  onClick={addProcess}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add Your First Process
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <InfoPanel 
        isOpen={infoOpen} 
        onClose={() => setInfoOpen(false)} 
        algorithm={selectedAlgorithm}
      />
    </Layout>
  );
}

export default App;