// components/marketplace/WorkflowTemplateCard.jsx - Versione compatta
import React from 'react';
import { Star, Download, Clock, User, Tag, Zap } from 'lucide-react';

export const WorkflowTemplateCard = ({ template, onClick }) => {
  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className='w-4 h-4 text-yellow-400 fill-current' />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key='half'
          className='w-4 h-4 text-yellow-400 fill-current opacity-50'
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className='w-4 h-4 text-gray-300' />);
    }

    return (
      <div className='flex items-center'>
        <div className='flex items-center mr-1'>{stars}</div>
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getComplexityLabel = (complexity) => {
    switch (complexity) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Unknown';
    }
  };

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
      {/* Header compatto con badges */}
      <div className='relative p-4 pb-2'>
        <div className='flex items-start justify-between mb-2'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white truncate flex-1 mr-2'>
            {template.name}
          </h3>

          {/* Badges posizionati nell'header */}
          <div className='flex space-x-1'>
            {template.featured && (
              <div className='bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center'>
                <Zap className='w-3 h-3 mr-1' />
                Featured
              </div>
            )}
            {template.premium && (
              <div className='bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md'>
                TEST
              </div>
            )}
          </div>
        </div>

        {/* Autore */}
        <div className='flex items-center mb-3'>
          <User className='w-3 h-3 text-gray-500 dark:text-gray-400 mr-1' />
          <span className='text-xs text-gray-600 dark:text-gray-400'>
            {template.author.name}
            {template.author.company && ` • ${template.author.company}`}
          </span>
        </div>

        {/* Descrizione */}
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
          {template.description}
        </p>
      </div>

      {/* Content principale */}
      <div className='px-4 pb-4'>
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
        <div className='flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mb-3'>
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
        <div>
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
