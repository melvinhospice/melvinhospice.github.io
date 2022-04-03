<?php
//modele Singleton
class DbPdo {
    private static $db;
    private function __construct(){}
    static function getPdo() {
        if(!isset(self::$db))
        {
            self::$db = new PDO('mysql:host=127.0.0.1;dbname=gestion'   ,'root','root');
            self::$db ->query('SET NAMES utf8');
            self::$db ->query('SET CHARACTER SET');
        }
        return self::$db;   
    }
}
