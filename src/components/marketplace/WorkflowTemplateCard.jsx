// components/marketplace/WorkflowTemplateCard.jsx
import React from 'react';
import { Star, Download, Clock, User, Zap, Tag } from 'lucide-react';

export const WorkflowTemplateCard = ({ template, onClick }) => {
  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get number of stars based on rating (rounded to nearest 0.5)
  const getStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className='flex items-center'>
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className='w-4 h-4 text-yellow-400 fill-yellow-400'
          />
        ))}
        {halfStar && (
          <div className='relative'>
            <Star className='w-4 h-4 text-yellow-400' />
            <div className='absolute inset-0 overflow-hidden w-1/2'>
              <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className='w-4 h-4 text-yellow-400' />
        ))}
        <span className='ml-1 text-xs text-gray-600 dark:text-gray-400'>
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // Get complexity badge color
  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Get complexity label
  const getComplexityLabel = (complexity) => {
    switch (complexity) {
      case 'beginner':
        return 'Beginner';
      case 'medium':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Unknown';
    }
  };

  // Format download count with K/M suffix
  const formatDownloads = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div
      className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1 transition-transform duration-200'
      onClick={onClick}
    >
      {/* Preview Image */}
      <div className='h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden'>
        {/* This would be an actual image in a real implementation */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-gray-500 dark:text-gray-400'>
            {template.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Featured badge */}
        {template.featured && (
          <div className='absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center'>
            <Zap className='w-3 h-3 mr-1' />
            Featured
          </div>
        )}

        {/* Premium badge */}
        {template.premium && (
          <div className='absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md'>
            Premium
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-4'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-1 truncate'>
          {template.name}
        </h3>

        <div className='flex items-center mb-2'>
          <User className='w-3 h-3 text-gray-500 dark:text-gray-400 mr-1' />
          <span className='text-xs text-gray-600 dark:text-gray-400'>
            {template.author.name}
            {template.author.company && ` • ${template.author.company}`}
          </span>
        </div>

        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
          {template.description}
        </p>

        {/* Tags */}
        <div className='flex flex-wrap gap-1 mb-3'>
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className='bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md flex items-center'
            >
              <Tag className='w-3 h-3 mr-1' />
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className='text-xs text-gray-500 dark:text-gray-400 px-1'>
              +{template.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className='flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mt-3'>
          <div>{getStars(template.rating)}</div>

          <div className='flex items-center text-gray-600 dark:text-gray-400'>
            <Download className='w-4 h-4 mr-1' />
            <span className='text-xs'>
              {formatDownloads(template.downloads)}
            </span>
          </div>

          <div className='flex items-center text-gray-600 dark:text-gray-400'>
            <Clock className='w-4 h-4 mr-1' />
            <span className='text-xs'>{formatDate(template.lastUpdated)}</span>
          </div>
        </div>

        {/* Complexity */}
        <div className='mt-3'>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(
              template.complexity
            )}`}
          >
            {getComplexityLabel(template.complexity)} • {template.nodeCount}{' '}
            Nodes
          </span>
        </div>
      </div>
    </div>
  );
};
