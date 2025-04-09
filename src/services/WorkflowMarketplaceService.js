// services/WorkflowMarketplaceService.js - Full integration

/**
 * Service for handling Workflow Marketplace operations
 */

// Mock data for demonstration purposes
const workflowTemplates = [
  {
    id: 'template-001',
    name: 'Customer Support Chatbot',
    description: 'An intelligent customer support workflow with request handling, sentiment analysis, and appropriate routing.',
    category: 'customer-service',
    tags: ['support', 'chatbot', 'sentiment-analysis'],
    author: {
      id: 'user-123',
      name: 'Alex Morgan',
      company: 'SupportAI Inc.',
      avatar: null
    },
    rating: 4.8,
    downloads: 3245,
    lastUpdated: '2025-03-15T14:30:00Z',
    version: '2.1.0',
    previewImage: 'customer-support-preview.png', // Would be a URL in a real app
    nodeCount: 8,
    complexity: 'medium',
    featured: true,
    premium: false,
    workflow: {
      nodes: [
        {
          id: 'trigger-12345',
          type: 'trigger',
          name: 'Support Request',
          triggerType: 'chat',
          position: { x: 100, y: 250 }
        },
        {
          id: 'agent-23456',
          type: 'agent',
          name: 'Support Agent',
          role: 'communicator',
          position: { x: 400, y: 250 }
        }
        // More nodes would be defined here in a basic form
      ],
      edges: [
        {
          id: 'edge-12345',
          source: 'trigger-12345',
          target: 'agent-23456',
        }
        // More edges would be defined here
      ]
    }
  },
  {
    id: 'template-002',
    name: 'Data Analysis Pipeline',
    description: 'A comprehensive data processing workflow including data cleaning, analysis, and visualization components.',
    category: 'data-science',
    tags: ['data-analysis', 'ETL', 'visualization'],
    author: {
      id: 'user-456',
      name: 'Samira Chen',
      company: 'DataScape Analytics',
      avatar: null
    },
    rating: 4.9,
    downloads: 2890,
    lastUpdated: '2025-02-20T09:15:00Z',
    version: '3.0.1',
    previewImage: 'data-analysis-preview.png',
    nodeCount: 12,
    complexity: 'advanced',
    featured: true,
    premium: true,
    workflow: {
      nodes: [
        // Nodes would be defined here
      ],
      edges: [
        // Edges would be defined here
      ]
    }
  },
  {
    id: 'template-003',
    name: 'Content Moderation System',
    description: 'AI-powered content moderation workflow with toxicity detection, policy compliance, and human review integration.',
    category: 'content-management',
    tags: ['moderation', 'safety', 'compliance'],
    author: {
      id: 'user-789',
      name: 'Jordan Lee',
      company: 'Safe Content AI',
      avatar: null
    },
    rating: 4.6,
    downloads: 1872,
    lastUpdated: '2025-03-05T16:45:00Z',
    version: '1.5.2',
    previewImage: 'moderation-preview.png',
    nodeCount: 10,
    complexity: 'medium',
    featured: false,
    premium: false,
    workflow: {
      nodes: [
        // Nodes would be defined here
      ],
      edges: [
        // Edges would be defined here
      ]
    }
  },
  {
    id: 'template-004',
    name: 'Sales Lead Qualification',
    description: 'Automated lead qualification and scoring workflow to identify high-value prospects.',
    category: 'sales',
    tags: ['lead-scoring', 'qualification', 'sales'],
    author: {
      id: 'user-234',
      name: 'Carlos Rodriguez',
      company: 'SalesForce Pro',
      avatar: null
    },
    rating: 4.5,
    downloads: 1456,
    lastUpdated: '2025-01-10T11:20:00Z',
    version: '2.3.0',
    previewImage: 'sales-lead-preview.png',
    nodeCount: 7,
    complexity: 'beginner',
    featured: false,
    premium: true,
    workflow: {
      nodes: [
        // Nodes would be defined here
      ],
      edges: [
        // Edges would be defined here
      ]
    }
  },
  {
    id: 'template-005',
    name: 'Document Processing Workflow',
    description: 'Extract, analyze, and summarize information from various document formats with NLP capabilities.',
    category: 'document-management',
    tags: ['document-processing', 'extraction', 'summarization'],
    author: {
      id: 'user-567',
      name: 'Emily Johnson',
      company: 'DocSmart AI',
      avatar: null
    },
    rating: 4.7,
    downloads: 2134,
    lastUpdated: '2025-02-28T13:40:00Z',
    version: '1.8.0',
    previewImage: 'document-processing-preview.png',
    nodeCount: 9,
    complexity: 'medium',
    featured: true,
    premium: false,
    workflow: {
      nodes: [
        // Nodes would be defined here
      ],
      edges: [
        // Edges would be defined here
      ]
    }
  },
  {
    id: 'template-006',
    name: 'Recruitment Assistant',
    description: 'AI-powered recruitment workflow that screens resumes, schedules interviews, and provides candidate evaluations.',
    category: 'hr',
    tags: ['recruitment', 'hr', 'candidate-screening'],
    author: {
      id: 'user-890',
      name: 'Priya Patel',
      company: 'TalentAI',
      avatar: null
    },
    rating: 4.4,
    downloads: 987,
    lastUpdated: '2025-01-25T10:15:00Z',
    version: '1.2.1',
    previewImage: 'recruitment-preview.png',
    nodeCount: 11,
    complexity: 'advanced',
    featured: false,
    premium: true,
    workflow: {
      nodes: [
        // Nodes would be defined here
      ],
      edges: [
        // Edges would be defined here
      ]
    }
  }
];

