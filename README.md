# Developer Portfolio

A developer portfolio built purely with AI. Features React, Vite, and Tailwind CSS, plus an AI-powered chat, GitHub project showcase, experience timeline, and contact section.

## Features

- **AI Chat** – Interactive chat powered by Groq LLM
- **GitHub Projects** – Live project cards from your GitHub profile
- **Experience** – Timeline of work history and achievements
- **Responsive** – Mobile-first layout with collapsible sidebars
- **Dark Theme** – Consistent dark UI with theme tokens

## Tech Stack

- [React](https://react.dev/) 18
- [Vite](https://vitejs.dev/) 6
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Radix UI](https://www.radix-ui.com/) – accessible primitives
- [Groq](https://console.groq.com/) – LLM API for chat

## Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Configure environment

Copy the example env file and add your keys:

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GROQ_API_KEY` | Yes | Groq API key for the chat feature. Get one at [console.groq.com](https://console.groq.com/) |
| `VITE_GITHUB_TOKEN` | No | GitHub PAT for higher rate limits (5k vs 60 req/hr). Create at [github.com/settings/tokens](https://github.com/settings/tokens) with `public_repo` and `read:user` scopes |

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4. Build for production

```bash
npm run build
```

Output is in `dist/`. Deploy to Vercel, Netlify, or any static host.

## Customization

- **Profile & content** – Edit `src/data/portfolio.json` for name, bio, experience, projects, and contact info.
- **Styles** – Theme variables and global styles live in `src/styles/theme.css`.

## Project Structure

```
src/
├── app/           # App shell, routes, components
├── data/          # Portfolio content (portfolio.json)
├── hooks/         # Custom hooks (e.g. useGitHubProjects)
├── styles/        # Global CSS and theme
└── main.tsx       # Entry point
```