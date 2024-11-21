$(document).ready(() => {
    // Recuperar el carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    renderizarCarrito(carrito);

    // Función para renderizar el carrito
    function renderizarCarrito(carrito) {
        $('#lista-carrito').empty();
        let total = 0;

        if (carrito.length === 0) {
            $('#lista-carrito').append('<li>El carrito está vacío.</li>');
            $('#total').text('Total: 0€');
            return;
        }

        carrito.forEach((producto, index) => {
            producto.cantidad = producto.cantidad ? parseInt(producto.cantidad) : 1;
            const precio = parseFloat(producto.precio) || 0;
            const subtotal = precio * producto.cantidad;
            total += subtotal;

            $('#lista-carrito').append(`
                <li class="producto-carrito">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div>
                        <p>${producto.nombre} - ${precio.toFixed(2)}€</p>
                        <div class="cantidad-controles">
                            <button class="boton-cantidad boton-restar" data-index="${index}" ${producto.cantidad === 1 ? 'disabled' : ''}>-</button>
                            <span>${producto.cantidad}</span>
                            <button class="boton-cantidad boton-sumar" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="boton-eliminar" data-index="${index}">Eliminar</button>
                </li>
            `);
        });

        $('#total').text(`Total: ${total.toFixed(2)}€`);
    }

    // Incrementar cantidad
    $(document).on('click', '.boton-sumar', function () {
        const index = $(this).data('index');
        carrito[index].cantidad += 1;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito(carrito);
    });

    // Decrementar cantidad
    $(document).on('click', '.boton-restar', function () {
        const index = $(this).data('index');
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito(carrito);
        }
    });

    // Eliminar producto del carrito
    $(document).on('click', '.boton-eliminar', function () {
        const index = $(this).data('index');
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito(carrito);
    });

    // Vaciar carrito
    $('#vaciar-carrito').click(() => {
        localStorage.removeItem('carrito');
        renderizarCarrito([]);
    });

    // Proceder con la compra usando Taxamo Checkout API
    $('#proceder-compra').click(() => {
        if (carrito.length === 0) {
            alert('El carrito está vacío. Agrega productos para continuar.');
            return;
        }

        // Calcular el total y preparar las líneas de transacción
        const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
        const transactionLines = carrito.map((producto) => ({
            amount: parseFloat(producto.precio) * producto.cantidad,
            custom_id: producto.nombre,
            description: `${producto.nombre} - ${producto.cantidad} unidad(es)`,
        }));

        // Inicializar Taxamo
        Taxamo.options.checkoutSrc = "https://p.taxamo.com";
        Taxamo.initialize('public_test_kf4VRs79lBxtA7cir14JKAW1EGIIgk6MAw8WzNy1F-w'); // Reemplaza con tu clave pública

        // Crear el objeto de transacción
        const transaction = {
            transaction_lines: transactionLines,
            currency_code: 'EUR', // Cambia a la moneda deseada
            billing_country_code: Taxamo.defaultTransaction.billing_country_code || 'ES' // Ejemplo: España
        };

        // Metadata adicional para redireccionar después del pago
        const metadata = {
            finished_redirect_url: self.location.href
        };

        // Crear el checkout
        const checkout = new Taxamo.Checkout(transaction, metadata);

        // Mostrar el formulario de Taxamo como overlay
        checkout.overlay((data) => {
            if (data.success) {
                alert('¡Compra realizada exitosamente!');
                console.log('Detalles de la transacción:', data);
                // Vaciar el carrito después de la compra
                localStorage.removeItem('carrito');
                renderizarCarrito([]);
            } else {
                alert('Error durante el proceso de compra.');
                console.error('Error de checkout:', data);
            }
        });
    });
});
