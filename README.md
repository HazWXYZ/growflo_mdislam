# GrowFlo

A web application that helps users search for plants, learn how to care for them, and track their own growing plants.

## What It Does

- **Search plants** using the Perenual API 
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

### Api key from: https://perenual.com/docs/api

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
