const pais = document.querySelector("#pais")
const ciudad = document.querySelector("#ciudad")
const resultado = document.querySelector("#resultado")
const formulario = document.querySelector("#formulario")
const btnSubmit = document.querySelector("#formulario input[type='submit']")

formulario.addEventListener("submit",enviarRequest)
ciudad.addEventListener("blur", validarDatos)

function enviarRequest(e) {
    e.preventDefault()
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad.value},${pais.value}&appid=${apiKey}`
    fetch(url)
    .then(data => data.json())
    .then(data => mostrarHTML(Math.round(data.main.temp-273.15), Math.round(data.main.temp_max-273.15), Math.round(data.main.temp_min-273.15)))
    .catch(function() {
        mostrarError(formulario, "Ubicación no encontrada")
    })
}

function validarDatos(e) {
    if (e.target.value === "") {
        mostrarError(e.target.parentElement, `El campo ${e.target.id} es obligatorio`)
        desactivarBoton()
    }
    else {
        limpiarError(e.target.parentElement)
        activarBoton()
    }
}

function mostrarHTML(temp, maxTemp, minTemp) {
    limpiarHTML()
    limpiarError(formulario)
    const ciudadHTML = document.createElement("p")
    ciudadHTML.classList.add("text-4xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    ciudadHTML.textContent = ciudad.value
    const paisHTML = document.createElement("p")
    paisHTML.classList.add("text-2xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    paisHTML.textContent = pais.value
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
    resultado.appendChild(paisHTML)
    resultado.appendChild(tempHTML)
    resultado.appendChild(tempMinHTML)
    resultado.appendChild(tempMaxHTML)
}

function mostrarError(referencia, mensaje) {
    limpiarError(referencia)
    const errorHTML = document.createElement("p")
    errorHTML.classList.add("bg-red-600", "p-2", "text-center", "text-white")
    errorHTML.textContent = mensaje
    referencia.appendChild(errorHTML)
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function limpiarError(referencia) {
    const errorHTML = referencia.querySelector(".bg-red-600")
    if (errorHTML) {
        errorHTML.remove()
    }
}

function desactivarBoton() {
    btnSubmit.classList.add("opacity-50")
    btnSubmit.disabled = true
}

function activarBoton() {
    btnSubmit.classList.remove("opacity-50")
    btnSubmit.disabled = false
}