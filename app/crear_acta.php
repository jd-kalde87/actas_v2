<div class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0">Crear Nueva Acta</h1>
            </div>
        </div>
    </div>
</div>
<div class="content">
    <div class="container-fluid">
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h5 class="m-0">Información General del Acta</h5>
            </div>
            <div class="card-body">
                <form id="form-crear-acta">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="tema">Tema Principal</label>
                                <input type="text" class="form-control" id="tema" placeholder="Ej: Revisión Mensual de Avances" required>
                            </div>
                            <div class="form-group">
                                <label for="lugar">Lugar de la Reunión</label>
                                <input type="text" class="form-control" id="lugar" placeholder="Ej: Sala de Juntas Principal" required>
                            </div>
                            <div class="form-group">
                                <label for="tiporeunion">Tipo de Reunión</label>
                                <select class="form-control" id="tiporeunion" required>
                                    <option value="" disabled selected>Seleccione un tipo...</option>
                                    <option value="1">Comite mensual</option>
                                    <option value="2">Verificacion en campo</option>
                                    <option value="10">Otros</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="fecha">Fecha</label>
                                <input type="date" class="form-control" id="fecha" required>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="HoraI">Hora Inicio</label>
                                        <input type="time" class="form-control" id="HoraI" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="HoraF">Hora Fin</label>
                                        <input type="time" class="form-control" id="HoraF" required>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="asistentes">N° de Asistentes Esperados</label>
                                <input type="number" class="form-control" id="asistentes" min="1" required>
                            </div>
                        </div>
                    </div>

                    <hr>
                    
                    <h5>Temario de la Reunión</h5>
                    <div id="contenedor-temarios">
                        <div class="input-group mb-2">
                            <span class="input-group-text">1.</span>
                            <input type="text" class="form-control" name="temario[]" placeholder="Punto 1 del temario" required>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-success mt-2" id="btn-agregar-temario">
                        <i class="fas fa-plus"></i> Agregar Punto
                    </button>

                </form>
            </div>
            <div class="card-footer text-right">
                <button type="button" class="btn btn-secondary" id="btn-previsualizar-acta">
                    <i class="fas fa-eye"></i> Previsualizar
                </button>
                <button type="button" class="btn btn-primary" id="btn-guardar-acta">
                    <i class="fas fa-save"></i> Guardar Acta
                </button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modal-previsualizacion" tabindex="-1" aria-hidden="true" style="display: none;">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Previsualización del Acta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
                <iframe id="preview-pdf" width="100%" height="600px" style="border: none;"></iframe>
            </div>
        </div>
    </div>
</div>