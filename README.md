# Visual Data Extractor

A Chrome extension with backend API for extracting structured data from web pages using AI.

## Prerequisites

- Node.js >= 16.0.0
- pnpm >= 8.0.0
- Python 3.9
- Chrome browser (for extension development)
- Vercel CLI (for local API development)

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Install Vercel CLI globally (for API development):**
   ```bash
   npm install -g vercel
   ```

3. **Install Python dependencies for the API:**
   ```bash
   cd apps/api
   pip install -r requirements.txt
   cd ../..
   ```

## Development

### Run all services (extension + API):
```bash
pnpm dev
```

### Run services individually:

**Chrome Extension:**
```bash
pnpm dev:extension
```

**Backend API:**
```bash
pnpm dev:api
```

### Load Chrome Extension:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `apps/extension/dist` directory (after building)

For development, you can also load from `apps/extension` and Vite will handle hot reloading.

## Building

### Build all:
```bash
pnpm build
```

### Build extension only:
```bash
pnpm build:extension
```

### Build types:
```bash
pnpm build:types
```

## Testing

Run tests across all packages:
```bash
pnpm test
```

## Project Structure

```
/
├── apps/
│   ├── extension/      # React Chrome Extension
│   └── api/            # Python Serverless Backend
├── packages/
│   └── types/          # Shared TypeScript types
├── docs/               # Documentation
└── pnpm-workspace.yaml # Monorepo configuration
```

## Tech Stack

- **Frontend**: React 18.x, TypeScript 5.x, Tailwind CSS, Vite
- **Backend**: Python 3.9, Vercel Serverless Functions
- **Monorepo**: pnpm workspaces
- **Testing**: Vitest (frontend), pytest (backend)