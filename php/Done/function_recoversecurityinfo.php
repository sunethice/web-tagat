<?php  
    require_once ('include/header.php');
    require_once ('include/session.php');
    require_once ('include/nativeauth.php');    
    if (!class_exists('security')) require_once 'model/security.php';
    if (!class_exists('gcsearch')) require_once 'model/googleCon.php';
    if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';       
    $loggeinuser = _session_getuser();
    if ($loggeinuser == null){
         //NOT LOGGED IN
        _senderror("User not logged in");      
    }
    //REQUEST VARIABLES
    $get_jsonData = $_POST["jsonData"];
    $params = json_decode($get_jsonData);
    if($params->cStrUserID != $loggeinuser->UserID){
         //NOT LOGGED IN
        _senderror("User authentication failed");        
    }
    $gcsearch = new gcsearch();
    $gcResult = $gcsearch->getObject("securityinfo", $params->cStrID);                   
    $gcResult = json_decode($gcResult);    
    $response = null;
    if($gcResult->bSUCCESS){  
        $security = new security();
        $security->loadKey($gcResult->oRESULT->fields->cStrPrivateKey);  
        if($params.cIType==1){//user    
            if($params->cStrKey != null && $params->cStrIV != null){
                $params->cStrKey = $security->RSADecryptWithKey($params->cStrKey);
                $params->cStrIV = $security->RSADecryptWithKey($params->cStrIV);   
            }
            else{
                $params->cStrKey = $security->cpGenerateBase64StringKey();
                $params->cStrIV = $security->cpGenerateBase64StringKey();     
            }   
        }
        else{//space
            if(checkSpacePermission($params->cStrUserID, $params->cStrID)){
                if($params->cStrKey != null && $params->cStrIV != null){
                    $params->cStrKey = $security->RSADecryptWithKey($params->cStrKey);
                    $params->cStrIV = $security->RSADecryptWithKey($params->cStrIV);   
                }
                else{
                    $params->cStrKey = $gcResult->oRESULT->fields->cStrKey;
                    $params->cStrIV = $gcResult->oRESULT->fields->cStrIV;   
                }           
            }
            else{
                _senderror("Space authentication failed");        
            }
        }     
        $cStrRSAPublicKeyExponent = $gcResult->oRESULT->fields->cStrRSAPublicKeyExponent;  
        $cStrRSAPublicKeyModulus = $gcResult->oRESULT->fields->cStrRSAPublicKeyModulus; 
    }
    else{
        $security = new security();
        if($params->cStrKey != null && $params->cStrIV != null){
            $security->loadKey($cStrPrivateKey);
            $params->cStrKey = $security->RSADecryptWithKey($params->cStrKey);
            $params->cStrIV = $security->RSADecryptWithKey($params->cStrIV);   
            $security = new security();
        }        
        else{
            $params->cStrKey = $security->cpGenerateBase64StringKey();
            $params->cStrIV = $security->cpGenerateBase64StringKey();  
        }           
        $cStrPrivateKey = $security->privateKey;     
        $xmlPublicKey = new SimpleXMLElement($security->publicKey);  
        $cStrRSAPublicKeyExponent = (string)$xmlPublicKey->Exponent; 
        $cStrRSAPublicKeyModulus = (string)$xmlPublicKey->Modulus;        
        
        //new object
        $hashDaraRow = array();  
        $hashDaraRow["cStrPrivateKey"] = $gcsearch->populateIndexField(1,$cStrPrivateKey);
        $hashDaraRow["cStrRSAPublicKeyExponent"] = $gcsearch->populateIndexField(1, $cStrRSAPublicKeyExponent);
        $hashDaraRow["cStrRSAPublicKeyModulus"] = $gcsearch->populateIndexField(1, $cStrRSAPublicKeyModulus);   
        $hashDaraRow["cStrKey"] = $gcsearch->populateIndexField(1, $params->cStrKey);
        $hashDaraRow["cStrIV"] = $gcsearch->populateIndexField(1,$params->cStrIV);        
        $hashDaraRow["cStrCreatedBy"] = $gcsearch->populateIndexField(1,$params->cStrUserID);        
        //index in google cloud contact
        //if(!$gcsearch->putObjectPostCommon("securityinfo",$params->cStrID,$hashDaraRow))                               
        {
            //_senderror("Error in populating security info");
        }  
    } 
    $response->bSUCCESS = true;
    $response->sMSG = "Data retrived successful";
    $response->cStrRSAPublicKeyExponent = $cStrRSAPublicKeyExponent;
    $response->cStrRSAPublicKeyModulus = $cStrRSAPublicKeyModulus;
    $response->cStrKey = $params->cStrKey;
    $response->cStrIV = $params->cStrIV;
    _send($response); 
    
    function checkSpacePermission($pStrUserID, $pStrModelID){ 
        //TODO:check if user has permission to space. if yes return true otherwise false
        return true;
    } 
?>
