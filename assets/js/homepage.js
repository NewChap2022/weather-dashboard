var userFormEl = document.querySelector("#user-form");
var formInputEl = document.querySelector("#cityname");
var cityNameEl = document.querySelector("#search-city-name");
var currentWeatherEl = document.querySelector(".currentweather");
var apiKey = "e10a1bcf5d67a6b3f71484bd7a8c46d2";

var getCityWeather = function (city) {
    var firstApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
    fetch(firstApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayCityName(data);
                // https://api.openweathermap.org/data/2.5/onecall?lat=43.6534817&lon=-79.3839347&exclude=minutely,hourly,daily&appid=e10a1bcf5d67a6b3f71484bd7a8c46d2
                var secondApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data[0].lat + "&lon=" + data[0].lon + "&exclude=minutely,hourly,alerts&units=metric&appid=" + apiKey;
                fetch(secondApiUrl).then(function(response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            displayCurrentWeather(data);
                        })
                    } else {
                        alert("Error: the weather is not found!");
                    }
                })
                .catch(function(error) {
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
    } else if (uvi >=3 && uvi <=5) {
        uvIndex.style.backgroundColor = "yellow";
    } else {
        uvIndex.style.backgroundColor = "red";
    };

    uvIndexData.appendChild(uvIndex);
    weatherDataEl.append(tempData, windData, humidityData, uvIndexData);

    currentWeatherEl.append(dateEl, weatherDataEl);
};

userFormEl.addEventListener("submit", formSubmitHandler);

