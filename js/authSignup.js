const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "https://movie-explorer-app-yw9h.onrender.com/api";

//authSignup.js
document.querySelector("form").addEventListener("submit", handleSignup);
// document.querySelector("")
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email.trim() === "" || password.trim() === "") {
        showToast("Email and password required");
        return;
    }

    if (username.trim() === "") {
        showToast("Username required");
        return;
    }

    if (!passwordRegex.test(password)) {
        showToast("Password must contain a number and a special character");
        return;
    }

    try {

        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || "Signup failed");
            return;
        }

        showToast("Signup successful! Redirecting.", 1800);

        setTimeout(() => {
            console.log("Form is valid");
            window.location.href = "login.html";
        }, 2000)

    } catch (err) {
        console.error(err);
        showToast("Server error");
    }
}

