// Sesión 19 - Actividad 1: Manipulación del DOM
// El código se ejecuta cuando el DOM está completamente cargado.
document.addEventListener("DOMContentLoaded", function () {
  console.log("El DOM ha sido completamente cargado");

  // ---------- Desafío 1: getElementById ----------
  // Cambia el texto del título al hacer clic en el botón.
  let botonTexto = document.getElementById("cambiarTexto");
  let titulo = document.getElementById("titulo");
  const textoOriginal = titulo.textContent;

  botonTexto.addEventListener("click", function () {
    titulo.textContent = "¡Texto cambiado!";
  });

  // ---------- Desafío 2: getElementsByClassName ----------
  // Cambia el color de fondo de todas las cajas con un bucle.
  let botonColor = document.getElementById("cambiarColor");
  let cajas = document.getElementsByClassName("caja");

  botonColor.addEventListener("click", function () {
    for (let i = 0; i < cajas.length; i++) {
      cajas[i].style.backgroundColor = "lightcoral";
    }
  });

  // ---------- Desafío 3: querySelector ----------
  // Cambia el fondo de la primera caja a lightgreen.
  document.getElementById("primeraCajaVerde").addEventListener("click", function () {
    let primeraCaja = document.querySelector(".caja");
    primeraCaja.style.backgroundColor = "lightgreen";
  });

  // ---------- Desafío 4: querySelectorAll ----------
  // Cambia el borde de todas las cajas a 2px azul oscuro.
  document.getElementById("bordeCajas").addEventListener("click", function () {
    let todasLasCajas = document.querySelectorAll(".caja");
    todasLasCajas.forEach(caja => {
      caja.style.border = "2px solid darkblue";
    });
  });

  // ---------- Reiniciar ----------
  document.getElementById("reiniciar").addEventListener("click", function () {
    titulo.textContent = textoOriginal;
    for (let i = 0; i < cajas.length; i++) {
      cajas[i].style.backgroundColor = "";
      cajas[i].style.border = "";
    }
  });
});
