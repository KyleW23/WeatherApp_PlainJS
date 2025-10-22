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

const displayCurrentWeather = async (coords) => {
    const lat = coords.lat;
    const lon = coords.lon;
    const city = coords.name;
    const state = coords.state;

    const weather = await getCurrentWeather(lat, lon);
    const temp = weather.main.temp;
    const condition = weather.weather[0].main;

    const locationDisplay = document.getElementById('cityState');
    locationDisplay.textContent = `${city}, ${state}`;

    const tempDisplay = document.getElementById('currentTemp');
    tempDisplay.textContent = temp;

    const conditionDisplay = document.getElementById('currentCondition');
    conditionDisplay.textContent = condition;
};

// displayCurrentWeather();

const cityForm = document.getElementById('cityForm');
cityForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const inputValue = document.getElementById('inputCity').value.trim();
    const coords = await getGeoCode(inputValue);
    if (coords.error) {
        return coords.message;
    }
    displayCurrentWeather(coords);
});

// LATER ADDITIONS:
// Change Units (standard, metric, or imperial)
// Change Language
