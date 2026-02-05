document.addEventListener('DOMContentLoaded', () => {
    
    // --- Funcionalidad 1: Navegación Activa y Smooth Scroll ---
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const sections = document.querySelectorAll('section');

    // Función para activar el enlace del menú según la posición del scroll
    function changeActiveNav() {
        let index = sections.length;

        while(--index && window.scrollY + 150 < sections[index].offsetTop) {}
        
        navLinks.forEach((link) => link.classList.remove('active'));
        // Verifica si el índice es válido antes de añadir la clase
        if (index >= 0 && index < navLinks.length) {
             // El primer enlace suele ser "Inicio" y puede no tener una sección mapeada exactamente al principio
             // Ajustamos para que si está cerca del top, active el primero.
             if (window.scrollY < 200) {
                 navLinks[0].classList.add('active');
             } else {
                 // Mapeo simple asumiendo orden secuencial
                // Nota: Para una implementación más robusta, se debería mapear por ID.
                // Por simplicidad en este ejemplo, usamos el orden.
                if(navLinks[index]) navLinks[index].classList.add('active');
             }
        }
    }
    
    // Activar navegación al hacer scroll
    window.addEventListener('scroll', changeActiveNav);


    // --- Funcionalidad 2: Botón Volver Arriba ---
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
      // Mostrar botón si se baja más de 300px
      if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollTopBtn.style.display = "block";
      } else {
        scrollTopBtn.style.display = "none";
      }
    }

    // Acción al hacer click en el botón de subir
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Funcionalidad 3: Interacción Dinámica en Tablas ---
    // Añade una clase 'highlight' a la fila de la tabla al pasar el mouse
    // aunque CSS ya lo maneja, esto muestra cómo manipular el DOM con JS.
    const tableRows = document.querySelectorAll('.styled-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = "scale(1.01)";
            row.style.transition = "transform 0.2s ease";
            row.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        });
        row.addEventListener('mouseleave', () => {
            row.style.transform = "scale(1)";
            row.style.boxShadow = "none";
        });
    });

});