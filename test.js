const city = document.querySelector('.citys')

city.addEventListener('change', changeCity)

changeCity()

function changeCity () {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=76dd4e01769a680db800caa975927240`) // куда отправляем запрос
        .then(response => response.json()) // парсим ответ в джейсон
        .then(data => getWeather(data)) // создаем функцию в которую будем принимать ответ
        .catch(err => console.error(err))

    function getWeather(response) {
        document.querySelector('.city').innerHTML = response.name
        document.querySelector('.weather').innerHTML = `в ${response.name} ${Math.round(response.main.temp - 273)} градусов`
        document.querySelector('.img').innerHTML = `<img src='http://openweathermap.org/img/w/${response.weather[0].icon}.png' alt='Icon depicting current weather.'>`
    }
}