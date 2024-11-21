document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita el envío tradicional del formulario

        const correo = document.getElementById("correo").value;
        const contraseña = document.getElementById("contraseña").value;

        try {
            const response = await fetch("http://localhost/proyecto/validar-login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ correo, contraseña }),
            });

            const result = await response.json();

            if (result.success) {
                alert("Inicio de sesión exitoso");
                window.location.href = "inicio.html"; // Redirección al inicio
            } else {
                alert(result.message); // Muestra el mensaje de error
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            alert("Ocurrió un error al procesar la solicitud.");
        }
    });
});
