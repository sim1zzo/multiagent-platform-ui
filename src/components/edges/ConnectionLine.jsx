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

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isHovered ? '#3b82f6' : '#64748b',
          strokeWidth: isHovered ? 2 : 1,
          transition: 'stroke 0.2s, stroke-width 0.2s',
        }}
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