# Sabores de México · Documentación técnica (Proyecto Fase 3)

Sitio web de un restaurante de comida mexicana que, además del menú, pedidos, encuesta y perfil, consume dos servicios RESTful para mostrar datos dinámicos: recetas (TheMealDB) y clima actual (Open-Meteo).

- Sitio: https://entregable-programacion.vercel.app/proyecto%20primera%20materia.html
- Pruebas automáticas: https://entregable-programacion.vercel.app/pruebas-api.html
- Repositorio: https://github.com/iconic430/entregable-programacion

---

## 1. Aspectos técnicos de la aplicación

### Tecnologías

| Capa | Tecnología |
|---|---|
| Estructura | HTML5 |
| Estilos | CSS3 (estilos propios en `<style>` y `sesiones.css`) + Bootstrap 5.3.3 |
| Lógica | JavaScript (ES2017+: `async/await`, `fetch`, `Map`, plantillas de texto) |
| Datos externos | API REST TheMealDB y API REST Open-Meteo (JSON sobre HTTPS) |
| Hosting | Vercel (despliegue automático con cada `git push`) y GitHub Pages |

No hay servidor propio ni base de datos: es un sitio estático. El navegador pide los datos directamente a las APIs (ambas permiten CORS con `Access-Control-Allow-Origin: *`).

### Estructura de archivos

| Archivo | Contenido |
|---|---|
| `proyecto primera materia.html` | Página principal: estructura, estilos y lógica del menú, pedidos, encuesta y perfil |
| `api.js` | Integración con las APIs REST: peticiones, manejo de estados, pintado de recetas, detalle y clima |
| `pruebas-api.html` | 11 pruebas automáticas de las APIs y de la interfaz |
| `responsivo.html`, `sesion*.html`, `reto-layouts.html` | Actividades de clase |

### Flujo de datos

1. Al cargar la página (`DOMContentLoaded`), `api.js` llama a `cargarMexicanas()` y `cargarClima()`.
2. `pedirJSON(url)` hace la petición `GET` con `fetch`, revisa el código HTTP y convierte la respuesta a JSON. Si tarda más de 10 s se cancela con `AbortController`.
3. La respuesta se **normaliza** (`normalizarReceta`) a objetos simples `{ id, nombre, imagen }`.
4. `pintarRecetas()` crea las tarjetas en el DOM con el grid de Bootstrap (`col-12 col-md-6 col-lg-4`).
5. Al presionar **Ver receta**, `verReceta(id)` pide el detalle, junta los 20 pares ingrediente/medida y los muestra en un modal. El detalle se guarda en una **caché** (`Map`) para no volver a pedirlo.

### Manejo de datos dinámicos y estados

| Estado | Qué ve el usuario |
|---|---|
| Cargando | Spinner con el texto "Cargando recetas…" o "Buscando…" |
| Éxito | Contador ("Recetas mexicanas: 6 recetas") y tarjetas |
| Sin resultados | Aviso "No encontramos recetas con esa búsqueda" |
| Error (red, 404, 500, tiempo agotado) | Alerta roja con el motivo y botón **Reintentar** |

- El texto que llega de la API se inserta con `textContent` y atributos, no con `innerHTML`, para evitar inyectar HTML.
- La búsqueda se codifica con `encodeURIComponent`.
- El clima traduce el código WMO a texto en español y recomienda terraza o comedor interior según la temperatura y la lluvia.

### Diseño responsivo

Las tarjetas de recetas usan `col-12 col-md-6 col-lg-4`: 1 columna en celular, 2 en tablet y 3 en computadora. El buscador usa `flex-wrap` para acomodarse en pantallas chicas.

---

## 2. Documentación de las APIs RESTful

### 2.1 TheMealDB

- **Base URL:** `https://www.themealdb.com/api/json/v1/1`
- **Autenticación:** no requiere (clave pública de prueba `1` incluida en la ruta).
- **Formato:** JSON. **Método:** `GET`.
- **Documentación oficial:** https://www.themealdb.com/api.php

| Endpoint | Parámetro | Uso en el sitio | Respuesta |
|---|---|---|---|
| `/filter.php?a=Mexican` | `a` = región | Lista inicial de recetas mexicanas | `{ "meals": [ { "idMeal", "strMeal", "strMealThumb" } ] }` |
| `/search.php?s={texto}` | `s` = nombre | Buscador | `{ "meals": [ ...receta completa ] }` o `{ "meals": null }` si no hay resultados |
| `/lookup.php?i={id}` | `i` = id de la receta | Detalle en el modal | `{ "meals": [ { ...receta completa } ] }` |

