# 🇮🇳 Chunav Saarthi — AI-Powered Election Education Platform

> **Empowering Indian voters** with AI-driven election education, MCC violation detection, myth-busting, and an interactive EVM simulator.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Powered by Gemini](https://img.shields.io/badge/AI-Google%20Gemini-blue)](https://ai.google.dev/)
[![Deployed on Cloud Run](https://img.shields.io/badge/Deployed-Cloud%20Run-green)](https://cloud.google.com/run)

## 🎯 Problem Statement

Indian voters face misinformation, don't know their rights, can't identify Model Code of Conduct (MCC) violations, and lack a single AI-powered platform to learn the election process interactively.

## 💡 Solution

Chunav Saarthi is a premium, AI-powered web application that educates users about the Indian election process through:

| Feature | Description |
|---------|-------------|
| **🤖 Ask Saarthi AI** | Conversational AI powered by Google Gemini — ask any election question |
| **⚖️ MCC Violation Checker** | Describe a scenario, AI detects if it violates the Model Code of Conduct |
| **🔍 Myth Buster** | Interactive cards debunking common election myths with legal citations |
| **🗳️ EVM Simulator** | Realistic EVM + VVPAT simulation with sound effects and animations |

## 🛠 Tech Stack

- **Frontend:** React 19 + Vite 8
- **AI:** Google Gemini API via `@google/genai` SDK
- **Styling:** Vanilla CSS with custom design tokens
- **Linting:** ESLint (flat config) + Prettier
- **Deployment:** Docker + Google Cloud Run + Cloud Build CI/CD
- **Type Safety:** PropTypes for runtime type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/Faizan10933/promptwar-ChunavSaarthi.git
cd promptwar-ChunavSaarthi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY

# Start development server
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without modifying |

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   └── ErrorBoundary.jsx
├── constants/         # Application constants and config
│   └── index.js
├── hooks/             # Custom React hooks
│   └── useAudio.js
├── lib/               # External service integrations
│   └── gemini.js      # Google Gemini AI client
├── pages/             # Page-level components
│   ├── HomePage.jsx
│   ├── AskSaarthiPage.jsx
│   ├── MCCCheckerPage.jsx
│   ├── MythBusterPage.jsx
│   └── EVMSimulatorPage.jsx
├── App.jsx            # Root component with routing
├── main.jsx           # Application entry point
└── index.css          # Global styles and design tokens
```

## 🌐 Deployment

The app is configured for **Google Cloud Run** with automatic CI/CD via Cloud Build.

```bash
# Manual deployment
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_VITE_GEMINI_API_KEY=your_key
```

See [cloudbuild.yaml](./cloudbuild.yaml) for the full pipeline configuration.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

## 🏆 Built for PromptWars Virtual Hackathon

This project was built as part of the [PromptWars Virtual Hackathon](https://promptwars.in/) by Hack2Skill.
