console.log("Jai Shree Krishna");


/*
async function fetchWeatherInfoUsingCity(){
    try{

    // let latitude = 18.564783 ;
    // let longitude = 125.5678043;

    let city = "patna";
    let API_key = `7f2d9ce90506ea22ecaaed6c03f9cd98` ;

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`) ;
    // const response = await fetch(` https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`)
    const data = await response.json() ;
    renderWeatherInfo(data) ;
    }
    catch(e){
        console.log("No response with error ",e) ;
    }
}    
async function fetchWeatherInfoUsingLatandLon(){
    try{
        let latitude = 18.564783 ;
        let longitude = 125.5678043 ;

        let API_key = `7f2d9ce90506ea22ecaaed6c03f9cd98` ;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`) ;
        let data = await response.json() ; 
        renderWeatherInfo(data) ;
    }
    catch(e){
        console.log("Error Found",e) ;
    }
}

function renderWeatherInfo(data){
    // console.log("Weather Data :- ",data) ;
    let newPara = document.createElement('p') ;
    newPara.innerText = (data.main).temp + " °C" ;
    // newPara.textContent = "Temperature = " + `${data?.main?.temp.toFixed(2)}`
    document.body.appendChild(newPara) ;
}
fetchWeatherInfoUsingCity();
fetchWeatherInfoUsingLatandLon() ;

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition) ;
    }
    else{
        console.log("No Geolocation Support") ;
    }
}

function showPosition(position){
    let lat = position.coords.latitude  ;
    let long = position.coords.longitude ;

    console.log(lat)  ;
    console.log(long) ;

}

*/
// getLocation();

const userTab = document.querySelector("[data-UserWeather]") ;
const searchTab = document.querySelector("[data-SearchWeather]") ;
const userContainer = document.querySelector(".weather-container") ;
const grantAccessContainer = document.querySelector(".grant-location-container") ;
const searchForm = document.querySelector("[data-SearchForm]") ;
const searchInput = document.querySelector("[data-SearchInput]") ;
const loadingScreen = document.querySelector(".loadingContainer") ;
const userInfoContainer = document.querySelector(".userInfoContainer") ;
let grantAccessBtn = document.querySelector("[data-GrantAccess]") ;
let errorHandlingContainer = document.querySelector("[data-ErrorHandling]") ;


let API_key = `7f2d9ce90506ea22ecaaed6c03f9cd98` ;

getFromSessionStorage();  // function call to ensure correct latitude and longitude is placed in the session storage...

//Initial Variables Need
let currentTab = userTab ;
currentTab.classList.add("currentTab") ;

userTab.addEventListener('click',()=>{
    switchTab(userTab);
})
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})



function switchTab(clickedTab){
    if(currentTab != clickedTab){

        currentTab.classList.remove('currentTab');
        currentTab = clickedTab ;
        currentTab.classList.add('currentTab');

    // Agar phle se searchForm active nhi hai toh search form ko active krna hai i.e. click is made on the Search Tab

        if(!searchForm.classList.contains('active')){
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active') ;
            console.log("Hii");
        }
        else{
            // Changing visible tab to user Weather
            searchForm.classList.remove('active') ;
            userInfoContainer.classList.remove('active');

            //getting location from local storage from previous storage...
            getFromSessionStorage();
        }
    }
}

//checking wether coordinates are available in session storage..
function getFromSessionStorage(){
    let localCoordinates = sessionStorage.getItem('user-coordinates') ; 
    //agra Local coordinates nhi mile
    if(!localCoordinates){
        userInfoContainer.classList.remove('active');
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localCoordinates) ;
        fetchUserWeatherInfo(coordinates) ;
        
    }
}
 
async function fetchUserWeatherInfo(coordinates){

    // Destructuring Assignment
    const {lat,lon} =  coordinates ;

    //making grant access container invisible
    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add("active");

    //API CALL
    try{
        const response = await fetch(` https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`) ;
        const data = await response.json();
        errorHandlingContainer.classList.remove('active1');
        loadingScreen.classList.remove("active") ;
        userInfoContainer.classList.add("active") ;
        renderWeatherInfo(data) ;
    }
    catch(e){
        loadingScreen.classList.remove("active") ;
        console.log("Error caught ",e);
        loadingScreen.classList.remove("active") ;
        userInfoContainer.classList.add("active") ;
        errorHandlingContainer.classList.add('active1');
    }
}

function renderWeatherInfo(data){
    //Firstly we are fetching element to be rendered :
    let cityName = document.querySelector("[data-cityName]");
    let countryCode;
    let countryIcon = document.querySelector("[data-countryIcon]");
    let weatherDesc = document.querySelector("[data-weatherDescription]");
    let weatherIconCode ;
    let weatherIcon = document.querySelector("[data-weatherIcon]") ;
    let temp = document.querySelector("[data-Temperature]") ;
    let windspeed = document.querySelector("[data-WindSpeed]") ;
    let humidity = document.querySelector("[data-Humidity]") ;
    let cloudiness = document.querySelector("[data-Clouds]") ;

    cityName.innerText = data?.name ;

    countryCode = data?.sys?.country ;
    countryIcon.src = `https://flagcdn.com/144x108/${countryCode.toLowerCase()}.png` ;

    weatherDesc.innerText = data?.weather?.[0]?.description ;

    weatherIconCode = data?.weather?.[0]?.icon ;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

    temp.innerText = `${(data?.main?.temp - 272.14).toFixed(3)} °C` ;
    windspeed.innerText = `${data?.wind?.speed} m/s` ;
    humidity.innerText = `${data?.main?.humidity} %` ;
    cloudiness.innerText =`${ data?.clouds?.all } %`; 
    
}
    
grantAccessBtn.addEventListener('click',getLocation) ;

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //Show alert for no geolocation support available
        alert("Sorry, GeoLocation is not available ") ;
    }
}

function showPosition(position){
    const userCoordinates = {lat: position.coords.latitude,
        lon:position.coords.longitude };

    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates) ;
}

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault() ;
    if(searchInput.value === "") return;

    fetchUserWeatherInfoUsingCity(searchInput.value) ;
})
async function fetchUserWeatherInfoUsingCity(city){
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    errorHandlingContainer.classList.remove('active1');
    loadingScreen.classList.add("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`) ;
        const data = await response.json();
        loadingScreen.classList.remove("active");
        renderWeatherInfo(data);
        userInfoContainer.classList.add('active');
    }
    catch(e){
        loadingScreen.classList.remove("active");
        errorHandlingContainer.classList.add('active1');
        console.log("Error Caught ",e);
    }
}
    







// 7f2d9ce90506ea22ecaaed6c03f9cd98
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}