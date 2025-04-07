// components/edges/ConnectionLine.jsx
import React from 'react';
import { BaseEdge, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { Trash2 } from 'lucide-react';

export const ConnectionLine = ({ 
  id, 
  source, 
  target, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  sourcePosition, 
  targetPosition, 
  style = {}, 
  data, 
  markerEnd
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isHovered, setIsHovered] = React.useState(false);

  // Determine the type of connection based on the node types
  const getConnectionType = () => {
    if (!data || !source) return 'default';
    
    // Here we'll rely on the node ID patterns since we don't have direct access to nodes
    if (source.includes('model-')) {
      return 'model';
    } else if (source.includes('memory-')) {
      return 'memory';
    } else if (source.includes('tool-')) {
      return 'tool';
    }
    
    return 'default';
  };

  const getEdgeColor = () => {
    const connectionType = getConnectionType();
    
    if (isHovered) {
      // Brighter colors when hovered
      switch (connectionType) {
        case 'model':
          return '#0ea5e9'; // sky-500
        case 'memory':
          return '#14b8a6'; // teal-500
        case 'tool':
          return '#f59e0b'; // amber-500
        default:
          return '#3b82f6'; // blue-500
      }
    } else {
      // Normal colors
      switch (connectionType) {
        case 'model':
          return '#7dd3fc'; // sky-300
        case 'memory':
          return '#5eead4'; // teal-300
        case 'tool':
          return '#fcd34d'; // amber-300
        default:
          return '#93c5fd'; // blue-300
      }
    }
  };

  const getEdgeStyle = () => {
    const connectionType = getConnectionType();
    
    const baseStyle = {
      ...style,
      stroke: getEdgeColor(),
      strokeWidth: isHovered ? 2 : 1.5,
      transition: 'stroke 0.2s, stroke-width 0.2s',
    };
    
    // Add dashed line for tool connections
    if (connectionType === 'tool') {
      return {
        ...baseStyle,
        strokeDasharray: '5,5',
      };
    }
    
    // Add dotted line for memory connections
    if (connectionType === 'memory') {
      return {
        ...baseStyle,
        strokeDasharray: '3,3',
      };
    }
    
    return baseStyle;
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={getEdgeStyle()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      {isHovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <button
              className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-red-50 hover:border-red-300"
              title="Remove Connection"
              onClick={(event) => {
                event.stopPropagation();
                data?.onDelete();
              }}
            >
              <Trash2 className="w-3 h-3 text-gray-500 hover:text-red-500" />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};