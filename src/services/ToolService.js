// src/services/ToolService.js

class ToolService {
  constructor() {
    this.storageKey = 'multiagent_tools';
    this.tools = this.loadToolsFromStorage();
  }

  // Load tools from localStorage
  loadToolsFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading tools from storage:', error);
    }
    return this.getDefaultTools();
  }

  // Save tools to localStorage
  saveToolsToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.tools));
    } catch (error) {
      console.error('Error saving tools to storage:', error);
    }
  }

  // Get all tools
  getAllTools() {
    return [...this.tools];
  }

  // Get tools for dashboard display
  getToolsForDashboard() {
    return this.tools.map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      type: tool.type,
      isActive: tool.isActive,
      isFavorite: tool.isFavorite,
      usageCount: tool.usageCount || 0,
      lastModified: tool.lastModified,
      created: tool.created,
      author: tool.author,
      tags: tool.tags,
      version: tool.version,
    }));
  }

  // Get tools available for agents
  getAvailableToolsForAgents() {
    return this.tools
      .filter((tool) => tool.isActive)
      .map((tool) => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        type: tool.type,
        parameters: tool.parameters || {},
        function: tool.function || null,
      }));
  }

  // Create new tool
  createTool(toolData) {
    const newTool = {
      id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: toolData.name,
      description: toolData.description,
      category: toolData.category || 'General',
      type: toolData.type || 'Function',
      parameters: toolData.parameters || {},
      function: toolData.function || null,
      code: toolData.code || '',
      isActive: true,
      isFavorite: false,
      usageCount: 0,
      created: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      author: toolData.author || 'User',
      tags: toolData.tags || [],
      version: toolData.version || '1.0.0',
      ...toolData,
    };

    this.tools.push(newTool);
    this.saveToolsToStorage();

    // Notify dashboard about new tool
    this.notifyDashboardUpdate();

    return newTool;
  }

  // Update existing tool
  updateTool(toolId, updates) {
    const toolIndex = this.tools.findIndex((tool) => tool.id === toolId);
    if (toolIndex !== -1) {
      this.tools[toolIndex] = {
        ...this.tools[toolIndex],
        ...updates,
        lastModified: new Date().toISOString().split('T')[0],
      };
      this.saveToolsToStorage();
      this.notifyDashboardUpdate();
      return this.tools[toolIndex];
    }
    return null;
  }

  // Delete tool
  deleteTool(toolId) {
    const initialLength = this.tools.length;
    this.tools = this.tools.filter((tool) => tool.id !== toolId);

    if (this.tools.length < initialLength) {
      this.saveToolsToStorage();
      this.notifyDashboardUpdate();
      return true;
    }
    return false;
  }

  // Toggle tool active status
  toggleToolActive(toolId) {
    const tool = this.tools.find((t) => t.id === toolId);
    if (tool) {
      tool.isActive = !tool.isActive;
      tool.lastModified = new Date().toISOString().split('T')[0];
      this.saveToolsToStorage();
      this.notifyDashboardUpdate();
      return tool;
    }
    return null;
  }

  // Increment usage count
  incrementUsage(toolId) {
    const tool = this.tools.find((t) => t.id === toolId);
    if (tool) {
      tool.usageCount = (tool.usageCount || 0) + 1;
      tool.lastModified = new Date().toISOString().split('T')[0];
      this.saveToolsToStorage();
      return tool;
    }
    return null;
  }

  // Notify dashboard about updates
  notifyDashboardUpdate() {
    // Custom event to notify dashboard components
    window.dispatchEvent(
      new CustomEvent('toolsUpdated', {
        detail: { tools: this.getAllTools() },
      })
    );
  }

  // Get tool statistics for dashboard
  getToolStats() {
    return {
      total: this.tools.length,
      active: this.tools.filter((t) => t.isActive).length,
      inactive: this.tools.filter((t) => !t.isActive).length,
      favorites: this.tools.filter((t) => t.isFavorite).length,
      categories: [...new Set(this.tools.map((t) => t.category))].length,
      mostUsed: this.tools.reduce(
        (max, tool) =>
          (tool.usageCount || 0) > (max.usageCount || 0) ? tool : max,
        this.tools[0]
      ),
    };
  }

  // Get default tools
  getDefaultTools() {
    return [
      {
        id: 'tool-web-search',
        name: 'Web Search',
        description:
          'Search the web for information using multiple search engines',
        category: 'Information',
        type: 'API',
        isActive: true,
        isFavorite: false,
        usageCount: 45,
        created: '2024-01-01',
        lastModified: '2024-12-20',
        author: 'System',
        tags: ['search', 'web', 'information', 'google'],
        version: '1.2.0',
        parameters: {
          query: {
            type: 'string',
            required: true,
            description: 'Search query',
          },
          maxResults: {
            type: 'number',
            required: false,
            description: 'Maximum results',
            default: 10,
          },
          searchEngine: {
            type: 'string',
            required: false,
            description: 'Search engine to use',
            default: 'google',
          },
        },
      },
      {
        id: 'tool-news-aggregator',
        name: 'News Aggregator',
        description:
          'Fetch and aggregate news from multiple sources with filtering capabilities',
        category: 'Information',
        type: 'API',
        isActive: true,
        isFavorite: true,
        usageCount: 78,
        created: '2024-03-15',
        lastModified: '2024-12-19',
        author: 'System',
        tags: ['news', 'media', 'current events', 'rss'],
        version: '1.1.5',
        parameters: {
          sources: {
            type: 'array',
            required: false,
            description: 'News sources to include',
          },
          keywords: {
            type: 'array',
            required: false,
            description: 'Keywords to filter by',
          },
          category: {
            type: 'string',
            required: false,
            description: 'News category',
            default: 'general',
          },
          language: {
            type: 'string',
            required: false,
            description: 'Content language',
            default: 'en',
          },
        },
      },
      {
        id: 'tool-text-analyzer',
        name: 'Text Analyzer',
        description:
          'Advanced NLP processing for text analysis, sentiment detection, and language processing',
        category: 'AI/ML',
        type: 'Python',
        isActive: true,
        isFavorite: false,
        usageCount: 134,
        created: '2024-04-05',
        lastModified: '2024-12-17',
        author: 'Simone Izzo',
        tags: ['nlp', 'sentiment', 'analysis', 'ai', 'text'],
        version: '1.5.3',
        parameters: {
          text: {
            type: 'string',
            required: true,
            description: 'Text to analyze',
          },
          language: {
            type: 'string',
            required: false,
            description: 'Text language',
            default: 'auto',
          },
          features: {
            type: 'array',
            required: false,
            description: 'Analysis features to enable',
          },
        },
      },
      {
        id: 'tool-image-generator',
        name: 'AI Image Generator',
        description:
          'Generate high-quality images using advanced AI models with custom prompts',
        category: 'AI/ML',
        type: 'API',
        isActive: false,
        isFavorite: false,
        usageCount: 12,
        created: '2024-05-20',
        lastModified: '2024-12-10',
        author: 'Antonio Capone',
        tags: ['ai', 'image', 'generation', 'dalle', 'midjourney'],
        version: '1.0.2',
        parameters: {
          prompt: {
            type: 'string',
            required: true,
            description: 'Image generation prompt',
          },
          style: {
            type: 'string',
            required: false,
            description: 'Art style',
            default: 'realistic',
          },
          resolution: {
            type: 'string',
            required: false,
            description: 'Image resolution',
            default: '1024x1024',
          },
        },
      },
      {
        id: 'tool-code-interpreter',
        name: 'Code Interpreter',
        description:
          'Execute and interpret code in multiple programming languages',
        category: 'Development',
        type: 'Function',
        isActive: true,
        isFavorite: false,
        usageCount: 23,
        created: '2024-01-01',
        lastModified: '2024-12-15',
        author: 'System',
        tags: ['code', 'interpreter', 'development', 'python', 'javascript'],
        version: '2.0.0',
        parameters: {
          code: {
            type: 'string',
            required: true,
            description: 'Code to execute',
          },
          language: {
            type: 'string',
            required: true,
            description: 'Programming language',
          },
          timeout: {
            type: 'number',
            required: false,
            description: 'Execution timeout in seconds',
            default: 30,
          },
        },
      },
      {
        id: 'tool-web-scraper',
        name: 'Web Scraper',
        description:
          'Extract data from websites with intelligent parsing and anti-bot detection',
        category: 'Data Collection',
        type: 'API',
        isActive: true,
        isFavorite: false,
        usageCount: 156,
        created: '2024-02-15',
        lastModified: '2024-12-18',
        author: 'System',
        tags: ['web', 'scraping', 'data', 'extraction'],
        version: '1.3.2',
        parameters: {
          url: { type: 'string', required: true, description: 'URL to scrape' },
          selectors: {
            type: 'array',
            required: false,
            description: 'CSS selectors for data extraction',
          },
          waitFor: {
            type: 'number',
            required: false,
            description: 'Wait time for dynamic content',
            default: 2000,
          },
        },
      },
      {
        id: 'tool-database-query',
        name: 'Database Query',
        description:
          'Execute SQL queries across multiple database types (MySQL, PostgreSQL, MongoDB)',
        category: 'Database',
        type: 'SQL',
        isActive: true,
        isFavorite: true,
        usageCount: 89,
        created: '2024-03-10',
        lastModified: '2024-12-19',
        author: 'Admin',
        tags: ['database', 'sql', 'query', 'mysql', 'postgresql'],
        version: '2.1.0',
        parameters: {
          query: {
            type: 'string',
            required: true,
            description: 'SQL query to execute',
          },
          database: {
            type: 'string',
            required: true,
            description: 'Database connection string',
          },
          timeout: {
            type: 'number',
            required: false,
            description: 'Query timeout',
            default: 30000,
          },
        },
      },
      {
        id: 'tool-calculator',
        name: 'Math Calculator',
        description:
          'Advanced mathematical computations and formula evaluation',
        category: 'Utilities',
        type: 'Function',
        isActive: true,
        isFavorite: true,
        usageCount: 67,
        created: '2024-01-01',
        lastModified: '2024-11-30',
        author: 'System',
        tags: ['math', 'calculation', 'formula'],
        version: '1.1.0',
        parameters: {
          expression: {
            type: 'string',
            required: true,
            description: 'Mathematical expression',
          },
          precision: {
            type: 'number',
            required: false,
            description: 'Decimal precision',
            default: 10,
          },
        },
      },
      {
        id: 'tool-email-sender',
        name: 'Email Sender',
        description:
          'Send emails with templates, attachments, and bulk sending capabilities',
        category: 'Communication',
        type: 'API',
        isActive: true,
        isFavorite: false,
        usageCount: 78,
        created: '2024-06-12',
        lastModified: '2024-12-16',
        author: 'System',
        tags: ['email', 'communication', 'smtp', 'templates'],
        version: '1.2.1',
        parameters: {
          to: {
            type: 'string',
            required: true,
            description: 'Recipient email address',
          },
          subject: {
            type: 'string',
            required: true,
            description: 'Email subject',
          },
          body: {
            type: 'string',
            required: true,
            description: 'Email body content',
          },
          template: {
            type: 'string',
            required: false,
            description: 'Email template to use',
          },
        },
      },
      {
        id: 'tool-api-connector',
        name: 'API Connector',
        description:
          'Connect to external APIs with authentication, rate limiting, and response parsing',
        category: 'Integration',
        type: 'API',
        isActive: true,
        isFavorite: true,
        usageCount: 167,
        created: '2024-08-15',
        lastModified: '2024-12-12',
        author: 'System',
        tags: ['api', 'integration', 'rest', 'Jira', 'http'],
        version: '1.4.0',
        parameters: {
          url: {
            type: 'string',
            required: true,
            description: 'API endpoint URL',
          },
          method: {
            type: 'string',
            required: false,
            description: 'HTTP method',
            default: 'GET',
          },
          headers: {
            type: 'object',
            required: false,
            description: 'Request headers',
          },
          payload: {
            type: 'object',
            required: false,
            description: 'Request payload',
          },
        },
      },
      {
        id: 'tool-scheduler',
        name: 'Task Scheduler',
        description:
          'Schedule and manage recurring tasks, cron jobs, and automated workflows',
        category: 'Automation',
        type: 'Function',
        isActive: true,
        isFavorite: true,
        usageCount: 56,
        created: '2024-11-05',
        lastModified: '2024-12-09',
        author: 'System',
        tags: ['scheduler', 'automation', 'cron', 'tasks', 'workflow'],
        version: '1.0.5',
        parameters: {
          task: {
            type: 'string',
            required: true,
            description: 'Task to schedule',
          },
          schedule: {
            type: 'string',
            required: true,
            description: 'Cron expression for scheduling',
          },
          timezone: {
            type: 'string',
            required: false,
            description: 'Timezone for execution',
            default: 'UTC',
          },
        },
      },
      {
        id: 'tool-notification-manager',
        name: 'Notification Manager',
        description:
          'Send notifications via multiple channels: email, SMS, Slack, Discord, Teams',
        category: 'Communication',
        type: 'API',
        isActive: true,
        isFavorite: false,
        usageCount: 234,
        created: '2024-11-20',
        lastModified: '2024-12-08',
        author: 'System',
        tags: ['notification', 'alert', 'slack', 'discord', 'sms'],
        version: '2.2.0',
        parameters: {
          message: {
            type: 'string',
            required: true,
            description: 'Notification message',
          },
          channel: {
            type: 'string',
            required: true,
            description: 'Notification channel',
          },
          priority: {
            type: 'string',
            required: false,
            description: 'Message priority',
            default: 'normal',
          },
          recipient: {
            type: 'string',
            required: true,
            description: 'Message recipient',
          },
        },
      },
      {
        id: 'tool-file-processor',
        name: 'File Processor',
        description:
          'Process and manipulate files: convert, compress, extract text, and format conversion',
        category: 'Utilities',
        type: 'Function',
        isActive: true,
        isFavorite: false,
        usageCount: 203,
        created: '2024-07-08',
        lastModified: '2024-12-14',
        author: 'System',
        tags: ['file', 'processing', 'conversion', 'pdf', 'excel'],
        version: '2.0.1',
        parameters: {
          filePath: {
            type: 'string',
            required: true,
            description: 'Path to file to process',
          },
          operation: {
            type: 'string',
            required: true,
            description: 'Operation to perform',
          },
          outputFormat: {
            type: 'string',
            required: false,
            description: 'Output format',
          },
        },
      },
      {
        id: 'tool-translation',
        name: 'Language Translator',
        description:
          'Translate text between multiple languages using advanced AI translation models',
        category: 'AI/ML',
        type: 'API',
        isActive: true,
        isFavorite: false,
        usageCount: 145,
        created: '2024-10-18',
        lastModified: '2024-12-13',
        author: 'System',
        tags: ['translation', 'language', 'ai', 'multilingual'],
        version: '1.3.0',
        parameters: {
          text: {
            type: 'string',
            required: true,
            description: 'Text to translate',
          },
          fromLang: {
            type: 'string',
            required: false,
            description: 'Source language',
            default: 'auto',
          },
          toLang: {
            type: 'string',
            required: true,
            description: 'Target language',
          },
        },
      },
    ];
  }
}

// Export singleton instance
export default new ToolService();
