# HTML View + Live

A real-time HTML/CSS/JS playground for previewing and iterating on front-end code in the browser.

This project is built with React, TypeScript, and Vite, and it provides a fast sandboxed preview experience with responsive device presets, template starters, console capture, snapshots, and export tools.

## Features

- Live preview for HTML, CSS, and JavaScript
- Debounced auto-reload with manual refresh
- Split, editor-only, preview-only, and source modes
- Responsive device presets for testing layouts
- Starter templates and reusable CDN libraries
- Snapshot management for saving UI states
- Console log and runtime error overlay
- Exporting current code as a shareable bundle

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- PrismJS
- Express / Node tooling for local app utilities

## Getting Started

### Prerequisites

- Node.js
- Bun or npm

### Install dependencies

```bash
npm install
# or
bun install
```

### Run the app

```bash
npm run dev
# or
bun run dev
```

The app runs on port 3000 by default.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Type check

```bash
npm run lint
```

## Project Structure

```text
.
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── metadata.json
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   ├── constants/
│   ├── types/
│   └── utils/
└── bun.lock
```

## Environment Variables

A sample configuration is provided in `.env.example`.

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

## License

This project is licensed under the Apache 2.0 license.

## Description

The project is described as: "preview code".
