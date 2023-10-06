
// Ваш API-ключ для OpenWeatherMap
const apiKey = '05dc951f8c722f175e1be3f229da6358';



async function getTimezone(city) {
  try {
    const timezoneApiUrl = `https://worldtimeapi.org/api/timezone/${city}`;
    const timezoneResponse = await fetch(timezoneApiUrl);
    const timezoneData = await timezoneResponse.json();
    return timezoneData.timezone;
  } catch (error) {
    console.error('Произошла ошибка при получении временной зоны:', error);
    return 'UTC'; // Возвращаем UTC в случае ошибки
  }
}

async function searchWeather(event) {
  event.preventDefault();

  const city = document.getElementById('city').value;
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=8`;
  const loadingMask = document.getElementById('loading-mask'); // Объявляем переменную loadingMask здесь
  try {
     // Плавно показываем элемент перед запросом погоды
     loadingMask.classList.remove('hidden');

    const currentWeatherResponse = await fetch(currentWeatherUrl);
    const currentWeatherData = await currentWeatherResponse.json();

    // Плавно скрываем элемент после получения данных о погоде
    loadingMask.classList.add('hidden');
    // Плавно показываем элемент перед запросом прогноза
    loadingMask.classList.remove('hidden');

    const hourlyForecastResponse = await fetch(hourlyForecastUrl);
    const hourlyForecastData = await hourlyForecastResponse.json();

     // Плавно скрываем элемент после получения данных о прогнозе
     loadingMask.classList.add('hidden');

    const timezone = await getTimezone(currentWeatherData.name);

    // Обновление информации о погоде на странице
    updateWeatherInfo(currentWeatherData, timezone);


    const hourlyForecastElement = document.getElementById('hourly-forecast');
    hourlyForecastElement.innerHTML = '';
    
    // Соответствие между значками погоды и именами файлов изображений

    const weatherIconsMapping = {
      'clear sky': 'clear-sky.png',
      'few clouds': 'broken-clouds.png',
      'scattered clouds': 'broken-clouds.png',
      'broken clouds': 'broken-clouds.png',
      'overcast clouds': 'overcast-clouds.png',
      'drizzle': 'shower-rain.png',
      'light intensity drizzle': 'shower-rain.png',
      'light rain': 'shower-rain.png',
      'moderate rain': 'shower-rain.png',
      'shower rain': 'rain.png',
      'rain': 'rain.png',
      'moderate rain': 'rain.png',
      'light intensity shower rain': 'rain.png',
      'heavy intensity rain': 'rain.png',
      'thunderstorm': 'thunderstorm.png',
      'snow': 'snow.png',
      'sleet': 'sleet.png',
      'mist': 'mist.png',
      'fog': 'mist.png',
      'smoke': 'mist.png',
      'hail': 'hail.png',
      // Добавьте другие соответствия здесь...
  };
  
  hourlyForecastData.list.forEach(forecast => {
      const dateTime = new Date((forecast.dt + hourlyForecastData.city.timezone) * 1000);
      const offset = dateTime.getTimezoneOffset() * 60 * 1000;
      dateTime.setTime(dateTime.getTime() + offset);
  
      const hour = dateTime.getHours();
      const temperature = Math.round(forecast.main.temp);
      const weatherDescription = forecast.weather[0].description;
      const iconFileName = weatherIconsMapping[weatherDescription] || 'default.png'; // По умолчанию "default.png"
  
      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');
      forecastItem.innerHTML = `
          <p class="forecast-hour">${hour}:00</p>
          <img class="weather-icon" src="img/${iconFileName}" alt="Weather Icon">
          <p class="forecast-temperature">${temperature} °C</p>
      `;
      hourlyForecastElement.appendChild(forecastItem);
  });
  
    
  } catch (error) {
    console.error('Произошла ошибка при получении данных о погоде:', error);
  }
}



// Функция для получения имени файла иконки на основе описания погоды и времени суток
function getWeatherIcon(description, isNight) {
  const iconMapping = {
    'clear sky': isNight ? 'clear-sky-night.gif' : 'clear-sky.gif',
    'few clouds': isNight ? 'broken-clouds-night.gif' : 'broken-clouds.gif',
    'scattered clouds': isNight ? 'broken-clouds-night.gif' : 'broken-clouds.gif',
    'broken clouds': isNight ? 'broken-clouds-night.gif' : 'broken-clouds.gif',
    'overcast clouds': 'overcast-clouds.gif',
    'light rain': 'shower-rain.gif',
    'moderate rain': 'shower-rain.gif',
    'shower rain': 'rain.gif',
    'rain': 'rain.gif',
    'moderate rain': 'rain.gif',
    'light intensity shower rain': 'rain.gif',
    'thunderstorm': 'thunderstorm.gif',
    'snow': 'snow.gif',
    'sleet': 'sleet.gif',
    'mist': 'mist.gif',
    // ... другие описания и соответствующие имена файлов иконок
  };
  
  return iconMapping[description.toLowerCase()] || ''; // Возвращаем имя файла иконки или пустую строку, если нет соответствия
}

// Функция для обновления информации о погоде на странице с помощью CSS
function updateWeatherInfo(data) { 
  const weatherIconElement = document.getElementById('weather-icon');
  const temperatureElement = document.getElementById('temperature');
  const descriptionElement = document.getElementById('description');
  const windDirectionElement = document.getElementById('wind-direction');
  const windSpeedElement = document.getElementById('wind-speed');
  const windIconElement = document.getElementById('wind-icon');
  const humidityElement = document.getElementById('humidity');
  const uvIndexElement = document.getElementById('uv-index');
  const feelsLikeElement = document.getElementById('feels-like');
  const pressureElement = document.getElementById('pressure');
  const rainProbabilityElement = document.getElementById('rain-probability');
  const sunriseElement = document.getElementById('sunrise');
  const sunsetElement = document.getElementById('sunset');
  const daylightElement = document.getElementById('daylight');
  
  const currentTime = new Date().getHours();
  const isNight = currentTime < 4 || currentTime > 20;
  const description = data.weather[0].description;
  const weatherIcon = getWeatherIcon(description, isNight);

  if (data && data.main && data.main.temp && data.weather && data.weather[0] && data.weather[0].description && data.main.humidity && data.wind && data.wind.speed && data.wind.deg) {
    const temperature = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6).toFixed(1);
    const windDirection = getWindDirection(data.wind.deg);
    const rainProbability = data.rain && data.rain['1h'] ? (data.rain['1h'] * 100).toFixed(1) : '-';
    const uvIndex = data.uvi !== undefined ? data.uvi : 'N/A';
    const feelsLike = Math.round(data.main.feels_like);
    const pressure = Math.round(data.main.pressure * 0.75006);
    const sunriseTimestamp = data.sys.sunrise * 1000;
    const sunsetTimestamp = data.sys.sunset * 1000;

    const sunriseTime = new Date(sunriseTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(sunsetTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const windDegree = data.wind.deg; // Замените на ваш реальный угол направления ветра
    const windIconPath = getWindDirectionIcon(windDegree);
    const daylightDuration = sunsetTimestamp - sunriseTimestamp;
    const daylightHours = Math.floor(daylightDuration / 3600000);
    const daylightMinutes = Math.floor((daylightDuration % 3600000) / 60000);
    
    // Создаем <span> для слова "Восход"
    const sunriseText = document.createElement('span');
    sunriseText.textContent = 'Sunrise';
    sunriseText.style.opacity = 0.5; // Устанавливаем прозрачность на 50%
    
    const sunsetText = document.createElement('span');
    sunsetText.textContent = 'Sunset';
    sunsetText.style.opacity = 0.5;

    temperatureElement.textContent = `${temperature} °C`;
    descriptionElement.textContent = `${description}`;
    humidityElement.textContent = `${humidity} %`;
    windDirectionElement.textContent = `${windDirection}`;
    windSpeedElement.textContent = `${windSpeed} km/h`;
    uvIndexElement.textContent = `${uvIndex}`;
    feelsLikeElement.textContent = `${feelsLike}°C`;
    pressureElement.textContent = `${pressure} mmHG`;
    rainProbabilityElement.textContent = `${rainProbability}%`;
    sunriseElement.innerHTML = `<strong>${sunriseTime} </strong>`;
    sunriseElement.appendChild(sunriseText);
    sunsetElement.innerHTML = `<strong>${sunsetTime} </strong>`;
    sunsetElement.appendChild(sunsetText);
    daylightElement.innerHTML = `Daylight hours<br><strong>${daylightHours} h ${daylightMinutes} min</strong>`;
  
    if (weatherIcon) {
      weatherIconElement.src = `img/${weatherIcon}`;
      weatherIconElement.style.display = 'inline';
    } else {
      weatherIconElement.style.display = 'none';
    }
    if (windIconPath) {
      windIconElement.src = `img/${windIconPath}`;
      windIconElement.style.display = 'inline';
    } else {
      windIconElement.style.display = 'none';
    }
    
  } else {
    temperatureElement.textContent = 'It is impossible to get weather data.';
    descriptionElement.textContent = '';
    humidityElement.textContent = '';
    windSpeedElement.textContent = '';
    windDirectionElement.textContent = '';
    uvIndexElement.textContent = 'N/A';
    feelsLikeElement.textContent = ``;
    pressureElement.textContent = ``;
    rainProbabilityElement.textContent = ``;
    sunriseElement.textContent = '';
    sunsetElement.textContent = '';
    
  }
}
// Функция для определения направления ветра
function getWindDirection(deg) {
  const directions = ['N', 'N-E', 'E', 'S-E', 'S', 'S-W', 'W', 'N-W'];
  const index = Math.round(deg / 45);
  return directions[index % 8];
}

function getWindDirectionIcon(deg) {
  const iconMapping = {
    'N': 'wind-n.png',
    'N-E': 'wind-ne.png',
    'E': 'wind-e.png',
    'S-E': 'wind-se.png',
    'S': 'wind-s.png',
    'S-W': 'wind-sw.png',
    'W': 'wind-w.png',
    'N-W': 'wind-nw.png',
  };
  
  const windDirection = getWindDirection(deg); 
  const windIcon = iconMapping[windDirection];

  return windIcon || ''; // Если иконка не найдена, возвращает пустую строку
}

// window.onload=function() {
//   document.getElementById('loading-mask').style.display='none';
// }

// Привязываем функцию к событию отправки формы
const weatherForm = document.getElementById('weather-form');
weatherForm.addEventListener('submit', searchWeather);