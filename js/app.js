const citySearch = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#search");
const temperature = document.querySelector("#temperature");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
 const weatherCondition = document.querySelector("#condition");
const weatherIcon = document.querySelector("#weatherIcon");
const loader = document.querySelector("#loader");
const dateTime = document.querySelector("#dateTime");
const feesLike = document.querySelector("#feels");
const historyBox = document.querySelector("#history");
const forecastBox = document.querySelector("#forecast");
const rainChances = document.querySelector("#rain");
const clearInput = document.querySelector("#clearInput");
const clearHistBtn = document.querySelector("#clearHistory");

citySearch.addEventListener("input", () => {
    if(citySearch.value.trim()!==""){
        clearInput.style.display = "inline";
    }else{
        clearInput.style.display = "none";
    }
});

clearHistBtn.addEventListener("click",()=>{
    localStorage.removeItem("history");
    searchHistory = [];
    renderHistory();
})

clearInput.addEventListener("click", ()=> {
    citySearch.value = "";
    clearInput.style.display = "none";
    citySearch.focus();
});
let searchHistory = JSON.parse(localStorage.getItem("history")) || [];

function displayForecast(weatherData){
    forecastBox.innerHTML = "";

    weatherData.forEach(day => {
        const card = document.createElement("div");
        card.classList.add("forecast-card");
        card.innerHTML = 
        `<h3>${day.date}</h3>
        <p> Max: ${day.maxtempC}°C</p>
        <p>${day.hourly[0].weatherDesc[0].value}</p>`;
        forecastBox.appendChild(card);
    })
}

function saveCity(city){
    city = city.toLowerCase();
if(!searchHistory.includes(city)){
    searchHistory.push(city);
}
localStorage.setItem(
    "history", JSON.stringify(searchHistory)
);
renderHistory();
}
function renderHistory(){
    historyBox.innerHTML = "";
    searchHistory.forEach(city => {
        const div = document.createElement("div");
        div.classList.add("history-item");
        div.textContent = city;
        div.addEventListener("click", () => {
            citySearch.value = city;
            getWeather();
        });
        historyBox.appendChild(div);
    });
}


 searchBtn.addEventListener("click", () =>{

        getWeather();
    }
);
citySearch.addEventListener("keypress",(e) =>{
    if(e.key === "Enter"){
        getWeather();
    }
}
);

function updateDateTime(){
    const now = new Date();
    const date = now.toLocaleDateString("en-IN",{
        weekday : "long",
        year : "numeric",
        month :"long",
        day : "numeric"
    });
    const time = now.toLocaleTimeString("en-IN");

    dateTime.textContent = `Date: ${date} || Time: ${time}`;
};
updateDateTime();
setInterval(updateDateTime,1000);

async function getWeather(){
    const city = citySearch.value.trim();

    if(city === ""){
        alert("Enter city name");
        return;
    }
  
    const url = `https://wttr.in/${city}?format=j1`;
    
try{
    loader.style.display = "block";
    const response = await fetch(url);
    const data = await response.json();


    temperature.textContent = `Temperature: ${data.current_condition[0].temp_C}°C`;
    humidity.textContent = `Humidity: ${data.current_condition[0].humidity}%`;
    wind.textContent = `Wind Speed: ${data.current_condition[0].windspeedKmph}`;
weatherCondition.textContent =`Condition: ${data.current_condition[0].weatherDesc[0].value}`;
feesLike.textContent = `Feels Like: ${data.current_condition[0].FeelsLikeC}°C`;
rainChances.textContent = `Precipitation : ${data.weather[0].hourly[0].chanceofrain}%`;

const weatherDesc= data.current_condition[0].weatherDesc[0].value.toLowerCase();

if(weatherDesc.includes("sunny")){
    weatherIcon.src = "./images/sun.png";
     document.body.style.background =
    "linear-gradient(to right, #56ccf2, #f2c94c)";
}
else if(
    weatherDesc.includes("rain") ||
    weatherDesc.includes("thunder")
){
    weatherIcon.src = "./images/thunder.png";
       document.body.style.background =
    "linear-gradient(to right, #1e3c72, #2a5298)";
}
else if(weatherDesc.includes("mist")||weatherDesc.includes("haze")){
    weatherIcon.src = "./images/haze.png";
     document.body.style.background =
    "linear-gradient(to right, #d7d2cc, #304352)";
}
else if(weatherDesc.includes("cloud")){
    weatherIcon.src = "./images/cloudy.png";
      document.body.style.background =
    "linear-gradient(to right, #bdc3c7, #2c3e50)";
}
saveCity(city);
displayForecast(data.weather);
}
catch(error){
    console.log(error);
    alert("city name not found");

}
finally{
    loader.style.display = "none";
}
}
renderHistory();
