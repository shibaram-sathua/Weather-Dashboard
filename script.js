const apiKey = 'e7a68dd14bc757e2867e3f2ad7b44815'; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');

const cityName = document.getElementById('cityName');
const description = document.getElementById('description');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

const forecastContainer = document.createElement('div');
forecastContainer.classList.add('forecast-container');
document.querySelector('.container').appendChild(forecastContainer);

const locationBtn = document.createElement('button');
locationBtn.textContent = 'Use My Location';
locationBtn.id = 'locationBtn';
document.querySelector('.search-bar').appendChild(locationBtn);

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByLocation(latitude, longitude);
      },
      error => {
        showError('Unable to retrieve your location.');
      }
    );
  } else {
    showError('Geolocation is not supported by your browser.');
  }
});

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    showError('Please enter a city name.');
  }
});

function fetchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
      fetchForecast(city);
    })
    .catch(error => {
      showError('City not found. Please try again.');
    });
}

function fetchForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      showError('Unable to fetch forecast. Please try again.');
    });
}

function fetchWeatherByLocation(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to fetch weather for your location');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
      fetchForecast(data.name);
    })
    .catch(error => {
      showError('Unable to fetch weather for your location.');
    });
}

function displayWeather(data) {
  weatherInfo.classList.remove('hidden');
  errorMessage.classList.add('hidden');

  cityName.textContent = data.name;
  description.textContent = data.weather[0].description;
  temperature.textContent = data.main.temp.toFixed(1);
  humidity.textContent = data.main.humidity;
  windSpeed.textContent = data.wind.speed;
}

function displayForecast(data) {
  forecastContainer.innerHTML = ''; // Clear previous forecast
  const forecast = data.list.filter(item => item.dt_txt.includes('12:00:00')); // Get daily data at noon

  forecast.forEach(day => {
    const date = new Date(day.dt_txt);
    const card = document.createElement('div');
    card.classList.add('forecast-card');

    card.innerHTML = `
      <h3>${date.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
      <p><strong>Temp:</strong> ${day.main.temp.toFixed(1)}°C</p>
      <p><strong>Humidity:</strong> ${day.main.humidity}%</p>
      <p><strong>Description:</strong> ${day.weather[0].description}</p>
    `;

    forecastContainer.appendChild(card);
  });
}

function showError(message) {
  weatherInfo.classList.add('hidden');
  errorMessage.classList.remove('hidden');
  errorMessage.textContent = message;
}