// User-saved workflows (would be in a database in a real implementation)
let userSavedWorkflows = [];

/**
 * Get all available workflow templates
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} - List of workflow templates
 */
export const getWorkflowTemplates = async (filters = {}) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      let results = [...workflowTemplates];

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        results = results.filter(template => template.category === filters.category);
      }

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(template => 
          template.name.toLowerCase().includes(searchLower) || 
          template.description.toLowerCase().includes(searchLower) ||
          template.tags.some(tag => tag.includes(searchLower))
        );
      }

      // Apply premium filter
      if (filters.premiumOnly === true) {
        results = results.filter(template => template.premium);
      } else if (filters.premiumOnly === false) {
        results = results.filter(template => !template.premium);
      }

      // Apply featured filter
      if (filters.featuredOnly) {
        results = results.filter(template => template.featured);
      }

      // Apply complexity filter
      if (filters.complexity && filters.complexity !== 'all') {
        results = results.filter(template => template.complexity === filters.complexity);
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'popular':
            results.sort((a, b) => b.downloads - a.downloads);
            break;
          case 'rating':
            results.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            results.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
            break;
          case 'oldest':
            results.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
            break;
          default:
            // Default sort by featured and then by downloads
            results.sort((a, b) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return b.downloads - a.downloads;
            });
        }
      }

      resolve(results);
    }, 800);
  });
};

/**
 * Get a specific workflow template by ID
 * @param {string} templateId - Template ID
 * @returns {Promise<Object>} - Workflow template
 */
export const getWorkflowTemplate = async (templateId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const template = workflowTemplates.find(t => t.id === templateId);
      
      if (!template) {
        reject(new Error(`Template with ID ${templateId} not found`));
      } else {
        resolve(template);
      }
    }, 500);
  });
};

/**
 * Import a workflow template into the current workspace
 * @param {string} templateId - Template ID to import
 * @returns {Promise<Object>} - Imported workflow data
 */
