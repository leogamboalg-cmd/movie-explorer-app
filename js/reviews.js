let starCount = 0;
let reviewCount = 0;
async function loadReviews(movieId) {
    const res = await apiFetch(
        `/reviews/movie/${encodeURIComponent(movieId)}`
    );
    const reviews = await res.json();

    const list = document.getElementById("reviewsList");
    const empty = document.getElementById("noReviews");

    // clear existing nodes safely
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    if (!reviews.length) {
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");
    starCount = 0;
    reviewCount = 0;
    reviews.forEach(review => {
        if (typeof review.rating === "number") {
            starCount += review.rating;
            reviewCount++;
        }
        list.appendChild(createReviewCard(review));
    });
    updateUserRating();
}

function updateUserRating() {
    const userRatingEl = document.getElementById("userRating");

    if (!reviewCount) {
        userRatingEl.textContent = "—";
        return;
    }

    const avg = (starCount / reviewCount).toFixed(1);
    userRatingEl.textContent = `${avg}/5.0`;
}

function createReviewCard(review) {
    const card = document.createElement("div");
    card.classList.add("review-card");

    // header
    const header = document.createElement("div");
    header.classList.add("review-header");

    const avatar = document.createElement("img");
    avatar.classList.add("avatar");
    avatar.src = "/images/default-avatar.png";
    avatar.onerror = () => {
        avatar.style.display = "none";
    };

    avatar.alt = "User avatar";

    const userBlock = document.createElement("div");

    const username = document.createElement("span");
    username.classList.add("username");
    username.textContent = review.user?.username || "Unknown user";

    const stars = document.createElement("span");
    stars.classList.add("stars");
    stars.textContent = renderStars(review.rating);
    userBlock.appendChild(username);
    userBlock.appendChild(stars);

    header.appendChild(avatar);
    header.appendChild(userBlock);

    // review text
    const text = document.createElement("p");
    text.classList.add("review-text");
    text.textContent = review.reviewText || "";

    // like button
    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-review");
    likeBtn.type = "button";
    likeBtn.appendChild(document.createElement("span"));
    likeBtn.appendChild(document.createElement("span"));
    updateLikeButton(likeBtn, review);
    likeBtn.addEventListener("click", () => toggleReviewLike(review, likeBtn));

    // assemble card
    card.appendChild(header);
    card.appendChild(text);
    card.appendChild(likeBtn);

    return card;
}

function updateLikeButton(button, review) {
    const likesCount = review.likesCount || 0;
    const likeLabel = likesCount === 1 ? "like" : "likes";
    const heart = button.children[0];
    const count = button.children[1];

    button.classList.toggle("liked", Boolean(review.likedByMe));
    heart.className = "like-heart";
    heart.textContent = review.likedByMe ? "♥" : "♡";
    count.className = "like-count";
    count.textContent = `${likesCount} ${likeLabel}`;
    button.setAttribute(
        "aria-label",
        `${review.likedByMe ? "Unlike" : "Like"} review with ${likesCount} ${likeLabel}`
    );
}

async function toggleReviewLike(review, button) {
    if (!review?._id || button.disabled) return;

    const wasLiked = Boolean(review.likedByMe);
    button.disabled = true;

    try {
        const res = await apiFetch(`/reviews/${review._id}/like`, {
            method: wasLiked ? "DELETE" : "POST"
        });

        const updatedReview = await res.json();

        if (!res.ok) {
            throw new Error(updatedReview.message || "Failed to update review like");
        }

        review.likesCount = updatedReview.likesCount;
        review.likedByMe = updatedReview.likedByMe;
        updateLikeButton(button, review);
    } catch (err) {
        console.error(err);
        showToast("Failed to update like", 2000);
    } finally {
        button.disabled = false;
    }
}

function renderStars(rating = 0) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? "★" : "☆";
    }
    return stars;
}

async function submitReview(rating, reviewText) {
    const movieData = sessionStorage.getItem("movieData");
    const movie = JSON.parse(movieData);
    const movieId = movie.Title;

    try {
        await apiFetch("/reviews", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                movieId,
                rating: rating ?? null,
                reviewText: reviewText ?? ""
            })
        });

        closeReviewModal();
        loadReviews(movieId);
        showToast("Review saved", 2000);

    } catch (err) {
        console.error(err);
        showToast("Failed to save review", 2000);
    }
}
