//authLogin.js
const API_BASE =
	window.location.hostname === "localhost"
		? "http://localhost:3000/api"
		: "https://movie-explorer-app-yw9h.onrender.com/api";

document.querySelector("form").addEventListener("submit", handleLogin);
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
showToast("Waking up server, please wait...", 30000);

async function handleLogin(e) {
	e.preventDefault();
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	if (email.trim() === "" || password.trim() === "") {
		showToast("Email and password required");
		return;
	}

	if (!passwordRegex.test(password)) {
		showToast("Password must contain a number and a special character");
		return;
	}

	try {

		const res = await fetch(`${API_BASE}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({ email, password })
		});
		const data = await res.json();
		console.log("LOGIN RESPONSE:", data);

		if (!res.ok) {
			showToast(data.message || "Login failed");
			return;
		}
		// localStorage.setItem("token", data.token);
		showToast("Login successful!", 1800);

		setTimeout(() => {
			console.log("Form is valid");
			window.location.href = "index.html";
		}, 2000)

	} catch (err) {
		console.error(err);
		showToast("Server error");
	}
}