# 🤖 Agentic TaskBoard

A production-ready Jira-like application for orchestrating AI agents with complete observability across the Software Development Lifecycle (SDLC).

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🎯 Autonomous AI Agent Orchestration
- **Smart Task Assignment**: Assign tasks to Claude agents that autonomously work through the full SDLC
- **Specialized Agents**: Dedicated agents for Planning, Building, Reviewing, and Testing
- **Full Context Handoff**: Each agent receives complete context from previous phases
- **Automatic Progression**: Tasks move through SDLC phases automatically

### 📊 Complete Observability
- **Real-time Cost Tracking**: Monitor AI inference costs per phase, task, and total session
- **Tool Call Logging**: Track every action agents take
- **Output File Tracking**: See exactly what each agent produced
- **Live Dashboard**: WebSocket-powered real-time updates

### 🎨 Modern, Intuitive UI
- **Dark Theme**: Professional dark theme with bright neon accents
- **Kanban Board**: Swim lanes for each SDLC phase (ToDo, Plan, Build, Review, Test, Done)
- **Real-time Status**: Watch agents work in real-time
- **Cost Visualization**: Beautiful header showing costs by phase

### 🔧 SDLC Workflow
Tasks automatically progress: **ToDo** → **Plan** → **Build** → **Review** → **Test** → **Done**

## 🏗️ Architecture

### Monorepo Structure
```
AgenticTaskBoard/
├── .claude/                    # Claude SDK configuration
│   ├── hooks/                  # Agent logging & cost tracking
│   ├── commands/               # Slash commands
│   ├── skills/                 # SDLC orchestrator skill
│   └── prompts/                # Agent meta prompts
├── packages/
│   ├── shared/                 # Shared TypeScript types
│   ├── backend/                # Fastify API + WebSocket
│   └── frontend/               # SolidJS application
```

### Technology Stack

**Backend:**
- Fastify - High-performance web framework
- TypeScript - Type-safe development
- WebSocket - Real-time communication
- In-memory store - Fast data access

**Frontend:**
- SolidJS - Reactive UI framework
- TypeScript - Full type safety
- Vite - Lightning-fast builds
- CSS Variables - Themeable design

**AI Integration:**
- Claude Agent SDK - Hooks, commands, skills
- Real-time cost tracking
- Automated SDLC orchestration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Build shared types
npm run build --workspace=packages/shared

# Start development servers (backend + frontend)
npm run dev
```

**Servers:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- WebSocket: ws://localhost:3001/ws

### Production Build

```bash
# Build all packages
npm run build

# Start backend
npm run start --workspace=packages/backend

# Serve frontend
cd packages/frontend/dist && npx serve
```

## 📖 Usage Guide

### Creating a Task

1. Click **"+ Create Task"** in the top-right
2. Enter task **title** (required) and **description**
3. Click **"Create Task"**

### Assigning an Agent

1. Find your task in the **ToDo** column
2. Click **"Assign Agent"** button
3. Watch as the orchestrator:
   - Spawns a **Planner Agent** to design the solution
   - Spawns a **Builder Agent** to implement it
   - Spawns a **Reviewer Agent** to review quality
   - Spawns a **Tester Agent** to write and run tests
4. Task automatically moves to **Done** when complete

### Monitoring Progress

- **Task Cards**: Show real-time status and cost
- **Cost Header**: Displays total and per-phase costs
- **Agent Status**: See which agents are working
- **Console Logs**: View detailed agent activity in backend console

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific package
npm test --workspace=packages/shared
npm test --workspace=packages/backend

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🎨 Code Style

This project follows strict code style guidelines:

- ❌ No semicolons
- 📏 2-space indentation
- 💬 Single quotes
- 📐 100-character line width
- 🎯 TypeScript strict mode

## 📦 API Reference

### REST API

Base URL: `http://localhost:3001/api`

#### Tasks
- `GET /tasks` - List all tasks
- `GET /tasks/:id` - Get task details
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/assign` - Assign agent to task

#### Agents
- `GET /agents` - List all agents
- `GET /agents/:id` - Get agent details
- `POST /agents` - Create agent
- `PATCH /agents/:id/status` - Update agent status

#### Costs
- `GET /costs` - Get cost breakdown
- `POST /costs/reset-session` - Reset session costs

### WebSocket Events

Connect: `ws://localhost:3001/ws`

- `task:created`, `task:updated`, `task:deleted`
- `agent:created`, `agent:status-changed`
- `workflow:started`, `workflow:completed`
- `cost:updated`

## 🔮 Future Enhancements

- [ ] Real Claude Agent SDK integration (currently simulated)
- [ ] Drag-and-drop tasks between columns
- [ ] Persistent database (SQLite/PostgreSQL)
- [ ] User authentication
- [ ] GitHub/GitLab integration
- [ ] Export reports (PDF, CSV)
- [ ] Custom agent workflows
- [ ] Team collaboration

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow code style guidelines
4. Add tests for new features
5. Submit a pull request

## 📄 License

MIT License

## 🙏 Acknowledgments

- Anthropic for Claude and the Agent SDK
- Fastify, SolidJS, and Vite teams
- Open source community

---

**Built with ❤️ for the agentic future**
