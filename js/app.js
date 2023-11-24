//Selectores

const pais = document.querySelector("#pais")
const ciudad = document.querySelector("#ciudad")
const resultado = document.querySelector("#resultado")
const formulario = document.querySelector("#formulario")
const btnSubmit = document.querySelector("#formulario input[type='submit']")
const mapContainer = document.querySelector("#mapContainer")
const btnFormulario = document.querySelector("#ciudad_pais")
const btnMapa = document.querySelector("#coordenadas")

//Variables

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 2, // starting zoom
    });

let mapMarker = new mapboxgl.Marker()
let coordenadasMarcadas

let url
let clima
let ubicacionesGuardadas = JSON.parse(localStorage.getItem("url")) ?? []

//Event listeners

map.on("click", obtenerCoordenadas)
formulario.addEventListener("submit", function() {
    enviarRequest(event, "ciudad_pais")
})
ciudad.addEventListener("blur", validarDatos)
btnFormulario.addEventListener("click",alternarForm)
btnMapa.addEventListener("click",alternarMapa)

//Funciones

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
    .then(data => clima = {
        ciudad: data.name,
        pais: data.sys.country,
        tiempo: data.weather[0].icon,
        temperatura: Math.round(data.main.temp),
        temperaturaMax: Math.round(data.main.temp_max),
        temperaturaMin: Math.round(data.main.temp_min),
        sensacionTermica: Math.round(data.main.feels_like),
        humedad: data.main.humidity,
        viento: data.wind.speed,
        timestamp: data.dt
    })
    .then(function() {
        mostrarHTML(clima)
    })
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

function mostrarHTML(clima) {
    limpiarHTML()
    limpiarError(formulario)

    const card = document.createElement("div")
    card.classList.add("max-w-sm", "rounded", "overflow-hidden", "shadow-lg", "mx-auto", "p-10")
    card.style.backgroundColor = "rgb(142, 206, 228)"

    const cardTitle = document.createElement("p")
    cardTitle.classList.add("text-3xl", "uppercase", "text-center", "font-bold")
    cardTitle.textContent = `${clima.ciudad}`

    const tiempoHTML = document.createElement("img")
    tiempoHTML.classList.add("block", "m-auto")
    tiempoHTML.src = `https://openweathermap.org/img/wn/${clima.tiempo}@2x.png`

    const ciudadHTML = document.createElement("p")
    ciudadHTML.classList.add("text-xl", "mt-2", "text-center")
    ciudadHTML.textContent = clima.ciudad

    const paisHTML = document.createElement("p")
    paisHTML.classList.add("text-xl", "mt-2", "text-center")
    paisHTML.textContent = clima.pais

    const tempHTML = document.createElement("p")
    tempHTML.classList.add("text-xl", "mt-2", "text-center")
    tempHTML.textContent = `${clima.temperatura}ºC`

    const tempMinHTML = document.createElement("p")
    tempMinHTML.classList.add("text-xl", "mt-2", "text-center")
    tempMinHTML.textContent = `Min: ${clima.temperaturaMin}ºC`

    const tempMaxHTML = document.createElement("p")
    tempMaxHTML.classList.add("text-xl", "mt-2", "text-center")
    tempMaxHTML.textContent = `Max: ${clima.temperaturaMax}ºC`

    const sensacionTermicaHTML = document.createElement("p")
    sensacionTermicaHTML.classList.add("text-xl", "mt-2", "text-center")
    sensacionTermicaHTML.textContent = `Sensación termica: ${clima.sensacionTermica}ºC`

    const humedadHTML = document.createElement("p")
    humedadHTML.classList.add("text-xl", "mt-2", "text-center")
    humedadHTML.textContent = `Humedad: ${clima.humedad}%`

    const vientoHTML = document.createElement("p")
    vientoHTML.classList.add("text-xl", "mt-2", "text-center")
    vientoHTML.textContent = `Viento: ${clima.viento}m/s`

    const guardarUbicacionHTML = document.createElement("button")
    guardarUbicacionHTML.classList.add("mt-5", "w-full", "bg-yellow-500", "p-3", "uppercase", "font-bold", "cursor-pointer", "rounded")
    guardarUbicacionHTML.textContent = `Guardar ubicación`
    guardarUbicacionHTML.addEventListener("click", function() {
        guardarUbicacion(clima)
    })

    card.appendChild(cardTitle)
    card.appendChild(tiempoHTML)
    card.appendChild(tiempoHTML)
    card.appendChild(tempHTML)
    card.appendChild(tempMinHTML)
    card.appendChild(tempMaxHTML)
    card.appendChild(sensacionTermicaHTML)
    card.appendChild(humedadHTML)
    card.appendChild(vientoHTML)
    card.appendChild(guardarUbicacionHTML)

    resultado.appendChild(card)
}

function guardarUbicacion(clima) {
    if (!ubicacionesGuardadas.includes(clima.ciudad)) {
        ubicacionesGuardadas = JSON.stringify([...JSON.parse(localStorage.getItem("url")) ?? [], clima])
        localStorage.setItem("url", ubicacionesGuardadas)
        mostrarOK(resultado, "Ubicación guardada con éxito")
        return
    }
    mostrarError(resultado, "La ubicación actual ya está guardada")
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

function alternarForm() {
    formulario.classList.remove("hidden")
    mapContainer.classList.add("hidden")
}

function alternarMapa() {
    mapContainer.classList.remove("hidden")
    formulario.classList.add("hidden")
}