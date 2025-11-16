// Select display + buttons
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");
const themeToggle = document.getElementById("themeToggle");


// Load history from LocalStorage
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
renderHistory();


// === BUTTON CLICK EVENTS ===
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        handleButtonClick(btn.dataset.key);
    });
});


// === KEYBOARD SUPPORT ===
document.addEventListener("keydown", (e) => {
    const validKeys = "0123456789+-*/.=EnterBackspace";
    if (!validKeys.includes(e.key)) return;

    if (e.key === "Enter") handleButtonClick("=");
    else if (e.key === "Backspace") handleButtonClick("Back");
    else handleButtonClick(e.key);
});


// === MAIN HANDLER FUNCTION ===
function handleButtonClick(value) {

    const operators = ["+", "-", "*", "/"];

    // Clear screen
    if (value === "C") {
        display.value = "";
        return;
    }

    // Backspace
    if (value === "Back") {
        display.value = display.value.slice(0, -1);
        return;
    }

    // Calculate
    if (value === "=") {
        calculateResult();
        return;
    }

    // Prevent starting with operator
    if (operators.includes(value) && display.value === "") return;

    // Prevent double operators
    const lastChar = display.value.slice(-1);
    if (operators.includes(value) && operators.includes(lastChar)) return;

    // Prevent double dots
    if (value === ".") {
        let currentNumber = display.value.split(/[-+*/]/).pop();
        if (currentNumber.includes(".")) return;
    }

    // Limit display length
    if (display.value.length >= 20) return;

    // Add clicked char
    display.value += value;
}


// === CALCULATE FUNCTION ===
function calculateResult() {
    try {
        if (display.value.includes("/0")) {
            display.value = "Error";
            return;
        }

        let result = eval(display.value);

        // Save to history
        addToHistory(display.value + " = " + result);

        display.value = result;

    } catch {
        display.value = "Error";
    }
}


// === HISTORY FUNCTIONS ===
function addToHistory(entry) {
    history.push(entry);
    localStorage.setItem("calcHistory", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

clearHistoryBtn.addEventListener("click", () => {
    history = [];
    localStorage.removeItem("calcHistory");
    renderHistory();
});


// === DARK/LIGHT MODE ===
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    themeToggle.textContent =
        document.body.classList.contains("dark") ? "☀️" : "🌙";
});
