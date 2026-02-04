async function loadFriendsList() {
    const container = document.getElementById("friendsListContainer");
    const countEl = document.getElementById("friendsCount");

    if (!container) return;

    // clear
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    try {
        const res = await apiFetch("/friends");

        if (!res.ok) return;

        const friends = await res.json();

        if (countEl) {
            countEl.textContent = friends.length;
        }

        if (friends.length === 0) {
            const empty = document.createElement("div");
            empty.textContent = "No friends yet.";
            empty.style.opacity = "0.6";
            container.appendChild(empty);
            return;
        }

        for (const friend of friends) {
            const item = document.createElement("div");
            item.classList.add("friend-item");

            const avatar = document.createElement("div");
            avatar.classList.add("friend-avatar");
            avatar.textContent = "👤";

            const info = document.createElement("div");
            info.classList.add("friend-info");

            const name = document.createElement("div");
            name.classList.add("friend-name");
            name.textContent = friend.username;

            info.appendChild(name);
            item.appendChild(avatar);
            item.appendChild(info);

            item.addEventListener("click", () => {
                window.location.href =
                    `profile.html?user=${encodeURIComponent(friend.username)}`;
            });

            container.appendChild(item);
        }

    } catch (err) {
        console.error(err);
    }
}