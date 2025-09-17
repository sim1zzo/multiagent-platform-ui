// App.jsx - Import section update
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WorkspaceManager } from './components/WorkspaceManager';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { Toolbar } from './components/Toolbar';
import { ErrorModal } from './components/modals/ErrorModal';
import { NotificationModal } from './components/modals/NotificationModal';
import { CustomNodeCreationModal } from './components/modals/CustomNodeCreationModal';
import { LoginPage } from './components/pages/LoginPage';
import { Settings } from './components/pages/Settings';
import { Profile } from './components/pages/Profile';
import { AppProvider, useApp } from './components/context/AppContext';
import { WorkflowMarketplace } from './components/marketplace/WorkflowMarketplace';
import { AgentMemoryVisualization } from './components/visualization/AgentMemoryVisualization';
import { useWorkflowMarketplace } from './hooks/useWorkflowMarketplace';
import { Dashboard } from './components/pages/Dashboard';
import { Analytics } from './components/pages/Analytics';
import { Tools } from './components/pages/Tools';
import { ToolBuilder } from './components/tools/ToolBuilder';
import { Simulations } from './components/pages/Simulations';
import ConversationFlowVisualizer from './components/visualization/ConversationFlowVisualizer';

const MainApp = () => {
  // Get app context
  const { activePage, navigateTo, settings } = useApp();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Use the marketplace hook
  const {
    isMarketplaceOpen,
    openMarketplace,
    closeMarketplace,
    importTemplate,
  } = useWorkflowMarketplace();

  // On component mount, check if user is already authenticated (from local storage)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Handle invalid stored user data
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login handler
  const handleLogin = (userData) => {
    // Save user to state and localStorage
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Workflow state
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Tools management state
  const [showToolBuilder, setShowToolBuilder] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [toolBuilderMode, setToolBuilderMode] = useState('create');

  // Memory visualization state
  const [memoryVisualizationOpen, setMemoryVisualizationOpen] = useState(false);
  const [selectedAgentForMemory, setSelectedAgentForMemory] = useState(null);

  // UI state
  const [workspaceConfig, setWorkspaceConfig] = useState({
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    snapToGrid: true,
    darkMode: settings.preferences.theme === 'dark',
  });

  // Modal state
  const [nodeCreationModal, setNodeCreationModal] = useState({
    isOpen: false,
    nodeType: null,
  });

  // Separate modals for error and notification/success
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: '',
  });

  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    message: '',
    type: 'info', // can be 'success', 'info', 'warning'
  });

  // Apply dark mode classes to body
  useEffect(() => {
    if (workspaceConfig.darkMode) {
      document.body.classList.add('dark', 'bg-gray-900');
    } else {
      document.body.classList.remove('dark', 'bg-gray-900');
    }
  }, [workspaceConfig.darkMode]);

  // Update darkMode when theme preference changes
  useEffect(() => {
    setWorkspaceConfig((prev) => ({
      ...prev,
      darkMode: settings.preferences.theme === 'dark',
    }));
  }, [settings.preferences.theme]);

  // Initialize node creation - check rules before opening modal
  const handleInitNodeCreate = (nodeType) => {
    // Rule: First node must be a trigger
    if (nodes.length === 0 && nodeType !== 'trigger') {
      setErrorModal({
        isOpen: true,
        message:
          'The first node in a workflow must be a Trigger Node. Please add a Trigger Node before adding other nodes.',
      });
      return;
    }

    // Show node creation modal
    setNodeCreationModal({
      isOpen: true,
      nodeType,
    });
  };

  // Helper function to get tool name from ID
  const getToolName = (toolId) => {
    const toolNames = {
      rag: 'Retrieval Augmented Generation',
      'web-search': 'Web Search',
      'code-interpreter': 'Code Interpreter',
      'api-connector': 'API Connector',
      database: 'Database Connector',
      file: 'File Processor',
      scraper: 'Web Scraper',
      mongodb: 'MongoDB Connector',
    };

    return toolNames[toolId] || `${toolId} Tool`;
  };

  // Create node after modal confirmation
  const handleNodeCreate = (nodeData) => {
    const newNode = {
      id: `${nodeData.nodeType || nodeCreationModal.nodeType}-${Date.now()}`,
      type: nodeData.nodeType || nodeCreationModal.nodeType,
      name: nodeData.name,
      position: { x: 100, y: 100 },
      ...nodeData,
    };

    let newNodes = [...nodes, newNode];
    let newEdges = [...edges];

    // If this is an agent node, create model, memory, and tool nodes
    if (newNode.type === 'agent') {
      // Create model node with updated defaults
      const modelNode = {
        id: `model-${Date.now()}`,
        type: 'model',
        name: `${newNode.model || settings.ai?.defaultModel || 'gpt-5'} Model`,
        modelType: newNode.model || settings.ai?.defaultModel || 'gpt-5',
        position: {
          x: newNode.position.x - 200,
          y: newNode.position.y + 150,
        },
      };

      const modelEdge = {
        id: `edge-${modelNode.id}-to-${newNode.id}`,
        source: modelNode.id,
        target: newNode.id,
        sourceHandle: 'output',
        targetHandle: 'model',
      };

      // Create memory node with updated defaults
      const memoryNode = {
        id: `memory-${Date.now()}`,
        type: 'memory',
        name: `${(
          newNode.memory ||
          settings.ai?.defaultMemoryType ||
          'short-memory'
        )
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase())} Memory`,
        memoryType:
          newNode.memory || settings.ai?.defaultMemoryType || 'short-memory',
        position: {
          x: newNode.position.x,
          y: newNode.position.y + 150,
        },
      };

      const memoryEdge = {
        id: `edge-${memoryNode.id}-to-${newNode.id}`,
        source: memoryNode.id,
        target: newNode.id,
        sourceHandle: 'output',
        targetHandle: 'memory',
      };

      // Add model and memory nodes and edges
      newNodes.push(modelNode);
      newNodes.push(memoryNode);
      newEdges.push(modelEdge);
      newEdges.push(memoryEdge);

      // =================================================================
      // RIABILITARE QUESTA SEZIONE - Creazione Tool nodes separati
      // =================================================================

      // Use default tools from settings if none are provided
      const toolsToAdd =
        newNode.tools && newNode.tools.length > 0
          ? newNode.tools
          : settings.ai?.defaultTools || [
              'web-search',
              'code-interpreter',
              'mongodb',
            ];

      // Create tool nodes if any tools are selected
      if (toolsToAdd.length > 0) {
        const toolsPerRow = 3;
        const horizontalSpacing = 170;
        const verticalSpacing = 120;
        const startX = newNode.position.x + 200;
        const startY = newNode.position.y + 150;

        toolsToAdd.forEach((toolId, index) => {
          const row = Math.floor(index / toolsPerRow);
          const col = index % toolsPerRow;

          const toolNode = {
            id: `tool-${toolId}-${Date.now()}-${index}`,
            type: 'tool',
            name: getToolName(toolId),
            toolType: toolId,
            position: {
              x: startX + col * horizontalSpacing,
              y: startY + row * verticalSpacing,
            },
            config: '',
          };

          // Create edge from tool to agent
          const toolEdge = {
            id: `edge-${toolNode.id}-to-${newNode.id}`,
            source: toolNode.id,
            target: newNode.id,
            sourceHandle: 'output',
            targetHandle: 'tool',
          };

          newNodes.push(toolNode);
          newEdges.push(toolEdge);
        });
      }

      // Remove properties from agent node since they're now separate nodes
      delete newNode.model;
      delete newNode.memory;
      // PUOI decidere se mantenere o cancellare tools:
      // OPZIONE A: Cancella tools (solo nodi separati)
      delete newNode.tools;

      // OPZIONE B: Mantieni tools (nodi separati + visualizzazione interna)
      // Non cancellare newNode.tools se vuoi entrambi
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNode(newNode.id);
    setNodeCreationModal({ isOpen: false, nodeType: null });
  };

  // Cancel node creation
  const handleCancelNodeCreate = () => {
    setNodeCreationModal({ isOpen: false, nodeType: null });
  };

  // Select node
  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId);
  };

  // Update node
  const handleNodeUpdate = (nodeId, updates) => {
    setNodes(
      nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node))
    );
  };

  // Delete node
  const handleNodeDelete = (nodeId) => {
    const nodeToDelete = nodes.find((node) => node.id === nodeId);

    if (!nodeToDelete) return;

    // Optionally confirm deletion if enabled in settings
    if (settings.preferences.confirmNodeDeletion) {
      if (
        !window.confirm(
          `Are you sure you want to delete the "${nodeToDelete.name}" node?`
        )
      ) {
        return;
      }
    }

    // For agent nodes, also delete connected model, memory, and tool nodes
    let nodesToDelete = [nodeId];

    if (nodeToDelete.type === 'agent') {
      // Find all connected model, memory, and tool nodes
      edges.forEach((edge) => {
        if (edge.target === nodeId) {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          if (
            sourceNode &&
            (sourceNode.type === 'model' || sourceNode.type === 'memory')
            // Rimosso: sourceNode.type === 'tool'
          ) {
            nodesToDelete.push(sourceNode.id);
          }
        }
      });
    }

    // Delete nodes
    setNodes(nodes.filter((node) => !nodesToDelete.includes(node.id)));

    // Delete edges connected to any of these nodes
    setEdges(
      edges.filter(
        (edge) =>
          !nodesToDelete.includes(edge.source) &&
          !nodesToDelete.includes(edge.target)
      )
    );

    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  // Create connection (edge)
  const handleConnectionCreate = (params) => {
    // Check if connection already exists
    const connectionExists = edges.some(
      (edge) =>
        edge.source === params.source &&
        edge.target === params.target &&
        edge.sourceHandle === params.sourceHandle &&
        edge.targetHandle === params.targetHandle
    );

    if (!connectionExists && params.source !== params.target) {
      // Get source and target node types
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      // Validate connection rules
      if (sourceNode && targetNode) {
        // Model nodes can only connect to agent nodes
        if (sourceNode.type === 'model' && targetNode.type !== 'agent') {
          setErrorModal({
            isOpen: true,
            message: 'Model nodes can only connect to Agent nodes.',
          });
          return;
        }
        // Memory nodes can only connect to agent nodes
        if (sourceNode.type === 'memory' && targetNode.type !== 'agent') {
          setErrorModal({
            isOpen: true,
            message: 'Memory nodes can only connect to Agent nodes.',
          });
          return;
        }

        // Tool nodes can only connect to agent nodes
        if (sourceNode.type === 'tool' && targetNode.type !== 'agent') {
          setErrorModal({
            isOpen: true,
            message: 'Tool nodes can only connect to Agent nodes.',
          });
          return;
        }

        // Add additional validation rules here if needed
      }

      const newEdge = {
        id: `edge-${Date.now()}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      };

      setEdges([...edges, newEdge]);
    }
  };

  // Delete connection
  const handleConnectionDelete = (edgeId) => {
    setEdges(edges.filter((edge) => edge.id !== edgeId));
  };

  // Update workspace configuration
  const handleWorkspaceConfig = (updates) => {
    setWorkspaceConfig({ ...workspaceConfig, ...updates });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !workspaceConfig.darkMode;
    setWorkspaceConfig({
      ...workspaceConfig,
      darkMode: newDarkMode,
    });
  };

  // Tool management functions
  const handleCreateTool = () => {
    setEditingTool(null);
    setToolBuilderMode('create');
    setShowToolBuilder(true);
  };

  const handleEditTool = (tool) => {
    setEditingTool(tool);
    setToolBuilderMode('edit');
    setShowToolBuilder(true);
  };

  const handleSaveTool = (toolData) => {
    setNotificationModal({
      isOpen: true,
      message: `Tool ${
        toolBuilderMode === 'create' ? 'created' : 'updated'
      } successfully!`,
      type: 'success',
    });

    setShowToolBuilder(false);
    setEditingTool(null);
  };

  const handleCancelToolBuilder = () => {
    setShowToolBuilder(false);
    setEditingTool(null);
  };
  // Export workspace
  const handleExportWorkflow = () => {
    const workspace = {
      nodes,
      edges,
      config: workspaceConfig,
    };

    // Create a JSON Blob
    const jsonBlob = new Blob([JSON.stringify(workspace, null, 2)], {
      type: 'application/json',
    });

    // Create a download link
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-export-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success notification
    setNotificationModal({
      isOpen: true,
      message: 'Workflow exported successfully',
      type: 'success',
    });
  };

  // Reset workspace
  const handleResetWorkflow = () => {
    if (
      window.confirm(
        'Are you sure you want to reset the workspace? All unsaved changes will be lost.'
      )
    ) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);

      // Show success notification
      setNotificationModal({
        isOpen: true,
        message: 'Workspace has been reset',
        type: 'info',
      });
    }
  };

  // Save workspace
  const handleSaveWorkspace = () => {
    const workspace = {
      nodes,
      edges,
      config: workspaceConfig,
    };

    const workspaceJson = JSON.stringify(workspace);
    localStorage.setItem('workflow-workspace', workspaceJson);

    // Show success notification
    setNotificationModal({
      isOpen: true,
      message: 'Workspace saved successfully',
      type: 'success',
    });
  };

  // Load workspace
  const handleLoadWorkspace = () => {
    const savedWorkspace = localStorage.getItem('workflow-workspace');

    if (savedWorkspace) {
      try {
        const workspace = JSON.parse(savedWorkspace);
        setNodes(workspace.nodes || []);
        setEdges(workspace.edges || []);
        setWorkspaceConfig(workspace.config || workspaceConfig);
        setSelectedNode(null);

        // Show success notification
        setNotificationModal({
          isOpen: true,
          message: 'Workspace loaded successfully',
          type: 'success',
        });
      } catch (error) {
        console.error('Failed to load workspace', error);
        setErrorModal({
          isOpen: true,
          message: 'Failed to load workspace: ' + error.message,
        });
      }
    } else {
      setErrorModal({
        isOpen: true,
        message: 'No saved workspace found',
      });
    }
  };

  // Handle importing workflow from the marketplace
  const handleImportWorkflow = (workflowData) => {
    if (!workflowData) return;

    // Clear existing workspace first
    setNodes(workflowData.nodes || []);
    setEdges(workflowData.edges || []);
    setSelectedNode(null);

    // Show success message with notification modal instead of error modal
    setNotificationModal({
      isOpen: true,
      message: `Successfully imported workflow "${
        workflowData.importedFrom?.templateName || 'Template'
      }"`,
      type: 'success',
    });
  };

  // Open the agent memory visualization
  const handleOpenMemoryVisualization = (agentId) => {
    setSelectedAgentForMemory(agentId);
    setMemoryVisualizationOpen(true);
  };

  // Close the agent memory visualization
  const handleCloseMemoryVisualization = () => {
    setMemoryVisualizationOpen(false);
    setSelectedAgentForMemory(null);
  };

  // Auto-save functionality
  useEffect(() => {
    // Set up auto-save if enabled
    if (settings.preferences.autoSave && nodes.length > 0) {
      const saveInterval = settings.preferences.saveInterval || 5;
      const intervalId = setInterval(() => {
        handleSaveWorkspace();
      }, saveInterval * 60 * 1000); // Convert minutes to milliseconds

      return () => clearInterval(intervalId);
    }
  }, [
    nodes,
    edges,
    settings.preferences.autoSave,
    settings.preferences.saveInterval,
  ]);

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render the appropriate page based on activePage state
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'simulations':
        return <Simulations />;
      case 'settings':
        return <Settings />;
      case 'tools':
        return (
          <Tools onCreateTool={handleCreateTool} onEditTool={handleEditTool} />
        );
      case 'profile':
        return <Profile />;
      case 'workflow':
      default:
        return (
          <div className='flex flex-1 overflow-hidden'>
            <Toolbar
              onNodeCreate={handleInitNodeCreate}
              onOpenMarketplace={openMarketplace}
            />

            <WorkspaceManager
              nodes={nodes}
              edges={edges}
              selectedNode={selectedNode}
              workspaceConfig={workspaceConfig}
              onNodeSelect={handleNodeSelect}
              onNodeUpdate={handleNodeUpdate}
              onNodeDelete={handleNodeDelete}
              onConnectionCreate={handleConnectionCreate}
              onConnectionDelete={handleConnectionDelete}
              onWorkspaceConfig={handleWorkspaceConfig}
              onOpenMemoryVisualization={handleOpenMemoryVisualization}
            />

            {selectedNode && (
              <ConfigurationPanel
                node={nodes.find((n) => n.id === selectedNode)}
                onUpdate={(updates) => handleNodeUpdate(selectedNode, updates)}
                onClose={() => setSelectedNode(null)}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={`h-screen flex flex-col ${
        workspaceConfig.darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'
      }`}
    >
      <Header
        onSave={handleSaveWorkspace}
        onLoad={handleLoadWorkspace}
        onExport={handleExportWorkflow}
        onReset={handleResetWorkflow}
        onOpenMarketplace={openMarketplace}
        darkMode={workspaceConfig.darkMode}
        toggleDarkMode={toggleDarkMode}
        navigateTo={navigateTo}
        activePage={activePage}
        userName={user.name}
        userInitials={user}
        onLogout={handleLogout}
      />

      {renderPage()}

      {/* Modals */}
      <CustomNodeCreationModal
        isOpen={nodeCreationModal.isOpen}
        nodeType={nodeCreationModal.nodeType}
        initialData={{}}
        onConfirm={handleNodeCreate}
        onCancel={handleCancelNodeCreate}
      />

      {/* Error Modal - only for errors */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />

      {/* Notification Modal - for success, info, and warnings */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        message={notificationModal.message}
        type={notificationModal.type}
        onClose={() =>
          setNotificationModal({ isOpen: false, message: '', type: 'info' })
        }
      />

      {/* Marketplace Modal */}
      {isMarketplaceOpen && (
        <WorkflowMarketplace
          onImportWorkflow={handleImportWorkflow}
          onClose={closeMarketplace}
        />
      )}

      {/* Memory Visualization Modal */}
      {memoryVisualizationOpen && selectedAgentForMemory && (
        <AgentMemoryVisualization
          agentId={selectedAgentForMemory}
          onClose={handleCloseMemoryVisualization}
        />
      )}
      {/* Tool Builder Modal */}
      {showToolBuilder && (
        <ToolBuilder
          tool={editingTool}
          mode={toolBuilderMode}
          onSave={handleSaveTool}
          onCancel={handleCancelToolBuilder}
        />
      )}
    </div>
  );
};

// Wrap the main app with the AppProvider
const App = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
