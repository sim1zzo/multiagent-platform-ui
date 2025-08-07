# MultiAgent Platform UI

A React-based user interface for creating, configuring, and managing collaborative AI agents with advanced visualization and analytics capabilities.

## 👥 Authors

This project has been developed by:

- **Simone Izzo** - Lead Developer & UI/UX Designer
- **Antonio Carbone** - Backend Integration & Architecture

## 🚀 Project Overview

The MultiAgent Platform enables the creation and orchestration of collaborative AI agents that can reason, communicate, and act autonomously or in coordination. This frontend provides an intuitive visual interface for building agent networks with robust analytics and monitoring tools.

### ✨ Key Features

- **🎨 Interactive Agent Builder**: Drag-and-drop interface for designing agent networks
- **🔗 Visual Connection System**: Create and manage relationships between agents, models, memory, and tools
- **🎭 Role-Based Configuration**: Specialized settings for different agent types
- **💾 Workspace Management**: Save, load, and organize agent configurations
- **🛒 Workflow Marketplace**: Browse and import pre-built workflow templates
- **🧠 Memory Visualization**: Inspect and analyze agent memory structures
- **📊 Conversation Flow Analyzer**: Visualize and optimize conversation paths
- **🧪 Simulations**: Test and validate workflows with various scenarios
- **📈 Analytics Dashboard**: Monitor performance metrics and system health
- **🌙 Dark Mode Support**: Full light/dark theme implementation
- **🔐 Authentication System**: Secure login with role-based access control

## 🛠 Technical Stack

- **Frontend Framework**: React 18.2.0
- **Workflow Visualization**: ReactFlow 11.7.0
- **Styling**: Tailwind CSS 3.3.3
- **Icons**: Lucide React 0.263.1
- **State Management**: Context API
- **Build Tool**: Create React App

## 🏁 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sim1zzo/multiagent-platform-ui.git
   cd multiagent-platform-ui
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**

   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### 🔧 Troubleshooting Installation

If you encounter issues with `react-scripts`:

```bash
# Clean installation
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Alternative with legacy peer deps
npm install --legacy-peer-deps
```

## 🎮 Usage Guide

### 🏗 Workflow Builder

1. **Creating Agents**: Use the toolbar to add different agent types to the workspace
2. **Configuring Agents**: Select an agent to view and edit its properties in the configuration panel
3. **Creating Connections**: Drag from one agent's connection point to another to establish a relationship
4. **Managing Workspace**: Use the navigation controls to zoom and pan the workspace
5. **Import Templates**: Browse the marketplace for pre-built workflow templates

### 🧠 Memory Visualization

1. Select an agent node in the workflow
2. Click on the "Memory" button to view the agent's memory structure
3. Filter memory items and view their connections and metadata
4. Export memory data for further analysis

### 🧪 Simulations & Analytics

1. Create simulation scenarios to test workflows
2. Run simulations and view results
3. Analyze performance metrics in the Analytics dashboard
4. View conversation flows and optimize interaction paths

## 📁 Project Structure

```
src/
├── App.jsx                           # Main application container
├── index.js                          # Application entry point
├── components/
│   ├── Header.jsx                    # Application header with navigation
│   ├── Toolbar.jsx                   # Tool sidebar with agent types
│   ├── WorkspaceManager.jsx          # Canvas for agent visualization
│   ├── ConfigurationPanel.jsx        # Agent configuration panel
│   ├── NavigationPanel.jsx           # Zoom and navigation controls
│   ├── ChatPanel.jsx                 # Interactive chat interface
│   ├── context/
│   │   └── AppContext.jsx            # Application-wide state management
│   ├── marketplace/
│   │   ├── WorkflowMarketplace.jsx   # Marketplace interface
│   │   ├── WorkflowTemplateCard.jsx  # Template display components
│   │   └── WorkflowTemplateDetails.jsx # Template detail view
│   ├── modals/
│   │   ├── ErrorModal.jsx            # Error display component
│   │   ├── NotificationModal.jsx     # Success/info notifications
│   │   └── CustomNodeCreationModal.jsx # Node creation wizard
│   ├── nodes/
│   │   ├── CustomNodes.jsx           # Node type definitions
│   │   └── AgentNode.jsx             # Agent node component
│   ├── edges/
│   │   └── ConnectionLine.jsx        # Connection visualization
│   ├── pages/
│   │   ├── Dashboard.jsx             # Main dashboard view
│   │   ├── Analytics.jsx             # Performance analytics
│   │   ├── Profile.jsx               # User profile management
│   │   ├── Settings.jsx              # Application settings
│   │   ├── Simulations.jsx           # Workflow testing interface
│   │   └── LoginPage.jsx             # Authentication interface
│   └── visualization/
│       ├── AgentMemoryVisualization.jsx    # Memory inspection tool
│       └── ConversationFlowVisualizer.jsx  # Conversation analyzer
├── hooks/
│   ├── useAgentMemory.js             # Memory management hook
│   └── useWorkflowMarketplace.js     # Marketplace interaction hook
├── services/
│   ├── MemoryService.js              # Memory data operations
│   └── WorkflowMarketplaceService.js # Template operations
└── styles/
    ├── tailwind.css                  # Tailwind CSS imports
    └── toggle.css                    # Custom toggle component styles
```

## 🎯 Advanced Features

### 🧠 Memory System

The platform includes a sophisticated memory visualization system:

- View the structure of agent memory
- Filter memory items by type, confidence, and time range
- Analyze connections between memory items
- Export memory data for external analysis

### 💬 Conversation Flow Analysis

Understand and optimize user interactions:

- Visualize conversation paths through different agent nodes
- Identify bottlenecks and abandonment points
- Analyze agent performance in conversation context
- Optimize routing and response efficiency

### 🛒 Workflow Marketplace

Browse and import pre-built workflow templates:

- **Customer Support Workflows**: Multi-agent chatbot systems
- **Data Analysis Pipelines**: Comprehensive ETL and analysis workflows
- **Content Moderation Systems**: AI-powered safety and compliance
- **Lead Qualification Processes**: Automated sales workflows
- **Document Processing Solutions**: OCR and NLP-powered document handling
- **HR Recruitment Assistants**: Resume screening and candidate evaluation

### 🧪 Simulations

Test your workflows comprehensively:

- Define custom test scenarios with various inputs
- Run simulations with different parameters
- View detailed execution logs and metrics
- Identify performance bottlenecks and optimization opportunities
- Compare results across different workflow versions

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
REACT_APP_ENABLE_DEBUG=true
```

### Build Configuration

For production builds:

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Development

```bash
npm start
```

### Production Build

```bash
npm run build
npm install -g serve
serve -s build
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices and hooks patterns
- Use TypeScript for new components when possible
- Maintain consistent code formatting with Prettier
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the excellent framework
- **ReactFlow** for the powerful flow visualization capabilities
- **Tailwind CSS** for the utility-first styling approach
- **Lucide** for the beautiful icon set
- **Reply** for supporting the development of this innovative platform

## 📞 Support

For support and questions:

- **Issues**: [GitHub Issues](https://github.com/sim1zzo/multiagent-platform-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sim1zzo/multiagent-platform-ui/discussions)
- **Email**: Contact the development team through Reply channels

---

<div align="center">

**MultiAgent Platform UI** - Empowering the future of collaborative AI

Made with ❤️ by **Simone Izzo** and **Antonio Carbone**

⭐ If you find this project useful, please give it a star on GitHub! ⭐

</div>
