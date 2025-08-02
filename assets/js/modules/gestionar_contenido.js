/**
 * Módulo para la vista "Gestionar Contenido".
 * de un acta específica (intervenciones y compromisos).
 */
window.inicializarVista = function(actaCodigo) {

    const mainContent = $('#main-content');
    const form = $('#form-contenido-acta');

    // ===================================================================
    //  # FUNCIONES DE CARGA DE DATOS
    // ===================================================================

    /**
     * Carga el temario del acta en el menú desplegable.
     */
    function inicializarGestionContenido() {
        fetch(`${APP_CONFIG.backendUrl}actas/obtener/${actaCodigo}`, { headers: { 'Authorization': `Bearer ${APP_CONFIG.token}` }})
        .then(response => response.json())
        .then(data => {
            const temarioSelect = $('#temario-select');
            temarioSelect.html('<option value="" selected disabled>Seleccione un punto...</option>');
            if (data.temario && Array.isArray(data.temario)) {
                data.temario.forEach(item => {
                    temarioSelect.append(`<option value="${item}">${item}</option>`);
                });
            }
        });
        cargarContenidoExistente();
    }

    /**
     * Obtiene y muestra el contenido ya guardado para esta acta.
     * Añade botones de Editar y Eliminar a cada item.
     */
function cargarContenidoExistente() {
        const contenidoContainer = $('#contenido-existente-container');
        fetch(`${APP_CONFIG.backendUrl}contenido-actas/obtener/${actaCodigo}`, { headers: { 'Authorization': `Bearer ${APP_CONFIG.token}` }})
        .then(response => response.json())
        .then(data => {
            contenidoContainer.html(''); // Limpiar antes de mostrar
            if (data && data.length > 0) {
                data.forEach(item => {
                    
                    let compromisosTexto = item.compromisos;
                    let compromisosHtml = '<p class="text-muted small">No hay compromisos para este punto.</p>';

                    // --- INICIO DE LA CORRECCIÓN ---
                    // Ahora, esta lógica parsea el texto formateado que estamos guardando.
                    if (compromisosTexto && typeof compromisosTexto === 'string' && compromisosTexto.trim() !== '') {
                        compromisosHtml = '<table class="table table-sm table-bordered" style="font-size: 0.9em;"><thead><tr><th>Compromiso</th><th>Responsable</th><th>Fecha</th></tr></thead><tbody>';
                        const lineas = compromisosTexto.trim().split('\n');
                        lineas.forEach(linea => {
                            // Usamos una expresión regular para extraer los datos
                            const match = linea.match(/(\d+\.\s)(.*)\[Responsable:\s(.*)\s\|\sFecha:\s(.*)\]/);
                            if (match) {
                                const descripcion = match[2].trim();
                                const responsable = match[3].trim();
                                const fecha = match[4].trim();
                                compromisosHtml += `<tr><td>${descripcion}</td><td>${responsable}</td><td>${fecha}</td></tr>`;
                            }
                        });
                        compromisosHtml += '</tbody></table>';
                    }
                    // --- FIN DE LA CORRECCIÓN ---

                    const contenidoHtml = `
                        <div class="callout callout-info" data-item-id="${item.id}">
                            <div class="float-right">
                                <button class="btn btn-xs btn-primary btn-editar-contenido" title="Editar"><i class="fas fa-pencil-alt"></i></button>
                                <button class="btn btn-xs btn-danger btn-eliminar-contenido" title="Eliminar"><i class="fas fa-trash"></i></button>
                            </div>
                            <h5>${item.temario_code}</h5>
                            <strong>Intervenciones:</strong>
                            <p>${item.intervenciones || 'No registradas.'}</p>
                            <strong>Compromisos:</strong>
                            ${compromisosHtml} 
                        </div>`;
                    const elemento = $(contenidoHtml);
                    elemento.data('itemData', item);
                    contenidoContainer.append(elemento);
                });
            } else {
                contenidoContainer.html('<p class="text-muted">Aún no se ha añadido contenido a esta acta.</p>');
            }
        });
    }


    // ===================================================================
    //  # MANEJO DE EVENTOS DE LA VISTA
    // ===================================================================

    // --- Lógica para el Formulario de Contenido (Izquierda) ---

    mainContent.on('click', '#btn-agregar-compromiso', function() {
        const nuevoCompromisoHtml = `<div class="compromiso-item border rounded p-2 mb-2"><div class="form-group"><textarea class="form-control compromiso-descripcion" rows="2" placeholder="Descripción del compromiso..." required></textarea></div><div class="row"><div class="col-md-6"><input type="text" class="form-control compromiso-responsable" placeholder="Responsable"></div><div class="col-md-6"><input type="date" class="form-control compromiso-fecha"></div></div><div class="row mt-1"><div class="col-md-6"><div class="form-check"><input class="form-check-input compromiso-sin-responsable" type="checkbox"><label class="form-check-label small">Sin Responsable</label></div></div><div class="col-md-6"><div class="form-check"><input class="form-check-input compromiso-sin-fecha" type="checkbox"><label class="form-check-label small">Sin Fecha</label></div></div></div><button type="button" class="btn btn-xs btn-danger mt-2 btn-remover-compromiso">Eliminar</button></div>`;
        $('#contenedor-compromisos').append(nuevoCompromisoHtml);
    });

    mainContent.on('click', '.btn-remover-compromiso', function() {
        $(this).closest('.compromiso-item').remove();
    });

    mainContent.on('change', '.compromiso-sin-responsable', function() {
        $(this).closest('.compromiso-item').find('.compromiso-responsable').prop('disabled', this.checked).val('');
    });

    mainContent.on('change', '.compromiso-sin-fecha', function() {
        $(this).closest('.compromiso-item').find('.compromiso-fecha').prop('disabled', this.checked).val('');
    });

    // --- Lógica para Contenido Existente (Derecha) ---

    mainContent.on('click', '.btn-eliminar-contenido', function() {
        if (confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) {
            const itemId = $(this).closest('.callout').data('item-id');
            fetch(`${APP_CONFIG.backendUrl}contenido-actas/eliminar/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${APP_CONFIG.token}` }
            }).then(response => {
                if(response.ok) {
                    window.mostrarNotificacion('Registro eliminado exitosamente.', 'success');
                    cargarContenidoExistente(actaCodigo);
                } else {
                    window.mostrarNotificacion('Error al eliminar el registro.', 'danger');
                }
            });
        }
    });

    mainContent.on('click', '.btn-editar-contenido', function() {
        const itemData = $(this).closest('.callout').data('itemData');
        
        // 1. Llenar los campos principales (esto ya funcionaba)
        $('#temario-select').val(itemData.temario_code);
        $('#intervenciones').val(itemData.intervenciones);
        
        const contenedorCompromisos = $('#contenedor-compromisos');
        contenedorCompromisos.html(''); // Limpiar compromisos anteriores
        
        // --- INICIO DE LA CORRECCIÓN ---
        // 2. "Traducir" el texto de los compromisos para rellenar el formulario
        let compromisosTexto = itemData.compromisos;

        if (compromisosTexto && typeof compromisosTexto === 'string' && compromisosTexto.trim() !== '') {
            // Dividir el texto en líneas individuales
            const lineas = compromisosTexto.trim().split('\n');
            
            lineas.forEach(linea => {
                // Usar la misma expresión regular para extraer los datos de cada línea
                const match = linea.match(/(\d+\.\s)(.*)\[Responsable:\s(.*)\s\|\sFecha:\s(.*)\]/);
                
                if (match) {
                    const descripcion = match[2].trim();
                    const responsable = match[3].trim();
                    const fecha = match[4].trim();

                    // a. Simular un clic para crear un nuevo bloque de compromiso vacío
                    $('#btn-agregar-compromiso').click();
                    
                    // b. Seleccionar el último bloque que acabamos de crear
                    const nuevoItem = contenedorCompromisos.find('.compromiso-item:last');
                    
                    // c. Rellenar los campos de ese nuevo bloque con los datos extraídos
                    nuevoItem.find('.compromiso-descripcion').val(descripcion);

                    if (responsable !== 'N/A') {
                        nuevoItem.find('.compromiso-responsable').val(responsable);
                    } else {
                        nuevoItem.find('.compromiso-sin-responsable').prop('checked', true).trigger('change');
                    }

                    if (fecha !== 'N/A') {
                        nuevoItem.find('.compromiso-fecha').val(fecha);
                    } else {
                        nuevoItem.find('.compromiso-sin-fecha').prop('checked', true).trigger('change');
                    }
                }
            });
        }
        
        $('#btn-guardar-contenido').html('<i class="fas fa-sync-alt"></i> Actualizar Contenido').data('editing-id', itemData.id);
        window.mostrarNotificacion('Modo de edición activado. Realice los cambios y haga clic en "Actualizar".', 'info');
    });

    // --- Eventos de Botones Principales (Footer) ---

