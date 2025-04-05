# GaBank - Financial Goal Tracking App

GaBank is a React Native mobile application that helps users track their financial goals and dreams with visual progress tracking and AI-powered image generation.

## Features

- 🔐 Secure user authentication with email and PIN
- 💰 Financial goal tracking with visual progress bars
- 🎯 Dream visualization with AI-generated images
- 💳 Card management system
- 💹 Budget planning and tracking
- 📊 Progress visualization
- 🔄 Real-time updates with Firestore
- 🖼️ Image generation using Gemini API
- 📥 Receive money with QR code generation
- 🏦 Save money with goal-based savings
- 🤖 Financial AI assistant for smart guidance

## Tech Stack

- React Native with Expo
- Firebase (Authentication & Firestore)
- Google's Gemini API for image generation
- Expo Image Manipulator for image processing

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account
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

## Key Features Explained

### Dream Tracking
- Create financial goals with names and target amounts
- Track progress with visual progress bars
- Generate AI images to visualize goals
- Automatic image optimization for storage

### User Authentication
- Email/password registration and login
- PIN setup for additional security
- Secure session management

### Card Management
- Add and manage multiple bank cards
- Track card balances
- Secure card information storage

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up the following collections:
   - `user`: User profiles
   - `Dream`: Financial goals
   - `card`: Card information
   - `savedMoney`: Savings records

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Firebase for backend services
- Google's Gemini API for image generation
- Expo team for the development framework
- React Native community for the amazing ecosystem 