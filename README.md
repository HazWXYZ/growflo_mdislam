# GrowFlo

A web application that helps users search for plants, learn how to care for them, and track their own growing plants.

## What It Does

- **Search plants** using the Perenual API — get watering, sunlight, and pruning info
- **Track your plants** with a personal dashboard (full CRUD)
- **Easy Grows page** — 5 recommended beginner-friendly plants
- **User accounts** — simple username/password auth, no email required

## Tech Stack

- **MongoDB** — database for users and tracked plants
- **Express** — backend REST API
- **React** — frontend (React Router, React Hooks, Context API)
- **Node.js** — runtime environment
- **Axios** — HTTP requests
- **bcryptjs** — password hashing
- **jsonwebtoken** — user authentication
- **Perenual API** — plant data

## Setup Instructions

### 1. Clone the repo

```
git clone https://github.com/HazWXYZ/growflo_mdislam
cd GrowFlo
```

### 2. Set up the backend

```
cd backend
npm install
```

Edit the `.env` file and add your Perenual API key:

```
PERENUAL_API_KEY=your_key_here
```

Get a free API key at: https://perenual.com/docs/api

Start the backend:

```
npm run dev
```

### 3. Set up the frontend

```
cd ../frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`. The React dev server proxies API calls to the backend automatically.

## Project Structure

```
GrowFlo/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Plant.js
│   └── routes/
│       ├── auth.js
│       ├── plants.js
│       └── search.js
└── frontend/
    ├── public/
    └── src/
        ├── App.jsx
        ├── App.css
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   └── Navbar.jsx
        └── pages/
            ├── Home.jsx
            ├── Tracker.jsx
            ├── EasyGrows.jsx
            └── About.jsx
```

## API Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | /api/auth/register | Create new account | No |
| POST | /api/auth/login | Login | No |
| GET | /api/plants | Get user's tracked plants | Yes |
| POST | /api/plants | Add a plant | Yes |
| PUT | /api/plants/:id | Update a plant | Yes |
| DELETE | /api/plants/:id | Delete a plant | Yes |
| GET | /api/search?q=query | Search Perenual API | No |

## Plant Tracker Fields

Each tracked plant stores these 7 fields:

1. **id** — MongoDB ObjectId
2. **name** — custom nickname (e.g. "Porch Basil")
3. **age** — how long you've been growing it
4. **environment** — Indoor / Outdoor / Greenhouse
5. **sunshine** — Full Sun / Partial Sun / Shade / Indirect Light
6. **lastWatered** — date of last watering
7. **size** — Seedling / Small / Medium / Large
