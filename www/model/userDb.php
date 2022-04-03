<?php
include 'connectPdo.php';
class UserDb{

    public static function getLoginUser($login, $mdp)
    {
        $sql="select * from user where login='$login' and mdp='$mdp' ";
        $objResultat=DbPdo::getPdo()->query($sql);
        $result=$objResultat->fetch();
        return $result;
    }
}


?>