document.addEventListener("DOMContentLoaded", mostrarUbicacion)

function mostrarUbicacion() {
    if (localStorage.getItem("url")) {
        JSON.parse(localStorage.getItem("url")).forEach((url) => {
            enviarRequest(url)
        })
    }
}

function enviarRequest(url) {
    fetch(url)
    .then(data => data.json())
    .then(data => mostrarHTML(data.name, data.sys.country, data.weather[0].icon, Math.round(data.main.temp), Math.round(data.main.temp_max), Math.round(data.main.temp_min), Math.round(data.main.feels_like), data.main.humidity, data.wind,data.sys.sunrise, data.sys.sunset, data.timezone))
}

function mostrarHTML(ciudad, pais, tiempo, temp, maxTemp, minTemp, sensacionTermica, humedad, viento, amanecer, atardecer, zonaHoraria) {

    const resultadoColumna1 = document.createElement("div")
    //resultadoColumna1.classList.add("flex-col")

    const resultadoColumna2 = document.createElement("div")
    //resultadoColumna2.classList.add("flex-col")

    const ciudadHTML = document.createElement("p")
    ciudadHTML.classList.add("text-4xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    ciudadHTML.textContent = ciudad

    const paisHTML = document.createElement("p")
    paisHTML.classList.add("text-2xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    paisHTML.textContent = pais

    const tiempoHTML = document.createElement("img")
    //tiempoHTML.classList.add()
    tiempoHTML.src = `https://openweathermap.org/img/wn/${tiempo}@2x.png`

    const tempHTML = document.createElement("p")
    tempHTML.classList.add("text-3xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    tempHTML.textContent = `${temp}ºC`

    const tempMinHTML = document.createElement("p")
    tempMinHTML.classList.add("text-xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    tempMinHTML.textContent = `Min: ${minTemp}ºC`

    const tempMaxHTML = document.createElement("p")
    tempMaxHTML.classList.add("text-xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    tempMaxHTML.textContent = `Max: ${maxTemp}ºC`

    const sensacionTermicaHTML = document.createElement("p")
    sensacionTermicaHTML.classList.add("text-xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    sensacionTermicaHTML.textContent = `Sensación termica: ${sensacionTermica}ºC`

    const humedadHTML = document.createElement("p")
    humedadHTML.classList.add("text-xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    humedadHTML.textContent = `Humedad: ${humedad}%`

    const vientoHTML = document.createElement("p")
    vientoHTML.classList.add("text-xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    vientoHTML.textContent = `Viento: ${viento.speed}m/s`

    resultadoColumna1.appendChild(ciudadHTML)
    resultadoColumna1.appendChild(paisHTML)
    resultadoColumna1.appendChild(tiempoHTML)
    resultadoColumna1.appendChild(tempHTML)
    resultadoColumna2.appendChild(tempMinHTML)
    resultadoColumna2.appendChild(tempMaxHTML)
    resultadoColumna2.appendChild(sensacionTermicaHTML)
    resultadoColumna2.appendChild(humedadHTML)
    resultadoColumna2.appendChild(vientoHTML)

    resultado.appendChild(resultadoColumna1)
    resultado.appendChild(resultadoColumna2)
    resultado.appendChild(vigilarUbicacion)
}