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
        apiWeatherNow(myCity)
}

//---------------------------------------------------------------------getCity



fetch('./city.json') 
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

            apiWeatherNow(valDataAttr) // ---------------------------------------------------callApiWeather
   
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

//--------------------------------------------------------ApiWeather

function apiWeatherNow(valDataAttr) {
    
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${valDataAttr}&appid=4317214dc76881a825ab03338bb20f69`) //weather? - now forecast? - 5 day
            .then(response => response.json()) 
            .then(data => getWeatherNow(data)) 
            .catch(err => console.error(err))


        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${valDataAttr}&appid=4317214dc76881a825ab03338bb20f69`) //weather? - now forecast? - 5 day
            .then(response => response.json()) 
            .then(data => getWeatherWeek(data)) 
            .catch(err => console.error(err))
}

//---------------------------------------------------getWeather

function getWeatherNow(response) {


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

    //-----------------------------------NOW----------------------------------------//
    document.querySelector('.weather-now .date-day').innerHTML = nowDateDay;
    document.querySelector('.weather-now .date-time').innerHTML = nowDateTime;
    document.querySelector('.weather-now .city').innerHTML = `${newCity[0].cityRU}`;
    document.querySelector('.weather-now .temp').innerHTML = `${Math.round(response.main.temp - 273)}<sup>o</sup>C`;
    //---------------------------------+1-----------------------------------------//

    weatherСonditions(response)
}

function getWeatherWeek(response) {

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
    d.setSeconds(d.getSeconds() + 10800);
    let nextDate = d.toLocaleString("ru", options[0])
    let nextTime = d.toLocaleString("ru", options[1])

    d.setSeconds(d.getSeconds() + 10800);
    let nextDate2 = d.toLocaleString("ru", options[0])
    let nextTime2 = d.toLocaleString("ru", options[1])

    d.setSeconds(d.getSeconds() + 10800);
    let nextDate3 = d.toLocaleString("ru", options[0])
    let nextTime3 = d.toLocaleString("ru", options[1])

    d.setSeconds(d.getSeconds() + 10800);
    let nextDate4 = d.toLocaleString("ru", options[0])
    let nextTime4 = d.toLocaleString("ru", options[1])

    document.querySelector('.weather-week .item1 .date').innerHTML = nextDate;
    document.querySelector('.weather-week .item1 .time').innerHTML = nextTime
    document.querySelector('.weather-week .item1 .temp').innerHTML = Math.round(response.list[2].main.temp - 273)
    let weatherMain1 = conditions.filter(item => item.key == response.list[2].weather[0].main)
    document.querySelector('.weather-week .item1 .weather').innerHTML = weatherMain1[0].value;

    //---------------------------------+2-----------------------------------------//
    document.querySelector('.weather-week .item2 .date').innerHTML = nextDate2;
    document.querySelector('.weather-week .item2 .time').innerHTML = nextTime2
    document.querySelector('.weather-week .item2 .temp').innerHTML = Math.round(response.list[3].main.temp - 273)
    let weatherMain2 = conditions.filter(item => item.key == response.list[2].weather[0].main)
    document.querySelector('.weather-week .item2  .weather').innerHTML = weatherMain2[0].value;

    //---------------------------------+3-----------------------------------------//
    document.querySelector('.weather-week .item3 .date').innerHTML = nextDate3;
    document.querySelector('.weather-week .item3 .time').innerHTML = nextTime3
    document.querySelector('.weather-week .item3 .temp').innerHTML = Math.round(response.list[4].main.temp - 273)
    let weatherMain3 = conditions.filter(item => item.key == response.list[2].weather[0].main)
    document.querySelector('.weather-week .item3 .weather').innerHTML = weatherMain3[0].value;

    //---------------------------------+4-----------------------------------------//
    document.querySelector('.weather-week .item4 .date').innerHTML = nextDate4;
    document.querySelector('.weather-week .item4 .time').innerHTML = nextTime4
    document.querySelector('.weather-week .item4 .temp').innerHTML = Math.round(response.list[5].main.temp - 273)
    let weatherMain4 = conditions.filter(item => item.key == response.list[2].weather[0].main)
    document.querySelector('.weather-week .item4 .weather').innerHTML = weatherMain4[0].value;



    if(nextTime > '06:00' && nextTime < '24:00'){   
        document.querySelector('.weather-week .item1 .img').innerHTML = `<img src='${weatherMain1[0].imgDay}'  style='width: 60px; height: 60px;' alt='Icon depicting current weather.'>`
      
    } else {
        document.querySelector('.weather-week .item1 .img').innerHTML = `<img src='${weatherMain1[0].imgNight}'  style='width: 60px; height: 60px;' alt='Icon depicting current weather.'>`
    }
    if(nextTime2 > '06:00' && nextTime2 < '24:00'){   
        document.querySelector('.weather-week .item2 .img').innerHTML = `<img src='${weatherMain2[0].imgDay}'  style='width: 60px; height: 60px;' alt='Icon depicting current weather.'>`
    } else {
        document.querySelector('.weather-week .item2 .img').innerHTML = `<img src='${weatherMain2[0].imgNight}'  style='width: 60px; height: 60px;' alt='Icon depicting current weather.'>`
    }
    if(nextTime3 > '06:00' && nextTime3 < '24:00'){   
        document.querySelector('.weather-week .item3 .img').innerHTML = `<img src='${weatherMain3[0].imgDay}'  style='width: 60px; height: 60px;' alt='Icon depicting current weather.'>`
    } else {
        document.querySelector('.weather-week .item3 .img').innerHTML = `<img src='${weatherMain3[0].imgNight}'  style='width: 60px; height: 60px;' alt='Icon depicting current weather.'>`
    }
    if(nextTime4 > '06:00' && nextTime4 < '24:00'){   
        document.querySelector('.weather-week .item4 .img').innerHTML = `<img src='${weatherMain4[0].imgDay}'  style='width: 60px; height: 60px;' alt='Icon depicting current weather.'>`
    } else {
        document.querySelector('.weather-week .item4 .img').innerHTML = `<img src='${weatherMain4[0].imgNight}'  style='width: 60px; height: 60px;' alt='Icon depicting current weather.'>`
    }

}




