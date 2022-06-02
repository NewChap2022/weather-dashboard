var userFormEl = document.querySelector("#user-form");
var formInputEl = document.querySelector("#cityname");
var cityNameEl = document.querySelector("#search-city-name");
var currentWeatherEl = document.querySelector(".currentweather");
var forecastEl = document.querySelector(".forecast");
var searchHistoryEl = document.querySelector(".search-history");
var searchHistory = [];
var apiKey = "e10a1bcf5d67a6b3f71484bd7a8c46d2";

// load the search history from local storage when refresh the page
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

// run getCityWeather function based on the user's input of the city name
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

// fetch the location of the city, display the name of the city on the webpage and add search history to the left of html
var getCityWeather = function (city) {
    var firstApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
    fetch(firstApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                addNewSearchHistory(data);
                displayCityName(data);
                fetchWeatherData(data);
            })
        } else {
            alert("Error: " + city + " is not found!");
        }
    })
    .catch(function (error) {
        alert("Unable to Connect to Open Weather Map. Please Try Again");
    });
};

//add new search history button to the local storage
var addNewSearchHistory = function (data) {
    var city = data[0].name.toUpperCase();
    var matchIndex = searchHistory.indexOf(city);

    // if the entered city name doesn't exist in the current searchHistory array and 
    // the searchHistory array has less than 10 cities, add it to the search history
    if (matchIndex === -1 & searchHistory.length <= 9) {
        searchHistory.push(city);
        displaySearchHistory(city);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        return;
    // if the entered city already exist in the searchHistory array then just move it to the end of array
    } else if (matchIndex !== -1) {
        searchHistory.splice(matchIndex, 1);
    // the array is set to contain 10 searched city. If more cities entered, it will remove previous city history. 
    // in this way, the searched history on the webpage won't get too long to mess the display.
    } else {
        searchHistory.shift();
    };

    searchHistory.push(city);

    // clear previous display and display updated search history
    while (searchHistoryEl.firstChild) {
        searchHistoryEl.removeChild(searchHistoryEl.firstChild);
    };

    for (var i = 0; i < searchHistory.length; i++) {
        displaySearchHistory(searchHistory[i]);
    };

    localStorage.setItem("search", JSON.stringify(searchHistory));
};


// display searched city under search form
var displaySearchHistory = function (city) {
    var searchHistoryBtn = document.createElement("button");
    searchHistoryBtn.className = "search-history-button";
    searchHistoryBtn.setAttribute("type", "button");
    searchHistoryBtn.textContent = city;
    searchHistoryEl.appendChild(searchHistoryBtn);
};

// display the name of city in the weather container
var displayCityName = function (data) {
    cityNameEl.textContent = data[0].name.toUpperCase();
};

// fetch weather based on the location
var fetchWeatherData = function (locationData) {
    var secondApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + locationData[0].lat + "&lon=" + locationData[0].lon + "&exclude=minutely,hourly,alerts&units=metric&appid=" + apiKey;
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
};

// use optained data to display current weather
var displayCurrentWeather = function (data) {
    // clear previous city's weather elements
    if (currentWeatherEl.childElementCount > 1) {
        for (var i = 0; i < 3; i++) {
            currentWeatherEl.removeChild(currentWeatherEl.lastChild);
        };
    }

    // display current date
    var date = dayjs().format("dddd DD-MMM-YYYY");
    var dateEl = document.createElement("p");
    dateEl.textContent = date;

    // display current weather
    var weatherIconEl = document.createElement("div");
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
    weatherIcon.setAttribute("alt", "current weather is " + data.current.weather[0].main);
    
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
        uvIndex.style.color = "black";
    } else {
        uvIndex.style.backgroundColor = "red";
    };
    
    weatherIconEl.appendChild(weatherIcon);
    uvIndexData.appendChild(uvIndex);
    weatherDataEl.append(tempData, windData, humidityData, uvIndexData);
    currentWeatherEl.append(dateEl, weatherIconEl, weatherDataEl);
};

// display 5 day forecast in the forecast container
var display5DayForecast = function (data) {
    // clear previous city's weather forecast
    if (forecastEl.childElementCount > 1) {
        for (var i = 0; i < 5; i++) {
            forecastEl.removeChild(forecastEl.lastChild);
        };
    };

    for (var i = 0; i < 5; i++) {
        var forecastCardEl = document.createElement("div");
        forecastCardEl.classList.add("forecast-card", "col-12", "col-sm-4", "col-lg");

        var dateEl = document.createElement("p");
        date = dayjs().add(i + 1, 'd').format("DD-MMM-YYYY");
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

var searchHistoryBtnHandler = function (event) {
    if (event.target.matches(".search-history-button")) {
        var cityName = event.target.innerHTML.trim();
        getCityWeather(cityName);
    }
};

loadSearchHistory();
userFormEl.addEventListener("submit", formSubmitHandler);
searchHistoryEl.addEventListener("click", searchHistoryBtnHandler);
