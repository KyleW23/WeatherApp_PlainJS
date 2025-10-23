const degreesToDirection = (degree) => {
    const directions = [
        'N',
        'NNE',
        'NE',
        'ENE',
        'E',
        'ESE',
        'SE',
        'SSE',
        'S',
        'SSW',
        'SW',
        'WSW',
        'W',
        'WNW',
        'NW',
        'NNW',
    ];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
};

const getGeoCode = async (inputValue) => {
    const city = inputValue;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data[0]);
        return data[0];
    } catch (error) {
        console.log(error);
        return {
            error: true,
            message: error.message,
        };
    }
};

const getCurrentWeather = async (lat, lon) => {
    const unit = 'imperial';
    const lang = 'en';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&lang=${lang}&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return {
            error: true,
            message: error.message,
        };
    }
};

const getHourlyWeather = async (lat, lon) => {
    const units = 'imperial';
    const lang = 'en';
    const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&lang=${lang}&units=${units}&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (errr) {
        console.log(error);
        return {
            error: true,
            message: error.message,
        };
    }
};

const getDailyWeather = async (lat, lon) => {
    const units = 'imperial';
    const lang = 'en';
    const count = 7;
    const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${count}&lang=${lang}&units=${units}&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return {
            error: true,
            message: error.message,
        };
    }
};

const displayCurrentWeather = async (coords) => {
    // Check for errors
    const lat = coords.lat;
    const lon = coords.lon;
    const city = coords.name;
    const state = coords.state;

    const weather = await getCurrentWeather(lat, lon);
    const condition = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    const temp = Math.round(weather.main.temp);
    const minTemp = Math.round(weather.main.temp_min);
    const maxTemp = Math.round(weather.main.temp_max);
    const feelsLike = Math.round(weather.main.feels_like);
    const windSpeed = Math.round(weather.wind.speed);
    const windDirection = degreesToDirection(weather.wind.deg);

    const locationDisplay = document.getElementById('cityState');
    locationDisplay.textContent = `${city}, ${state}`;

    const conditionDisplay = document.getElementById('conditionIcon');
    conditionDisplay.setAttribute('src', condition);

    const tempDisplay = document.getElementById('currentTemp');
    tempDisplay.textContent = `${temp}°F`;

    const minMaxDisplay = document.getElementById('minMax');
    minMaxDisplay.textContent = `L: ${minTemp}° H: ${maxTemp}°`;

    const feelsLikeDisplay = document.getElementById('feelsLike');
    feelsLikeDisplay.textContent = `Feels Like: ${feelsLike}°`;

    const windDisplay = document.getElementById('wind');
    windDisplay.textContent = `${windDirection} ${windSpeed} mph`;
};

const displayHourlyWeather = async (coords) => {
    const lat = coords.lat;
    const lon = coords.lon;

    const hourlyWeather = await getHourlyWeather(lat, lon);

    const hourlyDiv = document.getElementById('hourlyWeather');
    hourlyWeather.list.forEach((weather) => {
        const weatherDiv = document.createElement('div');
        const date = new Date(weather.dt * 1000);
        const time = date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
        });
        const temp = Math.round(weather.main.temp);
        const condition = weather.weather[0].main;
        weatherDiv.innerHTML = `<p>${time} - ${temp} - ${condition}</p>`;
        hourlyDiv.appendChild(weatherDiv);
    });
};

const dispalyDailyWeather = async (coords) => {
    const lat = coords.lat;
    const lon = coords.lon;

    const dailWeather = await getDailyWeather(lat, lon);

    const dailyDiv = document.getElementById('dailyWeather');
    dailWeather.list.forEach((weather) => {
        const weatherDiv = document.createElement('div');
        const date = new Date(weather.dt * 1000);
        const day = date.toLocaleDateString([], { weekday: 'short' });
        const minTemp = Math.round(weather.temp.min);
        const maxTemp = Math.round(weather.temp.max);
        const condition = weather.weather[0].main;
        weatherDiv.innerHTML = `<p>${day} - ${minTemp} / ${maxTemp} - ${condition}</p>`;
        dailyDiv.appendChild(weatherDiv);
    });
};

const cityForm = document.getElementById('cityForm');
cityForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const inputValue = document.getElementById('inputCity').value.trim();
    const coords = await getGeoCode(inputValue);
    if (coords.error) {
        return coords.message;
    }
    displayCurrentWeather(coords);
    // displayHourlyWeather(coords);
    // dispalyDailyWeather(coords);
});

// LATER ADDITIONS:
// Change Units (standard, metric, or imperial)
// Change Language
