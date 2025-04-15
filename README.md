# MultiAgent Platform UI

A React-based user interface for creating, configuring, and managing collaborative AI agents with advanced visualization and analytics capabilities.

## Project Overview

The MultiAgent Platform enables the creation and orchestration of collaborative AI agents that can reason, communicate, and act autonomously or in coordination. This frontend provides an intuitive visual interface for building agent networks with robust analytics and monitoring tools.

### Key Features

- **Interactive Agent Builder**: Drag-and-drop interface for designing agent networks
- **Visual Connection System**: Create and manage relationships between agents, models, memory, and tools
- **Role-Based Configuration**: Specialized settings for different agent types
- **Workspace Management**: Save, load, and organize agent configurations
- **Workflow Marketplace**: Browse and import pre-built workflow templates
- **Memory Visualization**: Inspect and analyze agent memory structures
- **Conversation Flow Analyzer**: Visualize and optimize conversation paths
- **Simulations**: Test and validate workflows with various scenarios
- **Analytics Dashboard**: Monitor performance metrics and system health
- **Dark Mode Support**: Full light/dark theme implementation

## Technical Stack

- **React**: Component-based UI architecture
- **ReactFlow**: Node-based interface for workflow visualization
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for cohesive visuals
- **Context API**: State management for application-wide data

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/multiagent-platform-ui.git
   cd multiagent-platform-ui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Workflow Builder

1. **Creating Agents**: Use the toolbar to add different agent types to the workspace
2. **Configuring Agents**: Select an agent to view and edit its properties in the configuration panel
3. **Creating Connections**: Drag from one agent's connection point to another to establish a relationship
4. **Managing Workspace**: Use the navigation controls to zoom and pan the workspace
5. **Import Templates**: Browse the marketplace for pre-built workflow templates

### Memory Visualization

1. Select an agent node in the workflow
2. Click on the "Memory" button to view the agent's memory structure
3. Filter memory items and view their connections and metadata
4. Export memory data for further analysis

### Simulations & Analytics

1. Create simulation scenarios to test workflows
2. Run simulations and view results
3. Analyze performance metrics in the Analytics dashboard
4. View conversation flows and optimize interaction paths

## Project Structure

```
src/
├── App.jsx                     // Main application container
├── index.js                    // Application entry point
├── components/
│   ├── Header.jsx              // Application header with navigation
│   ├── Toolbar.jsx             // Tool sidebar with agent types
│   ├── WorkspaceManager.jsx    // Canvas for agent visualization
│   ├── ConfigurationPanel.jsx  // Agent configuration panel
│   ├── NavigationPanel.jsx     // Zoom and navigation controls
│   ├── ChatPanel.jsx           // Interactive chat interface
│   ├── context/
│   │   └── AppContext.jsx      // Application-wide state management
│   ├── marketplace/
│   │   ├── WorkflowMarketplace.jsx     // Marketplace interface
│   │   └── WorkflowTemplateCard.jsx    // Template display components
│   ├── modals/
│   │   ├── ErrorModal.jsx      // Error display component
│   │   └── NotificationModal.jsx // Success/info notifications
│   ├── nodes/
│   │   ├── CustomNodes.jsx     // Node type definitions
│   │   └── AgentNode.jsx       // Agent node component
│   ├── edges/
│   │   └── ConnectionLine.jsx  // Connection visualization
│   ├── pages/
│   │   ├── Dashboard.jsx       // Main dashboard view
│   │   ├── Analytics.jsx       // Performance analytics
│   │   ├── Profile.jsx         // User profile management
│   │   ├── Settings.jsx        // Application settings
│   │   ├── Simulations.jsx     // Workflow testing interface
│   │   └── LoginPage.jsx       // Authentication interface
│   └── visualization/
│       ├── AgentMemoryVisualization.jsx // Memory inspection tool
│       └── ConversationFlowVisualizer.jsx // Conversation analyzer
├── hooks/
│   ├── useAgentMemory.js       // Memory management hook
│   └── useWorkflowMarketplace.js // Marketplace interaction hook
├── services/
│   ├── MemoryService.js        // Memory data operations
│   └── WorkflowMarketplaceService.js // Template operations
└── styles/
    ├── tailwind.css           // Tailwind CSS imports
    └── toggle.css             // Custom toggle component styles
```

## Advanced Features

### Memory System

The platform includes a sophisticated memory visualization system that allows you to:

- View the structure of agent memory
- Filter memory items by type, confidence, and time range
- Analyze connections between memory items
- Export memory data for external analysis

### Conversation Flow Analysis

The conversation flow analyzer helps you understand and optimize user interactions:

- Visualize conversation paths through different agent nodes
- Identify bottlenecks and abandonment points
- Analyze agent performance in conversation context
- Optimize routing and response efficiency

### Workflow Marketplace

Browse and import pre-built workflow templates:

- Customer support workflows
- Data analysis pipelines
- Content moderation systems
- Lead qualification processes
- Document processing solutions

### Simulations

Test your workflows with various scenarios:

- Define custom test scenarios
- Run simulations with different inputs
- View detailed execution logs
- Identify performance bottlenecks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
