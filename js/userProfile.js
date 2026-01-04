function getUsernameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("user");
}
const FAVORITES_PREVIEW_LIMIT = 8;
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


        document.getElementById("userHandle").textContent =
            user.username ? `@${user.username}` : "";

        document.getElementById("userBio").textContent =
            user.bio || "";

        renderFavoriteMovies(user.favoriteMovies || []);

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
            body: JSON.stringify({ bio: newBio })
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
                    `/movies/search?title=${encodeURIComponent(title)}`
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data.Poster && data.Poster !== "N/A") {
                        img.src = data.Poster;
                        setCachedPoster(title, data.Poster);
                    }
                }
            } catch { }
        }


        const titleEl = document.createElement("div");
        titleEl.classList.add("movie-card-title");
        titleEl.textContent = title;

        card.appendChild(img);
        card.appendChild(titleEl);

        card.addEventListener("click", async () => {
            const movie = await getMovieData(title);
            sessionStorage.setItem("movieData", JSON.stringify(movie));
            window.location.href = "movie.html";
        });

        grid.appendChild(card);
    }

    // show "View All" button if needed
    if (movies.length > FAVORITES_PREVIEW_LIMIT) {
        addViewAllFavoritesButton(movies.length);
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
