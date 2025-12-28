async function requireAuth() {
    const token = getAuthToken();

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await apiFetch("/users/me");

        if (!res.ok) {
            clearAuthToken();
            window.location.href = "login.html";
        }
    } catch {
        clearAuthToken();
        window.location.href = "login.html";
    }
}
