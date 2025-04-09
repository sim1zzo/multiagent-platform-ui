// components/modals/NotificationModal.jsx
import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

/**
 * NotificationModal - A modal for displaying different types of notifications
 * @param {boolean} isOpen - Whether the modal is open
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success', 'error', 'info', 'warning')
 * @param {function} onClose - Function to call when closing the modal
 */
export const NotificationModal = ({
  isOpen,
  message,
  type = 'info',
  onClose,
}) => {
  if (!isOpen) return null;

  // Determine icon and styles based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className='w-5 h-5 mr-2' />,
          textColor: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900',
          borderColor: 'border-green-200 dark:border-green-800',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          title: 'Success',
        };
      case 'error':
        return {
          icon: <AlertTriangle className='w-5 h-5 mr-2' />,
          textColor: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900',
          borderColor: 'border-red-200 dark:border-red-800',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          title: 'Error',
        };
      case 'warning':
        return {
          icon: <AlertCircle className='w-5 h-5 mr-2' />,
          textColor: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          title: 'Warning',
        };
      case 'info':
      default:
        return {
          icon: <Info className='w-5 h-5 mr-2' />,
          textColor: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900',
          borderColor: 'border-blue-200 dark:border-blue-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          title: 'Information',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md ${styles.borderColor}`}
      >
        <div
          className={`flex items-center justify-between p-4 border-b ${styles.borderColor}`}
        >
          <h2
            className={`text-lg font-medium ${styles.textColor} flex items-center`}
          >
            {styles.icon}
            {styles.title}
          </h2>
          <button
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            onClick={onClose}
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div
          className={`p-6 ${styles.bgColor} bg-opacity-20 dark:bg-opacity-20`}
        >
          <p className='text-gray-700 dark:text-gray-300'>{message}</p>
        </div>

        <div className='flex justify-end p-4 border-t border-gray-200 dark:border-gray-700'>
          <button
            type='button'
            className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${styles.buttonColor}`}
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
