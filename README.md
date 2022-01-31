# appWeather

After cloning the repository, create a js file inside the src folder with the same config.js
In it, you will need to provide your API keys for google maps (geolocation so you can get the latitude and longiture of the zipcode you enter in the input)and openweathermap (to get the weather, duh!)

```JavaScript
const config = {

    googleMapsKei: "yourKEY",
    openWeatherMapKey: "&exclude=minutely,hourly,current&units=imperial&appid=yourKEY"

}
export { config };`


You can find this project on my personal server [here](http://mariemoore.site/WeatherApp/ "weather App")


```
