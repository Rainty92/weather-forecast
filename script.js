document.addEventListener("DOMContentLoaded", ready);

function ready () {

let myCity;
const dropdown = document.querySelector('.value-list');
const inputField = document.querySelector('.chosen-value');
let valueArray = [];
let city = [];

//-------------------------------------------------------------------- getMyCity
window.onload = function () {

    jQuery(".user-city span").text(ymaps.geolocation.city);
    myCity = ymaps.geolocation.city;
        // jQuery("#user-region").text(ymaps.geolocation.region);
        // jQuery("#user-country").text(ymaps.geolocation.country);
        getConditions(myCity)
}

//---------------------------------------------------------------------getCity



fetch('./json/city.json') 
    .then(response => response.json())
    .then(data => getCity(data))


 function getCity (response) {

    city = response.map(item => ({
            cityEN: item['name-en'],
            cityRU: item['name-ru']
    }))
   
    city.sort(sortArr)

    for(let i = 0; i < city.length; i++) {
        dropdown.insertAdjacentHTML('beforeEnd',`<li data-value='${city[i].cityEN}'>${city[i].cityRU}</li>`)

    }
    let dropdownArray = document.querySelectorAll('li');

    dropdownArray.forEach(item => {
        valueArray.push(item.textContent);
    });

    showMenu(dropdownArray)
    addInputValue(dropdownArray)
}

//---------------------------------------------------------------------SortRuCity

function sortArr (a, b) {
    if (a.cityRU < b.cityRU) {
        return -1;
    }
    
    if (a.cityRU > b.cityRU) {
        return 1;
    }
    
    return 0;
}
//---------------------------------------------------------------------dropMenu
function showMenu(dropdownArray){ 
    inputField.addEventListener('input', () => {
        let inputValue = inputField.value.toLowerCase();
        // let valueSubstring;
        if (inputValue.length > 0) {
          for (let j = 0; j < valueArray.length; j++) {
            if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
              dropdownArray[j].classList.add('closed');
            } else {
              dropdownArray[j].classList.remove('closed');
            }
          }
        } else {
          for (let i = 0; i < dropdownArray.length; i++) {
            dropdownArray[i].classList.remove('closed');
          }
        }
      });
}

function addInputValue(dropdownArray){ 
    
    dropdownArray.forEach(item => {
        item.addEventListener('click', (evt) => {
            inputField.value = item.textContent;  
            let valDataAttr = item.getAttribute("data-value");

            getConditions(valDataAttr) // ---------------------------------------------------callApiWeather
   
          dropdownArray.forEach(dropdown => {
            dropdown.classList.add('closed');
          });
        });
      })
      openPlaseholder(dropdownArray)
}

function openPlaseholder(dropdownArray){ 

    inputField.addEventListener('focus', () => {
        inputField.placeholder = 'Введите название';
        dropdown.classList.add('open');
        dropdownArray.forEach(dropdown => {
          dropdown.classList.remove('closed');
        });
     });
  
}

  
inputField.addEventListener('blur', () => {
    inputField.placeholder = 'Выберите город';
    dropdown.classList.remove('open');
});

//--------------------------------------------------------Conditions

function getConditions(valDataAttr) {
    fetch('./json/conditions.json')
        .then(response => response.json())
        .then(data => getApiWeather(data, valDataAttr))
        .catch(err => console.error(err))
}

//--------------------------------------------------------ApiWeather

function getApiWeather(response, valDataAttr){

    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${valDataAttr}&appid=4317214dc76881a825ab03338bb20f69`) //weather? - now forecast? - 5 day
        .then(response => response.json()) 
        .then(data => getWeatherNow(data, response)) 
        .catch(err => console.error(err))


    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${valDataAttr}&appid=4317214dc76881a825ab03338bb20f69`) //weather? - now forecast? - 5 day
        .then(response => response.json()) 
        .then(data => getWeatherWeek(data, response)) 
        .catch(err => console.error(err))
        
    }


//---------------------------------------------------getWeather

function getWeatherNow(response, conditions) {


    let newCity = city.filter(item => item.cityEN == response.name) 
    
    let getDate = new Date();
    let options = [
        {
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            timezone: 'UTC',
        },
        {
            hour: 'numeric',
            minute: 'numeric',
        },
    ]
    let nowDateDay = getDate.toLocaleString("ru", options[0])
    let nowDateTime = getDate.toLocaleString("ru", options[1])

    document.querySelector('.weather-now .date-day').innerHTML = nowDateDay;
    document.querySelector('.weather-now .date-time').innerHTML = nowDateTime;
    document.querySelector('.weather-now .city').innerHTML = `${newCity[0].cityRU}`;
    document.querySelector('.weather-now .temp').innerHTML = `${Math.round(response.main.temp - 273)}<sup>o</sup>C`;

    let weatherMain = conditions.filter(item => item.key == response.weather[0].main)
    document.querySelector('.weather').innerHTML = weatherMain[0].value;
    if(nowDateTime > '06:00' && nowDateTime < '24:00'){   
            document.querySelector('.img').innerHTML = `<img src='${weatherMain[0].imgDay}'  style='width: 90px; height: 90px;' alt='Icon depicting current weather.'>`
    } else {
        document.querySelector('.img').innerHTML = `<img src='${weatherMain[0].imgNight}'  style='width: 90px; height: 90px;' alt='Icon depicting current weather.'>`
    }
}

function getWeatherWeek(response, conditions) {

    let d = new Date();
    let options = [
        {   
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        },
        {
            hour: 'numeric',
            minute: 'numeric'
        }
    ]

    let wItem = document.querySelectorAll('.weather-week__item');

    let N = 10800

    for(let i = 1; i <= wItem.length; i++){

        d.setSeconds(d.getSeconds() + N);

        let nextDate = d.toLocaleString("ru", options[0])
        let nextTime = d.toLocaleString("ru", options[1])

        document.querySelector(`.weather-week .item${i} .date`).innerHTML = nextDate;
        document.querySelector(`.weather-week .item${i} .time`).innerHTML = nextTime;
        document.querySelector(`.weather-week .item${i} .temp`).innerHTML = Math.round(response.list[1+i].main.temp - 273)

        let weatherMain = conditions.filter(item => item.key == response.list[1+i].weather[0].main)
        document.querySelector(`.weather-week .item${i} .weather`).innerHTML = weatherMain[0].value;

        if(nextTime > '06:00' && nextTime < '24:00'){   
            document.querySelector(`.weather-week .item${i} .img`).innerHTML = `<img src='${weatherMain[0].imgDay}'  style='width: 60px; height: 60px;' alt='Icon depicting current weather.'>`
          
        } else {
            document.querySelector(`.weather-week .item${i} .img`).innerHTML = `<img src='${weatherMain[0].imgNight}'  style='width: 60px; height: 60px;' alt='Icon depicting current weather.'>`

        }
    }

}
}
