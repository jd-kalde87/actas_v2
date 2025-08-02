<?php
// Recibimos el token enviado por POST desde app.js
$token = $_POST['token'] ?? ''; 
?>


<div class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0">Lista de Actas</h1>
            </div>
            <div class="col-sm-6">
                <button class="btn btn-primary float-right" data-vista="crear_acta">
                    <i class="fas fa-plus"></i> Nueva Acta
                </button>
            </div>
        </div>
    </div>
</div>
<div class="content">
    <div class="container-fluid">
        <div class="card">
            <div class="card-body">
                <table id="tabla-actas" class="table table-bordered table-striped" style="width:100%;">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Tema</th>
                            <th>Lugar</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                        <tbody>
                            <tr>
                                <td colspan="6" class="text-center">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="sr-only">Cargando...</span>
                                    </div>
                                    <p class="mt-2">Cargando datos del servidor...</p>
                                </td>
                            </tr>
                        </tbody>
                </table>
            </div>
        </div>
    </div>
</div>