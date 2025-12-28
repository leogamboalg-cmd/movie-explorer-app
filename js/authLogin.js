// authLogin.js

document.querySelector("form").addEventListener("submit", handleLogin);

async function handleLogin(e) {
	e.preventDefault();

	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	if (email.trim() === "" || password.trim() === "") {
		showToast("Email and password required");
		return;
	}

	try {
		const res = await fetch(`${API_BASE}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (!res.ok) {
			showToast(data.message || "Login failed");
			return;
		}

		// STORE TOKEN FOR HEADER-BASED AUTH
		setAuthToken(data.token);

		showToast("Login successful!", 1500);

		setTimeout(() => {
			window.location.href = "index.html";
		}, 1500);

	} catch (err) {
		console.error(err);
		showToast("Server error");
	}
}