var userInput = [];

//gets cities lat and long to be used for weather API call
var getCoord = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=f1456f8e5630684f6f3c0174180ff0c4";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
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
            });
        } else {
            alert("something went wrong while fetching api");
        };
    });
};

//loads in the cities when the site first loads from localStorage
var loadCities = function() {
    userInput = JSON.parse(localStorage.getItem("cities"));

    if(!userInput) {
        return;
    };

    for(var i=0; i < userInput.length; i++) {
        $("#past-cities").append('<p class="card mb-4">' + userInput[i] + '</p>');
    };
};

//saves the users input to the local array and localStorage, also creates a new p tag for html
var saveCity = function(city) {
    if (userInput.includes(city)) {
        return;
    } else {
        userInput.push(city);
        localStorage.setItem("cities", JSON.stringify(userInput));
        $("#past-cities").append('<p class="card mb-4">' + city + '</p>');
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

//initially loads the cities from localStorage
loadCities();