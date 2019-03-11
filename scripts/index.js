// Modal Parts//
var modal = document.getElementById('myModal');

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// App Start//
const UI = (function () {
  let menu = document.querySelector("#menu-container");

  const showApp = () => {
    document.querySelector("#app-loader").classList.add("display-none");
    document.querySelector("main").removeAttribute("hidden");
  };

  const loadApp = () => {
    document.querySelector("#app-loader").classList.remove("display-none");
    document.querySelector("main").setAttribute("hidden", "true");
  };

  const _showMenu = () => (menu.style.right = 0);
  const _hideMenu = () => (menu.style.right = "-65%");

  const _toggleHourlyWeather = () => {
    let hourlyWeather = document.querySelector("#hourly-weather-wrapper"),
      arrow = document.querySelector("#toggle-hourly-weather").children[0],
      visible = hourlyWeather.getAttribute("visible"),
      dailyWeather = document.querySelector("#daily-weather-wrapper");

    if (visible == "false") {
      hourlyWeather.setAttribute("visible", "true");
      hourlyWeather.style.bottom = 0;
      arrow.style.transform = "rotate(180deg)";
      dailyWeather.style.opacity = 0;
    } else if (visible == "true") {
      hourlyWeather.setAttribute("visible", "false");
      hourlyWeather.style.bottom = "-100%";
      arrow.style.transform = "rotate(0deg)";
      dailyWeather.style.opacity = 1;
    } else
      console.error(
        "Unknown state of the hourly weather panel and visible attribute"
      );
  };

  const drawWeatherData = (data, location) => {
    let currentlyData = data.currently, // data for the currently weather panel
      dailyData = data.daily.data, // data for the daily weather panel
      hourlyData = data.hourly.data, // data for the hourly weather panel
      weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      dailyWeatherWrapper = document.querySelector("#daily-weather-wrapper"),
      dailyWeatherModel,
      day,
      maxMinTemp,
      dailyIcon,
      hourlyWeatherWrapper = document.querySelector("#hourly-weather-wrapper"),
      hourlyWeatherModel,
      hourlyIcon;

    // set current weather
    document.querySelectorAll(".location-label").forEach(e => {
      e.innerHTML = location;
    });

    document.querySelector(
      "main"
    ).style.backgroundImage = `url("./assets/images/bg-images/${
      currentlyData.icon
    }.jpg")`;

    document
      .querySelector("#currentlyIcon")
      .setAttribute(
        "src",
        `./assets/images/summary-icons/${currentlyData.icon}-white.png`
      );

    document.querySelector("#summary-label").innerHTML = currentlyData.summary;
    // Set Temp to Fahrenheit
    document.querySelector("#degrees-label").innerHTML =
      Math.round(((currentlyData.temperature + 32) * 5) / 9) + "&#176;";

    //Humidty
    document.querySelector("#humidity-label").innerHTML =
      Math.round(currentlyData.humidity * 100) + "%";
    // Wind Speed
    document.querySelector("#wind-speed-label").innerHTML =
      (currentlyData.windSpeed / 1.6093).toFixed(1) + " mph";

    while (dailyWeatherWrapper.children[1]) {
      dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1]);
    }

    // Build weather data for the next seven days
    for (let i = 0; i <= 6; i++) {
      dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true);
      dailyWeatherModel.classList.remove("display-none");
      // set the day
      day = weekDays[new Date(dailyData[i].time * 1000).getDay()];
      dailyWeatherModel.children[0].children[0].innerHTML = day;

      maxMinTemp =
        Math.round(((dailyData[i].temperatureMax + 32) * 5) / 9) +
        "&#176;" +
        "/" +
        Math.round(((dailyData[i].temperatureMin + 32) * 5) / 9) +
        "&#176;";
      dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;

      dailyIcon = dailyData[i].icon;
      dailyWeatherModel.children[1].children[1].children[0].setAttribute(
        "src",
        `./assets/images/summary-icons/${dailyIcon}-white.png`
      );

      dailyWeatherWrapper.appendChild(dailyWeatherModel);
    }
    dailyWeatherWrapper.children[1].classList.add("current-day-of-the-week");

    // set hourly weather
    while (hourlyWeatherWrapper.children[1]) {
      hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1]);
    }

    // build weather data for the next 24 hours
    for (let i = 0; i <= 24; i++) {
      hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true);
      hourlyWeatherModel.classList.remove("display-none");
      hourlyWeatherModel.children[0].children[0].innerHTML =
        new Date(hourlyData[i].time * 1000).getHours() + ":00";

      // set temperature
      hourlyWeatherModel.children[1].children[0].innerHTML =
        Math.round(((hourlyData[i].temperature + 32) * 5) / 9) + "&#176;";
      hourlyIcon = hourlyData[i].icon;
      hourlyWeatherModel.children[1].children[1].children[0].setAttribute(
        "src",
        `./assets/images/summary-icons/${hourlyIcon}-grey.png`
      );

      hourlyWeatherWrapper.appendChild(hourlyWeatherModel);
    }
    UI.showApp();
  };

  document.querySelector("#open-menu-btn").addEventListener("click", _showMenu);
  document
    .querySelector("#close-menu-btn")
    .addEventListener("click", _hideMenu);

  document
    .querySelector("#toggle-hourly-weather")
    .addEventListener("click", _toggleHourlyWeather);

  return {
    showApp,
    loadApp,
    drawWeatherData
  };
})();

