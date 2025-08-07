// src/components/execution/ExecutionControlPanel.jsx
// Compact execution control panel for workflow editor

import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Zap,
} from 'lucide-react';
import { workflowExecutor } from '../../services/WorkflowExecutor';

const ExecutionControlPanel = ({
  workflow,
  onOpenMonitor,
  darkMode = false,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecution, setLastExecution] = useState(null);
  const [quickInputData, setQuickInputData] = useState('{"test": true}');
  const [executionCount, setExecutionCount] = useState(0);

  useEffect(() => {
    // Listen for execution events
    const handleExecutionStarted = (data) => {
      setIsExecuting(true);
      setExecutionCount((prev) => prev + 1);
    };

    const handleExecutionCompleted = (data) => {
      setIsExecuting(false);
      setLastExecution({
        status: 'completed',
        duration: data.duration,
        timestamp: new Date(),
      });
    };

    const handleExecutionFailed = (data) => {
      setIsExecuting(false);
      setLastExecution({
        status: 'failed',
        error: data.error,
        timestamp: new Date(),
      });
    };

    workflowExecutor.addEventListener(
      'execution:started',
      handleExecutionStarted
    );
    workflowExecutor.addEventListener(
      'execution:completed',
      handleExecutionCompleted
    );
    workflowExecutor.addEventListener(
      'execution:failed',
      handleExecutionFailed
    );

    return () => {
      workflowExecutor.removeEventListener(
        'execution:started',
        handleExecutionStarted
      );
      workflowExecutor.removeEventListener(
        'execution:completed',
        handleExecutionCompleted
      );
      workflowExecutor.removeEventListener(
        'execution:failed',
        handleExecutionFailed
      );
    };
  }, []);

  const quickExecute = async () => {
    if (!workflow || isExecuting) return;

    try {
      const inputData = JSON.parse(quickInputData);
      const workflowId = `quick_${Date.now()}`;

      await workflowExecutor.executeWorkflow(workflowId, workflow, inputData, {
        debug: false,
      });
    } catch (error) {
      console.error('Quick execution failed:', error);
      setLastExecution({
        status: 'failed',
        error: error.message,
        timestamp: new Date(),
      });
    }
  };

  const cancelExecution = () => {
    const activeExecutions = workflowExecutor.getActiveExecutions();
    activeExecutions.forEach((exec) => {
      workflowExecutor.cancelExecution(exec.executionId);
    });
    setIsExecuting(false);
  };

  const getStatusIcon = () => {
    if (isExecuting) {
      return <Activity className='w-4 h-4 text-blue-500 animate-pulse' />;
    }

    if (lastExecution) {
      switch (lastExecution.status) {
        case 'completed':
          return <CheckCircle className='w-4 h-4 text-green-500' />;
        case 'failed':
          return <AlertCircle className='w-4 h-4 text-red-500' />;
        default:
          return <Clock className='w-4 h-4 text-gray-400' />;
      }
    }

    return <Clock className='w-4 h-4 text-gray-400' />;
  };

  const canExecute = workflow && workflow.nodes && workflow.nodes.length > 0;

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border rounded-lg p-4 shadow-sm`}
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <Zap
            className={`w-5 h-5 mr-2 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}
          />
          <h3
            className={`font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Execution Control
          </h3>
        </div>

        <div className='flex items-center space-x-2'>
          {getStatusIcon()}
          <span
            className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {executionCount} runs
          </span>
        </div>
      </div>

      {/* Quick Input */}
      <div className='mb-4'>
        <label
          className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Quick Test Input
        </label>
        <textarea
          value={quickInputData}
          onChange={(e) => setQuickInputData(e.target.value)}
          className={`w-full h-20 p-2 text-xs font-mono border rounded ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-gray-50 border-gray-300 text-gray-900'
          }`}
          placeholder='{"key": "value"}'
        />
      </div>

      {/* Action Buttons */}
      <div className='space-y-2'>
        <div className='flex space-x-2'>
          <button
            onClick={quickExecute}
            disabled={!canExecute || isExecuting}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center ${
              !canExecute || isExecuting
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isExecuting ? (
              <>
                <Activity className='w-4 h-4 mr-2 animate-pulse' />
                Running...
              </>
            ) : (
              <>
                <Play className='w-4 h-4 mr-2' />
                Quick Run
              </>
            )}
          </button>

          {isExecuting && (
            <button
              onClick={cancelExecution}
              className='px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white'
            >
              <Square className='w-4 h-4' />
            </button>
          )}
        </div>

        <button
          onClick={onOpenMonitor}
          className={`w-full py-2 px-3 rounded-md text-sm font-medium border ${
            darkMode
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Settings className='w-4 h-4 mr-2 inline' />
          Open Monitor
        </button>
      </div>

      {/* Last Execution Status */}
      {lastExecution && (
        <div
          className={`mt-4 p-3 rounded-md text-xs ${
            lastExecution.status === 'completed'
              ? darkMode
                ? 'bg-green-900 text-green-200'
                : 'bg-green-50 text-green-800'
              : darkMode
              ? 'bg-red-900 text-red-200'
              : 'bg-red-50 text-red-800'
          }`}
        >
          <div className='flex items-center justify-between'>
            <span className='font-medium'>
              {lastExecution.status === 'completed' ? 'Success' : 'Failed'}
            </span>
            <span>{lastExecution.timestamp.toLocaleTimeString()}</span>
          </div>
          {lastExecution.duration && (
            <div className='mt-1'>Duration: {lastExecution.duration}ms</div>
          )}
          {lastExecution.error && (
            <div className='mt-1'>Error: {lastExecution.error}</div>
          )}
        </div>
      )}

      {/* Workflow Validation */}
      {!canExecute && (
        <div
          className={`mt-4 p-3 rounded-md text-xs ${
            darkMode
              ? 'bg-yellow-900 text-yellow-200'
              : 'bg-yellow-50 text-yellow-800'
          }`}
        >
          <div className='flex items-center'>
            <AlertCircle className='w-4 h-4 mr-2' />
            <span>Add nodes to your workflow to enable execution</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionControlPanel;
