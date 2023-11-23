const resultado = document.querySelector("#resultado")
let ubicacionesGuardadas = JSON.parse(localStorage.getItem("url")) ?? []

document.addEventListener("DOMContentLoaded", mostrarUbicacion)

function mostrarUbicacion() {
    limpiarHTML()
    if (localStorage.getItem("url")) {
        ubicacionesGuardadas.forEach((url) => {
            enviarRequest(url)
            return
        })
    }
}

function enviarRequest(url) {
    fetch(url)
    .then(data => data.json())
    .then(data => mostrarHTML(data.name, data.sys.country, data.weather[0].icon, Math.round(data.main.temp), Math.round(data.main.temp_max), Math.round(data.main.temp_min), Math.round(data.main.feels_like), data.main.humidity, data.wind,data.sys.sunrise, data.sys.sunset, data.timezone))
}

function borrarUbicacion(ciudad, pais) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiKey}&units=metric`
    ubicacionesGuardadas = ubicacionesGuardadas.filter((urlGuardada) => urlGuardada !== url)
    localStorage.setItem("url", JSON.stringify(ubicacionesGuardadas))
    mostrarUbicacion()
}

function mostrarHTML(ciudad, pais, tiempo, temp, maxTemp, minTemp, sensacionTermica, humedad, viento, amanecer, atardecer, zonaHoraria) {

    const ubicacion = document.createElement("div")
    ubicacion.classList.add("border-white")

    const resultadoColumna1 = document.createElement("div")
    resultadoColumna1.classList.add()

    const resultadoColumna2 = document.createElement("div")
    resultadoColumna2.classList.add()

    const ciudadHTML = document.createElement("p")
    ciudadHTML.classList.add("text-4xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    ciudadHTML.textContent = ciudad

    const paisHTML = document.createElement("p")
    paisHTML.classList.add("text-2xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    paisHTML.textContent = pais

    const tiempoHTML = document.createElement("img")
    tiempoHTML.classList.add("block", "m-auto")
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

    const borrarUbicacionHTML = document.createElement("button")
    borrarUbicacionHTML.classList.add("mt-5", "w-full", "bg-yellow-500", "p-3", "uppercase", "font-bold", "cursor-pointer", "rounded")
    borrarUbicacionHTML.textContent = `Borrar ubicación`
    borrarUbicacionHTML.addEventListener("click", function() {
        borrarUbicacion(ciudad, pais)
    })

    resultadoColumna1.appendChild(ciudadHTML)
    resultadoColumna1.appendChild(paisHTML)
    resultadoColumna1.appendChild(tiempoHTML)
    resultadoColumna1.appendChild(tempHTML)
    resultadoColumna2.appendChild(tempMinHTML)
    resultadoColumna2.appendChild(tempMaxHTML)
    resultadoColumna2.appendChild(sensacionTermicaHTML)
    resultadoColumna2.appendChild(humedadHTML)
    resultadoColumna2.appendChild(vientoHTML)

    ubicacion.appendChild(resultadoColumna1)
    ubicacion.appendChild(resultadoColumna2)
    ubicacion.appendChild(borrarUbicacionHTML)

    resultado.appendChild(ubicacion)
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}