function weatherСonditions(response,nowDateTime) {

    
    let weatherMain = conditions.filter(item => item.key == response.weather[0].main)
    document.querySelector('.weather').innerHTML = weatherMain[0].value;
    if(nowDateTime > '06:00' && nowDateTime < '24:00'){   
            document.querySelector('.img').innerHTML = `<img src='${weatherMain[0].imgDay}'  style='width: 90px; height: 90px;' alt='Icon depicting current weather.'>`
    } else {
        document.querySelector('.img').innerHTML = `<img src='${weatherMain[0].imgNight}'  style='width: 90px; height: 90px;' alt='Icon depicting current weather.'>`
    }

}




let conditions = [
    {
        key : 'Clear sky',
        value: 'Чистое небо',
        imgDay: 'img/clearSkyNight.png',
        imgNight: 'img/clearSkyDay.png'
    },
    {
        key: 'Clear',
        value: 'Чистое небо',
        imgDay: 'img/clearSkyDay.png',
        imgNight: 'img/clearSkyNight.png'
    },
    {
        key: 'Clouds',
        value: 'Облачно',
        imgDay: 'img/cloudsDayNight.png',
        imgNight: 'img/cloudsDayNight.png'
    },
    {
        key: 'Few clouds',
        value: 'Облачно с прояснениями',
        imgDay: 'img/smallCloudsDay.png',
        imgNight: 'img/smallCloudsNight.png'
    },
    {
        key: 'Scattered clouds',
        value: 'Малооблачно',
        imgDay: 'img/smallCloudsDay.png',
        imgNight: 'img/smallCloudsNight.png'
    },
    {
        key: 'Shower rain',
        value: 'Ливень',
        imgDay: 'img/showerRain.png',
        imgNight: 'img/showerRain.png'
    },
    {
        key: 'Rain',
        value: 'Дождь',
        imgDay: 'img/rainDay.png',
        imgNight: 'img/rainNight.png'
    },
    {
        key: 'Thunderstorm',
        value: 'Ливень с грозой',
        imgDay: 'img/thunderstorm.png',
        imgNight: 'img/thunderstorm.png'
    },
    {
        key: 'Snow',
        value: 'Снег',
        imgDay: 'img/snowDay.png',
        imgNight: 'img/snowNight.png'
    },
    {
        key: 'Mist',
        value: 'Туман',
        imgDay: 'img/mistDayNight.png',
        imgNight: 'img/mistDayNight.png'
    },
    {
        key: 'Drizzle',
        value: 'Морось',
        imgDay: 'img/drizzle.png',
        imgNight: 'img/drizzle.png'
    },
    {
        key: 'Smoke',
        value: 'Дым',
        value: 'Морось',
        imgDay: 'img/smoke.png',
        imgNight: 'img/smoke.png'
    },
    {
        key: 'Haze',
        value: 'Легкий туман',
        imgDay: 'img/hazeDay.png',
        imgNight: 'img/hazeNight.png'
    },
    {
        key: 'Dust',
        value: 'Пыль',
        imgDay: 'img/sand.png',
        imgNight: 'img/sand.png'
    },
    {
        key: 'Fog',
        value: 'Туман',
        imgDay: 'img/mistDayNight.png',
        imgNight: 'img/mistDayNight.png'
    },
    {
        key: 'Sand',
        value: 'Песок',
        imgDay: 'img/sand.png',
        imgNight: 'img/sand.png'
    },
    {
        key: 'Squall',
        value: 'Шквал',
        imgDay: 'img/squallDay.png',
        imgNight: 'img/squallDaypng'
    },
    {
        key: 'Ash',
        value: 'Пепел',
        imgDay: 'img/sand.png',
        imgNight: 'img/sand.png'
    },
    {
        key: 'Tornado',
        value: 'Торнадо',
        imgDay: 'img/smoke.png',
        imgNight: 'img/smoke.png'
    },

]

}

// function apiWeatherWeek(){
//     fetch('https://api.openweathermap.org/data/2.5/forecast?q=London&appid=4317214dc76881a825ab03338bb20f69')
//         .then(response => response)
//         .then(data => getWeatherWeek(data))


//     function getWeatherWeek(response){
//         console.log(response)
//     }
// }

// dropdown.classList.add('open');
// inputField.focus(); // focus input
// let valueArray = [];




// dropdownArray.forEach(item => {
//   valueArray.push(item.textContent);
// });


// const closeDropdown = () => {
//   dropdown.classList.remove('open');
// }



// document.addEventListener('click', (evt) => {
//   const isDropdown = dropdown.contains(evt.target);
//   const isInput = inputField.contains(evt.target);
//   if (!isDropdown && !isInput) {
//     dropdown.classList.remove('open');
//   }
// });



// inputField.addEventListener('change', changeCommand)

// function changeCommand () {
//     console.log(this.value)
// }