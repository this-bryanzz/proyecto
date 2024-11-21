$(document).ready(() => {
    // Log the entire localStorage to check contents
    console.log("Full localStorage:", localStorage);
  
    // Recuperar el producto seleccionado desde localStorage
    const productoSeleccionado = JSON.parse(
      localStorage.getItem("productoSeleccionado")
    );
    console.log("Producto Seleccionado:", productoSeleccionado);
  
    if (!productoSeleccionado) {
      console.error("No hay producto seleccionado en localStorage.");
      // Mostrar un mensaje de error en la página
      $("body").html(
        "<p>Producto no disponible. Por favor, selecciona un producto en la página principal.</p>"
      );
      return;
    }
  
    // Validar y asignar valores a cada propiedad
    const imagen =
      productoSeleccionado.imagen || "https://via.placeholder.com/150";
    const nombre = productoSeleccionado.nombre || "Nombre no disponible";
    const descripcion =
      productoSeleccionado.descripcion || "Descripción no disponible";
    const precio = productoSeleccionado.precio
      ? `$${productoSeleccionado.precio}`
      : "Precio no disponible";
  
    // Mostrar la información en la página
    $("#imagen")
      .attr("src", imagen)
      .on("error", function () {
        // Si hay un error cargando la imagen, usa una imagen por defecto
        $(this).attr("src", "https://via.placeholder.com/150");
      });
    $("#nombre").text(nombre);
    $("#descripcion").text(descripcion);
    $("#precio").text(precio);
  
    // Logs detallados para depuración
    console.log("Imagen mostrada:", imagen);
    console.log("Nombre mostrado:", nombre);
    console.log("Descripción mostrada:", descripcion);
    console.log("Precio mostrado:", precio);
  
    // Evento para añadir al carrito
    $(".boton")
      .eq(1)
      .click(() => {
        // El segundo botón es el de "Añadir al carrito"
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.push(productoSeleccionado); // Usar el producto seleccionado
        localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar el carrito actualizado
        alert("Producto añadido al carrito");
      });
  });
  