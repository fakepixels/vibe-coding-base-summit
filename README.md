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

### 1. Environment Configuration

This project uses several environment files for configuration:

- `.env`: Base environment variables loaded in all environments
- `.env.local`: Local environment variables (not committed to Git)
- `.env.production`: Production-specific environment variables

For local development, you can use `.env.local`. For production, the variables in `.env.production` will be used.

### 2. Redis Configuration

This application uses Redis for persistent storage of poll data. You'll need to set up a Redis instance. We recommend using [Upstash](https://upstash.com/) for a serverless Redis solution.

1. Create an account on [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy your Redis URL and token
4. Update your environment files with your Redis credentials:

```
REDIS_URL=https://your-redis-instance.upstash.io
REDIS_TOKEN=your-redis-token
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=community-poll
```

### 3. Production Configuration

For production deployment, you need to set the API base URL to ensure API requests work correctly:

```
NEXT_PUBLIC_API_BASE_URL=https://your-production-domain.com
```

This is already set in `.env.production` but you should update it with your actual production domain.

### 4. Install Dependencies

```bash
npm install
# or
yarn install
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 6. Build for Production

```bash
npm run build
# or
yarn build
```

### 7. Deploy to Production

You can deploy this application to any hosting platform that supports Next.js applications, such as Vercel, Netlify, or AWS.

#### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository in Vercel
3. Set the environment variables in the Vercel dashboard:
   - `REDIS_URL`
   - `REDIS_TOKEN`
   - `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME`
   - `NEXT_PUBLIC_API_BASE_URL` (set to your production domain)
   - Any other environment variables used in your application
4. Deploy the application

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

## Troubleshooting

### Votes Not Registering in Production

If votes are not registering in production, check the following:

1. Ensure your Redis credentials are correctly set in your production environment
2. Verify that `NEXT_PUBLIC_API_BASE_URL` is set to your actual production domain
3. Check the browser console for any errors related to API requests
4. Ensure that your API routes are properly deployed and accessible

You can use the included script to check if votes are being properly stored in Redis:

```bash
node scripts/check-votes.mjs
