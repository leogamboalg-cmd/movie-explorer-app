document.querySelector("form").addEventListener("submit", handleLogin);
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

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

		const res = await fetch("http://127.0.0.1:3000/api/auth/login", {
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
			// window.location.href = "index.html";
		}, 2000)

	} catch (err) {
		console.error(err);
		showToast("Server error");
	}
}