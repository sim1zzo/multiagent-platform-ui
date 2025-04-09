// hooks/useWorkflowMarketplace.js
import { useState, useCallback } from 'react';
import * as WorkflowMarketplaceService from '../services/WorkflowMarketplaceService';

/**
 * Custom hook for interacting with the Workflow Marketplace
 * @returns {Object} - Marketplace state and functions
 */
export const useWorkflowMarketplace = () => {
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [featuredTemplates, setFeaturedTemplates] = useState([]);

  // Open the marketplace
  const openMarketplace = useCallback(() => {
    setIsMarketplaceOpen(true);
    // Load featured templates when opening the marketplace
    loadFeaturedTemplates();
  }, []);

  // Close the marketplace
  const closeMarketplace = useCallback(() => {
    setIsMarketplaceOpen(false);
    setSelectedTemplate(null);
  }, []);

  // Load featured templates
  const loadFeaturedTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters = { featuredOnly: true, limit: 4 };
      const templates = await WorkflowMarketplaceService.getWorkflowTemplates(
        filters
      );
      setFeaturedTemplates(templates);
    } catch (err) {
      console.error('Error loading featured templates:', err);
      setError('Failed to load featured templates');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get a specific template by ID
  const getTemplate = useCallback(async (templateId) => {
    setIsLoading(true);
    setError(null);

    try {
      const template = await WorkflowMarketplaceService.getWorkflowTemplate(
        templateId
      );
      setSelectedTemplate(template);
      return template;
    } catch (err) {
      console.error('Error loading template:', err);
      setError(`Failed to load template: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Import a template
  const importTemplate = useCallback(async (templateId) => {
    setIsLoading(true);
    setError(null);

    try {
      const importedWorkflow =
        await WorkflowMarketplaceService.importWorkflowTemplate(templateId);
      return importedWorkflow;
    } catch (err) {
      console.error('Error importing template:', err);
      setError(`Failed to import template: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save the current workflow as a template
  const saveAsTemplate = useCallback(async (workflowData, metadata) => {
    setIsLoading(true);
    setError(null);

    try {
      const savedTemplate =
        await WorkflowMarketplaceService.saveWorkflowAsTemplate(
          workflowData,
          metadata
        );
      return savedTemplate;
    } catch (err) {
      console.error('Error saving workflow as template:', err);
      setError(`Failed to save template: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user's saved templates
  const getUserTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const templates =
        await WorkflowMarketplaceService.getUserSavedWorkflows();
      return templates;
    } catch (err) {
      console.error('Error loading user templates:', err);
      setError(`Failed to load your templates: ${err.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isMarketplaceOpen,
    isLoading,
    error,
    selectedTemplate,
    featuredTemplates,
    openMarketplace,
    closeMarketplace,
    loadFeaturedTemplates,
    getTemplate,
    importTemplate,
    saveAsTemplate,
    getUserTemplates,
  };
};
