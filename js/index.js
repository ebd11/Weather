// today main
const local = document.querySelector('.location')
const country  = document.querySelector('.country')
const conditions = document.querySelector('.conditions')
const temp = document.querySelector('.degrees')
const condtionsIcon = document.querySelector('.conditions-icon')
const lastUpdate = document.querySelector('.last-update')
const convertDegrees = document.querySelector('#convert')
// today supplemental
const currentTime = document.querySelector('.current-time')
const feelsLike = document.querySelector('.feels-like')
const humidity = document.querySelector('.humidity')
const windDirMph = document.querySelector('.wind-dir-mph')
const windGust = document.querySelector('.wind-gust-mph')

const inputField = document.querySelector('#entry')
const submitBtn = document.querySelector('#submit-entry')

// today forecast
const hourBlocks = document.querySelectorAll('.hour')
const hourConditions = document.querySelectorAll('.time-condition')
const hourTime = document.querySelectorAll('.day-hour')
const hourDegrees = document.querySelectorAll('.time-degrees')
const dayConditionImgs = document.querySelectorAll('.day-cond-img')
const hourHumidity = document.querySelectorAll('.time-humidity')
const hourWinds = document.querySelectorAll('.time-wind')

let cityOrZip
let fahrenheitToCelsius = false

getCurrentWeather()

submitBtn.addEventListener('click', submissionHandler)
inputField.addEventListener('keydown', submissionHandler)
convertDegrees.addEventListener('click', () => {
    if (fahrenheitToCelsius) {
        fahrenheitToCelsius = false
        convertDegrees.textContent = `Convert from \u00B0F to \u00B0C`
    } else {
        fahrenheitToCelsius = true
        convertDegrees.textContent = `Convert from \u00B0C to \u00B0F`
    }

    getCurrentWeather()
})

 async function getCurrentWeather() {
    try {
        const weather = await fetch(`http://api.weatherapi.com/v1/current.json?key=76630cc086f34dada4b25617231408&q=${cityOrZip || 'auto:ip'}`)

        const weatherData = await weather.json()

        // main
        local.textContent = weatherData.location.region === '' ? `${weatherData.location.name}` : `${weatherData.location.name}, ${weatherData.location.region}`
        country.textContent = weatherData.location.country
        conditions.textContent = weatherData.current.condition.text
        lastUpdate.textContent = `Last updated at ${weatherData.current.last_updated.split(' ')[1]}`
        temp.textContent = fahrenheitToCelsius ? `${weatherData.current.temp_c}\u00B0C` : `${weatherData.current.temp_f}\u00B0F`
        condtionsIcon.src = weatherData.current.condition.icon

        // supplemental
        currentTime.textContent += ` ${new Date().toLocaleTimeString()}`
        setInterval(() => {
            currentTime.textContent = ` ${new Date().toLocaleTimeString()}`
        }, 1000)
        feelsLike.textContent = fahrenheitToCelsius ? ` ${weatherData.current.feelslike_c}\u00B0C` : ` ${weatherData.current.feelslike_f}\u00B0F`
        humidity.textContent = ` ${weatherData.current.humidity}%`
        windDirMph.textContent = ` ${weatherData.current.wind_mph}mph ${weatherData.current.wind_degree}\u00B0 ${weatherData.current.wind_dir}`
        windGust.textContent = ` ${weatherData.current.gust_mph}mph`

        getDayForecast()
    } catch(err) {
        alert('Current weather: Could not find this city or zip code.')
        throw new Error(err)
    }
}

async function getDayForecast() {
 try {
    const forecast = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=76630cc086f34dada4b25617231408&q=${cityOrZip || 'auto:ip'}`)

    const forecastData = await forecast.json()

    const hourObjects = forecastData.forecast.forecastday[0].hour

    const conditionsArr = []
    const timesArr = []
    const degreesFahArr = []
    const degreesCelArr = []
    const iconsArr = []
    const humidityArr = []
    const windArr = []

    hourObjects.forEach(obj => {
        conditionsArr.push(obj.condition.text)
        timesArr.push(obj.time.split(' ')[1])
        degreesFahArr.push(obj.temp_f)
        degreesCelArr.push(obj.temp_c)
        iconsArr.push(obj.condition.icon)
        humidityArr.push(obj.humidity)
        windArr.push(` ${obj.wind_mph}mph ${obj.wind_degree}\u00B0 ${obj.wind_dir}`)
    })

    hourConditions.forEach((cond, i) => {
        cond.textContent = conditionsArr[i]
    })
    hourTime.forEach((hour, i) => {
        hour.textContent = timesArr[i]
    })
    hourDegrees.forEach((degree, i) => {
        fahrenheitToCelsius ? degree.textContent = `${degreesCelArr[i]}\u00B0C` : degree.textContent = `${degreesFahArr[i]}\u00B0F`
    })
    dayConditionImgs.forEach((img, i) => {
        img.src = iconsArr[i]
    })
    hourHumidity.forEach((humid, i) => {
        humid.textContent = `Humidity: ${humidityArr[i]}%`
    })
    hourWinds.forEach((wind, i) => {
        wind.textContent = `Wind: ${windArr[i]}`
    })
 } catch(err) {
     alert('Day forecast: Could not find this city or zip code.')
    throw new Error(err)
 }

}

function submissionHandler(e) {
    if (e.keyCode === 13 || e.target.parentElement.getAttribute('id') === 'submit-entry') {
        if (inputField.value === '') {
            alert('Please enter a valid zip code or city name.')
            return
        }
        cityOrZip = inputField.value
        inputField.value = ''
        getCurrentWeather()
        getDayForecast()
    }
}