# 🎬 MovieHub – Movie Listing & Reviews

A full-stack movie listing and review platform built with **Next.js**, **Tailwind CSS**, **Node.js**, and **PostgreSQL**.

## Features

- 🎥 Browse movies with search, genre filter, and sorting
- ⭐ Rate and review movies (1–5 stars)
- 🔐 User authentication (Register / Login with JWT)
- 🛡️ Admin dashboard for managing movies (CRUD)
- 🌙 Dark cinema-inspired design with glassmorphism

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS v3 |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT + bcryptjs |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repo

```bash
git clone https://github.com/rohitLomga/movie-hub.git
cd movie-hub
```

### 2. Backend Setup

```bash
cd backend
npm install
# Create .env from .env.example and update your DB credentials
cp .env.example .env
# Run the seed script to create tables & sample data
node seeds/seed.js
# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)

## Default Admin Account

After seeding, you can log in as admin:
- **Email**: admin@moviehub.com
- **Password**: admin123
