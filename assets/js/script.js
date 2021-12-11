var userInput = [];
var userCity;

//creates variable for each day
var today = new Date();
var day1 = new Date(today);
var day2 = new Date(today);
var day3 = new Date(today);
var day4 = new Date(today);
var day5 = new Date(today);
//sets variables to the following 5 days
day1.setDate(day1.getDate() + 1);
day2.setDate(day2.getDate() + 2);
day3.setDate(day3.getDate() + 3);
day4.setDate(day4.getDate() + 4);
day5.setDate(day5.getDate() + 5);
//sets the variables as a string
today = today.toLocaleDateString();
day1 = day1.toLocaleDateString();
day2 = day2.toLocaleDateString();
day3 = day3.toLocaleDateString();
day4 = day4.toLocaleDateString();
day5 = day5.toLocaleDateString();
//puts days into an array for easier calling in funcitons
var days = [day1, day2, day3, day4, day5];

//gets cities lat and long to be used for weather API call
var getCoord = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=f1456f8e5630684f6f3c0174180ff0c4";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                userCity = city;
                getApiFetch(data.coord.lat, data.coord.lon);
            });
        } else {
            alert("something went wrong while fetching api");
        };
    });
};

//gets weather info from API
var getApiFetch = function(lat, long) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=f1456f8e5630684f6f3c0174180ff0c4";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayMainForecast(data.current);
                displaySubForecasts(data.daily);
            });
        } else {
            alert("something went wrong while fetching api");
        };
    });
};

//displays weather info for today
var displayMainForecast = function(data) {
    //adds the weather info to HTML elements
    $("#weather-main").find("#city").text(userCity + "(" + today +")" + getWeatherIcon(data));
    $("#weather-main").find("#temp").text("Temp: " + data.temp + "°F");
    $("#weather-main").find("#wind").text("Wind: " + data.wind_speed + " MPH");
    $("#weather-main").find("#humidity").text("Humidity: " + data.humidity + "%");
    
    //if loop sets color of UV index according to severity
    if(data.uvi <= 2) {
        $("#weather-main").find("#uv").addClass("bg-success").text(data.uvi);
    } else if (data.uvi <= 5) {
        $("#weather-main").find("#uv").addClass("bg-warning").text(data.uvi);
    } else if (data.uvi <= 7) {
        $("#weather-main").find("#uv").addClass("bg-danger").text(data.uvi);
    } else {
        $("#weather-main").find("#uv").addClass("bg-secondary").text(data.uvi);
    };
};

//displays weather info for the following 5 days
var displaySubForecasts = function(data) {
    console.log(data);
    for(var i=1; i<=5; i++){
        $("#day" + i).find("#date").text("(" + days[i-1] +")");
        $("#day" + i).find("#icon").text(getWeatherIcon(data[i-1]));
        $("#day" + i).find("#temp").text("Temp: " + data[i-1].temp.day + "°F");
        $("#day" + i).find("#wind").text("Wind: " + data[i-1].wind_speed + " MPH");
        $("#day" + i).find("#humidity").text("Humidity: " + data[i-1].humidity + "%");
    }
};

//gets the appropriate icon for each weather type
var getWeatherIcon = function(data) {
    var weather = data.weather[0].main;
    if (weather === 'Clear') {
        return "☀️";
    } else if (weather === 'Clouds') {
        return "☁️";
    } else if (weather  === 'Rain' || weather === 'Drizzle') {
        return "🌧️";
    } else if (weather === 'Thunderstorm') {
        return "⛈️";
    } else if (weather === 'Snow') {
        return "❄️";
    } else {
        return "⛅";
    }
};

//loads in the cities when the site first loads from localStorage
var loadCities = function() {
    userInput = JSON.parse(localStorage.getItem("cities"));

    if(!userInput) {
        userInput = [];
    };

    for(var i=0; i < userInput.length; i++) {
        $("#past-cities").append('<p class="card mb-4" id="' + userInput[i] + '">' + userInput[i] + '</p>');
    };
};

//saves the users input to the local array and localStorage, also creates a new p tag for html
var saveCity = function(city) {
    if (userInput.includes(city)) {
        return;
    } else {
        userInput.push(city);
        localStorage.setItem("cities", JSON.stringify(userInput));
        $("#past-cities").append('<p class="card mb-4" id="' + city + '">' + city + '</p>');
    };
};

//checks for when the search button is clicked and gets the user's input from the form
$("#user-form").submit(function(e) {
    e.preventDefault();

    //gets the users city from the form
    var userCity = $("#city").val();
    saveCity(userCity);
    getCoord(userCity);

    //resets the form value to blank
    $("#city").val("");
});

//checks for if a past city is clicked and sends that city to the API functions
$("#past-cities").click(function(e) {
    if (e.target.id != "past-cities") {
        getCoord(e.target.id);
    };
});

//initially loads the cities from localStorage
loadCities();