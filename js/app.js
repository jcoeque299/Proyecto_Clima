//Selectores

const fondo = document.querySelector("#bodyContainer")
const pais = document.querySelector("#pais")
const ciudad = document.querySelector("#ciudad")
const resultado = document.querySelector("#resultado")
const formulario = document.querySelector("#formulario")
const btnSubmit = document.querySelector("#formulario input[type='submit']")
const mapContainer = document.querySelector("#mapContainer")
const btnFormulario = document.querySelector("#ciudad_pais")
const btnMapa = document.querySelector("#coordenadas")
const toastContainer = document.querySelector("#toastContainer")
const toastMessage = document.querySelector("#toastMessage")

//Variables

const map = new mapboxgl.Map({
    container: 'map', // ID de mapContainer en el HTML
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-74.5, 40], // Longitud y latitud
    zoom: 2
})

const geolocate = new mapboxgl.GeolocateControl ({
    positionOptions: {
      enableHighAccuracy: true
    },
    fitBoundsOptions: {
      linear: false
    },
    trackUserLocation: false
})

let mapMarker = new mapboxgl.Marker()
let coordenadasMarcadas

let url
let urlImagen
let clima
let ubicacionesGuardadas = JSON.parse(localStorage.getItem("url")) ?? []

//Event listeners

map.on("load", function() {
    geolocate.trigger()
})

map.on("click", obtenerCoordenadas)
formulario.addEventListener("submit", function() {
    enviarRequest(event, "ciudad_pais")
})

map.addControl(geolocate)

geolocate.on("geolocate", function(e) {
    e = {
        lngLat: {
            lng: e.coords.longitude,
            lat: e.coords.latitude
        }
    }
    obtenerCoordenadas(e)
    mostrarOKToast("Ubicación encontrada con éxito")
})
geolocate._updateCamera = () => {} //Evita que la camara del mapa se mueva automáticamente al geolocalizar al usuario, lo cual provocaba problemas de rendimiento graves
geolocate._onError = () => {
    mostrarErrorToast("Geolocalizacion no disponible")
}

ciudad.addEventListener("input", validarDatos)
btnFormulario.addEventListener("click",alternarForm)
btnMapa.addEventListener("click",alternarMapa)

//Funciones

function validarDatos(e) {
    if (e.target.value === "") {
        mostrarErrorForm(e.target.parentElement, `El campo ${e.target.id} es obligatorio`)
        desactivarBoton()
    }
    else {
        limpiarErrorForm(e.target.parentElement)
        activarBoton()
    }
}

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
        timestamp: data.dt
    })
    .then(function() {
        mostrarHTML(clima)
        obtenerEnlaceImagenUbicacion(clima)
    })
    .catch(function() {
        mostrarErrorForm(formulario, "Ubicación no encontrada")
    })
}

function obtenerEnlaceImagenUbicacion(clima) {
    url = `https://api.teleport.org/api/locations/${clima.latitud}%2C${clima.longitud}/`
    fetch(url)
    .then(data => data.json())
    .then(data => url = `${data._embedded["location:nearest-urban-areas"][0]._links["location:nearest-urban-area"].href}images`)
    .then(function() {
        obtenerImagenUbicacion(url)
    })
}

function obtenerImagenUbicacion(urlImagen) {
    fetch(urlImagen)
    .then(data => data.json())
    .then(data => urlImagen = data.photos[0].image.web)
    .then(function() {
        cambiarFondo(urlImagen)
    })
}

function cambiarFondo(urlImagen) {
    fondo.style.backgroundImage = `url("${urlImagen}")`
    fondo.style.backgroundSize = "cover"
}

function mostrarHTML(clima) {
    limpiarHTML()
    limpiarErrorForm(formulario)

    const card = document.createElement("div")
    card.classList.add("max-w-sm", "rounded", "overflow-hidden", "shadow-lg", "mr-auto", "p-8")
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
    guardarUbicacionHTML.classList.add("mt-5", "w-full", "bg-yellow-500", "hover:bg-yellow-600", "p-3", "uppercase", "font-bold", "cursor-pointer", "rounded")
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

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function guardarUbicacion(clima) {
    if (clima.ciudad === "" || clima.pais === "" || !clima.ciudad || !clima.pais) {
        mostrarErrorToast("No se puede guardar una ubicacion indeterminada")
    }
    else if (!ubicacionesGuardadas.some((ubicacion) => {
        return ubicacion.ciudad === clima.ciudad
    })) {
        ubicacionesGuardadas = [...ubicacionesGuardadas, clima]
        localStorage.setItem("url", JSON.stringify(ubicacionesGuardadas))
        mostrarOKToast("Ubicación guardada con éxito")
    }
    else {
        mostrarErrorToast("La ubicación actual ya está guardada")
    }
}

function mostrarOKToast(mensaje) {
    limpiarToast()
    toastContainer.classList.add('bg-green-500')
    toastMessage.textContent = mensaje
    toastContainer.classList.remove("hidden")

    setTimeout(() => {
        limpiarToast()
    }, 6000)
}

function mostrarErrorToast(mensaje) {
    limpiarToast()
    toastContainer.classList.add('bg-red-600')
    toastMessage.textContent = mensaje
    toastContainer.classList.remove("hidden")

    setTimeout(() => {
        limpiarToast()
    }, 6000)
}

function limpiarToast() {
    toastContainer.classList.add("hidden")
    toastContainer.classList.remove("bg-red-600", "bg-green-500")
    toastMessage.textContent = ""
}

function mostrarErrorForm(referencia, mensaje) {
    limpiarErrorForm(referencia)
    const errorHTML = document.createElement("p")
    errorHTML.classList.add("bg-red-600", "p-2", "text-center", "font-bold")
    errorHTML.textContent = mensaje
    referencia.appendChild(errorHTML)
}

function limpiarErrorForm(referencia) {
    const errorHTML = referencia.querySelector(".bg-red-600")
    if (errorHTML) {
        errorHTML.remove()
    }
}

function desactivarBoton() {
    btnSubmit.classList.add("opacity-50")
    btnSubmit.classList.remove("hover:bg-yellow-600")
    btnSubmit.disabled = true
}

function activarBoton() {
    btnSubmit.classList.remove("opacity-50")
    btnSubmit.classList.add("hover:bg-yellow-600")
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