// authSignup.js

document.querySelector("form").addEventListener("submit", handleSignup);

const passwordRegex =
    /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

async function handleSignup(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    const displayName = document.getElementById("displayName").value;

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        showToast("Passwords do not match");
        return;
    }

    if (username.trim() === "") {
        showToast("Username required");
        return;
    }

    if (email.trim() === "" || password.trim() === "") {
        showToast("Email and password required");
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
            body: JSON.stringify({ username, displayName, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || "Signup failed");
            return;
        }

        showToast("Signup successful! Redirecting to login.", 1500);

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (err) {
        console.error(err);
        showToast("Server error");
    }
}