// components/visualization/AgentMemoryButton.jsx
import React from 'react';
import { Brain } from 'lucide-react';

export const AgentMemoryButton = ({ onClick, isSelected, disabled }) => {
  return (
    <button
      className={`flex items-center justify-center p-2 rounded-md transition-colors ${
        isSelected
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } border border-gray-300 dark:border-gray-600 shadow-sm`}
      onClick={onClick}
      disabled={disabled}
      title='View Agent Memory'
    >
      <Brain className='w-5 h-5' />
      <span className='ml-2 hidden md:inline'>Memory</span>
    </button>
  );
};
