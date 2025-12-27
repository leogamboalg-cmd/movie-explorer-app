async function requireAuth() {
    try {
        const res = await fetch("http://localhost:3000/api/users/me", {
            credentials: "include"
        });

        if (!res.ok) {
            window.location.href = "login.html";
        }
    } catch {
        window.location.href = "login.html";
    }
}
