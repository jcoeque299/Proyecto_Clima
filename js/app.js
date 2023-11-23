const pais = document.querySelector("#pais")
const ciudad = document.querySelector("#ciudad")
const resultado = document.querySelector("#resultado")
const formulario = document.querySelector("#formulario")
const btnSubmit = document.querySelector("#formulario input[type='submit']")
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    });

    let mapMarker = new mapboxgl.Marker()
let coordenadasMarcadas

let url
let ubicacionesGuardadas = JSON.parse(localStorage.getItem("url")) ?? []

function obtenerCoordenadas(e) {
    mapMarker.remove()
    mapMarker.setLngLat(e.lngLat)
    mapMarker.addTo(map)
    coordenadasMarcadas = {
        lon: e.lngLat.lng,
        lat: e.lngLat.lat
    }
    enviarRequest(event, "coordenadas")
}

map.on("click", obtenerCoordenadas)
formulario.addEventListener("submit", function() {
    enviarRequest(event, "ciudad_pais")
})
ciudad.addEventListener("blur", validarDatos)

function enviarRequest(e, modo) {
    if (modo === "coordenadas") {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordenadasMarcadas.lat}&lon=${coordenadasMarcadas.lon}&appid=${apiKey}&units=metric`
        
    }
    else if (modo === "ciudad_pais") {
        e.preventDefault()
        url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad.value},${pais.value}&appid=${apiKey}&units=metric`
    }
    fetch(url)
    .then(data => data.json())
    .then(data => mostrarHTML(data.name, data.sys.country, data.weather[0].icon, Math.round(data.main.temp), Math.round(data.main.temp_max), Math.round(data.main.temp_min), Math.round(data.main.feels_like), data.main.humidity, data.wind))
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

function mostrarHTML(ciudad, pais, tiempo, temp, maxTemp, minTemp, sensacionTermica, humedad, viento) {
    limpiarHTML()
    limpiarError(formulario)

    const resultadoColumna1 = document.createElement("div")
    resultadoColumna1.classList.add("float-left")

    const resultadoColumna2 = document.createElement("div")
    resultadoColumna2.classList.add("float-right")

    const ciudadHTML = document.createElement("p")
    ciudadHTML.classList.add("text-4xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    ciudadHTML.textContent = ciudad

    const paisHTML = document.createElement("p")
    paisHTML.classList.add("text-2xl", "mt-5", "text-white", "font-bold", "uppercase","text-center")
    paisHTML.textContent = pais

    const tiempoHTML = document.createElement("img")
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

    const vigilarUbicacion = document.createElement("button")
    vigilarUbicacion.classList.add("mt-5", "w-full", "bg-yellow-500", "p-3", "uppercase", "font-bold", "cursor-pointer", "rounded")
    vigilarUbicacion.textContent = `Guardar ubicación`
    vigilarUbicacion.addEventListener("click", function() {
        guardarUbicacion(ciudad, pais)
    })

    resultadoColumna1.appendChild(ciudadHTML)
    resultadoColumna1.appendChild(paisHTML)
    resultadoColumna1.appendChild(tiempoHTML)
    resultadoColumna2.appendChild(tempHTML)
    resultadoColumna2.appendChild(tempMinHTML)
    resultadoColumna2.appendChild(tempMaxHTML)
    resultadoColumna2.appendChild(sensacionTermicaHTML)
    resultadoColumna2.appendChild(humedadHTML)
    resultadoColumna2.appendChild(vientoHTML)

    resultado.appendChild(resultadoColumna1)
    resultado.appendChild(resultadoColumna2)
    resultado.appendChild(vigilarUbicacion)
}

function mostrarOK(referencia, mensaje) {
    limpiarError(referencia)
    const alertaExito = document.createElement('p')
        alertaExito.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-10', 'font-bold', 'text-sm', 'uppercase')
        alertaExito.textContent = mensaje

        referencia.appendChild(alertaExito)

        setTimeout(() => {
            alertaExito.remove()
        }, 3000)
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

function guardarUbicacion(ciudad, pais) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiKey}&units=metric`
    if (!ubicacionesGuardadas.includes(url)) {
        ubicacionesGuardadas = JSON.stringify([...JSON.parse(localStorage.getItem("url")) ?? [], url])
        localStorage.setItem("url", ubicacionesGuardadas)
        mostrarOK(resultado, "Ubicación guardada con éxito")
        return
    }
    mostrarError(resultado, "La ubicación actual ya está guardada")
}
//Funcionalidades nuevas: Mas datos de clima, vigilar clima que añada ciudades a una lista y puedas acceder a una ventana nueva donde ver el clima de las ciudades añadidas, seleccionar ubicacion con un mapa de google maps (usar coordenadas en vez de city y country?) y que se actualice automaticamente cada cierto tiempo que estes dentro de la pagina