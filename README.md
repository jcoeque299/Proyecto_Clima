## Importante

Antes tenia la api key dentro del propio archivo js de la aplicación, pero github me dio una advertencia de que no era seguro, por lo que he movido el token a un archivo aparte que no está subido al repositorio, por lo que para probar el código del repositorio hay que crear un archivo "apiKey.js" con el siguiente contenido:

```
const apiKey = $TUAPIKEY
```