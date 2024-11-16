// Base API URL
const API_BASE_URL = "https://api.weatherapi.com/v1/forecast.json";
const ALERTS_API_URL = "http://api.weatherapi.com/v1/alerts.json";
const API_KEY = "55dfbfa23edd4a57a3a172415241511";

// Function to fetch and display weather data
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `${API_BASE_URL}?key=${API_KEY}&q=${city}&days=5`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const weatherData = await response.json();

    // Extract location data
    const { name, region, country } = weatherData.location;

    // Iterate through forecast days and update the UI
    weatherData.forecast.forecastday.forEach((forecastDay, index) => {
      const { date } = forecastDay;
      const {
        avgtemp_c,
        condition,
        maxwind_kph,
        avghumidity,
        daily_chance_of_rain,
        daily_chance_of_snow,
        uv,
      } = forecastDay.day;
      const { sunrise, sunset, moonrise, moonset, moon_phase } =
        forecastDay.astro;
      // Convert the date to dd-mm-yyyy format
      const formattedDate = formatDate(date);

      // Update the weather card
      updateWeatherCard(`day-${index}`, {
        date: formattedDate,
        name,
        region,
        country,
        temp_c: avgtemp_c,
        condition,
        wind_kph: maxwind_kph,
        humidity: avghumidity,
        feelslike_c: avgtemp_c, // Using avgtemp_c as a proxy for feelslike
        daily_chance_of_rain,
        daily_chance_of_snow,
        uv,
        sunrise,
        sunset,
        moonrise,
        moonset,
        moon_phase,
      });
    });

    // Fetch and display weather alerts
    fetchWeatherAlerts(city);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Could not fetch weather data. Please try again.");
  }
}

// Function to fetch weather alerts
async function fetchWeatherAlerts(city) {
  try {
    const response = await fetch(`${ALERTS_API_URL}?key=${API_KEY}&q=${city}`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather alerts");
    }
    const alertData = await response.json();

    // Extract the alerts array
    const alerts = alertData.alerts.alert;
    displayWeatherAlerts(alerts);
  } catch (error) {
    console.error("Error fetching weather alerts:", error);
    alert("Could not fetch weather alerts. Please try again.");
  }
}

// Function to display weather alerts
function displayWeatherAlerts(alerts) {
  const alertsList = document.getElementById("alerts-list");
  alertsList.innerHTML = ""; // Clear previous alerts

  if (alerts.length === 0) {
    alertsList.innerHTML = "<p>No alerts at the moment.</p>";
  } else {
    alerts.forEach((alert) => {
      const alertCard = document.createElement("div");
      alertCard.classList.add("alert-card");

      alertCard.innerHTML = `
        <h3>${alert.headline}</h3>
        <p><strong>Severity:</strong> <span class="alert-severity">${
          alert.severity
        }</span></p>
        <p class="alert-dates"><strong>Effective:</strong> ${new Date(
          alert.effective
        ).toLocaleString()} <br>
        <strong>Expires:</strong> ${new Date(
          alert.expires
        ).toLocaleString()}</p>
        <p><strong>Event:</strong> ${alert.event}</p>
        <p><strong>Description:</strong> ${alert.desc}</p>
      `;

      alertsList.appendChild(alertCard);
    });
  }
}

// Function to format date as dd-mm-yyyy
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

// Function to update a weather card
function updateWeatherCard(id, data) {
  document.getElementById(`${id}-data`).textContent = data.date;
  document.getElementById(`${id}-name`).textContent = data.name;
  document.getElementById(`${id}-region`).textContent = data.region;
  document.getElementById(`${id}-country`).textContent = data.country;
  document.getElementById(`${id}-temp`).textContent = `${data.temp_c}°C`;
  document.getElementById(`${id}-condition-text`).textContent =
    data.condition.text;
  document.getElementById(`${id}-condition-icon`).src = data.condition.icon;
  document.getElementById(`${id}-wind`).textContent = `${data.wind_kph} kph`;
  document.getElementById(`${id}-humidity`).textContent = `${data.humidity}%`;
  document.getElementById(
    `${id}-feels-like`
  ).textContent = `${data.feelslike_c}°C`;
  document.getElementById(
    `${id}-chance-rain`
  ).textContent = `${data.daily_chance_of_rain}%`;
  document.getElementById(
    `${id}-chance-snow`
  ).textContent = `${data.daily_chance_of_snow}%`;
  document.getElementById(`${id}-uv`).textContent = data.uv;
  document.getElementById(`${id}-sunrise`).textContent = data.sunrise;
  document.getElementById(`${id}-sunset`).textContent = data.sunset;
  document.getElementById(`${id}-moonrise`).textContent = data.moonrise;
  document.getElementById(`${id}-moonset`).textContent = data.moonset;
  document.getElementById(`${id}-moon-phase`).textContent = data.moon_phase;
}

// Event listener for user input
document.getElementById("fetch-weather").addEventListener("click", () => {
  const city = document.getElementById("city-input").value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const defaultCity = "Lisbon";
  document.getElementById("city-input").value = defaultCity;
  fetchWeather(defaultCity);
});

