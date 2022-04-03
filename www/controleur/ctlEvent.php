<?php
include './model/eventDb.php';
$action = $_GET['action'];

switch($action) {

   case 'lister':
   //appel à la base de données
   $liste = EventDb::getListeEvent();
   include 'vue/vueEvent/listeEvents.php';
   break;

   //$liste1 = SessDb::getListeSess();
   //include 'vue/vueEvent/listeSess.php';
   //break;

   case 'oneEvent':
   //affiche une page d'evenements
   $tab = EventDb::getOneEvent();
   include 'vue/vueEvent/pageEvent.php';
   break;

   case 'modifEv':

      include 'vue/modifEvent.php';

         $nom = $_POST['nom'];
         $type = $_POST['type'];
         $desc = $_POST['desc'];
         $pix = $_POST['pix'];
         $date = $_POST['date'];
         $id2 = $_POST['id2'];
         EventDb::suppEvent($nom, $type, $desc, $pix, $date, $id2);
         header('Location : index.php?land=event&action=lister');
   break;

   case 'formAjout':
      include 'vue/ajoutEvent.php';
   break;

   case 'validerAjout':

      include 'vue/ajoutEvent.php';
     
          
         $nom = $_POST['nom'];
         $type = $_POST['type'];
         $desc = $_POST['desc'];
         $pix = $_POST['pix'];
         $date = $_POST['date'];
         $id2 = $_POST['id2'];
         EventDb::ajouterEvent($nom, $type, $desc, $pix, $date, $id2);
         header('Location : index.php?land=event&action=lister');
        
         
      
   break;
} 

?>