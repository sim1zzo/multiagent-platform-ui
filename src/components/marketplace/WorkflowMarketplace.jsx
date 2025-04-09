// components/marketplace/WorkflowMarketplace.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  Star,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import * as WorkflowMarketplaceService from '../../services/WorkflowMarketplaceService';
import { WorkflowTemplateCard } from './WorkflowTemplateCard';
import { WorkflowTemplateDetails } from './WorkflowTemplateDetails';

export const WorkflowMarketplace = ({ onImportWorkflow, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    premiumOnly: null,
    featuredOnly: false,
    complexity: 'all',
    sortBy: 'popular',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [templatesPerPage] = useState(9);

  // Fetch templates and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch categories
        const categoriesData =
          await WorkflowMarketplaceService.getWorkflowCategories();
        setCategories(categoriesData);

        // Fetch templates with current filters
        const templatesData =
          await WorkflowMarketplaceService.getWorkflowTemplates(filters);
        setTemplates(templatesData);
      } catch (err) {
        console.error('Error loading marketplace data:', err);
        setError('Failed to load marketplace data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));

    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      premiumOnly: null,
      featuredOnly: false,
      complexity: 'all',
      sortBy: 'popular',
    });
    setCurrentPage(1);
  };

  // Handle template selection
  const handleSelectTemplate = async (templateId) => {
    try {
      setIsLoading(true);
      const template = await WorkflowMarketplaceService.getWorkflowTemplate(
        templateId
      );
      setSelectedTemplate(template);
    } catch (err) {
      console.error('Error loading template details:', err);
      setError('Failed to load template details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle template import
  const handleImportTemplate = async (templateId) => {
    try {
      setIsLoading(true);
      const importedWorkflow =
        await WorkflowMarketplaceService.importWorkflowTemplate(templateId);

      // Call the parent component's import handler
      onImportWorkflow(importedWorkflow);

      // Close the marketplace
      onClose();
    } catch (err) {
      console.error('Error importing template:', err);
      setError('Failed to import template. Please try again later.');
      setIsLoading(false);
    }
  };

  // Calculate current templates for pagination
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = templates.slice(
    indexOfFirstTemplate,
    indexOfLastTemplate
  );
  const totalPages = Math.ceil(templates.length / templatesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // If a template is selected, show its details
  if (selectedTemplate) {
    return (
      <WorkflowTemplateDetails
        template={selectedTemplate}
        onBack={() => setSelectedTemplate(null)}
        onImport={() => handleImportTemplate(selectedTemplate.id)}
      />
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-5/6 max-w-7xl h-5/6 flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center'>
            <h2 className='text-xl font-semibold text-gray-800 dark:text-white flex items-center'>
              Workflow Marketplace
            </h2>
            <span className='ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'>
              Beta
            </span>
          </div>
          <button
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            onClick={onClose}
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Filters */}
        <div className='bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex flex-wrap items-center gap-4'>
            {/* Search */}
            <div className='relative flex-grow max-w-md'>
              <input
                type='text'
                placeholder='Search templates...'
                className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
            </div>

            {/* Category dropdown */}
            <div className='flex items-center'>
              <label className='text-sm text-gray-600 dark:text-gray-400 mr-2'>
                Category:
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className='block p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
              >
                <option value='all'>All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Complexity dropdown */}
            <div className='flex items-center'>
              <label className='text-sm text-gray-600 dark:text-gray-400 mr-2'>
                Complexity:
              </label>
              <select
                value={filters.complexity}
                onChange={(e) =>
                  handleFilterChange('complexity', e.target.value)
                }
                className='block p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
              >
                <option value='all'>All Levels</option>
                <option value='beginner'>Beginner</option>
                <option value='medium'>Intermediate</option>
                <option value='advanced'>Advanced</option>
              </select>
            </div>

            {/* Sort dropdown */}
            <div className='flex items-center'>
              <label className='text-sm text-gray-600 dark:text-gray-400 mr-2'>
                Sort by:
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className='block p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
              >
                <option value='popular'>Most Popular</option>
                <option value='rating'>Highest Rated</option>
                <option value='newest'>Newest First</option>
                <option value='oldest'>Oldest First</option>
              </select>
            </div>

            {/* Toggle buttons */}
            <div className='flex items-center space-x-4'>
              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='sr-only peer'
                  checked={filters.featuredOnly}
                  onChange={(e) =>
                    handleFilterChange('featuredOnly', e.target.checked)
                  }
                />
                <div className="relative w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Featured Only
                </span>
              </label>

              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='sr-only peer'
                  checked={filters.premiumOnly === true}
                  onChange={(e) =>
                    handleFilterChange(
                      'premiumOnly',
                      e.target.checked ? true : null
                    )
                  }
                />
                <div className="relative w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Premium Only
                </span>
              </label>
            </div>

            {/* Reset filters button */}
            <button
              onClick={resetFilters}
              className='ml-auto px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md'
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className='flex-1 overflow-auto p-6'>
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <div className='flex flex-col items-center'>
                <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                <p className='mt-4 text-gray-600 dark:text-gray-300'>
                  Loading templates...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className='flex items-center justify-center h-full'>
              <div className='bg-red-100 dark:bg-red-900 p-4 rounded-md text-red-800 dark:text-red-200'>
                {error}
              </div>
            </div>
          ) : templates.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full'>
              <Search className='w-16 h-16 text-gray-400 mb-4' />
              <h3 className='text-xl font-medium text-gray-700 dark:text-gray-300 mb-2'>
                No templates found
              </h3>
              <p className='text-gray-500 dark:text-gray-400'>
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={resetFilters}
                className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {currentTemplates.map((template) => (
                  <WorkflowTemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => handleSelectTemplate(template.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex items-center justify-between mt-8'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Showing {indexOfFirstTemplate + 1}-
                      {Math.min(indexOfLastTemplate, templates.length)} of{' '}
                      {templates.length} templates
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ChevronLeft className='w-5 h-5' />
                    </button>

                    <div className='flex items-center space-x-1'>
                      {[...Array(totalPages).keys()].map((number) => (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`w-8 h-8 rounded-md ${
                            currentPage === number + 1
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                          }`}
                        >
                          {number + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ChevronRight className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
