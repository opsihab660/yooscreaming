# YooScreaming - Movie Streaming Platform

A modern movie streaming platform with user authentication using Firebase (Google login) and MongoDB for user data storage.

## Features

- User authentication with Google (Firebase)
- User data storage in MongoDB
- Protected routes for authenticated users
- User profile and settings pages
- Display name change with 60-day restriction
- Name change history tracking
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Firebase project with Google authentication enabled

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/yooscreaming.git
cd yooscreaming
```

### 2. Install dependencies

```bash
# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 3. Configure environment variables

The `.env` file in the root directory should contain:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# MongoDB Configuration
VITE_MONGODB_URI=your_mongodb_uri
```

The `server/.env` file should contain:

```
PORT=5000
MONGODB_URI=your_mongodb_uri
```

### 4. Start the development servers

```bash
# Start both client and server
npm run dev:all

# Or start them separately
npm run dev     # Start client
npm run server  # Start server
```

## User Authentication Flow

1. User clicks "Sign In" button in the navbar
2. User is redirected to the login page
3. User clicks "Sign in with Google" button
4. Google authentication popup appears
5. After successful authentication, user data is saved to MongoDB
6. User is redirected to the home page
7. User can access protected routes (profile, settings)

## User Profile and Settings

- **Profile Page**: Displays user information, display name history, and viewing history
- **Settings Page**: Allows users to manage account settings, appearance, notifications, and privacy

## Display Name Change Feature

- Users can change their display name once every 60 days
- The system tracks and displays the remaining days until the next allowed change
- Name change history is saved and displayed in both profile and settings pages
- Changes are synchronized between Firebase and MongoDB

## Project Structure

```
yooscreaming/
├── public/             # Static assets
├── server/             # Backend server
│   ├── index.js        # Server entry point
│   └── package.json    # Server dependencies
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts (AuthContext)
│   ├── db/             # Database connection
│   ├── firebase/       # Firebase configuration
│   ├── models/         # MongoDB models
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── .env                # Environment variables
└── package.json        # Client dependencies
```

## Local Movie Images Setup

This project uses local movie images. Place your movie poster images in the `public/images` directory.

## License

MIT
