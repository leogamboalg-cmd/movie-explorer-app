# Movie Explorer App Documentation

Movie Explorer App is a full-stack movie discovery project built with vanilla HTML, CSS, and JavaScript on the frontend and Node.js, Express, and MongoDB on the backend. Users can create an account, log in, search movies through the OMDb API, and save favorite titles to their profile.

The frontend is file-based and can be served locally with a static server such as VS Code Live Server. The backend lives in [`backend`](./backend) and exposes the API consumed by the frontend.

## Features

- User registration and login
- JWT-protected routes
- Movie search powered by the OMDb API
- Favorite movies stored per user
- Protected pages for the main app, favorites, and profile
- Friend endpoints scaffolded in the backend

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT bearer token
- External API: OMDb API

## Project Structure

```text
movie-explorer-app/
|-- backend/              Express API, models, middleware, controllers, routes
|-- css/                  Shared and page-specific styles
|-- images/               Static assets
|-- js/                   Frontend scripts and API helpers
|-- index.html            Authenticated home/search page
|-- movie.html            Movie details page
|-- favoriteMovies.html   Favorites page
|-- profile.html          Profile page shell
|-- login.html            Login page
|-- signup.html           Sign-up page
```

## Frontend Pages

- `login.html`: Logs a user in and stores the returned JWT in `localStorage`.
- `signup.html`: Creates a new account.
- `index.html`: Main page for authenticated users, including the movie search bar.
- `movie.html`: Displays a selected movie using data stored in `sessionStorage`.
- `favoriteMovies.html`: Loads the signed-in user's favorite movies.
- `profile.html`: Protected profile layout with placeholder sections for future features.

Shared frontend behavior is centralized in [`js/api.js`](./js/api.js), which selects the API base URL depending on whether the app is running locally or on a deployed host.

## Backend Overview

The backend Express app is responsible for:

- connecting to MongoDB
- registering and authenticating users
- protecting routes with JWT validation
- storing favorite movie titles
- exposing friend management endpoints
- proxying OMDb movie lookups so the API key stays server-side

Detailed backend setup and API reference are in [`backend/README.md`](./backend/README.md).

## Local Development

### 1. Start the backend

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
API_KEY=your_omdb_api_key
PORT=3000
NODE_ENV=development
```

Install and run:

```bash
cd backend
npm install
npm run dev
```

### 2. Serve the frontend

Serve the repository root with a static server. VS Code Live Server matches the backend CORS settings already present in [`backend/server.js`](./backend/server.js).

Supported local frontend origins:

- `http://localhost:5500`
- `http://127.0.0.1:5500`

Once both servers are running:

1. Open `signup.html` and create an account.
2. Log in from `login.html`.
3. Search for a movie from `index.html`.
4. Open a movie details page.
5. Add the movie to favorites.
6. Review saved movies in `favoriteMovies.html`.

## Authentication Flow

- `POST /api/auth/login` returns a JWT.
- The frontend stores that token in `localStorage`.
- Protected frontend requests send `Authorization: Bearer <token>`.
- Protected pages call `requireAuth()` before loading private content.

The backend middleware can also read `req.cookies.token`, but the current frontend implementation uses header-based auth rather than cookie-based auth.

## Current State

The current implementation works well enough for the core flow of signup, login, search, and favorites, but some parts are still incomplete or only partially wired:

- The friends API exists, but [`js/friends.js`](./js/friends.js) is not implemented.
- The profile page is mostly UI structure and does not yet load dedicated profile data into the page.
- [`backend/models/Review.js`](./backend/models/Review.js) exists, but no review routes are mounted.
- [`backend/routes/testRoutes.js`](./backend/routes/testRoutes.js) exists, but it is not mounted by the server.

## Next Improvements

- Finish the friends frontend and connect it to the existing backend routes.
- Choose one auth strategy consistently: cookie-based or bearer-token based.
- Add validation and automated tests for the API.
- Expand the profile page into a real account dashboard.
