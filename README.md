# Sabores de México · Proyecto final

Sitio web de un restaurante de cocina tradicional mexicana desarrollado durante la materia **Programación y diseño de aplicaciones**. Integra todo lo trabajado en el curso: maquetación con HTML5 y Bootstrap 5, diseño responsivo, interactividad con JavaScript y consumo de APIs RESTful.

- **Sitio publicado:** https://entregable-programacion.vercel.app/
- **Repositorio:** https://github.com/iconic430/entregable-programacion

---

## Cómo ejecutar la aplicación

El proyecto es un sitio estático: no necesita instalar nada ni levantar un servidor.

1. Descomprime la carpeta.
2. Abre `index.html` (página de inicio con enlaces a todo) o directamente `proyecto primera materia.html` en Chrome, Edge, Firefox o Safari.
3. Se necesita **conexión a internet** porque Bootstrap, la tipografía, las imágenes y las APIs se cargan desde la red.

> **Nota:** `pruebas-api.html` abre el sitio dentro de un `iframe` para revisarlo. Algunos navegadores bloquean eso cuando el archivo se abre con doble clic (`file://`). Para correr las pruebas usa la versión publicada (https://entregable-programacion.vercel.app/pruebas-api.html) o un servidor local, por ejemplo con la extensión *Live Server* de VS Code o con `python3 -m http.server`.

---

## Estructura del proyecto

```
Sabores de Mexico/
├── index.html                      Página de inicio: enlaces al proyecto y a las actividades
├── proyecto primera materia.html   PROYECTO PRINCIPAL (todas las fases)
├── api.js                          Fase 3: integración con las APIs REST
├── pruebas-api.html                Fase 3: 11 pruebas automáticas de las APIs y la interfaz
├── responsivo.html                 Ejercicio de media queries (Fase 2)
├── DOCUMENTACION.md                Documentación técnica: aspectos técnicos, APIs y bibliotecas
├── README.md                       Este archivo
│
├── sesiones.css                    Estilos compartidos de las actividades de clase
├── sesion19.html  + script.js      Sesión 19 · Manipulación del DOM
├── sesion20-banner.html            Sesión 20 · Actividad 1 (getElementById)
├── sesion20-testimonios.html       Sesión 20 · Actividad 2 (getElementsByClassName / TagName)
├── sesion20-contacto.html          Sesión 20 · Actividad 3 (querySelector / All / getElementsByName)
├── sesion25-carrito.html + carrito.js   Sesión 25 · Carrito de compras interactivo
└── reto-layouts.html               El gran reto de maquetación · Desafío 4 (grid de Bootstrap)
```

---

## Proyecto principal: `proyecto primera materia.html`

| Sección | Qué hace | Tecnologías |
|---|---|---|
| Encabezado y navbar | Logo, título y menú que se colapsa en celular y lleva a cada sección | Bootstrap navbar, JavaScript (scroll y cierre del menú) |
| Nuestras instalaciones | Carrusel de fotos del restaurante | Bootstrap carousel |
| Menú (carta) | Entradas, platos fuertes y postres; agregar platillos a "Tu selección" con total | Grid `col-12 col-md-6 col-lg-4`, JavaScript |
| Detalle de platillo | Modal con foto, descripción y precio | Bootstrap modal |
| Mi pedido | Panel lateral con los platillos elegidos y el total | Bootstrap offcanvas |
| Pedidos a domicilio | Pop-up para elegir cantidades, escribir la dirección y enviar el pedido con validación | Modal, formularios, validación HTML5 + JS |
| Recetas mexicanas | Recetas en vivo, buscador y detalle con ingredientes y video | **API REST TheMealDB** (`api.js`) |
| Ubicación | Dirección, horario y contacto en pestañas, mapa y clima actual | Nav/tabs, iframe de Google Maps, **API REST Open-Meteo** |
| Eventos especiales y clientes | Tarjetas de eventos y reseñas | Grid de Bootstrap |
| Califica tu experiencia | Encuesta con estrellas que agrega la reseña a la página | Formulario, CSS, JavaScript |
| Mi perfil | Datos del usuario que se guardan y llenan el pedido automáticamente | Modal, `localStorage` |

### Fases del proyecto

| Fase | Entregable | Qué se agregó |
|---|---|---|
| Fase 1 | Interfaz inicial | Estructura HTML, navbar, carrusel, modal, menú interactivo |
| Fase 2 | Entregable 3 | Tabs, offcanvas, formularios, pedidos, perfil, diseño responsivo (3+ tamaños) y pruebas en dispositivos |
| Fase 3 | Entregable 4 | Consumo de las APIs REST TheMealDB y Open-Meteo, manejo de estados, caché y pruebas automáticas |
| Final | Entregable 5 | Integración, documentación del código e informe ejecutivo |

---

## APIs y bibliotecas

| Recurso | Uso |
|---|---|
| Bootstrap 5.3.3 (CSS y JS bundle, CDN jsDelivr) | Grid, componentes y componentes interactivos |
| Google Fonts · Roboto | Tipografía |
| API REST TheMealDB | Recetas (`/filter.php`, `/search.php`, `/lookup.php`) |
| API REST Open-Meteo | Clima actual en CDMX (`/v1/forecast`) |
| Fetch API y AbortController (nativas) | Peticiones HTTP con tiempo límite |
| Unsplash | Fotografías de platillos e instalaciones |

La descripción completa de endpoints, parámetros, respuestas y manejo de errores está en [`DOCUMENTACION.md`](DOCUMENTACION.md).

---

## Actividades de clase incluidas

- **Sesión 19 · Manipulación del DOM** (`sesion19.html`, `script.js`): cuatro desafíos con `getElementById`, `getElementsByClassName`, `querySelector` y `querySelectorAll` dentro de `DOMContentLoaded`.
- **Sesión 20 · Selectores y colores en Bootstrap**: banner que cambia a `bg-warning`; testimonios VIP en `text-primary` y párrafos en `text-danger`; formulario con `bg-success`, `btn-danger` y `text-warning`.
- **Sesión 25 · Carrito de compras interactivo** (`sesion25-carrito.html`, `carrito.js`): cinco productos, funciones `agregarProducto()` y `eliminarProducto()` que modifican el DOM, contador y total en tiempo real y colores por acción.
- **El gran reto de maquetación · Desafío 4** (`reto-layouts.html`): tres layouts replicados con el grid de Bootstrap 5.
- **Ejercicio responsivo** (`responsivo.html`): `container`, `container-fluid` y media queries que cambian el fondo según el ancho de pantalla.
