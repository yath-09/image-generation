Photo AI-   AI-Powered Photo Generation

Tech Stack
Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS,S3 for model images 
Backend: Node.js with TypeScript
Authentication: Clerk
Containerization: Docker
Package Management: Bun
Monorepo Management: Turborepo


Project Structure
.
├── apps
│   ├── web/                 # Next.js frontend
│   └── backend/            # Node.js backend with bun
├── packages
│   ├── db/                 # Shared UI components
│   ├── typescript-config/  # Shared TS config
│   └── eslint-config/     # Shared ESLint config
├── docker/                # Docker configuration
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
└── package.json

Local Development

# Install dependencies
bun install

# Run development servers
bun run dev

# Build all packages
bun run build

Development Commands

# Run frontend only
bun run start:web

# Run backend only
bun run start:backend

# Run both frontend and backend
bun run dev