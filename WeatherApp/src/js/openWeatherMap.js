// sample openweathermap api call
//https://api.openweathermap.org/data/2.5/onecall?lat=43.9698&lon=-123.2006&exclude=minutely,hourly,current&units=imperial&appid=APIKEY

//sample response as json
/*
{
"lat":43.9698,
"lon":-123.2006,
"timezone":"America/Los_Angeles",
"timezone_offset":-25200,
"daily":[
  {
     "dt":1623096000,
     "sunrise":1623069040,
     "sunset":1623124386,
     "moonrise":1623063900,
     "moonset":1623115800,
     "moon_phase":0.92,
     "temp":{
        "day":59.11,
        "min":43.74,
        "max":60.8,
        "night":45.91,
        "eve":54.66,
        "morn":50.04
     },
     "feels_like":{
        "day":57.25,
        "night":44.8,
        "eve":53.64,
        "morn":48.54
     },
     "pressure":1013,
     "humidity":54,
     "dew_point":42.49,
     "wind_speed":10.51,
     "wind_deg":291,
     "wind_gust":10.22,
     "weather":[
        {
           "id":500,
           "main":"Rain",
           "description":"light rain",
           "icon":"10d"
        }
     ],
     "clouds":96,
     "pop":0.54,
     "rain":1.68,
     "uvi":4.23
  }
]
}
 */

import { config } from "./config";
const apiKey = config.openWeatherMapKey;
const weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?";

//returns a promise of api data 
export default async function (lat, lng) {
   let response = await fetch(`${weatherUrl}lat=${lat}&lon=${lng}${apiKey}`);
   if (!response.ok)
      throw new Error(`openWeatherMap's API call failed. ${response.status}`);
   else
      return await response.json();
}