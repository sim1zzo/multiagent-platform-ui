// components/Header.jsx
import React from 'react';
import { 
  Save, 
  Upload, 
  Settings, 
  HelpCircle, 
  User,
  Brain  // Added the missing Brain import
} from 'lucide-react';

export const Header = ({ onSave, onLoad }) => {
  return (
    <header className="h-16 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <div className="flex items-center mr-8">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white mr-2">
            <Brain className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold">MultiAgent Platform</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
  <a href="/dashboard" className="text-gray-800 hover:text-blue-600 text-sm font-medium">Dashboard</a>
  <a href="/agent-builder" className="text-blue-600 text-sm font-medium">Agent Builder</a>
  <a href="/simulations" className="text-gray-800 hover:text-blue-600 text-sm font-medium">Simulations</a>
  <a href="/analytics" className="text-gray-800 hover:text-blue-600 text-sm font-medium">Analytics</a>
</nav>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          onClick={onSave}
          title="Save Workspace"
        >
          <Save className="w-5 h-5" />
        </button>
        
        <button 
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          onClick={onLoad}
          title="Load Workspace"
        >
          <Upload className="w-5 h-5" />
        </button>
        
        <button 
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <button 
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          title="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        
        <button className="flex items-center text-sm font-medium text-gray-700">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <span className="hidden md:inline">User</span>
        </button>
      </div>
    </header>
  );
};