async function getWeather(city = 'Cairo') {
  const apiKey = 'b66ee2f4c33b4ed7f5c9377fae764113';
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=3`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    let weatherInfo = '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let currentDayIndex = new Date().getDay();

    data.list.slice(0, 3).forEach((item, index) => {
      let dayIndex = (currentDayIndex + index) % 7;
      let dateTime = new Date();
      dateTime.setDate(dateTime.getDate() + index);

      const dayName = days[dayIndex];
      const date = dateTime.toDateString();

      let weatherIcon = '';

      if (index === 0) {
        weatherIcon = `<img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather icon">`;

        weatherInfo += `
          <div class="card m-2 forecast-card">
            <div class="card-body">
              <h3>Today - ${city}</h3>
              <p>${date}</p>
              <div class="weather-icon">${weatherIcon}</div>
              <p>Temperature: ${item.main.temp}°C</p>
              <p>${item.weather[0].description}</p>
              <p>Rain Possibility: ${item.pop * 100}%</p>
              <p>Wind Direction: ${getWindDirection(item.wind.deg)}</p>
            </div>
          </div>
        `;
      } else {
        weatherIcon = `<img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather icon">`;
        weatherInfo += `
          <div class="card m-2 forecast-card">
            <div class="card-body">
              <h3>${dayName}</h3>
              <p>${date}</p>
              <div class="weather-icon">${weatherIcon}</div>
              <p>Temperature: ${item.main.temp}°C</p>
              <p>${item.weather[0].description}</p>
            </div>
          </div>
        `;
      }
    });

    document.getElementById('weather-info').innerHTML = weatherInfo;

  } catch (error) {
    console.log('Error fetching data: ', error);
  }
}

async function getNearestPlace() {
  const userEnteredCity = document.getElementById('city-input').value;
  const nominatimApiUrl = `https://nominatim.openstreetmap.org/search.php?q=${userEnteredCity}&format=json`;

  try {
    const response = await fetch(nominatimApiUrl);
    const data = await response.json();

    if (data && data.length > 0) {
      const nearestPlace = data[0].display_name;
      document.getElementById('city-input').value = nearestPlace;
      getWeather(nearestPlace);
    }
  } catch (error) {
    console.log('Error fetching nearest place: ', error);
  }
}

function getWindDirection(degree) {
  const directions = ['North', 'NorthEast', 'East', 'SouthEast', 'South', 'SouthWest', 'West', 'NorthWest'];
  const index = Math.round((degree % 360) / 45);
  return directions[index];
}

function subscribe() {
  const city = document.getElementById('city-input').value;
  if (city.trim() !== '') {
    getWeather(city);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getWeather(); 
  setInterval(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    
    if (currentHour === 0 && currentMinutes === 0 && currentSeconds === 0) {
      getWeather();
    }
  }, 1000); 
});