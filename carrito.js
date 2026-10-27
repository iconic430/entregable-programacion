// Sesión 25 - Actividad 1: Carrito de compras interactivo
// Manipulación del DOM, funciones y eventos.
document.addEventListener("DOMContentLoaded", function () {

  const lista = document.getElementById("listaCarrito");
  const contador = document.getElementById("contador");
  const total = document.getElementById("total");
  const mensaje = document.getElementById("mensaje");

  let suma = 0;

  // ---------- Cambia los colores de Bootstrap según la acción ----------
  // tipo: "success" (verde, agregado), "danger" (rojo, eliminado), "secondary" (gris, vacío)
  function mostrarEstado(tipo, texto) {
    mensaje.className = "alert alert-" + tipo + " py-2 mb-3";
    mensaje.textContent = texto;
    contador.className = "badge rounded-pill fs-6 text-bg-" + tipo;
  }

  function actualizarTotales() {
    contador.textContent = lista.children.length;
    total.textContent = "$" + suma;
  }

  // ---------- Función 1: agregar un producto ----------
  function agregarProducto(nombre, precio) {
    // Quita el resaltado del producto que antes era el último
    const anterior = lista.lastElementChild;
    if (anterior) anterior.classList.remove("list-group-item-success", "fw-bold");

    // Crea el nuevo elemento en el DOM y lo resalta en verde
    const item = document.createElement("li");
    item.className = "list-group-item list-group-item-success fw-bold d-flex justify-content-between";
    item.dataset.precio = precio;

    const textoNombre = document.createElement("span");
    textoNombre.textContent = nombre;
    const textoPrecio = document.createElement("span");
    textoPrecio.textContent = "$" + precio;

    item.appendChild(textoNombre);
    item.appendChild(textoPrecio);
    lista.appendChild(item);

    suma += precio;
    actualizarTotales();
    mostrarEstado("success", "✓ Se agregó " + nombre + " al carrito.");
  }

  // ---------- Función 2: eliminar el último producto añadido ----------
  function eliminarProducto() {
    const ultimo = lista.lastElementChild;

    if (!ultimo) {
      mostrarEstado("secondary", "El carrito está vacío.");
      return;
    }

    const nombre = ultimo.firstElementChild.textContent;
    suma -= Number(ultimo.dataset.precio);
    lista.removeChild(ultimo);
    actualizarTotales();

    if (lista.children.length === 0) {
      mostrarEstado("danger", "✕ Se eliminó " + nombre + ". El carrito quedó vacío.");
    } else {
      // El nuevo último producto vuelve a quedar resaltado
      lista.lastElementChild.classList.add("list-group-item-success", "fw-bold");
      mostrarEstado("danger", "✕ Se eliminó " + nombre + " del carrito.");
    }
  }

  // ---------- Eventos ----------
  const botones = document.querySelectorAll(".btn-agregar");

  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      agregarProducto(boton.dataset.nombre, Number(boton.dataset.precio));

      // El botón y la card cambian a verde un momento para indicar que se agregó
      const card = boton.closest(".producto");
      boton.classList.replace("btn-outline-success", "btn-success");
      boton.textContent = "✓ Agregado";
      card.classList.add("border-success");

      setTimeout(function () {
        boton.classList.replace("btn-success", "btn-outline-success");
        boton.textContent = "Agregar";
        card.classList.remove("border-success");
      }, 1000);
    });
  });

  document.getElementById("eliminarUltimo").addEventListener("click", eliminarProducto);
});
