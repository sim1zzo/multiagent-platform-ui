// components/marketplace/WorkflowTemplateDetails.jsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Star,
  User,
  Tag,
  Clock,
  Info,
  Settings,
  Box,
  Zap,
  Check,
  Star as StarIcon,
} from 'lucide-react';
import * as WorkflowMarketplaceService from '../../services/WorkflowMarketplaceService';

export const WorkflowTemplateDetails = ({ template, onBack, onImport }) => {
  const [importing, setImporting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle template import
  const handleImport = async () => {
    setImporting(true);
    await onImport();
    // Note: We don't need to handle completion here since the parent component will close this
  };

  // Handle rating submission
  const handleRateTemplate = async (rating) => {
    if (hasRated) return;

    try {
      setUserRating(rating);
      await WorkflowMarketplaceService.rateWorkflowTemplate(
        template.id,
        rating
      );
      setHasRated(true);
    } catch (err) {
      console.error('Error rating template:', err);
      // In a real app, you would show an error message
    }
  };

  // Get complexity label and color
  const getComplexityInfo = (complexity) => {
    switch (complexity) {
      case 'beginner':
        return {
          label: 'Beginner',
          color:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          description: 'Suitable for users new to AI workflows',
        };
      case 'medium':
        return {
          label: 'Intermediate',
          color:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          description: 'Requires some familiarity with AI concepts',
        };
      case 'advanced':
        return {
          label: 'Advanced',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          description: 'Best for experienced users with strong AI knowledge',
        };
      default:
        return {
          label: 'Unknown',
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
          description: 'Complexity level not specified',
        };
    }
  };

  // Get template preview image based on template type
  const getTemplateImage = () => {
    const templateType = template.name.toLowerCase();

    if (
      templateType.includes('customer support') ||
      templateType.includes('chatbot')
    ) {
      return '/images/templates/customer-support-preview.png';
    } else if (
      templateType.includes('data') ||
      templateType.includes('analysis')
    ) {
      return '/images/templates/data-analysis-preview.png';
    } else if (
      templateType.includes('document') ||
      templateType.includes('processing')
    ) {
      return '/images/templates/document-processing-preview.png';
    } else if (
      templateType.includes('content') ||
      templateType.includes('moderation')
    ) {
      return '/images/templates/content-moderation-preview.png';
    } else if (
      templateType.includes('lead') ||
      templateType.includes('sales')
    ) {
      return '/images/templates/sales-lead-preview.png';
    } else if (templateType.includes('recruit')) {
      return '/images/templates/recruitment-preview.png';
    } else {
      return '/images/templates/default-workflow-preview.png';
    }
  };

  // Get workflow diagram image based on template type
  const getWorkflowDiagramImage = () => {
    const templateType = template.name.toLowerCase();

    if (
      templateType.includes('customer support') ||
      templateType.includes('chatbot')
    ) {
      return '/images/templates/customer-support-diagram.png';
    } else if (
      templateType.includes('data') ||
      templateType.includes('analysis')
    ) {
      return '/images/templates/data-analysis-diagram.png';
    } else if (
      templateType.includes('document') ||
      templateType.includes('processing')
    ) {
      return '/images/templates/document-processing-diagram.png';
    } else if (
      templateType.includes('content') ||
      templateType.includes('moderation')
    ) {
      return '/images/templates/content-moderation-diagram.png';
    } else if (
      templateType.includes('lead') ||
      templateType.includes('sales')
    ) {
      return '/images/templates/sales-lead-diagram.png';
    } else if (templateType.includes('recruit')) {
      return '/images/templates/recruitment-diagram.png';
    } else {
      return '/images/templates/default-workflow-diagram.png';
    }
  };

  const complexityInfo = getComplexityInfo(template.complexity);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-5/6 max-w-7xl h-5/6 flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <button
            className='text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center'
            onClick={onBack}
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Back to Marketplace
          </button>
          <div className='flex space-x-2'>
            {template.premium && (
              <span className='bg-purple-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full'>
                Premium
              </span>
            )}
            {template.featured && (
              <span className='bg-blue-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center'>
                <Zap className='w-3 h-3 mr-1' />
                Featured
              </span>
            )}
          </div>
        </div>

        <div className='flex-1 overflow-auto'>
          <div className='flex flex-col md:flex-row p-6'>
            {/* Left column - Template info */}
            <div className='md:w-1/3 pr-6'>
              <div className='h-56 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden'>
                {/* Template preview image */}
                <img
                  src={getTemplateImage()}
                  alt={template.name}
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    // If image fails to load, show letter placeholder
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />

                {/* Fallback to letter if image fails */}
                <div className='text-4xl text-gray-500 dark:text-gray-400 hidden'>
                  {template.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                {template.name}
              </h1>

              <div className='flex items-center mb-4'>
                <div className='flex mr-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= template.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-yellow-400'
                      }`}
                    />
                  ))}
                </div>
                <span className='text-gray-600 dark:text-gray-400'>
                  {template.rating.toFixed(1)} ({template.downloads} downloads)
                </span>
              </div>

              <div className='flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4'>
                <User className='w-4 h-4 mr-1' />
                <span>
                  By <strong>{template.author.name}</strong>
                  {template.author.company &&
                    ` from ${template.author.company}`}
                </span>
              </div>

              <div className='mb-4'>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${complexityInfo.color} mb-2 mr-2`}
                >
                  {complexityInfo.label}
                </span>
                <span className='text-xs text-gray-600 dark:text-gray-400 block'>
                  {complexityInfo.description}
                </span>
              </div>

              <div className='flex flex-wrap gap-2 mb-4'>
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className='bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md flex items-center'
                  >
                    <Tag className='w-3 h-3 mr-1' />
                    {tag}
                  </span>
                ))}
              </div>

              <div className='flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4'>
                <Clock className='w-4 h-4 mr-1' />
                <span>Last updated: {formatDate(template.lastUpdated)}</span>
              </div>

              <div className='flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4'>
                <Box className='w-4 h-4 mr-1' />
                <span>Nodes: {template.nodeCount}</span>
              </div>

              <div className='flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4'>
                <Settings className='w-4 h-4 mr-1' />
                <span>Version: {template.version}</span>
              </div>

              <button
                className={`w-full py-3 px-4 rounded-md flex items-center justify-center ${
                  importing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium`}
                onClick={handleImport}
                disabled={importing}
              >
                {importing ? (
                  <>
                    <div className='mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className='w-5 h-5 mr-2' />
                    Import Workflow
                  </>
                )}
              </button>

              {/* Rating section */}
              <div className='mt-6 border-t border-gray-200 dark:border-gray-700 pt-4'>
                <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                  Rate this template
                </h3>
                <div className='flex items-center mb-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className='focus:outline-none'
                      onClick={() => handleRateTemplate(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      disabled={hasRated}
                    >
                      <StarIcon
                        className={`w-6 h-6 ${
                          star <= (hoverRating || userRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        } ${
                          hasRated ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {hasRated ? (
                  <div className='text-sm text-green-600 dark:text-green-400 flex items-center'>
                    <Check className='w-4 h-4 mr-1' />
                    Thank you for your rating!
                  </div>
                ) : (
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Click to rate this template
                  </p>
                )}
              </div>
            </div>

            {/* Right column - Description and preview */}
            <div className='md:w-2/3 mt-6 md:mt-0'>
              <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6'>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  About this template
                </h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>
                  {template.description}
                </p>

                {/* This would be expanded with more comprehensive information in a real app */}
                <div className='rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 mb-4'>
                  <h3 className='text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center'>
                    <Info className='w-4 h-4 mr-2 text-blue-500' />
                    What you'll build
                  </h3>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    With this template, you'll create a complete{' '}
                    {template.name.toLowerCase()} that connects multiple AI
                    agents to accomplish complex tasks. The workflow includes
                    pre-configured nodes for optimal performance.
                  </p>
                </div>

                <div className='rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800'>
                  <h3 className='text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center'>
                    <Settings className='w-4 h-4 mr-2 text-blue-500' />
                    Requirements
                  </h3>
                  <ul className='text-sm text-gray-700 dark:text-gray-300 space-y-2'>
                    <li className='flex items-center'>
                      <Check className='w-4 h-4 mr-2 text-green-500' />
                      MultiAgent Platform version 2.0+
                    </li>
                    <li className='flex items-center'>
                      <Check className='w-4 h-4 mr-2 text-green-500' />
                      {template.premium
                        ? 'Premium subscription'
                        : 'Free subscription'}
                    </li>
                    {template.complexity === 'advanced' && (
                      <li className='flex items-center'>
                        <Check className='w-4 h-4 mr-2 text-green-500' />
                        API keys for external services
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Workflow Preview */}
              <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-6'>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Workflow Preview
                </h2>

                <div className='relative h-96 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
                  {/* This would show a diagram or screenshot of the workflow */}
                  <img
                    src={getWorkflowDiagramImage()}
                    alt={`${template.name} workflow diagram`}
                    className='w-full h-full object-contain p-4'
                    onError={(e) => {
                      // If image fails to load, show text placeholder
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />

                  {/* Fallback if diagram fails to load */}
                  <div className='hidden absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-8'>
                    <p className='text-2xl mb-2'>Preview</p>
                    <p className='text-sm'>
                      Contains {template.nodeCount} nodes including agents,
                      conditions, and actions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
