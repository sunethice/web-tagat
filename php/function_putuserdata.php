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
    $param = json_decode($jsondata); 
    $dataDype=strval($param->cDataType);  
    
    $fileList = array();
    $fileList["indextext"] = $param->cStrIndexText;
    $fileList["type"] = $dataDype;
    $fileList["archived"]="0";
    $fileList["star"]="0";
    $fileList["parentid"]=$param->cStrParentObjID;
    $fileList["indextype"] = "1";
    $fileList["json"]= $jsondata;//meta data object    
    //index in google cloud inbox
    if(!$gcsearch->putObjectPost($param->cStrSenderEmail,$param->cStrObjID,$fileList))                               
    {
        _senderror("Error in google cloud inbexing");
    }
    $response = null;
    switch($param->cDataType){
        case 1:
        case 2:
        case 3:       
        case 5:
            if(!$gcsearch->putObjectPost($param->cStrReceiverEmail,$param->cStrObjID,$fileList))                                    
            {
                _senderror("Error in google cloud receiver inbexing");
            }
            break;
        case 4://Log        
            break;        
        case 6://Message            
            foreach ($param->cLGCContributorList as $contributor)
            { 
                if($contributor->cStrUserEmail != $param->cStrSenderEmail){
                    if(!$gcsearch->putObjectPost($contributor->cStrUserEmail,$param->cStrObjID,$fileList))                                    
                    {
                        _senderror("Error in google cloud contributor inbexing");
                    }
                }                         
            }
            $gcMessage = array();
            //$gcMessage["\$type"] = "TagatClassLibrary.Common.GCMessage, TagatClassLibrary";
            $gcMessage["cStrObjID"] = $param->cStrMessageID;
            $gcMessage["cStrConversationID"]=$param->cStrObjID;
            $gcMessage["cStrMessage"]  =$param->cStrMessage;
            $gcMessage["cStrSenderID"] = $param->cStrSenderID;
            $gcMessage["cStrSenderEmail"] = $param->cStrSenderEmail;
            $gcMessage["cStrSenderName"] = $param->cStrSenderName;
            $gcMessage["cStrSenderImgID"] = $param->cStrSenderImgID;
            $gcMessage["cDEpochSentDate"] = strval($param->cDEpochRepliedDate);
            $gcMessage["cStrArchived"] = "0";
            $gcMessage["cStrIndexText"] = $param->cStrIndexText;
            if(!$gcsearch->putObjectPost($param->cStrObjID,$param->cStrMessageID,$gcMessage))                                    
            {
                _senderror("Error in google cloud message inbexing");
            }       
            $response->oSUB_OBJECT = $param->cStrMessageID;
            break;
    }  
    $response->bSUCCESS = true;
    $response->sMSG = "Saving success";
    $response->oOBJECT = $param->cStrObjID;
    _send($response); 
?>
