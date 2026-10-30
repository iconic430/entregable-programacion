// ============================================================
// Proyecto Fase 3: integración de servicios RESTful
//   1. TheMealDB  → recetas (lista, búsqueda y detalle)
//   2. Open-Meteo → clima actual del restaurante (CDMX)
// Se usa fetch (nativo del navegador) con async/await.
// ============================================================

const RecetasAPI = {
  BASE: "https://www.themealdb.com/api/json/v1/1",
  cache: new Map(),          // guarda el detalle de las recetas ya consultadas
};

// Se exponen en window para que la página de pruebas (pruebas-api.html) pueda revisarlos
window.RecetasAPI = RecetasAPI;

const ClimaAPI = {
  URL: "https://api.open-meteo.com/v1/forecast" +
       "?latitude=19.4326&longitude=-99.1332" +
       "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
       "&timezone=America%2FMexico_City",
};

// ---------- Petición genérica a una API REST ----------
// Lanza un error si la respuesta no es 200-299 o si tarda más de 10 s.
async function pedirJSON(url) {
  const control = new AbortController();
  const limite = setTimeout(() => control.abort(), 10000);
  try {
    const respuesta = await fetch(url, { signal: control.signal });
    if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`);
    return await respuesta.json();
  } catch (error) {
    if (error.name === "AbortError") throw new Error("La API tardó demasiado en responder");
    throw error;
  } finally {
    clearTimeout(limite);
  }
}

// ============================================================
// 1. RECETAS (TheMealDB)
// ============================================================
const estado = () => document.getElementById("recetasEstado");
const lista = () => document.getElementById("listaRecetas");

function mostrarCargando(texto) {
  estado().innerHTML = `
    <div class="d-flex align-items-center gap-2 text-secondary">
      <div class="spinner-border spinner-border-sm text-danger" role="status"></div>
      <span>${texto}</span>
    </div>`;
}

function mostrarError(mensaje, reintentar) {
  lista().innerHTML = "";
  estado().innerHTML = `
    <div class="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2 mb-0" id="recetasError">
      <span>⚠️ No pudimos cargar las recetas: ${mensaje}.</span>
      <button class="btn btn-sm btn-outline-danger" id="reintentarRecetas">Reintentar</button>
    </div>`;
  document.getElementById("reintentarRecetas").addEventListener("click", reintentar);
}

// Convierte la respuesta de la API en objetos más simples para la interfaz
function normalizarReceta(m) {
  return { id: m.idMeal, nombre: m.strMeal, imagen: m.strMealThumb };
}

function pintarRecetas(recetas, titulo) {
  if (recetas.length === 0) {
    lista().innerHTML = "";
    estado().innerHTML = `<div class="alert alert-secondary mb-0" id="recetasVacio">No encontramos recetas con esa búsqueda. Prueba con "taco" o "chilli".</div>`;
    return;
  }
  estado().innerHTML = `<p class="text-secondary mb-0" id="recetasConteo">${titulo}: <strong>${recetas.length}</strong> receta${recetas.length === 1 ? "" : "s"}.</p>`;

  lista().innerHTML = "";
  recetas.forEach(r => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="card receta h-100 shadow-sm">
        <img class="card-img-top" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title"></h5>
          <button class="btn btn-outline-danger mt-auto">Ver receta</button>
        </div>
      </div>`;
    // textContent / atributos evitan insertar HTML que venga de la API
    col.querySelector("img").src = r.imagen + "/medium";
    col.querySelector("img").alt = r.nombre;
    col.querySelector(".card-title").textContent = r.nombre;
    col.querySelector("button").addEventListener("click", () => verReceta(r.id));
    col.querySelector(".card").dataset.id = r.id;
    lista().appendChild(col);
  });
}

// GET /filter.php?a=Mexican → recetas mexicanas
async function cargarMexicanas() {
  mostrarCargando("Cargando recetas mexicanas…");
  try {
    const datos = await pedirJSON(`${RecetasAPI.BASE}/filter.php?a=Mexican`);
    pintarRecetas((datos.meals || []).map(normalizarReceta), "Recetas mexicanas");
  } catch (error) {
    mostrarError(error.message, cargarMexicanas);
  }
}

// GET /search.php?s={texto} → búsqueda por nombre
async function buscarRecetas(texto) {
  const consulta = texto.trim();
  if (!consulta) return cargarMexicanas();
  mostrarCargando(`Buscando "${consulta}"…`);
  try {
    const datos = await pedirJSON(`${RecetasAPI.BASE}/search.php?s=${encodeURIComponent(consulta)}`);
    pintarRecetas((datos.meals || []).map(normalizarReceta), `Resultados para "${consulta}"`);
  } catch (error) {
    mostrarError(error.message, () => buscarRecetas(consulta));
  }
}

// Junta los 20 pares strIngredientN / strMeasureN que trae la API
function ingredientesDe(m) {
  const resultado = [];
  for (let i = 1; i <= 20; i++) {
    const ingrediente = (m[`strIngredient${i}`] || "").trim();
    const medida = (m[`strMeasure${i}`] || "").trim();
    if (ingrediente) resultado.push({ ingrediente, medida });
  }
  return resultado;
}

