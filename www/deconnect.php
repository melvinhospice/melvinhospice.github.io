<?php
session_start();
unset($_SESSION['tp']);
session_destroy();
header('Location: index.php');
?>  
