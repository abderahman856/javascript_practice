const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const finishedMessage = document.getElementById("finishedMessage");

let totalSeconds = 0;
let countdownInterval = null;
let isPaused = false;

function convertToTotalSeconds() {
    const h = Number(hoursInput.value);
    const m = Number(minutesInput.value);
    const s = Number(secondsInput.value);

    return h * 3600 + m * 60 + s;
};

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60;

      return (
        h.toString().padStart(2, "0") + ":" +
        m.toString().padStart(2, "0") + ":" +
        s.toString().padStart(2, "0")
    );
};

function startCountdown() {
    if (!isPaused) {
        totalSeconds = convertToTotalSeconds();
    }

    if (totalSeconds <= 0) {
        alert("Please enter a valid time.");
        return;
    }

    // Prevent multiple intervals
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            finishedMessage.textContent = "TIME'S UP!";
            alert("Countdown Finished!");
            return;
        }

        totalSeconds--;
        finishedMessage.textContent = formatTime(totalSeconds);

    }, 1000);

    isPaused = false;
}

// Pause countdown
function pauseCountdown() {
    clearInterval(countdownInterval);
    isPaused = true;
}

// Reset countdown
function resetCountdown() {
    clearInterval(countdownInterval);
    isPaused = false;
    finishedMessage.textContent = "00:00:00";

    hoursInput.value = "";
    minutesInput.value = "";
    secondsInput.value = "";
}

// EVENT LISTENERS
startBtn.addEventListener("click", startCountdown);
pauseBtn.addEventListener("click", pauseCountdown);
resetBtn.addEventListener("click", resetCountdown);