// GET /lookup.php?i={id} → detalle de una receta (con caché)
async function verReceta(id) {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalReceta"));
  const cuerpo = document.getElementById("recetaCuerpo");
  const video = document.getElementById("recetaVideo");
  document.getElementById("recetaTitulo").textContent = "Cargando receta…";
  cuerpo.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-danger"></div></div>`;
  video.classList.add("d-none");
  modal.show();

  try {
    let m = RecetasAPI.cache.get(id);
    if (!m) {
      const datos = await pedirJSON(`${RecetasAPI.BASE}/lookup.php?i=${encodeURIComponent(id)}`);
      m = datos.meals && datos.meals[0];
      if (!m) throw new Error("la receta ya no existe");
      RecetasAPI.cache.set(id, m);
    }

    document.getElementById("recetaTitulo").textContent = m.strMeal;
    cuerpo.innerHTML = `
      <div class="row g-4">
        <div class="col-md-5">
          <img class="img-fluid rounded mb-3" id="recetaImagen">
          <p class="mb-1"><span class="badge text-bg-danger" id="recetaCategoria"></span>
             <span class="badge text-bg-success" id="recetaOrigen"></span></p>
        </div>
        <div class="col-md-7">
          <h6 class="fw-bold">Ingredientes (<span id="recetaNumIng"></span>)</h6>
          <ul class="small mb-0" id="recetaIngredientes" style="columns: 2;"></ul>
        </div>
        <div class="col-12">
          <h6 class="fw-bold">Preparación <small class="text-secondary fw-normal">(texto original de la API, en inglés)</small></h6>
          <p class="small mb-0" id="recetaInstrucciones" style="white-space: pre-line;"></p>
        </div>
      </div>`;
    document.getElementById("recetaImagen").src = m.strMealThumb;
    document.getElementById("recetaImagen").alt = m.strMeal;
    document.getElementById("recetaCategoria").textContent = m.strCategory || "Sin categoría";
    document.getElementById("recetaOrigen").textContent = m.strArea || "";

    const ingredientes = ingredientesDe(m);
    document.getElementById("recetaNumIng").textContent = ingredientes.length;
    ingredientes.forEach(({ ingrediente, medida }) => {
      const li = document.createElement("li");
      li.textContent = medida ? `${medida} ${ingrediente}` : ingrediente;
      document.getElementById("recetaIngredientes").appendChild(li);
    });
    document.getElementById("recetaInstrucciones").textContent = m.strInstructions || "";

    if (m.strYoutube) {
      video.href = m.strYoutube;
      video.classList.remove("d-none");
    }
  } catch (error) {
    document.getElementById("recetaTitulo").textContent = "No se pudo cargar la receta";
    cuerpo.innerHTML = "";
    const alerta = document.createElement("div");
    alerta.className = "alert alert-danger mb-0";
    alerta.textContent = `⚠️ ${error.message}. Intenta de nuevo en un momento.`;
    cuerpo.appendChild(alerta);
  }
}

// ============================================================
// 2. CLIMA (Open-Meteo)
// ============================================================
// Códigos de clima WMO → texto en español
const CLIMA_WMO = {
  0: ["☀️", "Despejado"], 1: ["🌤️", "Mayormente despejado"], 2: ["⛅", "Parcialmente nublado"],
  3: ["☁️", "Nublado"], 45: ["🌫️", "Niebla"], 48: ["🌫️", "Niebla"],
  51: ["🌦️", "Llovizna ligera"], 53: ["🌦️", "Llovizna"], 55: ["🌦️", "Llovizna intensa"],
  61: ["🌧️", "Lluvia ligera"], 63: ["🌧️", "Lluvia"], 65: ["🌧️", "Lluvia fuerte"],
  80: ["🌧️", "Chubascos"], 81: ["🌧️", "Chubascos"], 82: ["⛈️", "Chubascos fuertes"],
  95: ["⛈️", "Tormenta"], 96: ["⛈️", "Tormenta con granizo"], 99: ["⛈️", "Tormenta con granizo"],
};

async function cargarClima() {
  const caja = document.getElementById("clima");
  try {
    const datos = await pedirJSON(ClimaAPI.URL);
    const c = datos.current;
    const [icono, descripcion] = CLIMA_WMO[c.weather_code] || ["🌡️", "Sin descripción"];
    const llueve = c.weather_code >= 51;
    const terraza = !llueve && c.temperature_2m >= 18
      ? `<span class="badge text-bg-success">Ideal para comer en la terraza</span>`
      : `<span class="badge text-bg-secondary">Te recomendamos el comedor interior</span>`;
    const hora = c.time.slice(11, 16);

    caja.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <div class="fs-1 lh-1">${icono}</div>
        <div>
          <div class="small text-secondary">Clima ahora en CDMX · ${hora} h</div>
          <div class="fs-4 fw-bold" id="climaTemp">${Math.round(c.temperature_2m)} °C</div>
          <div class="small">${descripcion} · Humedad ${c.relative_humidity_2m}% · Viento ${Math.round(c.wind_speed_10m)} km/h</div>
        </div>
      </div>
      <div class="mt-2">${terraza}</div>
      <div class="small text-secondary mt-1">Fuente: API Open-Meteo</div>`;
  } catch (error) {
    caja.innerHTML = `<div class="small text-danger" id="climaError">No pudimos obtener el clima (${error.message}).</div>`;
  }
}

// ============================================================
// Eventos
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formBuscarReceta").addEventListener("submit", (e) => {
    e.preventDefault();
    buscarRecetas(document.getElementById("buscarReceta").value);
  });
  document.getElementById("verMexicanas").addEventListener("click", () => {
    document.getElementById("buscarReceta").value = "";
    cargarMexicanas();
  });

  cargarMexicanas();
  cargarClima();
});
