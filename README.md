# FoodShareApp

FoodShareApp is a mobile app built with Expo and React Native that helps people share extra food with their local community. Users can create an account, post available food, browse nearby listings, and manage their own shared items.

## Features

- User authentication with Firebase Authentication
- Browse food listings stored in Cloud Firestore
- Create new food posts with quantity, location, description, and expiry details
- View your own listings and simple profile stats
- Expo Router navigation with authenticated tab access

## Tech Stack

- Expo
- React Native
- Expo Router
- Firebase Authentication
- Cloud Firestore
- TypeScript for routing files and JavaScript for screen components

## Project Structure

```text
FoodShareApp/
├── app/                 # Expo Router routes
│   ├── (tabs)/          # Auth-protected tab routes
│   ├── login.tsx
│   ├── main.tsx
│   ├── post-food.tsx
│   └── profile.tsx
├── screens/             # Main UI screen components
├── config.js            # Firebase app/auth/firestore setup via env vars
├── .env.example         # Example Firebase environment variables
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Expo CLI tools via `npx expo`
- A Firebase project with Authentication and Firestore enabled

### Installation

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Then fill in the Firebase values in `.env`.

### Run the App

```bash
npx expo start
```

You can then open the app in:

- Expo Go
- an Android emulator
- an iOS simulator
- a web browser

Helpful scripts:

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## Firebase Setup

This project uses Firebase for authentication and data storage. The app initializes Firebase in `config.js` using Expo public environment variables.

To use your own Firebase project:

1. Create a Firebase project in the [Firebase console](https://console.firebase.google.com/).
2. Enable Email/Password authentication.
3. Create a Firestore database.
4. Copy `.env.example` to `.env`.
5. Fill in the `EXPO_PUBLIC_FIREBASE_*` values from your Firebase project settings.

The app uses:

- `auth` for login and signup
- `db` for reading and writing `foodListings` and user profile documents

## Current App Flow

1. The root route checks Firebase auth state.
2. Unauthenticated users are redirected to `login`.
3. Authenticated users are redirected to the tabbed app.
4. Users can browse listings, post food, and view profile data.

## Firestore Data Used

### `foodListings`

Each listing currently includes fields such as:

- `foodName`
- `quantity`
- `description`
- `location`
- `expiry`
- `postedBy`
- `userId`
- `createdAt`
- `status`

### `users`

User profile documents may include:

- `email`
- `phoneNumber`
- `address`
- `gender`
- `createdAt`

## Notes

- Firebase configuration should be stored in a local `.env` file and never committed to source control.
- Some dependencies such as image picker, location, and notifications are installed but not yet fully used in the current screens.
- The UI is organized using Expo Router route files that wrap screen components from `screens/`.

## Future Improvements

- Add claiming workflow for food listings
- Add image uploads for food posts
- Add location-based discovery and maps
- Add stronger Firestore security rules
- Rotate any Firebase credentials that were previously committed and update your local `.env`

## License

This project is for educational and development use unless you add your own license.
