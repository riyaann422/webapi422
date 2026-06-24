async function getWeather(cityFromHistory = "") {

  const inputCity = document.getElementById("cityInput").value.trim();
  const dropdownCity = document.getElementById("cityDropdown").value;

  const city = cityFromHistory || inputCity || dropdownCity;

  if (!city) {
    alert("Please enter or select a city");
    return;
  }

  try {
    // Get coordinates
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await geoRes.json();

    if (!geoData.results) {
      document.getElementById("weatherBox").innerHTML = "❌ City not found";
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    // Get weather
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    const weatherData = await weatherRes.json();
    const w = weatherData.current_weather;

    document.getElementById("weatherBox").innerHTML = `
      <h2>📍 ${name}</h2>
      <p>🌡 Temperature: ${w.temperature} °C</p>
      <p>🌬 Wind Speed: ${w.windspeed} km/h</p>
      <p>☁ Weather Code: ${w.weathercode}</p>
    `;

    saveHistory(city);
    loadHistory();

  } catch (err) {
    document.getElementById("weatherBox").innerHTML =
      "❌ Error fetching weather";
  }
}

// When dropdown changes → auto fill input
function selectCity() {
  const selected = document.getElementById("cityDropdown").value;
  document.getElementById("cityInput").value = selected;
}

// HISTORY
function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (!history.includes(city)) {
    history.unshift(city);
  }

  history = history.slice(0, 5);
  localStorage.setItem("history", JSON.stringify(history));
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  const list = document.getElementById("history");
  list.innerHTML = "";

  history.forEach(city => {
    const li = document.createElement("li");
    li.innerText = city;
    li.onclick = () => getWeather(city);
    list.appendChild(li);
  });
}

loadHistory();