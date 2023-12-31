//Selectores

const resultado = document.querySelector("#resultado")
const btnBorrarApiKeys = document.querySelector("#borrarApiKeys")
const toastContainer = document.querySelector("#toastContainer")
const toastMessage = document.querySelector("#toastMessage")

//Variables

let apiKeys = {
    openweather: "",
    mapboxgl: ""
}

let url
let clima
let ubicacionesGuardadas = JSON.parse(localStorage.getItem("climas")) ?? []

//Event listeners

document.addEventListener("DOMContentLoaded", function() {
    obtenerApiKeys()
    iniciarTimer()
    actualizarDatos()
    mostrarHTML(ubicacionesGuardadas)
})

btnBorrarApiKeys.addEventListener("click", borrarApiKeys)

//Funciones

function obtenerApiKeys() {
    if (!localStorage.getItem("apikeys")) {
        apiKeys.openweather = prompt("Introduzca API key de OpenWeather. https://home.openweathermap.org/api_keys")
        apiKeys.mapboxgl = prompt("Introduzca API key de MapBoxGL. https://account.mapbox.com/")
        localStorage.setItem("apikeys", JSON.stringify(apiKeys))
        location.reload()
        return
    }
    apiKeys = JSON.parse(localStorage.getItem("apikeys"))
}

function borrarApiKeys() {
    localStorage.removeItem("apikeys")
    location.reload()
}

function iniciarTimer() {
    setInterval(actualizarDatos, 3600000)
}

function actualizarDatos() {
    ubicacionesGuardadas.forEach((ubicacion) => {
        const horaActual = new Date().getTime()/1000.0
        if ((horaActual-ubicacion.timestamp > 3600)) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${ubicacion.ciudad},${ubicacion.pais}&appid=${apiKeys.openweather}&units=metric`
            enviarRequest(url)
        }
    })
}

function enviarRequest(url) {
    fetch(url)
    .then(data => data.json())
    .then(function(data) {
        if (data.cod === 429) {
            mostrarErrorToast("Openweather API key bloqueada")
            throw new Error(data.message)
        }
        else if (data.cod === 401) {
            mostrarErrorToast("Openweather API key errónea o no activa")
            throw new Error(data.message)
        }
        clima = {
            longitud: data.coord.lon,
            latitud: data.coord.lat,
            ciudad: data.name,
            pais: data.sys.country,
            tiempo: data.weather[0].icon,
            temperatura: Math.round(data.main.temp),
            temperaturaMax: Math.round(data.main.temp_max),
            temperaturaMin: Math.round(data.main.temp_min),
            sensacionTermica: Math.round(data.main.feels_like),
            humedad: data.main.humidity,
            viento: data.wind.speed,
            timestamp: data.dt,
            statusCode: data.cod
        }
    })
    .then(function(){
        modificarDatos(clima)
    })
    .catch(function(e) {
        console.log(e)
    })
}

function modificarDatos(clima) {
    for (let cont = 0; cont < ubicacionesGuardadas.length; cont++) {
        ubicacion = ubicacionesGuardadas[cont]
        if (ubicacion.ciudad === clima.ciudad) {
            ubicacionesGuardadas.splice(cont,1,clima)
        }
    }
    localStorage.setItem("climas", JSON.stringify(ubicacionesGuardadas))
    mostrarHTML(ubicacionesGuardadas)
}

function mostrarHTML(climas) {

    limpiarHTML()

    const cardGroup = document.createElement("div")
    cardGroup.classList.add("flex", "justify-center", "flex-wrap")

    climas.forEach((clima) => {
        const card = document.createElement("div")
        card.classList.add("max-w-sm", "rounded", "overflow-hidden", "shadow-lg", "flex", "flex-col", "m-5", "p-10")
        card.style.backgroundColor = "rgb(142, 206, 228)"

        const ciudadHTML = document.createElement("p")
        ciudadHTML.classList.add("text-3xl", "uppercase", "text-center", "font-bold")
        ciudadHTML.textContent = `${clima.ciudad}`

        const tiempoHTML = document.createElement("img")
        tiempoHTML.classList.add("block", "m-auto")
        tiempoHTML.src = `https://openweathermap.org/img/wn/${clima.tiempo}@2x.png`

        const paisHTML = document.createElement("p")
        paisHTML.classList.add("text-2xl", "mt-2", "text-center", "font-bold")
        paisHTML.textContent = clima.pais

        const tempHTML = document.createElement("p")
        tempHTML.classList.add("text-2xl", "mt-2", "text-center", "font-bold")
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

        const borrarUbicacionHTML = document.createElement("button")
        borrarUbicacionHTML.classList.add("mt-5", "w-full", "bg-yellow-500", "hover:bg-yellow-600", "p-3", "uppercase", "font-bold", "cursor-pointer", "rounded")
        borrarUbicacionHTML.textContent = `Borrar ubicación`
        borrarUbicacionHTML.addEventListener("click", function() {
            borrarUbicacion(clima)
        })

    card.appendChild(ciudadHTML)
    card.appendChild(paisHTML)
    card.appendChild(tiempoHTML)
    card.appendChild(tempHTML)
    card.appendChild(tempMinHTML)
    card.appendChild(tempMaxHTML)
    card.appendChild(sensacionTermicaHTML)
    card.appendChild(humedadHTML)
    card.appendChild(vientoHTML)
    card.appendChild(borrarUbicacionHTML)

    cardGroup.appendChild(card)
    })
    
    resultado.appendChild(cardGroup)
}

function borrarUbicacion(clima) {
    ubicacionesGuardadas = ubicacionesGuardadas.filter((ubicacionGuardada) => (ubicacionGuardada.ciudad !== clima.ciudad || ubicacionGuardada.pais !== clima.pais))
    localStorage.setItem("climas", JSON.stringify(ubicacionesGuardadas))
    mostrarHTML(ubicacionesGuardadas)
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarErrorToast(mensaje) {
    limpiarToast()
    toastContainer.classList.add('bg-red-600')
    toastMessage.textContent = mensaje
    toastContainer.classList.remove("hidden")
}

function limpiarToast() {
    toastContainer.classList.add("hidden")
    toastContainer.classList.remove("bg-red-600", "bg-green-500", "bg-yellow-600")
    toastMessage.textContent = ""
}