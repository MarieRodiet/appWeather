import "./general";
// getLocation is the ONLY export from googleMaps.js
import getLocation from "./googleMaps";
import getForecast from "./openWeatherMap";
import "./config";
// getWeekday and getDate are named exports from dates.js
import { getShortDate, getWeekday, getDate } from "./dates";

import { event } from "jquery";

class Weather {
  constructor() {
    this.form = document.getElementById("form");
    this.weatherList = document.getElementById("weather-list");
    this.currentDay = document.getElementById("currentDay");

    this.firstDay = null;
    this.weekDay = [];
    this.state = {
      zipcode: "",
      city: {},
      forecast: [],
      selectedDate: null,
    };

    //bind the methods to the Weather class 
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.renderWeatherList = this.renderWeatherList.bind(this);
    this.renderCurrentDay = this.renderCurrentDay.bind(this);

    this.form.addEventListener("submit", (event) => {
      //prevent the defaut behavior of the button
      event.preventDefault();
      this.onFormSubmit();
    });
  }


  //retrieve the lat and lng for zipcode
  onFormSubmit() {
    this.firstDay = null;
    this.weekDay = [];
    this.state = {
      zipcode: "",
      city: {},
      forecast: [],
      selectedDate: null,
    };
    this.state.zipcode = document.getElementById("zipcode").value;
    getLocation(this.state.zipcode)
      .then((data) => {
        this.state.city.name = data.results[0].address_components[1].long_name;
        this.state.city.lat = data.results[0].geometry.location.lat;
        this.state.city.lng = data.results[0].geometry.location.lng;
        /* Call renderWeatherList in onFormSubmit AFTER BOTH ajax calls
        have completed. Pass this.state.forecast as a parameter */
        this.getWeather();
      })
      .catch((error) => {
        alert("There was a problem getting location information: " + error);
      });
  }

  getWeather() {
    //call openweathermap to get weather info with lat and lng info
    const lat = this.state.city.lat;
    const lng = this.state.city.lng;
    getForecast(lat, lng)
      .then((data) => {
        for (let i = 0; i < 7; i++) {
          const dayInfo = {};
          const date = new Date();
          //The dates in the weather information are GMT and need to be translated to the timezone for the zipcode
          date = getDate(
            data.daily[i].dt,
            data.timezone_offset
          );

          dayInfo = {
            //Wed Jun 09 2021 20:00:00 GMT-0700 (Pacific Daylight Time)
            dayData: date,
            //"Wednesday"
            weekDay: getWeekday(date),
            //06/12/2021
            shortDate: getShortDate(date),

            minTemp: data.daily[i].temp.min,
            maxTemp: data.daily[i].temp.max,
            windSpeed: data.daily[i].wind_speed,
            _huminity: data.daily[i].humidity,
            _pressure: data.daily[i].pressure,
            _description: data.daily[i].weather[0].description,
            _icon: data.daily[i].weather[0].icon,
            mornTemp: data.daily[i].temp.morn,
            dayTemp: data.daily[i].temp.day,
            nightTemp: data.daily[i].temp.night,
            eveTemp: data.daily[i].temp.eve
          };
          this.state.forecast.push(dayInfo);
        }

        //zipcode cleared inside input tag
        this.clearCurrentDay();
        this.renderWeatherList();
      })
      .catch((error) => {
        alert("There was a problem getting weather information: " + error);
      }
      )
      ;
  }

  renderWeatherList() {
    let weeksWeatherHtml = this.state.forecast.reduce(
      (html, forecastDay, index) => html += this.renderWeatherListItem(forecastDay, index),
      "");
    weeksWeatherHtml = weeksWeatherHtml == "" ? "there is nothing to display" : weeksWeatherHtml;
    this.weatherList.innerHTML = weeksWeatherHtml;
    //forcastElements in an array of elements that have the class .weather-list-item
    let forecastElements = document.getElementsByClassName("weather-list-item");
    //add a click event handler to each of the elements using a loop
    for (let i = 0; i < forecastElements.length; i++) {
      //bind renderCurrentDay() to both the class and the index of the element
      forecastElements[i].onclick = this.renderCurrentDay.bind(this, i);
    }
  }

  renderWeatherListItem(forecastDay) {
    return `<div class="weather-list-item">
          <span>${forecastDay.shortDate}</span><br>
          <span>${forecastDay.weekDay}</span><br>
          <span>${forecastDay.minTemp} &deg;F | ${forecastDay.maxTemp} &deg;F</span>
        </div>`;
  }

  //clicking on a day's show Details makes the details of that day appear in #currentDay's DIV
  //Get bigger icon by changing the folder from w to wn and add @2x before the .png in URL
  renderCurrentDay(index) {
    const day = this.state.forecast[index];
    this.currentDay.innerHTML =
      `<div id="currentDayWrapper">
      <h1>${day.weekDay} In ${this.state.city.name}</h1>
      <div class="currentDayContent">
      <div class="weather">
        <img
          src="http://openweathermap.org/img/wn/${day._icon}@2x.png"
          alt="‘weather icon from openweathermap.org’"
          ></img>
        <p>${day._description}</p>

      </div>
      <div class="details">
          <span>Morning Temperature: ${day.mornTemp} &deg;F</span><br>
          <span>Day Temperature: ${day.dayTemp} &deg;F</span><br>
          <span>Evening Temperature: ${day.eveTemp} &deg;F</span><br>
          <span>Night Temperature: ${day.nightTemp} &deg;F</span><br>
          <span>Atmospheric Pressure: ${day._pressure} hPa</span><br>
          <span>Humidity: ${day._huminity}%</span><br>
          <span>Wind Speed: ${day.windSpeed} mph</span>
      </div>
      </div>
      </div>`;
  }

  clearCurrentDay() {
    document.getElementById("zipcode").value = "";
  }

}
let weather;
window.onload = () => {
  weather = new Weather();
}


