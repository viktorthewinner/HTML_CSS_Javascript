const apiKey = '8076575397d12e7549781e95b5f249ea'; // Înlocuiește cu cheia ta API

// Selectează elementele HTML
const weatherCard = document.getElementById('weather-card');
const weatherSpinner = document.getElementById('weather-spinner');

// Funcție pentru a obține vremea pentru orașul selectat (5 zile)
async function fetchWeather(city) {
  // Arată spinner-ul de încărcare
  weatherSpinner.style.display = 'block';
  weatherCard.style.display = 'none'; // Ascunde cardul de vreme până la încărcarea datelor

  try {
    // Trimite cererea către OpenWeatherMap API pentru prognoza pe 5 zile
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=5&units=metric&appid=${apiKey}`);

    // Dacă cererea a avut succes
    if (response.ok) {
      const weatherData = await response.json();
      updateWeatherCard(weatherData); // Actualizează cardul cu noile date meteo pentru 5 zile
    } else {
      throw new Error('City not found');
    }
  } catch (error) {
    console.error('Eroare la obținerea vremii:', error);
    alert('Eroare la obținerea vremii pentru acest oraș.');
  } finally {
    // Ascunde spinner-ul și arată cardul
    weatherSpinner.style.display = 'none';
    weatherCard.style.display = 'block';
  }
}

// Funcție pentru a actualiza cardul de vreme cu prognoza pe 5 zile
function updateWeatherCard(data) {
  const cityElement = document.getElementById('city');
  cityElement.textContent = `${data.city.name}, ${data.city.country}`;

  // Afișează prognoza pentru 5 zile
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = ''; // Golește containerul de prognoză înainte de a-l popula

  // Parcurge prognoza pentru fiecare zi
  data.list.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('forecast-day');

    const date = new Date(day.dt * 1000); // Transformă timestamp-ul în dată
    const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    dayElement.innerHTML = `
      <div class="forecast-date">${dateString}</div>
      <div class="forecast-temp">${day.main.temp}°C</div>
      <div class="forecast-description">${day.weather[0].description}</div>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon">
    `;

    forecastContainer.appendChild(dayElement);
  });
}

// Funcție pentru a iniția căutarea vremii pe baza orașului
function onCitySelected(city) {
  fetchWeather(city);
}
