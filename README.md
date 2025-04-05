# GaBank - Financial Goal Tracking App

GaBank is a React Native mobile application that helps users track their financial goals and dreams with visual progress tracking and AI-powered image generation.

## Features

- 💰 Financial goal tracking with visual progress bars
- 💳 Card management system
- 💹 Budget planning and tracking
- 🔄 Real-time updates with Firestore
- 🖼️ Dream visualization using Gemini API
- 📥 Receive money with QR code generation
- 🏦 Save money with goal-based savings
- 🤖 Financial AI assistant for smart guidance

## Tech Stack

- React Native with Expo
- Firebase (Authentication & Firestore)
- Google's Gemini API for image generation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account and keys
- Gemini API key

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gabank.git
cd gabank/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

## Project Structure

```
frontend/
├── App.js                 # Main application entry
├── assets/               # Images and static assets
├── backend/             # Backend controllers
│   ├── dreamController.js
│   ├── userController.js
│   └── ...
├── components/          # Reusable components
├── config/             # Configuration files
│   ├── firebaseConfig.js
│   └── geminiConfig.js
├── screens/            # Application screens
└── styles/            # Stylesheets
```


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Firebase for backend services
- Google's Gemini API for image generation
- Expo team for the development framework
- React Native community for the amazing ecosystem
