function getUsernameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("user");
}
const FAVORITES_PREVIEW_LIMIT = 10;
const usernameFromURL = getUsernameFromURL();
const viewingOtherUser = Boolean(usernameFromURL);

async function loadProfile() {
  const card = document.getElementById("profileCard");
  // check if we are viewing another user

  // decide endpoint
  const endpoint = usernameFromURL
    ? `/users/${encodeURIComponent(usernameFromURL)}`
    : "/users/me";

  try {
    const res = await apiFetch(endpoint);

    if (!res.ok) {
      console.log("Profile fetch failed:", res.status);
      return;
    }

    const user = await res.json();

    document.getElementById("username").textContent =
      user.displayName || user.username || "";

    document.getElementById("userHandle").textContent = user.username
      ? `@${user.username}`
      : "";

    document.getElementById("userBio").textContent = user.bio || "";

    document.getElementById("friendsCount").textContent = (
      user.friendsList || []
    ).length;

    const friendButton = document.getElementById("addFriendBtn");

    if (!viewingOtherUser && friendButton) {
      friendButton.classList.add("hidden");
    }

    if (viewingOtherUser && friendButton) {
      friendButton.onclick = async () => {
        try {
          const res = await apiFetch("/friends/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              friendName: user.username,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            showToast(data.message);
            console.log(data.message);
            return;
          }

          showToast("Friend added!");
        } catch (err) {
          console.error(err);
          console.log(res);
          showToast("Error adding friend");
        }
      };
    }

    renderFavoriteMovies(user.favoriteMovies || []);
    loadReviewedMovies(user.username);
    if (!viewingOtherUser) loadFriendsList();

    // hide edit button if NOT your profile
    if (usernameFromURL && editBtn) {
      editBtn.classList.add("hidden");
    }

    card.classList.add("ready");
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", loadProfile);

const editBtn = document.getElementById("editProfileBtn");
const bioEl = document.getElementById("userBio");
const bioEditor = document.getElementById("bioEditor");
const bioInput = document.getElementById("bioInput");
const saveBtn = document.getElementById("saveBioBtn");
const cancelBtn = document.getElementById("cancelBioBtn");

if (!viewingOtherUser) {
  editBtn.addEventListener("click", () => {
    bioInput.value = bioEl.textContent.trim();
    bioEl.classList.add("hidden");
    bioEditor.classList.remove("hidden");
    bioInput.focus();
  });

  cancelBtn.addEventListener("click", () => {
    bioEditor.classList.add("hidden");
    bioEl.classList.remove("hidden");
  });

  saveBtn.addEventListener("click", async () => {
    const newBio = bioInput.value.trim();

    const res = await apiFetch("/users/me/setBio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: newBio }),
    });

    if (!res.ok) {
      showToast("Failed to update bio");
      return;
    }

    const user = await res.json();
    bioEl.textContent = user.bio || "";

    bioEditor.classList.add("hidden");
    bioEl.classList.remove("hidden");

    showToast("Bio updated");
  });
}

async function renderFavoriteMovies(movies = []) {
  const grid = document.getElementById("favoriteMoviesGrid");
  const countEl = document.getElementById("favoritesCount");

  if (!grid) return;

  // update count
  if (countEl) {
    countEl.textContent = movies.length;
  }

  // clear grid safely
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }

  if (movies.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.textContent = "No favorite movies yet.";
    emptyMsg.style.opacity = "0.6";
    grid.appendChild(emptyMsg);
    return;
  }

  const previewMovies = movies.slice(0, FAVORITES_PREVIEW_LIMIT);

  for (const title of previewMovies) {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const img = document.createElement("img");
    img.alt = title;

    // fetch poster safely
    const cachedPoster = getCachedPoster(title);
    if (cachedPoster) {
      img.src = cachedPoster;
    } else {
      try {
        const res = await apiFetch(
          `/movies/search?title=${encodeURIComponent(title)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.Poster && data.Poster !== "N/A") {
            img.src = data.Poster;
            setCachedPoster(title, data.Poster);
          }
        }
      } catch {}
    }

    const titleEl = document.createElement("div");
    titleEl.classList.add("movie-card-title");
    titleEl.textContent = title;

    card.appendChild(img);
    card.appendChild(titleEl);

    card.addEventListener("click", async () => {
      const movie = await getMovieData(title);
      sessionStorage.setItem("movieData", JSON.stringify(movie));
      addToRecentlyViewed(movie);
      window.location.href = "movie.html";
    });

    grid.appendChild(card);
  }

  // show "View All" button if needed
  if (movies.length > FAVORITES_PREVIEW_LIMIT) {
    addViewAllFavoritesButton(movies.length);
  }
}

async function loadReviewedMovies(username) {
  const grid = document.getElementById("reviewedMoviesGrid");
  const countEl = document.getElementById("reviewsCount");

  if (!grid) return;

  // clear grid
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }

  try {
    const res = await apiFetch(`/reviews/userReviews/${username}`);

    if (!res.ok) return;

    const reviews = await res.json();

    if (countEl) {
      countEl.textContent = reviews.length;
    }

    if (reviews.length === 0) {
      const empty = document.createElement("div");
      empty.textContent = "No reviews yet.";
      empty.style.opacity = "0.6";
      grid.appendChild(empty);
      return;
    }

    for (const review of reviews) {
      const title = review.movieId;

      const card = document.createElement("div");
      card.classList.add("movie-card");

      const img = document.createElement("img");
      img.alt = title;

      const cachedPoster = getCachedPoster(title);
      if (cachedPoster) {
        img.src = cachedPoster;
      } else {
        try {
          const res = await apiFetch(
            `/movies/search?title=${encodeURIComponent(title)}`,
          );

          if (res.ok) {
            const data = await res.json();
            if (data.Poster && data.Poster !== "N/A") {
              img.src = data.Poster;
              setCachedPoster(title, data.Poster);
            }
          }
        } catch {}
      }

      const titleEl = document.createElement("div");
      titleEl.classList.add("movie-card-title");
      titleEl.textContent = `${title} ⭐${review.rating ?? ""}`;

      card.appendChild(img);
      card.appendChild(titleEl);

      card.addEventListener("click", async () => {
        const movie = await getMovieData(title);
        sessionStorage.setItem("movieData", JSON.stringify(movie));
        window.location.href = "movie.html";
      });

      grid.appendChild(card);
    }
  } catch (err) {
    console.error(err);
  }
}

function addViewAllFavoritesButton(totalCount) {
  const container = document.getElementById("viewAllFavoritesContainer");

  // clear previous button if re-rendering
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const btn = document.createElement("button");
  btn.textContent = `View all ${totalCount} favorites`;
  btn.classList.add("btn-ghost");
  btn.style.marginTop = "18px";
  btn.style.width = "100%";

  btn.addEventListener("click", () => {
    window.location.href = "favoriteMovies.html";
  });

  container.appendChild(btn);
}

function getCachedPoster(title) {
  return sessionStorage.getItem(`poster:${title}`);
}

function setCachedPoster(title, poster) {
  sessionStorage.setItem(`poster:${title}`, poster);
}
