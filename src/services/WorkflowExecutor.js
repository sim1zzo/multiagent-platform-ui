// src/services/WorkflowExecutor.js
// Core Workflow Execution Engine

class WorkflowExecutor {
  constructor() {
    this.executionState = new Map(); // Track execution state per workflow
    this.nodeExecutors = new Map(); // Register node executors
    this.eventListeners = new Map(); // Event listeners for progress tracking
    
    // Register default node executors
    this.registerNodeExecutors();
  }

  /**
   * Execute a workflow with given input data
   * @param {string} workflowId - Unique workflow identifier
   * @param {Object} workflow - Workflow definition (nodes, edges)
   * @param {Object} inputData - Input data to start workflow
   * @param {Object} options - Execution options (debug, timeout, etc.)
   * @returns {Promise<Object>} Execution result
   */
  async executeWorkflow(workflowId, workflow, inputData = {}, options = {}) {
    const executionId = `exec_${workflowId}_${Date.now()}`;
    
    // Initialize execution state
    const state = {
      executionId,
      workflowId,
      status: 'running',
      startTime: new Date(),
      endTime: null,
      input: inputData,
      output: null,
      error: null,
      nodeStates: new Map(), // Track state of each node
      executionPath: [], // Track execution order
      currentData: inputData, // Current data flowing through workflow
      debug: options.debug || false,
      timeout: options.timeout || 300000, // 5 minutes default
    };

    this.executionState.set(executionId, state);

    try {
      // Emit execution started event
      this.emitEvent('execution:started', { executionId, workflowId, input: inputData });

      // Find trigger nodes (entry points)
      const triggerNodes = workflow.nodes.filter(node => node.type === 'trigger');
      
      if (triggerNodes.length === 0) {
        throw new Error('No trigger nodes found in workflow');
      }

      // Start execution from trigger nodes
      const results = await Promise.all(
        triggerNodes.map(triggerNode => 
          this.executeNodeChain(executionId, workflow, triggerNode, inputData)
        )
      );

      // Update final state
      state.status = 'completed';
      state.endTime = new Date();
      state.output = results.length === 1 ? results[0] : results;

      this.emitEvent('execution:completed', {
        executionId,
        workflowId,
        output: state.output,
        duration: state.endTime - state.startTime
      });

      return {
        success: true,
        executionId,
        output: state.output,
        duration: state.endTime - state.startTime,
        executionPath: state.executionPath
      };

    } catch (error) {
      // Update error state
      state.status = 'failed';
      state.endTime = new Date();
      state.error = error.message;

      this.emitEvent('execution:failed', {
        executionId,
        workflowId,
        error: error.message,
        duration: state.endTime - state.startTime
      });

      return {
        success: false,
        executionId,
        error: error.message,
        duration: state.endTime - state.startTime,
        executionPath: state.executionPath
      };
    }
  }

  /**
   * Execute a chain of nodes starting from a specific node
   */
  async executeNodeChain(executionId, workflow, startNode, inputData) {
    const state = this.executionState.get(executionId);
    let currentData = inputData;
    let currentNode = startNode;

    while (currentNode) {
      // Execute current node
      try {
        state.executionPath.push(currentNode.id);
        
        this.emitEvent('node:started', {
          executionId,
          nodeId: currentNode.id,
          nodeName: currentNode.name,
          input: currentData
        });

        // Execute node with timeout
        const nodeResult = await Promise.race([
          this.executeNode(currentNode, currentData, state),
          this.createTimeoutPromise(state.timeout, `Node ${currentNode.name} timed out`)
        ]);

        // Update node state
        state.nodeStates.set(currentNode.id, {
          status: 'completed',
          input: currentData,
          output: nodeResult,
          startTime: new Date(),
          endTime: new Date()
        });

        this.emitEvent('node:completed', {
          executionId,
          nodeId: currentNode.id,
          nodeName: currentNode.name,
          output: nodeResult
        });

        currentData = nodeResult;

        // Find next node(s)
        const nextNodes = this.getNextNodes(workflow, currentNode.id);
        
        if (nextNodes.length === 0) {
          // End of chain
          break;
        } else if (nextNodes.length === 1) {
          // Single next node
          currentNode = nextNodes[0];
        } else {
          // Multiple next nodes - parallel execution
          const parallelResults = await Promise.all(
            nextNodes.map(nextNode => 
              this.executeNodeChain(executionId, workflow, nextNode, currentData)
            )
          );
          return parallelResults;
        }

      } catch (error) {
        // Update node error state
        state.nodeStates.set(currentNode.id, {
          status: 'failed',
          input: currentData,
          error: error.message,
          startTime: new Date(),
          endTime: new Date()
        });

        this.emitEvent('node:failed', {
          executionId,
          nodeId: currentNode.id,
          nodeName: currentNode.name,
          error: error.message
        });

        throw error;
      }
    }

    return currentData;
  }

  /**
   * Execute a single node
   */
  async executeNode(node, inputData, executionState) {
    const nodeType = node.type;
    const executor = this.nodeExecutors.get(nodeType);

    if (!executor) {
      throw new Error(`No executor found for node type: ${nodeType}`);
    }

    // Create execution context
    const context = {
      node,
      input: inputData,
      executionId: executionState.executionId,
      workflowId: executionState.workflowId,
      debug: executionState.debug,
      // Helper functions for nodes
      log: (message) => this.log(executionState.executionId, node.id, message),
      emit: (event, data) => this.emitEvent(event, { ...data, nodeId: node.id, executionId: executionState.executionId })
    };

    return await executor(context);
  }

  /**
   * Get next nodes in the workflow chain
   */
  getNextNodes(workflow, currentNodeId) {
    const outgoingEdges = workflow.edges.filter(edge => edge.source === currentNodeId);
    return outgoingEdges.map(edge => 
      workflow.nodes.find(node => node.id === edge.target)
    ).filter(Boolean);
  }

