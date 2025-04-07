// components/NavigationPanel.jsx
import React from 'react';
import { 
  Grid, 
  Maximize, 
  Minimize, 
  AlignCenter,
  Lock,
  Unlock
} from 'lucide-react';

export const NavigationPanel = ({ config, onConfigChange }) => {
  const toggleGrid = () => {
    onConfigChange({ showGrid: !config.showGrid });
  };
  
  const toggleSnapToGrid = () => {
    onConfigChange({ snapToGrid: !config.snapToGrid });
  };
  
  const zoomIn = () => {
    onConfigChange({ zoom: Math.min(config.zoom + 0.2, 2) });
  };
  
  const zoomOut = () => {
    onConfigChange({ zoom: Math.max(config.zoom - 0.2, 0.2) });
  };
  
  const resetView = () => {
    onConfigChange({ zoom: 1, panX: 0, panY: 0 });
  };

  return (
    <div className="absolute bottom-4 right-4 flex flex-col bg-white border border-gray-200 rounded-md shadow-md">
      <div className="p-2 border-b border-gray-200">
        <button
          className={`p-2 rounded-md hover:bg-gray-100 ${config.showGrid ? 'text-blue-600' : 'text-gray-500'}`}
          onClick={toggleGrid}
          title="Toggle Grid"
        >
          <Grid className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-2 border-b border-gray-200">
        <button
          className={`p-2 rounded-md hover:bg-gray-100 ${config.snapToGrid ? 'text-blue-600' : 'text-gray-500'}`}
          onClick={toggleSnapToGrid}
          title={config.snapToGrid ? "Snap to Grid" : "Free Movement"}
        >
          {config.snapToGrid ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="p-2 border-b border-gray-200 flex flex-col items-center">
        <button
          className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
          onClick={zoomIn}
          title="Zoom In"
        >
          <Maximize className="w-5 h-5" />
        </button>
        
        <div className="my-1 text-xs font-medium">
          {Math.round(config.zoom * 100)}%
        </div>
        
        <button
          className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
          onClick={zoomOut}
          title="Zoom Out"
        >
          <Minimize className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-2">
        <button
          className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
          onClick={resetView}
          title="Reset View"
        >
          <AlignCenter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};