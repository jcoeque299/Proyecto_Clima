# Proyecto de mejora DWEC

## Descripción

Mi entrega del proyecto consiste en una mejora de la página web hecha en clase que muestra el clima de una ubicación. Los cambios realizados son los siguientes:

+ **Mayor cantidad de datos**: Se han añadido nuevos datos a consultar de la ubicación que se elija, como por ejemplo, el tiempo atmosférico, viento, humedad, etc...
+ **Cambios en la estructura visual**: El HTML y el CSS originales daban problemas a la hora de mostrar una mayor cantidad de datos, por lo que ha sido cambiado intentando mantener una buena experiencia de usuario
+ **Integración de mapa interactivo**: Además de poder introducir la ubicación a consultar mediante un formulario, es posible activar un mapa para hacer consultas haciendo click en cualquier parte del mismo
+ **Guardado de ubicaciones**: Si hay una ubicación que quieras consultar de forma contínua, puedes guardarla para visualizarla rapidamente desde una página aparte. Esta página actualizará los datos automáticamente cada hora, por lo que es posible dejarla abierta para consultarla cada cierto tiempo, sin necesidad de interacción adicional
+ **Geolocalizacion**: La página intentará localizar automáticamente al usuario al iniciar la página. Si la geolocalización es exitosa, se mostrará automáticamente el clima de la ubicación del usuario
+ **Imágenes de las ubicaciones**: Al consultar una ubicación, se cambiará el fondo de la página por una imagen del lugar elegido. Hay algunas ubicaciones con las que esta funcionalidad no está disponible. En ese caso, el fondo volverá al predeterminado

## Importante

Esta aplicación necesita dos tokens distintos, uno para la api de OpenWeather, y otro para la api de MapboxGL. Si decides utilizar esta página, la primera vez que la uses, saldran dos ventanas emergentes pidiéndote ambos tokens. Una vez los introduzcas, no deberá ser necesario volver a introducirlos para seguir usando la página, ya que se almacenarán en el almacenamiento local del navegador

En la entrega del proyecto estarán mis tokens, solamente se deberán introducir en las ventanas emergentes

## Recursos externos

Para esta tarea se han utilizado fragmentos de código de tailwind CSS ya creados, los cuales han sido modificados posteriormente. Los componentes utilizados y las páginas de donde provienen son:

+ **NavBars**: https://flowbite.com/docs/components/navbar/
+ **Toasts**: https://flowbite.com/docs/components/toast/
+ **Cards**: https://flowbite.com/docs/components/card/

Adicionalmente, se han utilizado tres APIs:

+ **OpenWeather**: https://openweathermap.org/
+ **MapBoxGL**: https://www.mapbox.com/mapbox-gljs. Además del uso de la API en sí, se han utilizado fragmentos de código js de la documentación de la API para el uso del mapa
+ **Teleport API**: https://developers.teleport.org/api/reference/