Campos de una receta completa que usa el sitio:

| Campo | Ejemplo | Uso |
|---|---|---|
| `idMeal` | `"52826"` | Identificador para pedir el detalle |
| `strMeal` | `"Braised Beef Chilli"` | Título |
| `strMealThumb` | URL `.jpg` (se le agrega `/medium` para la miniatura) | Imagen |
| `strCategory` / `strArea` | `"Beef"` / `"Mexican"` | Etiquetas |
| `strIngredient1…20` / `strMeasure1…20` | `"Beef"` / `"1kg"` | Lista de ingredientes |
| `strInstructions` | Texto en inglés | Preparación |
| `strYoutube` | URL | Botón "Ver video" |

Ejemplo de petición y respuesta:

```http
GET https://www.themealdb.com/api/json/v1/1/filter.php?a=Mexican
```
```json
{
  "meals": [
    { "strMeal": "Braised Beef Chilli",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/uuqvwu1504629254.jpg",
      "idMeal": "52826" }
  ]
}
```

Errores: una ruta inexistente responde `404`; una búsqueda sin coincidencias responde `200` con `"meals": null` (el sitio lo trata como "sin resultados").

### 2.2 Open-Meteo

- **URL:** `https://api.open-meteo.com/v1/forecast`
- **Autenticación:** no requiere. Uso gratuito no comercial.
- **Formato:** JSON. **Método:** `GET`.
- **Documentación oficial:** https://open-meteo.com/en/docs

| Parámetro | Valor usado | Significado |
|---|---|---|
| `latitude`, `longitude` | `19.4326`, `-99.1332` | Ubicación del restaurante (CDMX) |
| `current` | `temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` | Datos actuales que se piden |
| `timezone` | `America/Mexico_City` | Hora local en la respuesta |

Respuesta (fragmento):

```json
{
  "current_units": { "temperature_2m": "°C", "relative_humidity_2m": "%", "wind_speed_10m": "km/h" },
  "current": { "time": "2026-10-30T07:30", "temperature_2m": 15.1,
               "relative_humidity_2m": 80, "wind_speed_10m": 2.6, "weather_code": 3 }
}
```

`weather_code` sigue la tabla WMO (0 despejado, 3 nublado, 61–65 lluvia, 95 tormenta…); `api.js` la traduce con el objeto `CLIMA_WMO`.

---

## 3. Bibliotecas adicionales

| Biblioteca / recurso | Versión | Cómo se carga | Para qué se usa |
|---|---|---|---|
| Bootstrap (CSS) | 5.3.3 | CDN jsDelivr `bootstrap.min.css` | Grid responsivo, tarjetas, botones, alertas, badges, spinners, formularios |
| Bootstrap (JS bundle, incluye Popper) | 5.3.3 | CDN jsDelivr `bootstrap.bundle.min.js` | Componentes interactivos: navbar colapsable, carrusel, modales (detalle de receta, pedido, perfil), offcanvas, tabs. Desde `api.js` se usa `bootstrap.Modal.getOrCreateInstance()` |
| Google Fonts – Roboto | 400–900 | `fonts.googleapis.com` | Tipografía del sitio |
| Google Maps (iframe embebido) | — | `maps.google.com/maps?output=embed` | Mapa de la ubicación |
| Fetch API / AbortController | Nativas del navegador | — | Peticiones HTTP y tiempo límite (no se usa ninguna librería extra como Axios o jQuery) |

---

## 4. Pruebas

`pruebas-api.html` abre el sitio en un `iframe` y corre 11 pruebas contra las APIs reales:

1. TheMealDB responde 200 con recetas mexicanas.
2. Cada receta trae `idMeal`, `strMeal` y `strMealThumb`.
3. La interfaz muestra una tarjeta por cada receta.
4. Buscar "taco" muestra solo recetas con taco.
5. Una búsqueda sin resultados muestra el aviso.
6. "Ver receta" abre el detalle con ingredientes.
7. El detalle se guarda en caché.
8. Si la API falla se muestra un error con "Reintentar".
9. "Reintentar" vuelve a cargar las recetas.
10. Open-Meteo responde con la temperatura.
11. La sección Ubicación muestra el clima.

Además se revisó la sección en celular (390 px), tablet (768 px) y computadora (1280 px) sin desplazamiento horizontal.
