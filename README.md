# CMS Architecture Project

This project consists of two main repositories:

1. **Frontend**: Next.js CMS Admin Portal
2. **Backend**: NestJS REST API server

## Project Structure

```
example-cms/
├── frontend/          # Next.js Admin Portal
└── backend/           # NestJS API Server
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB instance)
- Clerk account for authentication

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your:
- `DATABASE_URL` - MongoDB connection string
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL (default: http://localhost:3001)

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Run migrations (if needed):
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run start:dev
```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3000)

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3001`

## Features

### Dynamic Pages Management
- Create dynamic public-facing pages with custom slugs
- Flexible block-based content system (headings, text, images, videos, quotes, code blocks)
- Publish status management (Draft, Published, Archived)
- Optional scheduling for publication
- Public-facing page rendering at `/{slug}`

### Content Management
- Articles, Videos, and Ads management
- CRUD operations for all content types
- Content status management (Draft, Published, Archived)

### Location Management
- Hierarchical location structure
- Create, edit, and delete locations
- Assign content to locations

### Notification Management
- Create push notifications
- Schedule notifications
- Target specific locations or all users
- Track notification status

### Feedback Management
- View user feedback from mobile app
- Respond to feedback
- Update feedback status
- Categorize feedback

## API Endpoints

### Pages
- `GET /api/pages` - List published pages (public)
- `GET /api/pages/admin` - List all pages with filters (protected)
- `GET /api/pages/slug/:slug` - Get page by slug (public)
- `GET /api/pages/:id` - Get single page (protected)
- `POST /api/pages` - Create page (protected)
- `PATCH /api/pages/:id` - Update page (protected)
- `DELETE /api/pages/:id` - Delete page (protected)

### Content
- `GET /api/content` - List all content
- `GET /api/content/:id` - Get single content
- `POST /api/content` - Create content
- `PATCH /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### Locations
- `GET /api/locations` - List all locations
- `GET /api/locations/:id` - Get single location
- `POST /api/locations` - Create location
- `PATCH /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Notifications
- `GET /api/notifications` - List all notifications
- `GET /api/notifications/:id` - Get single notification
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/:id` - Update notification
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/:id/send` - Send notification

### Feedback
- `GET /api/feedback` - List all feedback
- `GET /api/feedback/:id` - Get single feedback
- `POST /api/feedback` - Create feedback (public)
- `PATCH /api/feedback/:id/status` - Update feedback status
- `POST /api/feedback/:id/respond` - Respond to feedback

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### E2E Tests
```bash
cd backend
npm run test:e2e
```

## Technology Stack

### Frontend
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Tanstack Query (React Query)
- Clerk Authentication
- React Hook Form + Zod

### Backend
- NestJS
- TypeScript
- Prisma ORM
- MongoDB
- Clerk SDK
- class-validator + class-transformer

## Development Notes

- All API endpoints (except public feedback creation) require Clerk authentication
- The backend uses Prisma for database operations
- The frontend uses Tanstack Query for data fetching and caching
- Authentication is handled via Clerk middleware in the frontend
- CORS is configured to allow requests from the frontend URL
