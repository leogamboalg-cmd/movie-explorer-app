document.getElementById("addFriendForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document
        .getElementById("addFriendInput")
        .value
        .trim();

    if (!username) return;

    window.location.href = `profile.html?user=${encodeURIComponent(username)}`;
});