document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
        await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        // Redirect to login
        window.location.href = "login.html";
    } catch (err) {
        console.error("Logout failed", err);
    }
});