const LOCALSTORAGE = (function () {
  let savedCities = [];

  const save = city => {
    savedCities.push(city);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  };

  const get = () => {
    if (localStorage.getItem("savedCities") != null)
      savedCities = JSON.parse(localStorage.getItem("savedCities"));
  };

  const remove = index => {
    if (index < savedCities.length) {
      savedCities.splice(index, 1);

      localStorage.setItem("savedCities", JSON.stringify(savedCities));
    }
  };

  const getSavedCities = () => savedCities;

  return {
    save,
    get,
    remove,
    getSavedCities
  };
})();

const SAVEDCITIES = (function () {
  let container = document.querySelector("#saved-cities-wrapper");

  const drawCity = city => {
    let cityBox = document.createElement("div"),
      cityWrapper = document.createElement("div"),
      deleteWrapper = document.createElement("div"),
      cityTextNode = document.createElement("h1"),
      deleteBtn = document.createElement("button");

    cityBox.classList.add("saved-city-box", "flex-container");
    cityTextNode.innerHTML = city;
    cityTextNode.classList.add("set-city");
    cityWrapper.classList.add("ripple", "set-city");
    cityWrapper.append(cityTextNode);
    cityBox.append(cityWrapper);

    deleteBtn.classList.add("ripple", "remove-saved-city");
    deleteBtn.innerHTML = "-";
    deleteWrapper.append(deleteBtn);
    cityBox.append(deleteWrapper);

    container.append(cityBox);
  };

  const _deleteCity = cityHTMLBtn => {
    let nodes = Array.prototype.slice.call(container.children),
      cityWrapper = cityHTMLBtn.closest(".saved-city-box"),
      cityIndex = nodes.indexOf(cityWrapper);

    LOCALSTORAGE.remove(cityIndex);
    cityWrapper.remove();
  };

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-saved-city")) {
      _deleteCity(event.target);
    }
  });

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("set-city")) {
      let nodes = Array.prototype.slice.call(container.children),
        cityWrapper = event.target.closest(".saved-city-box"),
        cityIndex = nodes.indexOf(cityWrapper),
        savedCities = LOCALSTORAGE.getSavedCities();

      WEATHER.getWeather(savedCities[cityIndex], false);
    }
  });

  return {
    drawCity
  };
})();

const GETLOCATION = (function () {
  let location;

  const locationInput = document.querySelector("#location-input"),
    addCityBtn = document.querySelector("#add-city-btn");

  const _addCity = () => {
    location = locationInput.value;
    locationInput.value = "";
    addCityBtn.setAttribute("disabled", "true");
    addCityBtn.classList.add("disabled");

    WEATHER.getWeather(location, true);
  };

  locationInput.addEventListener("input", function () {
    let inputText = this.value.trim();

    if (inputText != "") {
      addCityBtn.removeAttribute("disabled");
      addCityBtn.classList.remove("disabled");
    } else {
      addCityBtn.setAttribute("disabled", "true");
      addCityBtn.classList.add("disabled");
    }
  });

  addCityBtn.addEventListener("click", _addCity);
})();

//Get Weather data
const WEATHER = (function () {
  // private keys for the api
  const darkSkyKey = "d2f735418d108e7b63045632b53b187a",
    geocoderKey = "11b9399f48d64d48b2ca702d8e36c150";

  // return a valid URL for OpenCage API
  const _getGeocodeURL = location =>
    `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geocoderKey}`;

  // return a valid URL for DarkSky API
  const _getDarkSkyURL = (lat, lng) =>
    `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`;

  // get weather data from Dark Sky
  const _getDarkSkyData = (url, location) => {
    axios
      .get(url)
      .then(res => {
        // draw the data on the interface
        UI.drawWeatherData(res.data, location);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getWeather = (location, save) => {
    UI.loadApp();

    let geocodeURL = _getGeocodeURL(location);

    // get data from OpenCageData
    axios
      .get(geocodeURL)
      .then(res => {
        // if the location is invalid....
        if (res.data.results.length == 0) {
          console.error("Invalid Location");
          UI.showApp();
          return;
        }

        if (save) {
          LOCALSTORAGE.save(location);
          SAVEDCITIES.drawCity(location);
        }

        // get lat and lng from OpenCageData
        let lat = res.data.results[0].geometry.lat,
          lng = res.data.results[0].geometry.lng;

        // get a formated url for dakSky
        let darkskyURL = _getDarkSkyURL(lat, lng);

        // call the function to get weather data
        _getDarkSkyData(darkskyURL, location);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return {
    getWeather
  };
})();

window.onload = function () {
  LOCALSTORAGE.get();

  let cities = LOCALSTORAGE.getSavedCities();

  if (cities.length != 0) {
    cities.forEach(city => SAVEDCITIES.drawCity(city));

    WEATHER.getWeather(cities[cities.length - 1], false);
  } else UI.showApp();
};