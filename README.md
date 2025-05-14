# Community Polling App

A simple polling application built with Next.js and OnchainKit that allows users to connect their wallet and vote on a poll. Each wallet can vote only once, and the results are stored persistently across devices.

## Features

- Connect wallet functionality using OnchainKit
- Vote on a poll with 5 options
- One vote per wallet address
- Real-time results display
- Persistent storage using Redis
- Thank you popup after voting

## Setup Instructions

### 1. Redis Configuration

This application uses Redis for persistent storage of poll data. You'll need to set up a Redis instance. We recommend using [Upstash](https://upstash.com/) for a serverless Redis solution.

1. Create an account on [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy your Redis URL and token
4. Update the `.env.local` file with your Redis credentials:

```
REDIS_URL=https://your-redis-instance.upstash.io
REDIS_TOKEN=your-redis-token
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=community-poll
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

## How It Works

1. Users connect their wallet using the OnchainKit wallet connector
2. Once connected, users can select one of the five voting options
3. After voting, a thank you popup appears and the results are displayed
4. The vote is stored in Redis, ensuring persistence across devices and sessions
5. Users can only vote once per wallet address

## API Endpoints

- `GET /api/poll` - Get current poll data (vote counts and total votes)
- `POST /api/poll` - Submit a vote (requires address and option)
- `GET /api/poll/user?address={address}` - Check if a user has already voted

## Technologies Used

- Next.js
- React
- OnchainKit
- Redis (via Upstash)
- Tailwind CSS
