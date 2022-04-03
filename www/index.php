<?php
session_start();
include 'vue/head.php';


if(isset($_SESSION['connect'])){ //connexion à la session
    include 'vue/menu.php';

    if(isset($_GET['land'])){
        switch($_GET['land']) {

            case 'event':
                    include 'controleur/ctlEvent.php';
                    break;
        
            }
        }
    else
    {
    include 'vue/landing.html';
    }

}
if(isset($_GET['ctl'])) {  //appel de produits

    switch($_GET['ctl']) {

            case 'connect':
                include 'controleur/ctlConnect.php';
                break;
    }
}

if(!isset($_SESSION['connect'])) {
    
    include 'vue/formLogin.php';}
    include 'vue/footer.php';

?>