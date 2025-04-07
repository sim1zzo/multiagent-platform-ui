// components/Toolbar.jsx
import React, { useState } from 'react';
import { 
  Brain, 
  Search, 
  MessageSquare, 
  Lightbulb, 
  Database, 
  Play,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  Tag,
  Save,
  Upload
} from 'lucide-react';

export const Toolbar = ({ onAgentCreate }) => {
  const [expanded, setExpanded] = useState(true);
  
  const agentTypes = [
    { id: 'basic', name: 'Basic Agent', icon: <Brain className="w-5 h-5" />, description: 'General purpose agent with basic capabilities' },
    { id: 'searcher', name: 'Searcher', icon: <Search className="w-5 h-5" />, description: 'Specialized in information retrieval' },
    { id: 'communicator', name: 'Communicator', icon: <MessageSquare className="w-5 h-5" />, description: 'Focused on agent-to-agent communications' },
    { id: 'reasoner', name: 'Reasoner', icon: <Lightbulb className="w-5 h-5" />, description: 'Specialized in logical inference and reasoning' },
    { id: 'memory', name: 'Memory', icon: <Database className="w-5 h-5" />, description: 'Stores and retrieves information' },
    { id: 'executor', name: 'Executor', icon: <Play className="w-5 h-5" />, description: 'Executes actions in the environment' },
  ];
  
  const organizationTools = [
    { id: 'createFolder', name: 'Create Folder', icon: <FolderPlus className="w-5 h-5" /> },
    { id: 'addTag', name: 'Add Tag', icon: <Tag className="w-5 h-5" /> },
    { id: 'saveWorkspace', name: 'Save Workspace', icon: <Save className="w-5 h-5" /> },
    { id: 'loadWorkspace', name: 'Load Workspace', icon: <Upload className="w-5 h-5" /> },
  ];

  return (
    <div className={`h-full border-r border-gray-200 bg-white transition-all duration-300 ${expanded ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className={`font-medium ${expanded ? 'block' : 'hidden'}`}>Toolbox</h2>
        <button
          className="p-1 rounded-md hover:bg-gray-100"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
      
      <div className="p-2">
        <div className="mb-6">
          <h3 className={`text-sm font-medium text-gray-700 mb-3 ${expanded ? 'block' : 'hidden'}`}>
            Agent Types
          </h3>
          
          <div className="space-y-2">
            {agentTypes.map(agentType => (
              <button
                key={agentType.id}
                className={`flex items-center w-full p-2 rounded-md hover:bg-gray-100 transition-colors ${expanded ? 'justify-start' : 'justify-center'}`}
                onClick={() => onAgentCreate(agentType.id)}
                title={!expanded ? agentType.name : undefined}
              >
                <div className="text-gray-600">
                  {agentType.icon}
                </div>
                
                {expanded && (
                  <div className="ml-3 text-left">
                    <div className="text-sm font-medium text-gray-700">{agentType.name}</div>
                    <div className="text-xs text-gray-500">{agentType.description}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium text-gray-700 mb-3 ${expanded ? 'block' : 'hidden'}`}>
            Organization
          </h3>
          
          <div className="space-y-2">
            {organizationTools.map(tool => (
              <button
                key={tool.id}
                className={`flex items-center w-full p-2 rounded-md hover:bg-gray-100 transition-colors ${expanded ? 'justify-start' : 'justify-center'}`}
                title={!expanded ? tool.name : undefined}
              >
                <div className="text-gray-600">
                  {tool.icon}
                </div>
                
                {expanded && (
                  <div className="ml-3 text-left">
                    <div className="text-sm font-medium text-gray-700">{tool.name}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};