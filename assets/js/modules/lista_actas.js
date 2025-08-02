// assets/js/modules/lista_actas.js

/**
 * ## inicializarVista
 * **Función principal:** Se ejecuta cuando la vista 'lista_actas' se carga.
 * Su única misión es llamar a la función que inicializa la tabla.
 */
window.inicializarVista = function() {
    
    const mainContent = $('#main-content');
    
    /**
     * Obtiene las actas del backend y las muestra en una tabla DataTables.
     */
    function inicializarTablaActas() {
        fetch(`${APP_CONFIG.backendUrl}actas/obtener`, { headers: { 'Authorization': `Bearer ${APP_CONFIG.token}` }})
        .then(response => {
            if (response.status === 401) throw new Error('Sesión expirada');
            if (!response.ok) throw new Error('Respuesta del servidor no fue OK');
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            }
            let tbody = '';
            data.forEach(acta => {
                tbody += `<tr>
                    <td>${acta.codigo || 'N/A'}</td>
                    <td>${acta.tema || 'N/A'}</td>
                    <td>${acta.lugar || 'N/A'}</td>
                    <td>${acta.fecha || 'N/A'}</td>
                    <td><span class="badge badge-info">${acta.firma || 'N/A'}</span></td>
                    <td>
                        <button class="btn btn-xs btn-info btn-previsualizar-lista" data-codigo="${acta.codigo}" title="Previsualizar"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-xs btn-primary btn-editar-encabezado" data-codigo="${acta.codigo}" title="Editar Encabezado"><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn btn-xs btn-success btn-gestionar-contenido" data-codigo="${acta.codigo}" title="Gestionar Contenido"><i class="fas fa-stream"></i></button>
                    </td>
                </tr>`;
            });
            $('#tabla-actas tbody').html(tbody);
            $('#tabla-actas').DataTable({
                "responsive": true, "lengthChange": false, "autoWidth": false,
                "language": { "sProcessing":"Procesando...","sLengthMenu":"Mostrar _MENU_ registros","sZeroRecords":"No se encontraron resultados","sEmptyTable":"Ningún dato disponible en esta tabla","sInfo":"Mostrando del _START_ al _END_ de _TOTAL_ registros","sInfoEmpty":"Mostrando del 0 al 0 de 0 registros","sInfoFiltered":"(filtrado de _MAX_ registros)","sSearch":"Buscar:","oPaginate":{"sFirst":"Primero","sLast":"Último","sNext":"Siguiente","sPrevious":"Anterior"}}
            });
        })
        .catch(error => {
            console.error('Error al cargar actas:', error);
            if (error.message === 'Sesión expirada') {
                window.mostrarNotificacion('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.', 'danger');
            } else {
                $('#tabla-actas tbody').html('<tr><td colspan="6" class="text-center text-danger">Error al cargar los datos.</td></tr>');
            }
        });
    }

    // Llamada inicial al cargar el módulo
    inicializarTablaActas();
};