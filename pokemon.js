// Sesión 29 - Actividad 1: Pokémon con map y filter
// 1. Se obtiene la lista de Pokémon de la PokéAPI (nombre, imagen y peso).
// 2. Al hacer clic en "Buscar" se filtra la lista con filter
//    y se crean los <li> con map (antes se usaba forEach).

const API = "https://pokeapi.co/api/v2/pokemon?limit=151";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const pokemonList = document.getElementById("pokemon-list");
const estado = document.getElementById("estado");

// Aquí se guarda la lista completa que llega en la primera solicitud
let pokemons = [];

// ---------- Primera solicitud: lista de Pokémon con sus detalles ----------
fetch(API)
  .then(respuesta => respuesta.json())
  .then(data => {
    // map: de cada resultado pedimos su detalle (imagen y peso)
    const solicitudes = data.results.map(pokemon =>
      fetch(pokemon.url).then(respuesta => respuesta.json())
    );
    return Promise.all(solicitudes);
  })
  .then(detalles => {
    // map: transformamos cada detalle en un objeto con lo que necesitamos
    pokemons = detalles.map(pokemon => ({
      id: pokemon.id,
      nombre: pokemon.name,
      imagen: pokemon.sprites.front_default,
      peso: pokemon.weight / 10,   // la API da el peso en hectogramos → kg
    }));
    mostrarPokemons(pokemons);
  })
  .catch(() => {
    estado.textContent = "No se pudo cargar la lista de Pokémon. Revisa tu conexión.";
  });

// ---------- Crear y mostrar los <li> con map ----------
function mostrarPokemons(lista) {
  // Limpiar la lista actual antes de mostrar los nuevos resultados
  pokemonList.innerHTML = "";

  if (lista.length === 0) {
    estado.textContent = `No hay Pokémon que contengan "${searchInput.value.trim()}".`;
    return;
  }
  estado.textContent = `Mostrando ${lista.length} Pokémon.`;

  // map crea y retorna un NUEVO array de elementos <li> (en lugar de forEach)
  const elementosLi = lista.map(pokemon => {
    const li = document.createElement("li");
    li.className = "col-6 col-sm-4 col-md-3 col-lg-2";
    li.innerHTML = `
      <div class="pokemon">
        <span class="numero">#${String(pokemon.id).padStart(3, "0")}</span>
        <img src="${pokemon.imagen}" alt="${pokemon.nombre}">
        <h3>${pokemon.nombre}</h3>
        <p class="mb-0 text-secondary">Peso: ${pokemon.peso} kg</p>
      </div>`;
    return li;
  });

  // Insertamos el nuevo array de <li> en <ul id="pokemon-list">
  pokemonList.append(...elementosLi);
}

// ---------- Búsqueda al hacer clic en "Buscar" ----------
searchButton.addEventListener("click", () => {
  // Capturamos el valor que escribió el usuario
  const texto = searchInput.value.trim().toLowerCase();

  // filter: solo los Pokémon cuyo nombre contiene el texto buscado
  const filtrados = pokemons.filter(pokemon => pokemon.nombre.includes(texto));

  mostrarPokemons(filtrados);
});

// Extra: también se puede buscar presionando Enter
searchInput.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") searchButton.click();
});