export const importWorkflowTemplate = async (templateId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const template = workflowTemplates.find(t => t.id === templateId);
      
      if (!template) {
        reject(new Error(`Template with ID ${templateId} not found`));
        return;
      }
      
      // Enhanced workflow processing to ensure all connections are properly set up
      let importedWorkflow;
      
      // Check if this is the Customer Support Chatbot template to provide a rich example
      if (templateId === 'template-001') {
        // For the demo, we'll provide a comprehensive example for the Customer Support template
        importedWorkflow = {
          nodes: [
            // Trigger Node - Entry point
            {
              id: 'trigger-12345',
              type: 'trigger',
              name: 'Customer Support Request',
              triggerType: 'chat',
              position: { x: 100, y: 250 },
              parameters: {
                channelType: 'website-chat',
                initialMessage: 'How can I help you today?'
              }
            },
            // Initial Support Agent
            {
              id: 'agent-23456',
              type: 'agent',
              name: 'Support Triage Agent',
              role: 'communicator',
              position: { x: 350, y: 250 },
              parameters: { 
                systemPrompt: 'You are a customer support agent. Be helpful and polite. Determine the nature of the customer\'s issue.'
              }
            },
            // Model for the Triage Agent
            {
              id: 'model-34567',
              type: 'model',
              name: 'GPT-4 Model',
              modelType: 'gpt-4',
              position: { x: 350, y: 400 },
              parameters: {
                temperature: 0.7,
                maxTokens: 2000
              }
            },
            // Memory for the Triage Agent
            {
              id: 'memory-45678',
              type: 'memory',
              name: 'Chat History Memory',
              memoryType: 'chat-history',
              position: { x: 500, y: 400 },
              parameters: {
                windowSize: 10
              }
            },
            // Sentiment Analysis Tool
            {
              id: 'tool-56789',
              type: 'tool',
              name: 'Sentiment Analysis',
              toolType: 'api-connector',
              position: { x: 650, y: 400 },
              config: '{\n  "endpoint": "api/sentiment",\n  "method": "POST"\n}'
            },
            // Condition Node - Route based on issue type
            {
              id: 'condition-67890',
              type: 'condition',
              name: 'Issue Type Router',
              position: { x: 600, y: 250 },
              condition: '{{agent_output.issue_type}}',
              trueLabel: 'Technical',
              falseLabel: 'Billing'
            },
            // Technical Support Agent
            {
              id: 'agent-78901',
              type: 'agent',
              name: 'Technical Support Agent',
              role: 'thinker',
              position: { x: 850, y: 150 },
              parameters: { 
                systemPrompt: 'You are a technical support specialist. Help customers troubleshoot and resolve technical issues.'
              }
            },
            // Model for Technical Agent
            {
              id: 'model-89012',
              type: 'model',
              name: 'Technical Model',
              modelType: 'gpt-4',
              position: { x: 850, y: 30 },
              parameters: {
                temperature: 0.5,
                maxTokens: 4000
              }
            },
            // Memory for Technical Agent
            {
              id: 'memory-90123',
              type: 'memory',
              name: 'Technical Memory',
              memoryType: 'vector-store',
              position: { x: 1000, y: 30 },
              parameters: {
                embeddingModel: 'text-embedding-ada-002'
              }
            },
            // Documentation Tool for Technical Agent
            {
              id: 'tool-01234',
              type: 'tool',
              name: 'Knowledge Base',
              toolType: 'rag',
              position: { x: 1150, y: 30 },
              config: '{\n  "documentSource": "technical-docs",\n  "retrieverType": "hybrid"\n}'
            },
            // Billing Support Agent
            {
              id: 'agent-12345',
              type: 'agent',
              name: 'Billing Support Agent',
              role: 'executor',
              position: { x: 850, y: 350 },
              parameters: { 
                systemPrompt: 'You are a billing support specialist. Help customers with billing inquiries and payment issues.'
              }
            },
            // Model for Billing Agent
            {
              id: 'model-23456',
              type: 'model',
              name: 'Billing Model',
              modelType: 'gpt-3.5',
              position: { x: 850, y: 470 },
              parameters: {
                temperature: 0.3,
                maxTokens: 2000
              }
            },
            // Memory for Billing Agent
            {
              id: 'memory-34567',
              type: 'memory',
              name: 'Billing Memory',
              memoryType: 'chat-history',
              position: { x: 1000, y: 470 },
              parameters: {
                windowSize: 5
              }
            },
            // Database Tool for Billing Agent
            {
              id: 'tool-45678',
              type: 'tool',
              name: 'Billing System',
              toolType: 'database',
              position: { x: 1150, y: 470 },
              config: '{\n  "connectionString": "billing-system",\n  "actions": ["query", "update"]\n}'
            },
            // Final action for resolution
            {
              id: 'action-56789',
              type: 'action',
              name: 'Resolution Manager',
              actionType: 'code',
              position: { x: 1100, y: 250 },
              config: '{\n  "callback": "markTicketResolved",\n  "notifyUser": true\n}'
            }
          ],
          edges: [
            // Main flow connections
            {
              id: 'edge-trigger-to-triage',
              source: 'trigger-12345',
              target: 'agent-23456',
              sourceHandle: 'default',
              targetHandle: 'default'
            },
            {
              id: 'edge-triage-to-router',
              source: 'agent-23456',
              target: 'condition-67890',
              sourceHandle: 'default',
              targetHandle: 'default'
            },
            {
              id: 'edge-router-to-technical',
              source: 'condition-67890',
              target: 'agent-78901',
              sourceHandle: 'true',
              targetHandle: 'default'
            },
            {
              id: 'edge-router-to-billing',
              source: 'condition-67890',
              target: 'agent-12345',
              sourceHandle: 'false',
              targetHandle: 'default'
            },
            {
              id: 'edge-technical-to-resolution',
              source: 'agent-78901',
              target: 'action-56789',
              sourceHandle: 'default',
              targetHandle: 'default'
            },
            {
              id: 'edge-billing-to-resolution',
              source: 'agent-12345',
              target: 'action-56789',
              sourceHandle: 'default',
              targetHandle: 'default'
            },
            
            // Connect models, memories and tools to agents
            {
              id: 'edge-model-to-triage',
              source: 'model-34567',
              target: 'agent-23456',
              sourceHandle: 'output',
              targetHandle: 'model'
            },
            {
              id: 'edge-memory-to-triage',
              source: 'memory-45678',
              target: 'agent-23456',
              sourceHandle: 'output',
              targetHandle: 'memory'
            },
            {
              id: 'edge-tool-to-triage',
              source: 'tool-56789',
              target: 'agent-23456',
              sourceHandle: 'output',
              targetHandle: 'tool'
            },
            
            // Technical agent connections
            {
              id: 'edge-model-to-technical',
              source: 'model-89012',
              target: 'agent-78901',
              sourceHandle: 'output',
              targetHandle: 'model'
            },
            {
              id: 'edge-memory-to-technical',
              source: 'memory-90123',
              target: 'agent-78901',
              sourceHandle: 'output',
              targetHandle: 'memory'
            },
            {
              id: 'edge-tool-to-technical',
              source: 'tool-01234',
              target: 'agent-78901',
              sourceHandle: 'output',
              targetHandle: 'tool'
            },
            
            // Billing agent connections
            {
              id: 'edge-model-to-billing',
              source: 'model-23456',
              target: 'agent-12345',
              sourceHandle: 'output',
              targetHandle: 'model'
            },
            {
              id: 'edge-memory-to-billing',
              source: 'memory-34567',
              target: 'agent-12345',
              sourceHandle: 'output',
              targetHandle: 'memory'
            },
            {
              id: 'edge-tool-to-billing',
              source: 'tool-45678',
              target: 'agent-12345',
              sourceHandle: 'output',
              targetHandle: 'tool'
            }
          ],
          importedFrom: {
            templateId: template.id,
            templateName: template.name,
            importDate: new Date().toISOString()
          }
        };
      } else {
        // For other templates, we'll create a more basic but complete workflow
        // This is a generalized structure with reasonable defaults
        importedWorkflow = {
          nodes: [
            // Trigger node
            {
              id: `trigger-${Date.now()}`,
              type: 'trigger',
              name: `${template.name} Trigger`,
              triggerType: 'api',
              position: { x: 100, y: 250 },
              parameters: {
                payload: '{\n  "input": "string"\n}'
              }
            },
            // Main agent
            {
              id: `agent-${Date.now()}`,
              type: 'agent',
              name: `${template.name} Agent`,
              role: 'thinker',
              position: { x: 400, y: 250 },
              parameters: {
                systemPrompt: `You are a specialized agent for ${template.name}. Execute your tasks according to best practices.`
              }
            },
            // Model for agent
            {
              id: `model-${Date.now()}`,
              type: 'model',
              name: 'GPT-4 Model',
              modelType: 'gpt-4',
              position: { x: 300, y: 400 },
              parameters: {
                temperature: 0.7,
                maxTokens: 2000
              }
            },
            // Memory for agent
            {
              id: `memory-${Date.now()}`,
              type: 'memory',
              name: 'Vector Memory',
              memoryType: 'vector-store',
              position: { x: 450, y: 400 },
              parameters: {
                embeddingModel: 'text-embedding-ada-002'
              }
            },
            // Tool for agent
            {
              id: `tool-${Date.now()}`,
              type: 'tool',
              name: 'Helper Tool',
              toolType: 'api-connector',
              position: { x: 600, y: 400 },
              config: '{\n  "endpoint": "api/helper",\n  "method": "POST"\n}'
            },
            // Action node
            {
              id: `action-${Date.now()}`,
              type: 'action',
              name: 'Process Result',
              actionType: 'code',
              position: { x: 700, y: 250 },
              config: '{\n  "callback": "processResult",\n  "notifyUser": true\n}'
            }
          ],
          edges: [
            // Main flow
            {
              id: `edge-flow-1-${Date.now()}`,
              source: importedWorkflow?.nodes[0]?.id || `trigger-${Date.now()}`,
              target: importedWorkflow?.nodes[1]?.id || `agent-${Date.now()}`,
              sourceHandle: 'default',
              targetHandle: 'default'
            },
            {
              id: `edge-flow-2-${Date.now()}`,
              source: importedWorkflow?.nodes[1]?.id || `agent-${Date.now()}`,
              target: importedWorkflow?.nodes[5]?.id || `action-${Date.now()}`,
              sourceHandle: 'default',
              targetHandle: 'default'
            },
            // Connect model, memory and tool to agent
            {
              id: `edge-model-${Date.now()}`,
              source: importedWorkflow?.nodes[2]?.id || `model-${Date.now()}`,
              target: importedWorkflow?.nodes[1]?.id || `agent-${Date.now()}`,
              sourceHandle: 'output',
              targetHandle: 'model'
            },
            {
              id: `edge-memory-${Date.now()}`,
              source: importedWorkflow?.nodes[3]?.id || `memory-${Date.now()}`,
              target: importedWorkflow?.nodes[1]?.id || `agent-${Date.now()}`,
              sourceHandle: 'output',
              targetHandle: 'memory'
            },
            {
              id: `edge-tool-${Date.now()}`,
              source: importedWorkflow?.nodes[4]?.id || `tool-${Date.now()}`,
              target: importedWorkflow?.nodes[1]?.id || `agent-${Date.now()}`,
              sourceHandle: 'output',
              targetHandle: 'tool'
            }
          ],
          importedFrom: {
            templateId: template.id,
            templateName: template.name,
            importDate: new Date().toISOString()
          }
        };
      }
      
      // Record this as a download
      const templateIndex = workflowTemplates.findIndex(t => t.id === templateId);
      if (templateIndex !== -1) {
        workflowTemplates[templateIndex].downloads += 1;
      }
      
      resolve(importedWorkflow);
    }, 1000);
  });
};

