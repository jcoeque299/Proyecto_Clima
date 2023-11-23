## Importante

Antes tenia las api key dentro del propio archivo js de la aplicación, pero github me dio una advertencia de que no era seguro, por lo que he movido los token a un archivo aparte que no está subido al repositorio, por lo que para probar el código del repositorio hay que crear un archivo "apiKey.js" con el siguiente contenido:

```
const apiKey = $tuApiKeyOpenweather
mapboxgl.accessToken = $tuApiKeyMapboxGL
```

La primera key es de OpenWeather, necesaria para extraer la información del clima de una zona. La segunda key, es para poder utilizar la funcionalidad del mapa