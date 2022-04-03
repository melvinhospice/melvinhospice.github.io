<?php
include 'connectPdo.php';
class SessDb{
	
	public static function getListeSess()
	{
		$sql = "select * from session ";		
		$objResultat = DbPdo::getPdo()->query($sql);	
		$result = $objResultat->fetchAll();
		return $result;
	}
	
}

?>