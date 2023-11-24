//Selectores

const resultado = document.querySelector("#resultado")

//Variables

let url
let clima
let ubicacionesGuardadas = JSON.parse(localStorage.getItem("url")) ?? []

//Event listeners

document.addEventListener("DOMContentLoaded", function() {
    iniciarTimer()
    actualizarDatos()
    mostrarHTML(ubicacionesGuardadas)
})

//Funciones

function iniciarTimer() {
    setInterval(actualizarDatos, 1800000)
}

function actualizarDatos() {
    ubicacionesGuardadas.forEach((ubicacion) => {
        const horaActual = new Date().getTime()/1000.0
        if ((horaActual-ubicacion.timestamp > 1800)) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${ubicacion.ciudad},${ubicacion.pais}&appid=${apiKey}&units=metric`
            enviarRequest(url)
        }
    })
}

function enviarRequest(url) {
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
    .then(clima => modificarDatos(clima))
}

function modificarDatos(clima) {
    for (let cont = 0; cont < ubicacionesGuardadas.length; cont++) {
        ubicacion = ubicacionesGuardadas[cont]
        if (ubicacion.ciudad === clima.ciudad) {
            console.log(`${ubicacion.ciudad} ${clima.ciudad} Actualizando`)
            ubicacionesGuardadas.splice(cont,1,clima)
        }
    }
    localStorage.setItem("url", JSON.stringify(ubicacionesGuardadas))
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

        const borrarUbicacionHTML = document.createElement("button")
        borrarUbicacionHTML.classList.add("mt-5", "w-full", "bg-yellow-500", "p-3", "uppercase", "font-bold", "cursor-pointer", "rounded")
        borrarUbicacionHTML.textContent = `Borrar ubicación`
        borrarUbicacionHTML.addEventListener("click", function() {
            borrarUbicacion(clima)
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
    card.appendChild(borrarUbicacionHTML)

    cardGroup.appendChild(card)
    })
    
    resultado.appendChild(cardGroup)
}

function borrarUbicacion(clima) {
    ubicacionesGuardadas = ubicacionesGuardadas.filter((ubicacionGuardada) => ubicacionGuardada.ciudad !== clima.ciudad)
    localStorage.setItem("url", JSON.stringify(ubicacionesGuardadas))
    mostrarHTML(ubicacionesGuardadas)
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}