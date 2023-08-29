const locationTimezone = document.querySelector('.location-timezone');
const icon = document.querySelector('.icon');
const temperatureValue = document.querySelector('.temperature');
const temperatureDescription = document.querySelector('.temperature-description');
const temperatureSection = document.querySelector('.temperatureSection');
const temperatureSpan = document.querySelector('.temperatureUnit');
const searchButton = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

let temperatureDegree;
let temperatureUnit = "°F";  

// Toggle temperature
temperatureSection.addEventListener('click', () => {
    if (temperatureUnit === "°F") {
        let fahrenheit = (temperatureDegree -32) * (5/9);
        temperatureValue.textContent = Math.round(fahrenheit);
        temperatureUnit = "°C";
        temperatureSpan.textContent = temperatureUnit;
    } else {
        temperatureValue.textContent = temperatureDegree;
        temperatureUnit = "°F";
        temperatureSpan.textContent = temperatureUnit;
    }
});

// Fetch weather data
function displayWeatherData(data, targetContainer) {
  temperatureDegree = data.main.temp;
  const description = data.weather[0].description;
  const iconID = data.weather[0].icon;

  // Check if we're updating the main container or from a search result
  if (targetContainer.classList.contains('container')) {
    // Update main container (user's geolocation)
    locationTimezone.textContent = `${data.name}, ${data.sys.country}`;
    icon.src = `http://openweathermap.org/img/w/${iconID}.png`;
    temperatureValue.textContent = temperatureDegree;
    temperatureDescription.textContent = description;
  } else {
    // Create elements for the new city search result
    const cityNameElem = document.createElement('div');
    cityNameElem.textContent = `${data.name}, ${data.sys.country}`;

    const temperatureElem = document.createElement('div');
    temperatureElem.innerHTML = `${temperatureDegree}<span>${temperatureUnit}</span>`;

    const descriptionElem = document.createElement('div');
    descriptionElem.textContent = description;

    const iconElem = document.createElement('img');
    iconElem.src = `http://openweathermap.org/img/w/${iconID}.png`;

    // Append elements to target container
    targetContainer.append(cityNameElem, temperatureElem, descriptionElem, iconElem);
  }
}

// Get geolocation
async function getWeather(latitude, longitude) {
  try {
      const api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=imperial`;
      const response = await fetch(api);
      const data = await response.json();

      displayWeatherData(data, document.querySelector('.container')); // Updates the main container
  } catch (error) {
      console.error("Error fetching geolocation weather:", error);
  }
}


searchButton.addEventListener('click', () => {
  const cityName = cityInput.value.trim(); // Get city name from input
  if (cityName) {
      getWeatherByCity(cityName); // Fetch weather for that city
  }
});

async function getWeatherByCity(cityName) {
  try {
      const api = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.WEATHER_API_KEY}&units=imperial`;
      const response = await fetch(api);
      const data = await response.json();

      if (data.cod === 200) { 
          // Remove previous search results
          const existingSearchResult = document.querySelector('.search-result');
          if(existingSearchResult) {
              existingSearchResult.remove();
          }

          const searchResultContainer = document.createElement('div');
          searchResultContainer.classList.add('search-result');
          displayWeatherData(data, searchResultContainer); 

          document.querySelector('.search-results-container').appendChild(searchResultContainer); 
      } else {
          alert('City not found. Please try another.');
      }
  } catch (error) {
      console.error("Error fetching city weather:", error);
  }
}

// Get geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    getWeather(latitude, longitude);
  });
}

searchButton.addEventListener('click', () => {
  const cityName = cityInput.value.trim();
  if (cityName) {
      getWeatherByCity(cityName);
  }
});
