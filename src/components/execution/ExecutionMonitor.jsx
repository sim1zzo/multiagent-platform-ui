// src/components/execution/ExecutionMonitor.jsx
// Real-time execution monitoring component

import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Square,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Zap,
  Eye,
  BarChart3,
} from 'lucide-react';
import { workflowExecutor } from '../../services/WorkflowExecutor';

const ExecutionMonitor = ({ workflow, isOpen, onClose, darkMode = false }) => {
  const [executions, setExecutions] = useState([]);
  const [currentExecution, setCurrentExecution] = useState(null);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionInput, setExecutionInput] = useState('{}');

  // Setup event listeners for real-time updates
  useEffect(() => {
    const handleExecutionStarted = (data) => {
      setExecutions((prev) => [
        ...prev,
        {
          ...data,
          status: 'running',
          startTime: new Date(),
          progress: 0,
        },
      ]);
      setCurrentExecution(data.executionId);
      setIsExecuting(true);
    };

    const handleExecutionCompleted = (data) => {
      setExecutions((prev) =>
        prev.map((exec) =>
          exec.executionId === data.executionId
            ? {
                ...exec,
                status: 'completed',
                endTime: new Date(),
                progress: 100,
              }
            : exec
        )
      );
      setIsExecuting(false);
      addLog(
        data.executionId,
        'info',
        `Execution completed in ${data.duration}ms`
      );
    };

    const handleExecutionFailed = (data) => {
      setExecutions((prev) =>
        prev.map((exec) =>
          exec.executionId === data.executionId
            ? {
                ...exec,
                status: 'failed',
                endTime: new Date(),
                error: data.error,
              }
            : exec
        )
      );
      setIsExecuting(false);
      addLog(data.executionId, 'error', `Execution failed: ${data.error}`);
    };

    const handleNodeStarted = (data) => {
      addLog(data.executionId, 'info', `Started: ${data.nodeName}`);
      // Update progress based on execution path
      updateExecutionProgress(data.executionId);
    };

    const handleNodeCompleted = (data) => {
      addLog(data.executionId, 'success', `Completed: ${data.nodeName}`);
      updateExecutionProgress(data.executionId);
    };

    const handleNodeFailed = (data) => {
      addLog(
        data.executionId,
        'error',
        `Failed: ${data.nodeName} - ${data.error}`
      );
    };

    // Register event listeners
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
    workflowExecutor.addEventListener('node:started', handleNodeStarted);
    workflowExecutor.addEventListener('node:completed', handleNodeCompleted);
    workflowExecutor.addEventListener('node:failed', handleNodeFailed);

    // Cleanup listeners on unmount
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
      workflowExecutor.removeEventListener('node:started', handleNodeStarted);
      workflowExecutor.removeEventListener(
        'node:completed',
        handleNodeCompleted
      );
      workflowExecutor.removeEventListener('node:failed', handleNodeFailed);
    };
  }, []);

  const addLog = useCallback((executionId, type, message) => {
    const log = {
      id: Date.now() + Math.random(),
      executionId,
      type,
      message,
      timestamp: new Date(),
    };
    setExecutionLogs((prev) => [...prev, log]);
  }, []);

  const updateExecutionProgress = useCallback(
    (executionId) => {
      const state = workflowExecutor.getExecutionState(executionId);
      if (state && workflow) {
        const totalNodes = workflow.nodes.length;
        const completedNodes = state.executionPath.length;
        const progress = Math.min((completedNodes / totalNodes) * 100, 100);

        setExecutions((prev) =>
          prev.map((exec) =>
            exec.executionId === executionId ? { ...exec, progress } : exec
          )
        );
      }
    },
    [workflow]
  );

  const executeWorkflow = async () => {
    if (!workflow || isExecuting) return;

    try {
      const inputData = JSON.parse(executionInput);
      const workflowId = `workflow_${Date.now()}`;

      // Execute workflow
      const result = await workflowExecutor.executeWorkflow(
        workflowId,
        workflow,
        inputData,
        { debug: true }
      );

      console.log('Workflow execution result:', result);
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      addLog('manual', 'error', `Failed to start execution: ${error.message}`);
    }
  };

  const cancelExecution = (executionId) => {
    workflowExecutor.cancelExecution(executionId);
    setIsExecuting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <Activity className='w-4 h-4 text-blue-500 animate-pulse' />;
      case 'completed':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'failed':
        return <XCircle className='w-4 h-4 text-red-500' />;
      case 'cancelled':
        return <Square className='w-4 h-4 text-gray-500' />;
      default:
        return <Clock className='w-4 h-4 text-gray-400' />;
    }
  };

  const getLogTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div
        className={`w-full max-w-6xl h-5/6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-xl flex flex-col`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          } flex items-center justify-between`}
        >
          <div className='flex items-center'>
            <Zap
              className={`w-6 h-6 mr-3 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}
            />
            <div>
              <h2
                className={`text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Execution Monitor
              </h2>
              <p
                className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Real-time workflow execution monitoring
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-md hover:${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            ✕
          </button>
        </div>

        <div className='flex-1 flex'>
          {/* Left Panel - Execution Control */}
          <div
            className={`w-1/3 p-6 border-r ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            {/* Input Data */}
            <div className='mb-6'>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Input Data (JSON)
              </label>
              <textarea
                value={executionInput}
                onChange={(e) => setExecutionInput(e.target.value)}
                className={`w-full h-32 p-3 border rounded-md text-sm font-mono ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder='{"message": "Hello World"}'
              />
            </div>

            {/* Execute Button */}
            <button
              onClick={executeWorkflow}
              disabled={isExecuting || !workflow}
              className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center mb-4 ${
                isExecuting || !workflow
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isExecuting ? (
                <>
                  <Activity className='w-4 h-4 mr-2 animate-pulse' />
                  Executing...
                </>
              ) : (
                <>
                  <Play className='w-4 h-4 mr-2' />
                  Execute Workflow
                </>
              )}
            </button>

            {/* Recent Executions */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Recent Executions
              </h3>

              <div className='space-y-3'>
                {executions
                  .slice(-5)
                  .reverse()
                  .map((execution) => (
                    <div
                      key={execution.executionId}
                      className={`p-3 border rounded-md ${
                        darkMode
                          ? 'border-gray-600 bg-gray-700'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center'>
                          {getStatusIcon(execution.status)}
                          <span
                            className={`ml-2 text-sm font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {execution.executionId.split('_')[1]}
                          </span>
                        </div>

                        {execution.status === 'running' && (
                          <button
                            onClick={() =>
                              cancelExecution(execution.executionId)
                            }
                            className='text-red-500 hover:text-red-700'
                          >
                            <Square className='w-4 h-4' />
                          </button>
                        )}
                      </div>

                      {execution.progress !== undefined && (
                        <div
                          className={`w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2`}
                        >
                          <div
                            className={`h-2 rounded-full transition-all ${
                              execution.status === 'completed'
                                ? 'bg-green-500'
                                : execution.status === 'failed'
                                ? 'bg-red-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${execution.progress}%` }}
                          ></div>
                        </div>
                      )}

                      <p
                        className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {execution.startTime?.toLocaleTimeString()}
                        {execution.endTime &&
                          ` - ${execution.endTime.toLocaleTimeString()}`}
                      </p>
                    </div>
                  ))}

                {executions.length === 0 && (
                  <p
                    className={`text-center text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    No executions yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Execution Logs */}
          <div className='flex-1 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Execution Logs
              </h3>

              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setExecutionLogs([])}
                  className={`px-3 py-1 text-sm rounded-md ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Logs Container */}
            <div
              className={`h-full border rounded-md p-4 overflow-y-auto ${
                darkMode
                  ? 'border-gray-600 bg-gray-900'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {executionLogs.length > 0 ? (
                <div className='space-y-2'>
                  {executionLogs.map((log) => (
                    <div
                      key={log.id}
                      className='flex items-start space-x-3 text-sm'
                    >
                      <span className='text-gray-500 font-mono text-xs mt-0.5 min-w-20'>
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span
                        className={`font-medium uppercase text-xs mt-0.5 min-w-16 ${getLogTypeColor(
                          log.type
                        )}`}
                      >
                        {log.type}
                      </span>
                      <span
                        className={`flex-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <div className='text-center'>
                    <Eye
                      className={`w-12 h-12 mx-auto mb-4 ${
                        darkMode ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      No execution logs yet
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      Execute a workflow to see real-time logs
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionMonitor;
