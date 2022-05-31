var userFormEl = document.querySelector("#user-form");
var formInputEl = document.querySelector("#cityname");
var cityNameEl = document.querySelector("#search-city-name");
var currentWeatherEl = document.querySelector(".currentweather");
var apiKey = "e10a1bcf5d67a6b3f71484bd7a8c46d2";

var getCityWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
            })
        } else {
            alert ("Error: " + city + "'s weather is not found");
        }
    })
    .catch(function(error) {
        alert ("Unable to Connect to Open Weather Map. Please Try Again");
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

var displayCurrentWeather = function (cityName) {
    cityNameEl.textContent = cityName.toUpperCase()
    
    var date = moment().format("MMM Do YY");
    var dateEl = document.createElement("p");
    dateEl.textContent = date;
    currentWeatherEl.appendChild(dateEl);
    
}

userFormEl.addEventListener("submit", formSubmitHandler);

