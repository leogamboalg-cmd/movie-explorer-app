async function loadProfile() {
    const card = document.getElementById("profileCard");

    try {
        const res = await apiFetch("/users/me");
        if (!res.ok) return;

        const user = await res.json();

        const usernameEl = document.getElementById("username");
        const userHandleEl = document.getElementById("userHandle");
        const bioEl = document.getElementById("userBio");

        if (usernameEl) usernameEl.textContent = user.displayName || "";
        if (userHandleEl) userHandleEl.textContent = user.username ? `@${user.username}` : "";
        if (bioEl) bioEl.textContent = user.bio || "";

        if (card) card.classList.add("ready");
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

/* ENTER EDIT MODE */
editBtn.addEventListener("click", () => {
    bioInput.value = bioEl.textContent.trim();
    bioEl.classList.add("hidden");
    bioEditor.classList.remove("hidden");
    bioInput.focus();
});

/* CANCEL */
cancelBtn.addEventListener("click", () => {
    bioEditor.classList.add("hidden");
    bioEl.classList.remove("hidden");
});

/* SAVE */
saveBtn.addEventListener("click", async () => {
    const newBio = bioInput.value.trim();

    const res = await apiFetch("/users/me/setBio", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
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