/**
 * Save a workflow as a template
 * @param {Object} workflowData - Workflow data including nodes, edges, etc.
 * @param {Object} templateMetadata - Template metadata
 * @returns {Promise<Object>} - Saved template
 */
export const saveWorkflowAsTemplate = async (workflowData, templateMetadata) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTemplate = {
        id: `template-user-${Date.now()}`,
        rating: 0,
        downloads: 0,
        lastUpdated: new Date().toISOString(),
        featured: false,
        ...templateMetadata,
        workflow: workflowData
      };
      
      // In a real implementation, this would save to a database
      // For demo purposes, we'll add it to the user's saved workflows
      userSavedWorkflows.push(newTemplate);
      
      resolve(newTemplate);
    }, 800);
  });
};

/**
 * Get categories for workflow templates
 * @returns {Promise<Array>} - List of categories
 */
export const getWorkflowCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = [
        { id: 'customer-service', name: 'Customer Service' },
        { id: 'data-science', name: 'Data Science' },
        { id: 'content-management', name: 'Content Management' },
        { id: 'sales', name: 'Sales & Marketing' },
        { id: 'document-management', name: 'Document Management' },
        { id: 'hr', name: 'Human Resources' },
        { id: 'finance', name: 'Finance' },
        { id: 'education', name: 'Education' },
        { id: 'healthcare', name: 'Healthcare' },
        { id: 'other', name: 'Other' }
      ];
      
      resolve(categories);
    }, 300);
  });
};

/**
 * Rate a workflow template
 * @param {string} templateId - Template ID
 * @param {number} rating - Rating value (1-5)
 * @returns {Promise<Object>} - Updated template
 */
export const rateWorkflowTemplate = async (templateId, rating) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const templateIndex = workflowTemplates.findIndex(t => t.id === templateId);
      
      if (templateIndex === -1) {
        reject(new Error(`Template with ID ${templateId} not found`));
        return;
      }
      
      // In a real implementation, this would calculate a weighted average
      // based on all user ratings. Here we just do a simple update.
      const currentRating = workflowTemplates[templateIndex].rating;
      const newRating = (currentRating * 0.9) + (rating * 0.1); // Simple weighted update
      
      workflowTemplates[templateIndex].rating = parseFloat(newRating.toFixed(1));
      
      resolve(workflowTemplates[templateIndex]);
    }, 500);
  });
};

/**
 * Get user's saved workflow templates
 * @returns {Promise<Array>} - User's saved templates
 */
export const getUserSavedWorkflows = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userSavedWorkflows);
    }, 500);
  });
};