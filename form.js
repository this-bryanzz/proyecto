document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita el envío tradicional del formulario

        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const contraseña = document.getElementById("contraseña").value;

        try {
            const response = await fetch("http://localhost/proyecto/guardar-usuario.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre, correo, contraseña }),
            });

            const result = await response.json();

            if (result.success) {
                alert("Usuario registrado con éxito");
                form.reset(); // Limpia el formulario
            } else {
                alert("Error al registrar el usuario: " + result.message);
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            alert("Ocurrió un error al procesar la solicitud.");
        }
    });
});
