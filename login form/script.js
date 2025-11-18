// const loginForm = document.getElementById('loginForm');
// const emailInput = document.getElementById('emailInput');
// const passwordInput = document.getElementById('passwordInput');

// const errorMessage = document.getElementById('errorMessage');
// const loginBtn = document.getElementById('loginBtn');
// const togglePassword = document.getElementById('togglePassword');

// togglePassword.addEventListener('click', () => {
//     if (passwordInput.type === "password") {
//         passwordInput.type = "text";
//         togglePassword.textContent = "hide"
//     } else {
//         passwordInput.type = "password"
//         passwordInput.textContent = "show"
//     }
// });

// loginForm.addEventListener('submit', function(e) {
//     e.preventDefault();

//     const email = emailInput.value.trim();
//     const password = emailInput.value.trim();

//     errorMessage.classList.add('hidden');

//     if (!email || !password) {
//         showError("please fill out all fields");
//         return;
//     }

//     if (!email.includes("@") || !email.includes(".")) {
//         showError("your email is incorrect");
//         return;
//     }

//     if (password.length < 6) {
//         showError("password must be at least 6 characters");
//         return;
//     }

//     alert("Login is successful")
// });

// function showError(msg) {
//     errorMessage.textContent = msg;
//     errorMessage.classList.remove('hidden')
// };



const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

const errorMessage = document.getElementById('errorMessage');
const togglePassword = document.getElementById('togglePassword');

// ===============================
// SHOW HIDE PASSWORD
// ===============================
togglePassword.addEventListener('click', () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }
});

// ===============================
// FORM VALIDATION
// ===============================
loginForm.addEventListener('submit', function (e) {
    e.preventDefault(); // stop form refresh

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // clear old error
    errorMessage.classList.add("hidden");

    // 1. Empty fields
    if (!email || !password) {
        showError("Please fill out all fields.");
        return;
    }

    // 2. Email validation
    if (!email.includes('@') || !email.includes(".")) {
        showError("Your email is incorrect.");
        return;
    }

    // 3. Password validation
    if (password.length < 6) {
        showError("Password must be at least 6 characters.");
        return;
    }

    // If all is good
    alert("Login successful!");
});

// Helper function to display error
function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove("hidden");
}
