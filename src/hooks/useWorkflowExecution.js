// src/hooks/useWorkflowExecution.js
// Custom hook for managing workflow execution state

import { useState, useEffect, useCallback } from 'react';
import { workflowExecutor } from '../services/WorkflowExecutor';

export const useWorkflowExecution = () => {
  const [executions, setExecutions] = useState([]);
  const [currentExecution, setCurrentExecution] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);

  // Setup event listeners
  useEffect(() => {
    const handleExecutionStarted = (data) => {
      const execution = {
        ...data,
        status: 'running',
        startTime: new Date(),
        progress: 0,
        logs: [],
      };

      setExecutions((prev) => [execution, ...prev]);
      setCurrentExecution(data.executionId);
      setIsExecuting(true);

      addLog(
        data.executionId,
        'info',
        `Execution started: ${data.executionId}`
      );
    };

    const handleExecutionCompleted = (data) => {
      setExecutions((prev) =>
        prev.map((exec) =>
          exec.executionId === data.executionId
            ? {
                ...exec,
                status: 'completed',
                endTime: new Date(),
                duration: data.duration,
                output: data.output,
                progress: 100,
              }
            : exec
        )
      );

      setIsExecuting(false);
      if (currentExecution === data.executionId) {
        setCurrentExecution(null);
      }

      addLog(
        data.executionId,
        'success',
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
                duration: data.duration,
              }
            : exec
        )
      );

      setIsExecuting(false);
      if (currentExecution === data.executionId) {
        setCurrentExecution(null);
      }

      addLog(data.executionId, 'error', `Execution failed: ${data.error}`);
    };

    const handleNodeStarted = (data) => {
      addLog(data.executionId, 'info', `Node started: ${data.nodeName}`);
      updateProgress(data.executionId);
    };

    const handleNodeCompleted = (data) => {
      addLog(data.executionId, 'success', `Node completed: ${data.nodeName}`);
      updateProgress(data.executionId);
    };

    const handleNodeFailed = (data) => {
      addLog(
        data.executionId,
        'error',
        `Node failed: ${data.nodeName} - ${data.error}`
      );
    };

    // Register listeners
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
  }, [currentExecution]);

  const addLog = useCallback((executionId, type, message) => {
    const log = {
      id: Date.now() + Math.random(),
      executionId,
      type,
      message,
      timestamp: new Date(),
    };

    setExecutionLogs((prev) => [...prev, log]);

    // Also add to execution-specific logs
    setExecutions((prev) =>
      prev.map((exec) =>
        exec.executionId === executionId
          ? { ...exec, logs: [...(exec.logs || []), log] }
          : exec
      )
    );
  }, []);

  const updateProgress = useCallback(
    (executionId) => {
      const state = workflowExecutor.getExecutionState(executionId);
      if (state) {
        const execution = executions.find((e) => e.executionId === executionId);
        if (execution && execution.workflowNodeCount) {
          const progress = Math.min(
            (state.executionPath.length / execution.workflowNodeCount) * 100,
            100
          );

          setExecutions((prev) =>
            prev.map((exec) =>
              exec.executionId === executionId ? { ...exec, progress } : exec
            )
          );
        }
      }
    },
    [executions]
  );

  const executeWorkflow = useCallback(
    async (workflowId, workflow, inputData = {}, options = {}) => {
      if (isExecuting) {
        throw new Error('Another workflow is already executing');
      }

      try {
        // Add workflow node count for progress calculation
        const executionOptions = {
          ...options,
          workflowNodeCount: workflow.nodes?.length || 0,
        };

        const result = await workflowExecutor.executeWorkflow(
          workflowId,
          workflow,
          inputData,
          executionOptions
        );

        return result;
      } catch (error) {
        console.error('Workflow execution failed:', error);
        throw error;
      }
    },
    [isExecuting]
  );

  const cancelExecution = useCallback(
    (executionId) => {
      const success = workflowExecutor.cancelExecution(executionId);
      if (success) {
        setExecutions((prev) =>
          prev.map((exec) =>
            exec.executionId === executionId
              ? { ...exec, status: 'cancelled', endTime: new Date() }
              : exec
          )
        );

        if (currentExecution === executionId) {
          setCurrentExecution(null);
          setIsExecuting(false);
        }

        addLog(executionId, 'warning', 'Execution cancelled by user');
      }
      return success;
    },
    [currentExecution]
  );

  const clearExecutions = useCallback(() => {
    setExecutions([]);
    setExecutionLogs([]);
    setCurrentExecution(null);
  }, []);

  const clearLogs = useCallback(() => {
    setExecutionLogs([]);
  }, []);

  const getExecutionById = useCallback(
    (executionId) => {
      return executions.find((exec) => exec.executionId === executionId);
    },
    [executions]
  );

  const getExecutionLogs = useCallback(
    (executionId = null) => {
      if (executionId) {
        return executionLogs.filter((log) => log.executionId === executionId);
      }
      return executionLogs;
    },
    [executionLogs]
  );

  const getActiveExecutions = useCallback(() => {
    return executions.filter((exec) => exec.status === 'running');
  }, [executions]);

  const getExecutionStats = useCallback(() => {
    const total = executions.length;
    const completed = executions.filter((e) => e.status === 'completed').length;
    const failed = executions.filter((e) => e.status === 'failed').length;
    const running = executions.filter((e) => e.status === 'running').length;
    const cancelled = executions.filter((e) => e.status === 'cancelled').length;

    const successRate = total > 0 ? (completed / total) * 100 : 0;

    const avgDuration = executions
      .filter((e) => e.duration)
      .reduce((acc, e, _, arr) => acc + e.duration / arr.length, 0);

    return {
      total,
      completed,
      failed,
      running,
      cancelled,
      successRate,
      avgDuration,
    };
  }, [executions]);

  return {
    // State
    executions,
    currentExecution,
    isExecuting,
    executionLogs,

    // Actions
    executeWorkflow,
    cancelExecution,
    clearExecutions,
    clearLogs,

    // Getters
    getExecutionById,
    getExecutionLogs,
    getActiveExecutions,
    getExecutionStats,

    // Utils
    addLog,
  };
};
