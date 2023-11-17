const pais = document.querySelector("#pais")
const ciudad = document.querySelector("#ciudad")
const resultado = document.querySelector("#resultado")
const formulario = document.querySelector("#formulario")

formulario.addEventListener("submit",sendRequest)

function sendRequest(e) {
    e.preventDefault()
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad.value},${pais.value}&appid=${apiKey}`
    fetch(url)
    .then(data => data.json())
    .then(data => mostrarHTML(Math.round(data.main.temp-273.15), Math.round(data.main.temp_max-273.15), Math.round(data.main.temp_min-273.15)))
}

function mostrarHTML(temp, maxTemp, minTemp) {
    limpiarHTML()
    const ciudadHTML = document.createElement("p")
    ciudadHTML.classList.add("text-4xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    ciudadHTML.textContent = ciudad.value
    const tempHTML = document.createElement("p")
    tempHTML.classList.add("text-3xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    tempHTML.textContent = `${temp}ºC`
    const tempMaxHTML = document.createElement("p")
    tempMaxHTML.classList.add("text-xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    tempMaxHTML.textContent = `Max: ${maxTemp}ºC`
    const tempMinHTML = document.createElement("p")
    tempMinHTML.classList.add("text-xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    tempMinHTML.textContent = `Min: ${minTemp}ºC`
    resultado.appendChild(ciudadHTML)
    resultado.appendChild(tempHTML)
    resultado.appendChild(tempMinHTML)
    resultado.appendChild(tempMaxHTML)
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}