function hacerPeticion(categoria = "") {
    const settings = {
        url: `https://zylalabs.com/api/916/sneakers+database+api/731/search+sneaker?limit=20&page=0${categoria ? '&query=' + categoria : ''}`,
        method: "GET",
        headers: {
            "Authorization": "Bearer 5781|TeleNh3Hyiye57ctqtR57EBpbVsAsb0EWckD1IWi"
        }
    };

    $.ajax(settings).done(response => {
        const productos = response.results;
        const contenedor = $('.contenedor-productos');
        contenedor.empty();  // Limpiar el contenedor de productos

        productos.forEach(producto => {
            const nombre = producto.name || "Sin nombre";
            const imagen = producto.image.original || "https://via.placeholder.com/150";
            const id = producto.id;

            const productoHTML = `
                <div class="producto" data-id="${id}">
                    <img src="${imagen}" alt="${nombre}" class="imagen-producto">
                    <h3 class="nombre-producto">${nombre}</h3>
                </div>
            `;
            contenedor.append(productoHTML);  // Agregar el producto al contenedor
        });
        

        // Evento para guardar detalles del producto seleccionado
        $('.producto').on('click', function() {
            const productoId = $(this).data('id');
            const producto = productos.find(p => p.id === productoId);

            if (!producto) {
                console.error("Producto no encontrado:", productoId);
                return;
            }

            // Guardar los detalles del producto en localStorage
            const productoSeleccionado = {
                id: producto.id,
                nombre: producto.name || "Sin nombre",
                imagen: producto.image.original || "https://via.placeholder.com/150",
                descripcion: producto.story || "Descripción no disponible.",
                precio: producto.estimatedMarketValue || "Precio no disponible."
            };

            localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));

            // Redirigir a la página de detalles
            window.location.href = 'detalles.html';
        });
    }).fail((jqXHR, textStatus) => {
        if (jqXHR.status === 503) {
            console.warn("Servicio no disponible, reintentando en 5 segundos...");
            setTimeout(() => hacerPeticion(categoria), 5000);  // Reintentar la petición
        } else {
            console.error("Error en la solicitud:", textStatus);
        }
    });
}

$(document).ready(function() {
    // Llamada inicial a la API (sin filtro de categoría)
    hacerPeticion();

    // Manejar el clic en las categorías
    $('.menu-categorias a').on('click', function(e) {
        e.preventDefault();  // Evitar el comportamiento por defecto del enlace
        const categoria = $(this).text().toLowerCase();  // Obtener el nombre de la categoría y convertir a minúsculas
        hacerPeticion(categoria);  // Hacer la petición con la categoría seleccionada
    });
});