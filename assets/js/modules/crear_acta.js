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

    mainContent.on('click', '#btn-previsualizar-acta', function() {
        const { jsPDF } = window.jspdf;
        const form = document.getElementById('form-crear-acta');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Recopilar datos del formulario
        const tema = $('#tema').val() || 'N/A';
        const lugar = $('#lugar').val() || 'N/A';
        const fechaInput = $('#fecha').val();
        const fecha = fechaInput ? new Date(fechaInput + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
        const horaInicio = $('#HoraI').val() || 'N/A';
        const horaFin = $('#HoraF').val() || 'N/A';
        const temarios = $('input[name="temario[]"]').map(function() { return $(this).val(); }).get();

        // Crear contenido HTML para el PDF
        let temarioHtml = '<ul>';
        temarios.forEach(t => { if(t) temarioHtml += `<li>${t}</li>`; });
        temarioHtml += '</ul>';

        const previewHtml = `
            <div id="pdf-preview-content" style="padding: 20px; font-family: Arial, sans-serif; color: #333; width: 210mm;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="assets/img/logo2.png" alt="Logo" style="max-width: 150px;"/>
                    <h1 style="color: #0056b3; margin-top: 10px;">BORRADOR DE ACTA</h1>
                </div>
                <hr>
                <h2 style="color: #0056b3;">Información General</h2>
                <p><strong>Tema:</strong> ${tema}</p>
                <p><strong>Lugar:</strong> ${lugar}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <p><strong>Hora:</strong> ${horaInicio} - ${horaFin}</p>
                <hr>
                <h2 style="color: #0056b3;">Temario</h2>
                ${temarioHtml}
                <hr>
                <div style="margin-top: 80px;">
                    <p><strong>Firmas:</strong></p>
                    <br><br><br>
                    <p style="border-top: 1px solid #333; padding-top: 5px;">Firma del Responsable</p>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.innerHTML = previewHtml;
        document.body.appendChild(container);

        html2canvas(container.querySelector('#pdf-preview-content'), { scale: 2, useCORS: true }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            const pdfDataUri = pdf.output('datauristring');
            $('#preview-pdf').attr('src', pdfDataUri);
            $('#modal-previsualizacion').modal('show');

            document.body.removeChild(container);
        });
    });

    // La limpieza de eventos ahora es manejada automáticamente por app.js
};