mainContent.on('click', '#btn-guardar-contenido', function() {
    const editingId = $(this).data('editing-id');
    let url = `${APP_CONFIG.backendUrl}contenido-actas/create`;
    let method = 'POST';

    if (editingId) {
        url = `${APP_CONFIG.backendUrl}contenido-actas/actualizar/${editingId}`;
        method = 'PATCH';
    }
    
    // --- INICIO DE LA CORRECCIÓN ---
    // 1. Recolectar los compromisos del formulario en un array
    const compromisosArray = [];
    $('#contenedor-compromisos .compromiso-item').each(function() {
        const item = $(this);
        const descripcion = item.find('.compromiso-descripcion').val();
        if (descripcion) { // Solo procesar si hay una descripción
            compromisosArray.push({
                descripcion: descripcion,
                responsable: item.find('.compromiso-sin-responsable').is(':checked') ? 'N/A' : item.find('.compromiso-responsable').val(),
                fecha: item.find('.compromiso-sin-fecha').is(':checked') ? 'N/A' : item.find('.compromiso-fecha').val()
            });
        }
    });

    // 2. Convertir el array a un texto formateado (el "idioma" que el backend entiende)
    let compromisosTexto = '';
    if (compromisosArray.length > 0) {
        compromisosArray.forEach((comp, index) => {
            compromisosTexto += `${index + 1}. ${comp.descripcion} [Responsable: ${comp.responsable} | Fecha: ${comp.fecha}]\n`;
        });
    }
    // --- FIN DE LA CORRECCIÓN ---

        const data = {
            acta: actaCodigo,
            temario_code: $('#temario-select').val(),
            intervenciones: $('#intervenciones').val(),
            compromisos: compromisosTexto.trim() // Usamos siempre el texto formateado
        };

        if (!data.temario_code) {
            window.mostrarNotificacion('Por favor, seleccione un punto del temario.', 'warning');
            return;
        }

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${APP_CONFIG.token}`},
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) throw new Error(editingId ? 'Error al actualizar.' : 'Error al guardar.');
            return response.json();
        }).then(() => {
            window.mostrarNotificacion(editingId ? 'Contenido actualizado exitosamente.' : 'Contenido añadido exitosamente.', 'success');
            form[0].reset();
            $('#contenedor-compromisos').html('');
            $('#btn-guardar-contenido').html('<i class="fas fa-plus"></i> Añadir al Acta').removeData('editing-id');
            cargarContenidoExistente(actaCodigo);
        }).catch(error => {
            console.error("Error:", error);
            window.mostrarNotificacion(error.message, 'danger');
        });
    });



    // ===================================================================
    //  # INICIALIZACIÓN DE LA VISTA
    // ===================================================================
    inicializarGestionContenido();

    // Desvincular eventos para evitar duplicados al cambiar de vista
    mainContent.on('remove', function() {
        mainContent.off('click', '#btn-agregar-compromiso');
        mainContent.off('click', '.btn-remover-compromiso');
        mainContent.off('click', '#btn-guardar-contenido');
        mainContent.off('click', '.btn-eliminar-contenido');
        mainContent.off('click', '.btn-editar-contenido');
        mainContent.off('change', '.compromiso-sin-responsable');
        mainContent.off('change', '.compromiso-sin-fecha');
    });
};