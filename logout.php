<?php
// Es crucial iniciar la sesión para poder acceder a ella.
session_start();

// Elimina todas las variables de la sesión.
$_SESSION = array();

// Destruye la sesión por completo.
session_destroy();

// Redirige al usuario a la página de inicio de sesión.
header("Location: login.php");

// Asegura que el script se detenga después de la redirección.
exit();
?>