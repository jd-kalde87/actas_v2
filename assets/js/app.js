$(document).ready(function() {

    const mainContent = $('#main-content');

    /**
     * ## mostrarNotificacion
     * **Función global:** Muestra una alerta temporal en la parte superior.
     * La hacemos global (window.mostrarNotificacion) para que los módulos puedan usarla.
     */
    window.mostrarNotificacion = function(mensaje, tipo = 'success') {
        const alertaHtml = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">${mensaje}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
        $('.content-header').find('.alert').remove();
        $('.content-header').after(alertaHtml);
        setTimeout(() => { $('.content-header').next('.alert').fadeOut(); }, 5000);
    }

    /**
     * ## cargarVista
     * **Función principal:** Carga una vista PHP en el contenido principal y
     * luego carga su módulo de JavaScript correspondiente para darle funcionalidad.
     */
    window.cargarVista = function(vista, id = null) {
        let url = 'app/' + vista + '.php';
        let dataToSend = { id: id };

        mainContent.load(url, dataToSend, function(response, status, xhr) {
            if (status == "error") {
                mainContent.html(`<div class="p-3"><div class="alert alert-danger"><strong>Error:</strong> No se pudo cargar la vista <code>${url}</code>.</div></div>`);
            } else {
                // Después de cargar el HTML, intenta cargar el archivo JS del módulo
                $.getScript(`assets/js/modules/${vista}.js`)
                    .done(function() {
                        console.log(`Módulo ${vista}.js cargado.`);
                        // Si el módulo define una función de inicialización, la llamamos
                        if (typeof window.inicializarVista === 'function') {
                            window.inicializarVista(id);
                        }
                    })
                    .fail(function(jqxhr, settings, exception) {
                        // No mostramos error si el módulo no existe (ej. dashboard no necesita JS)
                        if (jqxhr.status === 404) {
                            console.log(`No se encontró un módulo JS para la vista ${vista}.`);
                        } else {
                            console.error(`Error al cargar el módulo ${vista}.js:`, exception);
                        }
                    });
            }
        });
    }

    // ===================================================================
    //  # MANEJO DE EVENTOS DE NAVEGACIÓN
    // ===================================================================

    // Clics en la barra lateral para navegar
    $('.sidebar .nav-link[data-vista]').on('click', function(e) {
        e.preventDefault();
        const vistaSolicitada = $(this).data('vista');
        $('.sidebar .nav-link').removeClass('active');
        $(this).addClass('active');
        window.cargarVista(vistaSolicitada);
    });

    // Clics en elementos con 'data-vista' que se cargan dinámicamente
    mainContent.on('click', '[data-vista]', function(e) {
        e.preventDefault();
        const vistaSolicitada = $(this).data('vista');
        // Simula un clic en el menú lateral para mantener la consistencia
        $(`.sidebar .nav-link[data-vista="${vistaSolicitada}"]`).click();
    });

    // --- INICIO DE LA MODIFICACIÓN ---
    // Unificamos los clics de los botones de la tabla en un solo manejador de eventos
    mainContent.on('click', 'button[data-codigo]', function() {
        const codigo = $(this).data('codigo');
        let vista = null;

        if ($(this).hasClass('btn-gestionar-contenido')) {
            vista = 'gestionar_contenido';
        } else if ($(this).hasClass('btn-editar-encabezado')) {
            vista = 'editar_acta';
        }
        // Aquí podríamos añadir el 'else if' para el botón de previsualizar de la lista si lo reincorporamos

        if (vista) {
            window.cargarVista(vista, codigo);
        }
    });
    // --- FIN DE LA MODIFICACIÓN ---
    

    // ===================================================================
    //  # CARGA INICIAL
    // ===================================================================

    // Carga el dashboard por defecto al iniciar la aplicación
    window.cargarVista('dashboard');
});