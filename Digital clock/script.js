// =======================================
// TASK 1: SELECT ELEMENTS
// =======================================
const clock = document.getElementById("clock");
const dateElement = document.getElementById("date");
const toggleFormat = document.getElementById("toggleFormat");
const toggleTheme = document.getElementById("toggleTheme");
const body = document.body;


// =======================================
// Load saved settings (Tasks 8 & 9)
// =======================================
let is24Hour = JSON.parse(localStorage.getItem("is24Hour")) ?? true;
let isDarkMode = JSON.parse(localStorage.getItem("isDarkMode")) ?? false;

// Apply saved theme
if (isDarkMode) {
    body.classList.add("dark");
    toggleTheme.textContent = "Light Mode";
} else {
    toggleTheme.textContent = "Dark Mode";
}

// Apply saved time format
toggleFormat.textContent = is24Hour
    ? "Switch to 12-Hour Format"
    : "Switch to 24-Hour Format";


// =======================================
// TASK 2 + 3 + 6 + 10: UPDATE CLOCK + DATE
// =======================================
function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let ampm = "";

    // 12-hour format logic (Task 6)
    if (!is24Hour) {
        ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 0 → 12
    }

    // Add 0 before numbers (formatting)
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    // Update clock display
    clock.textContent = `${hours}:${minutes}:${seconds}${is24Hour ? "" : " " + ampm}`;

    // === TASK 10: small animation effect ===
    clock.classList.remove("tick");
    void clock.offsetWidth; // restart animation
    clock.classList.add("tick");

    // === TASK 3: show date ===
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    dateElement.textContent = `${dayName}, ${monthName} ${day}, ${year}`;
}


// =======================================
// TASK 4: UPDATE CLOCK EVERY SECOND
// =======================================
setInterval(updateClock, 1000);
updateClock(); // Run once immediately


// =======================================
// TASK 5 + 8: SWITCH 12/24 FORMAT
// =======================================
toggleFormat.addEventListener("click", () => {
    is24Hour = !is24Hour;

    toggleFormat.textContent = is24Hour
        ? "Switch to 12-Hour Format"
        : "Switch to 24-Hour Format";

    localStorage.setItem("is24Hour", JSON.stringify(is24Hour));

    updateClock();
});


// =======================================
// TASK 7 + 9: DARK/LIGHT MODE
// =======================================
toggleTheme.addEventListener("click", () => {
    body.classList.toggle("dark");
    isDarkMode = body.classList.contains("dark");

    toggleTheme.textContent = isDarkMode ? "Light Mode" : "Dark Mode";

    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
});
