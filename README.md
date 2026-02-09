# MovieApp

MovieApp is a full-stack IMDb-style web application that allows users to search movies, manage favorites, write reviews, and interact with other users through profiles and friends.

The project focuses on building a secure and modern web app using Node.js, Express, MongoDB, and a custom frontend without frameworks.

---

## Features

### Authentication & Security
- JWT authentication using HTTP-only cookies
- Secure password hashing with bcrypt
- Protected API routes
- Session persistence across refresh
- Auth-required access to protected pages

<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/1d026e0e-f5ee-4a95-92dd-d7c7966d6e52" />

---

### Movie Search & Discovery
- Movie search powered by the OMDb API
- Movie detail pages showing ratings, plot, cast, and metadata
- Smooth navigation between movies

<img width="1890" height="906" alt="image" src="https://github.com/user-attachments/assets/0580bd3b-d7df-4447-8569-ae0ce1be765d" />


---

### Movie Details Page
Displays complete movie information including:

- Poster
- Ratings
- Plot
- Cast
- Release info
- Box office and awards

<img width="1462" height="787" alt="image" src="https://github.com/user-attachments/assets/f53e1e91-1ee8-4383-92c0-48963ad75eea" />


---

### Favorites System
Users can save movies to favorites which are stored in MongoDB.

<img width="1889" height="819" alt="image" src="https://github.com/user-attachments/assets/991cb03e-4385-4494-a96d-46242f23e591" />


---

### Reviews & Ratings
Users can rate and leave reviews for movies, and average ratings are shown.

(image of movie page review modal or review section)

---

### User Profiles
Users have profile pages showing activity and favorites.

<img width="1892" height="884" alt="image" src="https://github.com/user-attachments/assets/f55d17dd-2772-47e9-a191-2abe25d33d8a" />


---

### Friends System
Users can search for other users and view friends in the sidebar.

<img width="286" height="366" alt="image" src="https://github.com/user-attachments/assets/92403ee7-1231-49b2-82ca-ac7adc528616" />


---

## Tech Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript
- Responsive custom UI

### Backend
- Node.js
- Express.js
- RESTful API

### Database
- MongoDB
- Mongoose ODM

### Authentication
- JWT + HTTP-only cookies

### APIs
- OMDb Movie API
- TMDB Movie API
---
