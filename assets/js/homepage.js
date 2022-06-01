var userFormEl = document.querySelector("#user-form");
var formInputEl = document.querySelector("#cityname");
var cityNameEl = document.querySelector("#search-city-name");
var currentWeatherEl = document.querySelector(".currentweather");
var forecastEl = document.querySelector(".forecast");
var searchHistoryEl = document.querySelector(".search-history");
var searchHistory = [];
var apiKey = "e10a1bcf5d67a6b3f71484bd7a8c46d2";

var getCityWeather = function (city) {
    var firstApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
    fetch(firstApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                addNewSearchHistory(data);
                displayCityName(data);
                // https://api.openweathermap.org/data/2.5/onecall?lat=43.6534817&lon=-79.3839347&exclude=minutely,hourly,daily&appid=e10a1bcf5d67a6b3f71484bd7a8c46d2
                var secondApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data[0].lat + "&lon=" + data[0].lon + "&exclude=minutely,hourly,alerts&units=metric&appid=" + apiKey;
                fetch(secondApiUrl).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            displayCurrentWeather(data);
                            display5DayForecast(data);
                        })
                    } else {
                        alert("Error: the weather is not found!");
                    }
                })
                    .catch(function (error) {
                        alert("Unable to Connect to Open Weather Map. Please Try Again");
                    });
            })
        } else {
            alert("Error: " + city + " is not found!");
        }
    })
        .catch(function (error) {
            alert("Unable to Connect to Open Weather Map. Please Try Again");
        });
};

var formSubmitHandler = function (event) {
    event.preventDefault();
    var cityName = formInputEl.value.trim();

    if (cityName) {
        getCityWeather(cityName);
        formInputEl.value = "";
    } else {
        alert("Please enter a city name");
    };
};

var displayCityName = function (data) {
    // display the name of city
    cityNameEl.textContent = data[0].name.toUpperCase();
}

var displayCurrentWeather = function (data) {
    while (currentWeatherEl.firstChild) {
        currentWeatherEl.removeChild(currentWeatherEl.firstChild);
    };

    // display current date
    var date = moment().format("MMM Do YYYY");
    var dateEl = document.createElement("p");
    dateEl.textContent = date;
    currentWeatherEl.appendChild(dateEl);

    // display current weather
    var weatherIconEl = document.createElement("div");
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
    weatherIcon.setAttribute("alt", "current weather is " + data.current.weather[0].main);
    currentWeatherEl.appendChild(weatherIconEl);
    weatherIconEl.appendChild(weatherIcon);

    var weatherDataEl = document.createElement("div");
    weatherDataEl.className = "row";

    var tempData = document.createElement("p");
    tempData.className = "col-md-6";
    tempData.textContent = "Temp: " + Math.round(data.current.temp) + " °C";

    var windData = document.createElement("p");
    windData.className = "col-md-6";
    windData.textContent = "Wind: " + data.current.wind_speed + " m/s";

    var humidityData = document.createElement("p");
    humidityData.className = "col-md-6";
    humidityData.textContent = "Humidity: " + data.current.humidity + " %";

    var uvIndexData = document.createElement("p");
    uvIndexData.className = "col-md-6";
    uvIndexData.textContent = "UV Index: ";
    var uvIndex = document.createElement("span");
    var uvi = data.current.uvi;
    uvIndex.textContent = uvi;
    uvIndex.style.padding = "5px";
    uvIndex.style.color = "white";
    if (uvi <= 2) {
        uvIndex.style.backgroundColor = "green";
    } else if (uvi >= 3 && uvi <= 5) {
        uvIndex.style.backgroundColor = "yellow";
    } else {
        uvIndex.style.backgroundColor = "red";
    };

    uvIndexData.appendChild(uvIndex);
    weatherDataEl.append(tempData, windData, humidityData, uvIndexData);

    currentWeatherEl.append(dateEl, weatherDataEl);
};

var display5DayForecast = function (data) {
    while (forecastEl.firstChild) {
        forecastEl.removeChild(forecastEl.firstChild);
    };

    for (var i = 0; i < 5; i++) {
        var forecastCardEl = document.createElement("div");
        forecastCardEl.classList.add("forecast-card", "col-12", "col-sm-4", "col-lg");

        var dateEl = document.createElement("p");
        date = moment().add(i + 1, 'd').format("MMM Do YYYY");
        dateEl.textContent = date;

        var weatherIconEl = document.createElement("div");
        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        weatherIcon.setAttribute("alt", "current weather is " + data.daily[i].weather[0].main);

        var tempData = document.createElement("p");
        tempData.textContent = "Temp: " + Math.round(data.daily[i].temp.day) + " °C";

        var windData = document.createElement("p");
        windData.textContent = "Wind: " + data.daily[i].wind_speed + " m/s";

        var humidityData = document.createElement("p");
        humidityData.className = "col-md-6";
        humidityData.textContent = "Humidity: " + data.daily[i].humidity + " %";

        weatherIconEl.appendChild(weatherIcon);
        forecastCardEl.append(dateEl, weatherIconEl, tempData, windData, humidityData);
        forecastEl.appendChild(forecastCardEl);
    }
};

var displaySearchHistory = function (city) {
    var searchHistoryBtn = document.createElement("button");
    searchHistoryBtn.className = "search-history-button";
    searchHistoryBtn.setAttribute("type", "submit");
    searchHistoryBtn.textContent = city;
    searchHistoryEl.appendChild(searchHistoryBtn);
};

var addNewSearchHistory = function (data) {
    var city = data[0].name.toUpperCase();
    var matchIndex = searchHistory.indexOf(city);

    if (matchIndex === -1 & searchHistory.length <= 9) {
        searchHistory.push(city);
        displaySearchHistory(city);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        return;
    } else if (matchIndex !== -1) {
        searchHistory.splice(matchIndex, 1);
        console.log(searchHistory);
    } else {
        searchHistory = searchHistory.shift();
    };

    searchHistory.push(city);

    while (searchHistoryEl.firstChild) {
        searchHistoryEl.removeChild(searchHistoryEl.firstChild);
    };

    for (var i = 0; i < searchHistory.length; i++) {
        displaySearchHistory(searchHistory[i]);
    };
    
    localStorage.setItem("search", JSON.stringify(searchHistory));
}

var loadSearchHistory = function () {
    searchHistory = localStorage.getItem("search");
    if (!searchHistory) {
        searchHistory = [];
    } else {
        searchHistory = JSON.parse(searchHistory);
        for (var i = 0; i < searchHistory.length; i++) {
            displaySearchHistory(searchHistory[i]);
        };
    };
};

loadSearchHistory()
userFormEl.addEventListener("submit", formSubmitHandler);

