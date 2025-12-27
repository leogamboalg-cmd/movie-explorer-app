// js/toast.js
let toastTimeout;

function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");

    if (!toast) {
        console.warn("Toast element not found");
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}
