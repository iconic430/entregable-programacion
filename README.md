# Entregable - Programación

- **proyecto primera materia.html**: página "Sabores de México" hecha con Bootstrap 5 (navbar, carrusel, modal, nav/tabs, offcanvas, formulario de calificación y pedidos a domicilio).
- **responsivo.html**: ejercicio de `container` / `container-fluid` y media queries que cambian el color de fondo según el tamaño de la pantalla.
- **index.html**: página de inicio con enlaces a los dos archivos.

## Sesión 19 · JavaScript: selectores y DOM

- **sesion19.html** + **script.js**: Actividad 1 "Manipulación del DOM". Cuatro desafíos con `getElementById`, `getElementsByClassName`, `querySelector` y `querySelectorAll`, todo dentro de `DOMContentLoaded`.

## Sesión 20 · Selectores y colores en Bootstrap

- **sesion20-banner.html**: Actividad 1, banner `id="banner"` que cambia a `bg-warning` con `getElementById` al actualizar la promoción.
- **sesion20-testimonios.html**: Actividad 2, testimonios con clase `testimonio-vip` → `text-primary` (`getElementsByClassName`) y todos los párrafos → `text-danger` (`getElementsByTagName`).
- **sesion20-contacto.html**: Actividad 3, formulario de contacto: primer campo de texto → `bg-success` (`querySelector`), todos los botones → `btn-danger` (`querySelectorAll`), campo nombre → `text-warning` (`getElementsByName`).
- **sesiones.css**: estilos compartidos de las páginas de actividades.

## Sesión 25 · JS en acción

- **sesion25-carrito.html** + **carrito.js**: Actividad 1 "Carrito de compras interactivo". Cinco cards con imagen, nombre, precio y botón Agregar; funciones `agregarProducto()` y `eliminarProducto()` que crean y quitan elementos del DOM (se elimina el último añadido); contador y total que se actualizan al instante; colores de Bootstrap que cambian según la acción (verde al agregar, rojo al eliminar, gris con el carrito vacío).

## El gran reto de maquetación

- **reto-layouts.html**: Desafío 4, réplica de las tres opciones de layout con el grid de Bootstrap 5 (`row`, `col-12`, `col-md-4`, `col-md-8`, `col-md-3`, `col-md-9`, fila anidada). En celular las columnas se apilan y desde `md` toman la forma de la imagen.
