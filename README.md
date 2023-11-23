# Proyecto de mejora DWEC

## Descripción

Mi entrega del proyecto consiste en una mejora de la página web hecha en clase que muestra el clima de una ubicación. Los cambios realizados son los siguientes:

+ **Cambios en la estructura visual**: El HTML y el CSS originales daban problemas a la hora de crear una interfaz ordenada para el usuario, por lo que se ha cambiado el HTML y el CSS de la página para mejorar la experiencia de usuario
+ **Mayor cantidad de datos**: Se han añadido nuevos datos a consultar de la ubicación que se elija, como por ejemplo, el tiempo atmosférico, viento, humedad, etc...
+ **Integración de mapa interactivo**: Además de poder introducir la ubicación a consultar mediante un formulario, es posible activar un mapa para hacer consultas haciendo click en cualquier parte del mismo
+ **Guardado de ubicaciones**: Si hay una ubicación que quieras consultar de forma contínua, puedes guardarla para visualizarla rapidamente desde una página aparte. Esta página actualizará los datos automáticamente cada media hora, por lo que es posible dejarla abierta para consultarla cada cierto tiempo, sin necesidad de interacción adicional

## Importante

Esta aplicación necesita dos tokens distintos, uno para la api de OpenWeather, y otro para la api de MapboxGL. Si visitas la página desde el enlace proporcionado, no será necesario hacer nada para poder interactuar con la página. Sin embargo, si decides lanzar esta página en local, deberás crear un archivo en el directorio **"js"**, cuyo nombre sea **"apiKey.js"**, y deberá tener el siguiente contenido:

```
const apiKey = $tuApiKeyOpenweather
mapboxgl.accessToken = $tuApiKeyMapboxGL
```