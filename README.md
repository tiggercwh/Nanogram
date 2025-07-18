# Nanogram - A Picross/Nonogram Puzzle Game

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)

A full-featured Nanogram (also known as Picross or Nonogram) puzzle game built with modern web technologies. Test your logic skills by solving picture logic puzzles where you fill in the grid based on the numbers provided.

Play the live demo: [https://nanogram.vercel.app/](https://nanogram.vercel.app/)

## ✨ Features

### 🎮 Game Board

- **Interactive Puzzle Solving**: Click to fill cells, right-click to mark as empty
- **Smart Controls**:
  - Click and drag to fill or clear multiple cells
  - Right-click and drag to mark multiple cells
  - Use keyboard shortcuts for faster solving
- **Undo/Redo**: Easily correct mistakes with unlimited undo/redo

### 🎨 Level Creation

- **Built-in Editor**: Create and test your own puzzles
- **No Backend Needed**: All levels are stored in the browser
- **Shareable Links**: Generate links to share your custom levels

## 🛠 Tech Stack

- **Frontend**:

  - Next.js 12
  - React 18
  - TypeScript
  - Tailwind CSS
  - tRPC for type-safe APIs
  - React Query for data fetching

- **Backend**:

  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL (with Vercel Postgres)
  - Redis (for caching with Vercel KV)

- **Deployment**:
  - Vercel
  - Vercel Postgres
  - Vercel KV

## 🚀 Getting Started

### Prerequisites

- Node.js 14.6.0 or later
- Yarn or npm
- PostgreSQL database
- Redis (for caching, optional but recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/nanogram.git
   cd nanogram
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/nanogram?schema=public"
   REDIS_URL="redis://localhost:6379"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Run the development server:

   ```bash
   yarn dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing

To run the test suite:

```bash
yarn test
# or
npm test
```

## 🏗 Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Next.js pages and API routes
├── server/        # tRPC routers and procedures
├── styles/        # Global styles and Tailwind config
└── utils/         # Utility functions and helpers
```

## 🙏 Acknowledgments

- Inspired by classic Picross/Nonogram games
- Built with the awesome [T3 Stack](https://create.t3.gg/)
