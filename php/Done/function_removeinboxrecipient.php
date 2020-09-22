<?php
    
    require_once ('include/header.php');
    require_once ('include/session.php');
    
    require_once ('model/tagat_email.php');
    require_once ('model/baseconv.php');
    
    if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';
    if (!class_exists('gcsearch')) require_once 'model/googleCon.php';
    if (!class_exists('S3')) require_once 'model/S3.php';
    
    
    //REQUEST VARIABLES
    $requestParams  = $_POST["json"];
    $get_callback 	= $_GET["callback"];
    
    if ($requestParams == null )    {
        
        _senderror("Forbidden");
    }
    $prams = json_decode($requestParams);
    $s3 = new S3($awsAccessKey, $awsSecretKey);
    $gcsearch = new gcsearch();
    
    $mStrDataType="";
    switch ($prams->cDataType) {
        case 1://template
            $mStrDataType = "Templates";
            break;
        case 2://document
            $mStrDataType = "Templates";
            break;
        case 3://view
            $mStrDataType = "Templates";
            break;
    }
    
    //delete s3Object in user email folder
    //$objPath = $prams->cStrUserEmail."/".$mStrDataType."/".$prams->cStrObjID;
    //$delete = $s3->deleteObjectCustom($objPath);
    //if (!$delete){
    //    _senderror("Error deleing");
    //}
    
    //delete from sharedRecipients
    $objPath= "sharedRecipients/".$prams->cStrObjID."/".$prams->cStrUserEmail;
    $delete = $s3->deleteObjectCustom($objPath);
    if (!$delete){
        //_senderror("Error deleing Recipient");
    }
    
    //deleting from google index
    $delete = $gcsearch->deleteObject($prams->cStrUserEmail, $prams->cStrObjID);
    if (!$delete){
        _senderror("Error deleting");
    }
    
    $awsAccess = null;
    $awsAccess->bSUCCESS = true;
    _send($awsAccess);
    
    ?>
