# weather-dashboard

## Object 
Design a weather dashboard to display a city's current weather and 5-day forecast.

## Criteria
- [x] Design a weather dashboard with form inputs
- [x] when a city is searched, the webpage presents with current and future conditions for that city and that city is added to the search history
- [x] The current weather display the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
- [x] UV Index has a color that indicates whether the conditions are favorable, moderate, or severe
- [x] A 5-day forecast displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
- [x] When click on a city in the search history, the webpage presents with current and future conditions for that city

## Language used
html, css(bootstrap), javascript

## API used
Open Weather API

## Reflection
Every API has its own way to obtain the data. Reading through the document and understanding how to use it is vital. I used one of the weather data collection in the beginning. But the data does not include the UV Index. However, the one with UV Index only accepts the location but not the city name. Therefore two fetches have to be made to meet the criteria needs. Bootstrap helps a lot in making the page responsive.

## Screenshot
<img src=".\assets\images\screenshot.png" alt="webpage screenshot" width ="879" height="592"/>

## Link to Deployed Application
https://newchap2022.github.io/weather-dashboard/
