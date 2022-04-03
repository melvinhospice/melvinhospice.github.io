<?php
include 'connectPdo.php';
class EventDb{
	
	public static function getListeEvent()
	{
		$sql = "select * from evenement ";		
		$objResultat = DbPdo::getPdo()->query($sql);	
		$result = $objResultat->fetchAll();
		return $result;
	}

    public static function getOneEvent()
	{

        $ref=$_GET['num'];
        $sql = "select * from evenement where idEv =:x";
        $result = DbPdo::getPdo()->prepare($sql);
        $result->bindParam(':x',$ref);
        $result->execute();
        $liste=$result->fetch();

    }

    public static function ajouterEvent($nom, $type, $desc, $pix, $date, $id2) 
    {
            $sql = "INSERT INTO `evenement` (`idEv`, `nomEv`, `typeEv`, `descripEv`, `photoEv`, `dateEv`, `id` ) VALUES (NULL, :nom, :typ, :descr, :pix, :dat, :id2);";
            $result = DbPdo::getPdo()->prepare($sql);
            $result->bindParam(':nom',$nom);
            $result->bindParam(':typ',$type);
            $result->bindParam(':descr',$desc);
            $result->bindParam(':pix',$pix);
            $result->bindParam(':dat',$date);
            $result->bindParam(':id2',$id2);

            $result->execute();
    
           
    }
    public static function suppEvent($nom, $type, $desc, $pix, $date, $id2) 
    {
            $sql = "UPDATE SET `evenement` (`idEv`, `nomEv`, `typeEv`, `descripEv`, `photoEv`, `dateEv`, `id` ) VALUES (NULL, :nom, :typ, :descr, :pix, :dat, :id2);";
            $result = DbPdo::getPdo()->prepare($sql);
            $result->bindParam(':nom',$nom);
            $result->bindParam(':typ',$type);
            $result->bindParam(':descr',$desc);
            $result->bindParam(':pix',$pix);
            $result->bindParam(':dat',$date);
            $result->bindParam(':id2',$id2);

            $result->execute();
    
           
    }

}           

?>