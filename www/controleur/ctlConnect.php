<?php
include './model/userDb.php';
$action = $_GET['action'];
switch($action) {
   case 'validConnect':
      //appel à la BDD
      $login=$_POST['login'];
      $mdp=$_POST['mdp'];
      $unUser=UserDb::getLoginUser($login,$mdp);
      if(is_array($unUser)) {
         $_SESSION['connect']=true;
         $_SESSION['id']=$unUser['id'];
         $_SESSION['nom']=$unUser['nom'];
         header('Location: index.php');
      }

      break;   
}

?>