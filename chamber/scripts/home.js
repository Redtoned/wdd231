const WEATHER_API_KEY = "60bfa04671fd27e039ae6d7ac20c436c";

const DENTON_LAT = 33.21;
const DENTON_LON = -97.13;

const weatherTemp = document.getElementById("weather-temp");
const weatherDesc = document.getElementById("weather-desc");
const weatherIcon = document.getElementById("weather-icon");
const forecastList = document.getElementById("forecast-list");

function formatDayLabel(unixSeconds) {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function pickDailyForecasts(list) {
  const days = {};
  list.forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    const dayKey = date.toISOString().slice(0, 10);
    const hour = date.getUTCHours();

    if (!days[dayKey] || Math.abs(hour - 12) < Math.abs(days[dayKey].hour - 12)) {
      days[dayKey] = { entry, hour };
    }
  });
  return Object.values(days)
    .map((d) => d.entry)
    .slice(1, 4);
}

function renderForecast(days) {
  forecastList.innerHTML = days
    .map(
      (day) => `
        <li class="forecast-day">
          <span class="forecast-label">${formatDayLabel(day.dt)}</span>
          <img class="forecast-icon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"
               alt="${day.weather[0].description}" loading="lazy">
          <span class="forecast-temp">${Math.round(day.main.temp)}&deg;F</span>
        </li>`
    )
    .join("");
}

function showWeatherFallback() {
  weatherTemp.textContent = "--°F";
  weatherDesc.textContent = "Add an OpenWeatherMap API key to see live conditions.";
  forecastList.innerHTML = "";
}

async function loadWeather() {
  if (!WEATHER_API_KEY || WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    showWeatherFallback();
    return;
  }

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${DENTON_LAT}&lon=${DENTON_LON}&units=imperial&appid=${WEATHER_API_KEY}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${DENTON_LAT}&lon=${DENTON_LON}&units=imperial&appid=${WEATHER_API_KEY}`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error("Weather fetch failed");
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    weatherTemp.textContent = `${Math.round(current.main.temp)}\u00b0F`;
    weatherDesc.textContent = current.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
    weatherIcon.alt = current.weather[0].description;

    renderForecast(pickDailyForecasts(forecast.list));
  } catch (error) {
    console.error("Error loading weather:", error);
    showWeatherFallback();
  }
}

loadWeather();

const spotlightGrid = document.getElementById("spotlight-grid");

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildSpotlightCard(member) {
  const levelLabel = membershipLabels[member.membershipLevel] || "Member";
  return `
    <article class="spotlight-card">
      <div class="spotlight-image">
        <img src="images/${member.image}" alt="${member.name} logo"
             loading="lazy" onerror="this.remove()">
      </div>
      <div class="spotlight-body">
        <span class="membership-badge membership-${member.membershipLevel}">${levelLabel}</span>
        <h3>${member.name}</h3>
        <p class="tag-line">${member.tagline}</p>
        <dl class="card-details">
          <div><dt>Phone</dt><dd>${member.phone}</dd></div>
          <div><dt>Address</dt><dd>${member.address}</dd></div>
          <div><dt>URL</dt><dd><a href="${member.url}" target="_blank" rel="noopener">${member.url.replace(/^https?:\/\//, "")}</a></dd></div>
        </dl>
      </div>
    </article>
  `;
}

async function loadSpotlights() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    const data = await response.json();

    const eligible = data.members.filter((m) => m.membershipLevel === 2 || m.membershipLevel === 3);
    const count = Math.random() < 0.5 ? 2 : 3;
    const chosen = shuffle(eligible).slice(0, count);

    spotlightGrid.innerHTML = chosen.map(buildSpotlightCard).join("");
  } catch (error) {
    spotlightGrid.innerHTML = `<p class="directory-error">Sorry, member spotlights could not be loaded right now.</p>`;
    console.error("Error loading spotlights:", error);
  }
}

loadSpotlights();