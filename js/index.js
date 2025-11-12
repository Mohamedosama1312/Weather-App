//^########3 html element

let Container = document.querySelector(".forecast-container");
let searchInput = document.querySelector("#searchInput");
let searchBtn = document.querySelector("#searchBtn");
//& #### App Variables ####


//^ ########function

async function getWeather(city) {
    let resp = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=af8bcf8ff0494c0fb49163210251111&q=${city}&days=7`, { method: "GET" });
    let wether = await resp.json();
    displayCurrent(wether.location, wether.current, wether.forecast);
    displayAnother(wether.forecast.forecastday)

};

async function getWeatherByCoords(lat, lon) {
    let resp = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=af8bcf8ff0494c0fb49163210251111&q=${lat},${lon}&days=7`);
    let weather = await resp.json();
    displayCurrent(weather.location, weather.current, weather.forecast);
    displayAnother(weather.forecast.forecastday);
}

function displayCurrent(location, current, forecast) {
    const date = new Date(location.localtime);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    const dayNumber = date.getDate();
    const monthName = date.toLocaleDateString("en-US", { month: "long" });
    const dateFormatted = `${dayNumber} ${monthName}`;

    let currentMarkup = ` <div class="today forecast">
                        <div class="forecast-header">
                            <div class="day">${dayName}</div>
                            <div class="date">${dateFormatted}</div>
                        </div> <!-- .forecast-header -->
                        <div class="forecast-content">
                            <div class="location">${location.name}</div>
                            <div class="degree">
                                <div class="num">${current.temp_c}<sup>o</sup>C</div>
                                <div class="forecast-icon">
                                    <img src="https:${current.condition.icon}" alt="" width=90> 
                                </div> 
                            </div>
                            <div class="custom">${current.condition.text}</div>
                            <div> <span><img src="./images/icon-umberella.png" alt="">${forecast.forecastday[0].day.daily_chance_of_rain}%</span>
                                <span><img src="./images/icon-wind.png" alt="">${current.wind_kph}km/h</span>
                                <span><img src="./images/icon-compass.png" alt="">${current.wind_dir}</span>
                            </div>
                        </div>
                    </div>`

    Container.innerHTML += currentMarkup;
};


function displayAnother(forecast) {
    for (let index = 1; index < forecast.length; index++) {
        const date = new Date(forecast[index].date);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        let anotherMarkcup = ` <div class="forecast">
                        <div class="forecast-header">
                            <div class="day">${dayName}</div>
                        </div> <!-- .forecast-header -->
                        <div class="forecast-content">
                            <div class="forecast-icon">
                                <img src="https:${forecast[index].day.condition.icon}" alt="" width=48>
                            </div>
                            <div class="degree">${forecast[index].day.maxtemp_c}<sup>o</sup>C</div>
                            <small>${forecast[index].day.mintemp_c}<sup>o</sup></small>
                            <div class="custom">${forecast[index].day.condition.text}</div>
                        </div>
                    </div>
    `
        Container.innerHTML += anotherMarkcup;

    }
};

async function searchWeather() {
    let searchKeyword = searchInput.value.trim();
    let resp = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=af8bcf8ff0494c0fb49163210251111&q=${searchKeyword}&days=7`, { method: "GET" });
    let wether = await resp.json();
    // if (searchKeyword === "") return;
    Container.innerHTML = "";
    if (wether.error) {
        Container.innerHTML = `<h1>"${searchKeyword}" City Not Found❌ </h1>`;
        return;
    }
    displayCurrent(wether.location, wether.current, wether.forecast);
    displayAnother(wether.forecast.forecastday)
}


//^####### event
searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchWeather();
    } else {
        searchWeather();
    }
})

window.addEventListener("load", () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            (err) => {
                console.warn("User denied location, fallback to default city.");
                getWeather("cairo");
            }
        );
    } else {
        console.warn("Geolocation not supported, fallback to default city.");
        getWeather("cairo");
    }
});

searchBtn.addEventListener("click", searchWeather);
