document.getElementById("addFriendForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document
        .getElementById("addFriendInput")
        .value
        .trim();

    if (!username) return;

    try {
        const res = await apiFetch(`/users/${encodeURIComponent(username)}`);

        if (!res.ok) {
            showToast("User not found", 2000);
            return;
        }

        // user exists → go to profile
        window.location.href =
            `profile.html?user=${encodeURIComponent(username)}`;

    } catch (err) {
        console.error(err);
        showToast("Failed to search user", 2000);
    }
});
