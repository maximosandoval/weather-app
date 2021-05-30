//SET UP CONST/FUNCTION FOR:
//SEARCH INPUT FOR CITY
//CLEAR INPUT FOR CITY
//DISPLAY CITY
//DISPLAY DATE
//DISPLAY TEMP
//DISPLAY WIND
//DISPLAY HUMIDITY
//DISPLAY UV INDEX ONLY IN MAIN JUMBOTRON AND NOT SUBSET OF CARDS
//DISPLAY CLOUD ICON IN JUMBOTRON
//Set up local Storage to save search entries
//Need to strigify parts in JSON for local storage

const userFormEl = document.querySelector("#user-form");
let cityInputEl = document.querySelector("#city-name");
const weatherContainerEl = document.querySelector("#weather-container");
const forecastContainerEl = document.querySelector("#forecast-containers");
const createSearchHistory = document.querySelector("#main-container");
const apiKey = "11a28f3b177613b00aee74b2e8b462f4";

// function for user city input into form element
let citySubmit = function (event) {
  // prevent default action
  event.preventDefault();
  let cityName = cityInputEl.value.trim();

  // getting city info and setting it to empty strings for alert
  if (cityName) {
    getCityInfo(cityName);

    cityInputEl.value = "";
    // alert if not value input into form and they click button
  } else {
    alert("Please enter a city");
  }

  // creating buttons for previously searched cities
  let createSearchHistoryButton = document.createElement("button");
  createSearchHistoryButton.textContent = cityName;
  createSearchHistory.append(createSearchHistoryButton);
};
// click event for search button in form
userFormEl.addEventListener("submit", citySubmit);

// function to make api call
getCityInfo = function (city) {
  // weather api call
  var city = cityInputEl.value;
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&APPID=" +
    apiKey;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // setting variables for latitude and longitude to use in apiUrl2
      let lat = data.coord.lat;
      let long = data.coord.lon;

      // onecall api call
      let apiUrl2 =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        long +
        "&units=imperial&appid=" +
        apiKey;
      fetch(apiUrl2)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          localStorage.setItem(city, JSON.stringify(data));

          displayWeatherBoard(city);
          displayFutureForecasts(city);
        });
    });
};

// grabbing HTML elements for display weather board
const cityName = document.querySelector(".card-city");
const currentDate = document.querySelector(".card-date");
const temp = document.querySelector(".card-text1");
const wind = document.querySelector(".card-text2");
const humidity = document.querySelector(".card-text3");
const uvIndex = document.querySelector(".card-text4");

// creating function to display content from api call
function displayWeatherBoard(city) {
  // pulling data out of local storage
  let data = JSON.parse(localStorage.getItem(city));
  weatherContainerEl.classList.remove("hide");
  // giving the variables data value and creating text content
  cityName.textContent = city;
  currentDate.textContent = moment().format("dddd, MMMM Do YYYY");
  temp.textContent = "Temp:" + " " + data.current.temp + "°F";
  wind.textContent = "Wind:" + " " + data.current.wind_speed + " " + "MPH";
  humidity.textContent = "Humidity:" + " " + data.current.humidity + "%";
  uvIndex.textContent = "UV Index:" + " " + data.current.uvi;
  if (uvIndex <= 2) {
    uvIndex.classList.add("low");
  } else if (uvIndex >= 3 && uvIndex <= 7) {
    uvIndex.classList.add("moderate");
  } else {
    uvIndex.classList.add("high");
  }
}

// creating function to display forecast cards
function displayFutureForecasts(city) {
  // pulling data out of local storage
  let data = JSON.parse(localStorage.getItem(city));
  // grabbing html element for text content
  let forecast = document.querySelectorAll(".card-forecast");
  forecastContainerEl.classList.remove("hide");
  // creating loop to empty out div once new city is submitted for search
  for (let i = 0; i < forecast.length; i++) {
    forecast[i].innerHTML = "";
  }

  // looping through data to get daily forecast
  // incrementing daily for 5 day forecast
  for (let i = 0; i < forecast.length; i++) {
    // creating html element
    const date = document.createElement("h5");
    const icon = document.createElement("img");
    const temp = document.createElement("p");
    const wind = document.createElement("p");
    const humidity = document.createElement("p");

    // assigning value to text content
    date.textContent = moment()
      .add(i + 1, "days")
      .format("dddd, MMMM Do");
    icon.setAttribute(
      "src",
      "s://openweathermap.org/img/wn/" +
        data.daily[i].weather[0].icon +
        "@2x.png"
    );
    temp.textContent = "Temp:" + " " + data.daily[i].temp.day + "°F";
    wind.textContent = "Wind:" + " " + data.daily[i].wind_speed + " " + "MPH";
    humidity.textContent = "Humidity:" + " " + data.daily[i].humidity + "%";

    // appending created elements
    forecast[i].append(date, icon, temp, wind, humidity);
  }
}
