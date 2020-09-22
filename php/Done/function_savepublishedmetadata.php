<?php
  
require_once ('include/header.php');
require_once ('include/session.php');

if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';
if (!class_exists('UpdateGCUserData')) require_once 'model/UpdateGCUserData.php';


//$loggeinuser = _session_getuser();
//REQUEST VARIABLES
$paramJson = $_POST["json"];
$get_callback = $_GET["callback"];
if ($paramJson == null )
{
    _senderror("Forbidden");    
}
$paramObj = json_decode($paramJson);
$thismeta = $paramObj->cMetadata;
$loggeinuser = $paramObj->cUser;

//google cloud meta data update
$gcUserDataobj = new UpdateGCUserData($loggeinuser);

//Update main object's GC data
$result = $gcUserDataobj->updateObjectData($thismeta);
if(!$result){
    _senderror($result);
}
//Update parent object's GC data
if ($paramObj->cBNewData)
{      
    $result = $gcUserDataobj->updateParentObjectData($thismeta);
    if(!$result){
        _senderror($result);
    }
}
//everything ok
$awsAccess = null;
$awsAccess->bSUCCESS = true;
_send($awsAccess);

?>
