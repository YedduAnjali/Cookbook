# Recipe Book

A React + Firebase web app for exploring, adding, and managing recipes (ingredients + cooking steps) with real-time data and authenticated users.

## Features

- Email/password and Google sign-in (Firebase Auth)
- Create, read, update, delete recipes with ingredients and step-by-step instructions
- Image upload for recipe photos (Firebase Storage)
- Real-time updates via Firestore `onSnapshot`
- Search by name/ingredient and filter by category, cuisine, difficulty
- Per-user favorites (tap the star on any card)
- Protected routes: only signed-in users can add/edit, only owners can delete

## Tech stack

- React 18 + Vite
- React Router v6
- Firebase v10 (Auth, Firestore, Storage)

## Getting started

### 1. Install

```bash
npm install
```

### 2. Create a Firebase project

1. Go to https://console.firebase.google.com and create a new project.
2. Add a **Web app** and copy the SDK config.
3. In the Firebase console, enable:
   - **Authentication** → Sign-in method → Email/Password and Google
   - **Firestore Database** (start in production mode; the included rules are secure)
   - **Storage**

### 3. Configure env vars

Copy `.env.example` → `.env` and fill in the Firebase values.

```bash
cp .env.example .env
```

### 4. Deploy security rules (recommended)

```bash
# One-time setup
npm install -g firebase-tools
firebase login
firebase init          # pick Firestore + Storage, use the included files

# Deploy the rules in this repo
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

### 5. Run locally

```bash
npm run dev
```

Then open http://localhost:5173.

### 6. Build for production

```bash
npm run build
npm run preview   # test the production bundle
```

## Data model

Each document in the `recipes` collection looks like:

```js
{
  title: "Classic margherita pizza",
  description: "Blistered crust, San Marzano sauce, fresh mozzarella.",
  category: "Dinner",          // Breakfast | Lunch | Dinner | Dessert | Snack | Drink
  cuisine: "Italian",
  difficulty: "medium",        // easy | medium | hard
  prepTime: "20",              // minutes (string for easy form handling)
  cookTime: "10",
  servings: "4",
  ingredients: [
    { amount: "500 g", name: "00 flour" },
    { amount: "325 ml", name: "water" },
    ...
  ],
  steps: [
    "Mix flour, water, salt, yeast. Knead 10 minutes.",
    "Rest dough 24h in fridge.",
    ...
  ],
  imageUrl: "https://firebasestorage.googleapis.com/...",
  imagePath: "recipes/<uid>/1713456789-pizza.jpg",
  ownerUid: "<firebase-auth-uid>",
  ownerName: "Tarun",
  favoritedBy: ["<uid>", "<uid>"],
  createdAt: <Timestamp>,
  updatedAt: <Timestamp>
}
```

## Project structure

```
recipe-book/
├── index.html
├── package.json
├── vite.config.js
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── .env.example
└── src/
    ├── main.jsx            # React entry
    ├── App.jsx             # Routes
    ├── firebase/
    │   ├── config.js       # Firebase init
    │   └── recipes.js      # CRUD + image helpers
    ├── context/
    │   └── AuthContext.jsx # useAuth() provider
    ├── hooks/
    │   └── useRecipes.js   # Realtime recipes subscription
    ├── components/
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── RecipeCard.jsx
    │   └── SearchFilter.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Signup.jsx
    │   ├── RecipeDetail.jsx
    │   ├── RecipeForm.jsx  # Handles both "create" and "edit" modes
    │   ├── MyRecipes.jsx
    │   └── Favorites.jsx
    └── styles/
        └── index.css
```

## Security rules at a glance

- Anyone (including signed-out visitors) can read recipes and recipe images.
- Only signed-in users can create recipes, and they become the `ownerUid`.
- Only the owner can update the recipe contents or delete it.
- Non-owners can still update a recipe *only* to add or remove their own UID in `favoritedBy` — no other fields.
- Image uploads are limited to 5 MB, image MIME types only, and can only be written under the user's own `recipes/{uid}/...` path.

## Notes

- `ownerName` is denormalised on the recipe so we don't need a second round-trip to look up user profile docs.
- Favorites use an `array-contains` query, which requires the composite index declared in `firestore.indexes.json`.
