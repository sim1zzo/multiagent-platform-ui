// App.jsx - Main container component
import React, { useState } from 'react';
import { Header } from './components/Header';
import { WorkspaceManager } from './components/WorkspaceManager';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { Toolbar } from './components/Toolbar';

const App = () => {
  const [agents, setAgents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [workspaceConfig, setWorkspaceConfig] = useState({
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    snapToGrid: true,
  });

  const handleAgentCreate = (agentType) => {
    const newAgent = {
      id: `agent-${Date.now()}`,
      type: agentType,
      name: `New ${agentType}`,
      position: { x: 100, y: 100 },
      role: 'explorer', // Default role
      parameters: {},
      knowledgeBase: null,
    };
    
    setAgents([...agents, newAgent]);
    setSelectedAgent(newAgent.id);
  };

  const handleAgentSelect = (agentId) => {
    setSelectedAgent(agentId);
  };

  const handleAgentUpdate = (agentId, updates) => {
    setAgents(agents.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  };

  const handleAgentDelete = (agentId) => {
    setAgents(agents.filter(agent => agent.id !== agentId));
    
    // Also remove any connections involving this agent
    setConnections(connections.filter(
      conn => conn.source !== agentId && conn.target !== agentId
    ));
    
    if (selectedAgent === agentId) {
      setSelectedAgent(null);
    }
  };

  const handleConnectionCreate = (sourceId, targetId) => {
    // Check if connection already exists
    const connectionExists = connections.some(
      conn => conn.source === sourceId && conn.target === targetId
    );
    
    if (!connectionExists && sourceId !== targetId) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        source: sourceId,
        target: targetId,
        type: 'default', // Can be extended for different connection types
      };
      
      setConnections([...connections, newConnection]);
    }
  };

  const handleConnectionDelete = (connectionId) => {
    setConnections(connections.filter(conn => conn.id !== connectionId));
  };

  const handleWorkspaceConfig = (updates) => {
    setWorkspaceConfig({ ...workspaceConfig, ...updates });
  };

  const handleSaveWorkspace = () => {
    const workspace = {
      agents,
      connections,
      config: workspaceConfig,
    };
    
    const workspaceJson = JSON.stringify(workspace);
    localStorage.setItem('multiagent-workspace', workspaceJson);
    
    // In a real application, you would likely save to a server
    console.log('Workspace saved', workspace);
  };

  const handleLoadWorkspace = () => {
    const savedWorkspace = localStorage.getItem('multiagent-workspace');
    
    if (savedWorkspace) {
      try {
        const workspace = JSON.parse(savedWorkspace);
        setAgents(workspace.agents || []);
        setConnections(workspace.connections || []);
        setWorkspaceConfig(workspace.config || workspaceConfig);
        setSelectedAgent(null);
      } catch (error) {
        console.error('Failed to load workspace', error);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onSave={handleSaveWorkspace} onLoad={handleLoadWorkspace} />
      
      <div className="flex flex-1 overflow-hidden">
        <Toolbar onAgentCreate={handleAgentCreate} />
        
        <WorkspaceManager
          agents={agents}
          connections={connections}
          selectedAgent={selectedAgent}
          workspaceConfig={workspaceConfig}
          onAgentSelect={handleAgentSelect}
          onAgentUpdate={handleAgentUpdate}
          onAgentDelete={handleAgentDelete}
          onConnectionCreate={handleConnectionCreate}
          onConnectionDelete={handleConnectionDelete}
          onWorkspaceConfig={handleWorkspaceConfig}
        />
        
        {selectedAgent && (
          <ConfigurationPanel
            agent={agents.find(a => a.id === selectedAgent)}
            onUpdate={(updates) => handleAgentUpdate(selectedAgent, updates)}
            onClose={() => setSelectedAgent(null)}
          />
        )}
      </div>
    </div>
  );
};

export default App;