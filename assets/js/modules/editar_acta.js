// assets/js/modules/editar_acta.js

window.inicializarVista = function(actaCodigo) {

    const mainContent = $('#main-content');

    function renumerarTemariosEditar() {
        $('#contenedor-temarios-editar .input-group').each(function(index) {
            $(this).find('.input-group-text').text(index + 1 + '.');
        });
    }

    function inicializarEdicion() {
        fetch(`${APP_CONFIG.backendUrl}actas/obtener/${actaCodigo}`, { headers: { 'Authorization': `Bearer ${APP_CONFIG.token}` }})
        .then(response => response.json())
        .then(data => {
            $('#tema-editar').val(data.tema);
            $('#lugar-editar').val(data.lugar);
            $('#fecha-editar').val(data.fecha);
            $('#HoraI-editar').val(data.horaInicio);
            $('#HoraF-editar').val(data.horaFin);
            $('#asistentes-editar').val(data.cantidad_asistentes);
            const tipoSelect = $('#tiporeunion-editar');
            tipoSelect.html(`<option value="1">Comite mensual</option><option value="2">Verificacion en campo</option><option value="10">Otros</option>`);
            tipoSelect.val(data.tipo_reunion);
            const contenedorTemarios = $('#contenedor-temarios-editar');
            contenedorTemarios.html('');
            if (data.temario && Array.isArray(data.temario)) {
                data.temario.forEach(item => {
                    const nuevoTemario = `<div class="input-group mb-2"><span class="input-group-text"></span><input type="text" class="form-control" name="temario-editar[]" value="${item}" required><button type="button" class="btn btn-outline-danger btn-remover-temario-editar"><i class="fas fa-times"></i></button></div>`;
                    contenedorTemarios.append(nuevoTemario);
                });
            }
            renumerarTemariosEditar();
        });
    }

    mainContent.on('click', '#btn-agregar-temario-editar', function() {
        const nuevoTemario = `<div class="input-group mb-2"><span class="input-group-text"></span><input type="text" class="form-control" name="temario-editar[]" placeholder="Nuevo punto" required><button type="button" class="btn btn-outline-danger btn-remover-temario-editar"><i class="fas fa-times"></i></button></div>`;
        $('#contenedor-temarios-editar').append(nuevoTemario);
        renumerarTemariosEditar();
    });

    mainContent.on('click', '.btn-remover-temario-editar', function() {
        $(this).closest('.input-group').remove();
        renumerarTemariosEditar();
    });

    mainContent.on('click', '#btn-actualizar-acta', function() {
        const actaCodigo = $('#form-editar-acta').data('acta-codigo');
        const temarios = [];
        $('input[name="temario-editar[]"]').each(function() { temarios.push($(this).val()); });
        const data = {
            tema: $('#tema-editar').val(), lugar: $('#lugar-editar').val(), fecha: $('#fecha-editar').val(),
            horaInicio: $('#HoraI-editar').val(), horaFin: $('#HoraF-editar').val(), cantidad_asistentes: $('#asistentes-editar').val(),
            tipo_reunion: $('#tiporeunion-editar').val(), temario: temarios
        };
        fetch(`${APP_CONFIG.backendUrl}actas/actualizar/${actaCodigo}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${APP_CONFIG.token}`},
            body: JSON.stringify(data)
        })
        .then(response => { if (!response.ok) throw new Error('Error al actualizar.'); return response.json(); })
        .then(() => {
            window.mostrarNotificacion('Acta actualizada exitosamente.');
            window.cargarVista('lista_actas');
        })
        .catch(error => { window.mostrarNotificacion('Hubo un error al actualizar.', 'danger'); console.error(error); });
    });

    inicializarEdicion();

    mainContent.on('remove', function() {
        mainContent.off('click', '#btn-agregar-temario-editar');
        mainContent.off('click', '.btn-remover-temario-editar');
        mainContent.off('click', '#btn-actualizar-acta');
    });
};