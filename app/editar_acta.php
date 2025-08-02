<?php
$acta_codigo = htmlspecialchars($_POST['id'] ?? 'Error');
?>

<div class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0">Editar Encabezado del Acta</h1>
            </div>
        </div>
    </div>
</div>
<div class="content">
    <div class="container-fluid">
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h5 class="m-0">Modificando Acta: <strong><?php echo $acta_codigo; ?></strong></h5>
            </div>
            <div class="card-body">
                <form id="form-editar-acta" data-acta-codigo="<?php echo $acta_codigo; ?>">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="tema-editar">Tema Principal</label>
                                <input type="text" class="form-control" id="tema-editar" required>
                            </div>
                            <div class="form-group">
                                <label for="lugar-editar">Lugar de la Reunión</label>
                                <input type="text" class="form-control" id="lugar-editar" required>
                            </div>
                            <div class="form-group">
                                <label for="tiporeunion-editar">Tipo de Reunión</label>
                                <select class="form-control" id="tiporeunion-editar" required></select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="fecha-editar">Fecha</label>
                                <input type="date" class="form-control" id="fecha-editar" required>
                            </div>
                            <div class="row">
                                <div class="col-sm-6"><div class="form-group"><label for="HoraI-editar">Hora Inicio</label><input type="time" class="form-control" id="HoraI-editar" required></div></div>
                                <div class="col-sm-6"><div class="form-group"><label for="HoraF-editar">Hora Fin</label><input type="time" class="form-control" id="HoraF-editar" required></div></div>
                            </div>
                            <div class="form-group">
                                <label for="asistentes-editar">N° de Asistentes</label>
                                <input type="number" class="form-control" id="asistentes-editar" min="1" required>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <h5>Temario de la Reunión</h5>
                    <div id="contenedor-temarios-editar"></div>
                    <button type="button" class="btn btn-sm btn-success mt-2" id="btn-agregar-temario-editar">
                        <i class="fas fa-plus"></i> Agregar Punto
                    </button>
                </form>
            </div>
            <div class="card-footer text-right">
                <button type="button" class="btn btn-secondary" data-vista="lista_actas">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btn-actualizar-acta">
                    <i class="fas fa-save"></i> Actualizar Encabezado
                </button>
            </div>
        </div>
    </div>
</div>