  /**
   * Register node executors for different node types
   */
  registerNodeExecutors() {
    // Trigger Node Executor
    this.nodeExecutors.set('trigger', async (context) => {
      const { node, input } = context;
      context.log(`Trigger activated: ${node.name}`);
      
      // For API triggers, return the input data
      // For scheduled triggers, this would handle cron logic
      return input;
    });

    // Agent Node Executor
    this.nodeExecutors.set('agent', async (context) => {
      const { node, input } = context;
      context.log(`Agent processing: ${node.name}`);
      
      // This would integrate with actual AI models
      // For now, simulate processing
      await this.simulateDelay(1000);
      
      return {
        ...input,
        agentResponse: `Processed by ${node.name}`,
        timestamp: new Date().toISOString(),
        agentId: node.id
      };
    });

    // Action Node Executor
    this.nodeExecutors.set('action', async (context) => {
      const { node, input } = context;
      context.log(`Action executing: ${node.name}`);
      
      // Execute the action based on actionType
      const actionType = node.actionType || 'log';
      
      switch (actionType) {
        case 'log':
          console.log('Workflow Action:', input);
          break;
        case 'webhook':
          await this.executeWebhook(node, input);
          break;
        case 'email':
          await this.sendEmail(node, input);
          break;
        default:
          context.log(`Unknown action type: ${actionType}`);
      }
      
      return {
        ...input,
        actionExecuted: node.name,
        actionType,
        timestamp: new Date().toISOString()
      };
    });

    // Condition Node Executor
    this.nodeExecutors.set('condition', async (context) => {
      const { node, input } = context;
      context.log(`Condition evaluating: ${node.name}`);
      
      // Evaluate condition (this would be more sophisticated)
      const condition = node.condition || 'true';
      const result = this.evaluateCondition(condition, input);
      
      return {
        ...input,
        conditionResult: result,
        conditionNode: node.id
      };
    });

    // Model Node Executor
    this.nodeExecutors.set('model', async (context) => {
      const { node, input } = context;
      context.log(`Model processing: ${node.name}`);
      
      // This would integrate with actual AI models (OpenAI, etc.)
      await this.simulateDelay(2000);
      
      return {
        ...input,
        modelResponse: `Response from ${node.modelType || 'default'} model`,
        modelId: node.id,
        timestamp: new Date().toISOString()
      };
    });

    // Memory Node Executor
    this.nodeExecutors.set('memory', async (context) => {
      const { node, input } = context;
      context.log(`Memory operation: ${node.name}`);
      
      // Memory operations (store/retrieve)
      const memoryType = node.memoryType || 'vector-store';
      
      return {
        ...input,
        memoryOperation: `${memoryType} operation completed`,
        memoryId: node.id,
        timestamp: new Date().toISOString()
      };
    });

    // Tool Node Executor
    this.nodeExecutors.set('tool', async (context) => {
      const { node, input } = context;
      context.log(`Tool executing: ${node.name}`);
      
      // Tool execution (API calls, file operations, etc.)
      const toolType = node.toolType || 'api-connector';
      
      return {
        ...input,
        toolResult: `${toolType} tool executed`,
        toolId: node.id,
        timestamp: new Date().toISOString()
      };
    });
  }

  /**
   * Register a custom node executor
   */
  registerNodeExecutor(nodeType, executor) {
    this.nodeExecutors.set(nodeType, executor);
  }

  /**
   * Add event listener for execution events
   */
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  emitEvent(event, data) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  /**
   * Get execution state
   */
  getExecutionState(executionId) {
    return this.executionState.get(executionId);
  }

  /**
   * Get all active executions
   */
  getActiveExecutions() {
    const activeExecutions = [];
    for (const [executionId, state] of this.executionState) {
      if (state.status === 'running') {
        activeExecutions.push({
          executionId,
          workflowId: state.workflowId,
          startTime: state.startTime,
          executionPath: state.executionPath
        });
      }
    }
    return activeExecutions;
  }

  /**
   * Cancel execution
   */
  cancelExecution(executionId) {
    const state = this.executionState.get(executionId);
    if (state && state.status === 'running') {
      state.status = 'cancelled';
      state.endTime = new Date();
      this.emitEvent('execution:cancelled', { executionId });
      return true;
    }
    return false;
  }

  /**
   * Helper methods
   */
  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  createTimeoutPromise(timeout, message) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), timeout);
    });
  }

  evaluateCondition(condition, input) {
    try {
      // Simple condition evaluation (would be more sophisticated in production)
      // This is a basic implementation - you'd want a proper expression evaluator
      const func = new Function('input', `return ${condition}`);
      return func(input);
    } catch (error) {
      console.error('Condition evaluation error:', error);
      return false;
    }
  }

  async executeWebhook(node, input) {
    // Implement webhook execution
    console.log('Executing webhook:', node.config, input);
    await this.simulateDelay(500);
  }

  async sendEmail(node, input) {
    // Implement email sending
    console.log('Sending email:', node.config, input);
    await this.simulateDelay(500);
  }

  log(executionId, nodeId, message) {
    console.log(`[${executionId}][${nodeId}] ${message}`);
  }

  /**
   * Clean up old execution states (should be called periodically)
   */
  cleanupOldExecutions(maxAge = 3600000) { // 1 hour default
    const now = new Date();
    for (const [executionId, state] of this.executionState) {
      if (state.endTime && (now - state.endTime) > maxAge) {
        this.executionState.delete(executionId);
      }
    }
  }
}

// Export singleton instance
export const workflowExecutor = new WorkflowExecutor();
export default WorkflowExecutor;