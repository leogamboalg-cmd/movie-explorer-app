function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

async function loadUser() {
    try {
        const res = await apiFetch("/users/me");
        if (!res.ok) return;

        const user = await res.json();

        const welcomeEl = document.querySelector(".welcome");
        if (welcomeEl && user.username) {
            welcomeEl.textContent = `Welcome, ${capitalize(user.username)}!`;
        }
    } catch (err) {
        console.error("Failed to load user", err);
    }
}

document.addEventListener("DOMContentLoaded", loadUser);
