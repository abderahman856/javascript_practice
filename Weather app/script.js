// ==============================
// TASK 1 — SELECT ALL ELEMENTS
// ==============================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const errorMessage = document.getElementById("errorMessage");
const weatherBox = document.getElementById("weatherBox");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

// ==============================
// TASK 2 — API KEY
// ==============================
const API_KEY = "af571b6ed1a88be489cd41bda46d2f54"; // Replace later

// ==============================
// TASK 3 — SEARCH BUTTON CLICK
// ==============================
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name");
    return;
  }

  fetchWeather(city);
});

// ==============================
// TASK 4 — FETCH WEATHER FUNCTION
// ==============================
async function fetchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod === "404") {
      showError("City not found ❌");
      return;
    }

    updateUI(data);
  } 
  catch (error) {
    showError("Something went wrong 😢");
  }
}


// ==============================
// TASK 5 — UPDATE THE UI
// ==============================
function updateUI(data) {
  hideError();
  showWeatherBox();

  cityName.textContent = data.name;
  temperature.textContent = data.main.temp + "°C";
  condition.textContent = data.weather[0].description;
  humidity.textContent = data.main.humidity + "%";
  wind.textContent = data.wind.speed + " m/s";

  const iconId = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
}

// ==============================
// TASK 6 — HIDE & SHOW COMPONENTS
// ==============================
function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove("hidden");
  weatherBox.classList.add("hidden");
}

function hideError() {
  errorMessage.classList.add("hidden");
}

function showWeatherBox() {
  weatherBox.classList.remove("hidden");
}
