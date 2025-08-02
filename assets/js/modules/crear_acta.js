// assets/js/modules/crear_acta.js

window.inicializarVista = function() {

    const mainContent = $('#main-content');

    function renumerarTemarios() {
        $('#contenedor-temarios .input-group').each(function(index) {
            $(this).find('.input-group-text').text(index + 1 + '.');
        });
    }

    mainContent.on('click', '#btn-agregar-temario', function() {
        const nuevoTemario = `<div class="input-group mb-2"><span class="input-group-text"></span><input type="text" class="form-control" name="temario[]" placeholder="Siguiente punto del temario" required><button type="button" class="btn btn-outline-danger btn-remover-temario"><i class="fas fa-times"></i></button></div>`;
        $('#contenedor-temarios').append(nuevoTemario);
        renumerarTemarios();
    });

    mainContent.on('click', '.btn-remover-temario', function() {
        $(this).closest('.input-group').remove();
        renumerarTemarios();
    });

    mainContent.on('click', '#btn-guardar-acta', function() {
        const form = document.getElementById('form-crear-acta');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const temarios = [];
        $('input[name="temario[]"]').each(function() { temarios.push($(this).val()); });
        const payload = JSON.parse(atob(APP_CONFIG.token.split('.')[1]));
        const data = {
            tema: $('#tema').val(), tipo_reunion: $('#tiporeunion').val(), lugar: $('#lugar').val(), fecha: $('#fecha').val(),
            horaInicio: $('#HoraI').val(), horaFin: $('#HoraF').val(), cantidad_asistentes: $('#asistentes').val(),
            temario: temarios, create_acta_user: payload.cedula, usuarios: [payload.cedula], firma: "Borrador"
        };
        fetch(`${APP_CONFIG.backendUrl}actas/crear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${APP_CONFIG.token}`},
            body: JSON.stringify(data)
        })
        .then(response => { if (!response.ok) throw new Error('Error al guardar.'); return response.json(); })
        .then(responseData => {
            window.mostrarNotificacion(`Acta ${responseData.codigo} creada. Redirigiendo...`);
            setTimeout(() => { window.cargarVista('lista_actas'); }, 2000);
        })
        .catch(error => { window.mostrarNotificacion('Hubo un error al guardar el acta.', 'danger'); console.error(error); });
    });

    // Desvincular eventos al salir de la vista para evitar duplicados
    mainContent.on('remove', function() {
        mainContent.off('click', '#btn-agregar-temario');
        mainContent.off('click', '.btn-remover-temario');
        mainContent.off('click', '#btn-guardar-acta');
    });
};