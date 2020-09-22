<?php  
    require_once ('include/header.php');
    require_once ('include/session.php');
    if (!function_exists('curl_init')) {  require_once 'purl-master/src/Purl.php';}
    if (!class_exists('gcsearch')) require_once 'model/googleCon.php';
    $jsondata  = $_POST["json"];
    $get_callback 	= $_GET["callback"];
    if ($jsondata == null)
    {
        _senderror("Forbidden");
    }
    $gcsearch = new gcsearch();
    $paramUserDataList = json_decode($jsondata); 
    foreach ($paramUserDataList as $userData)
    {   
        $dataDype=strval($userData->cDataType);   
        $fileList = array();
        $fileList["indextext"] = $userData->cStrIndexText;
        $fileList["type"] = $dataDype;
        $fileList["archived"]="0";
        $fileList["star"]="0";
        $fileList["parentid"]=$userData->cStrParentObjID;
        $fileList["indextype"] = "1";
        $fileList["json"]= json_encode($userData);//meta data object    
        //index in google cloud inbox
        if(!$gcsearch->putObjectPost($userData->cStrSenderEmail,$userData->cStrObjID,$fileList))                               
        {
            _senderror("Error in google cloud inbexing");
        }
        if($dataDype!="4"){
            if(!$gcsearch->putObjectPost($userData->cStrReceiverEmail,$userData->cStrObjID,$fileList))                                    
            {
                _senderror("Error in google cloud inbexing");
            }
        }
    }    
    $response = null;
    $response->bSUCCESS = true;
    $response->sMSG = "Saving success";    
    _send($response); 
?>
