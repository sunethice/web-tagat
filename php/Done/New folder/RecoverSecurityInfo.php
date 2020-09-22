<?php
require_once ('ActionBase.php');
if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';
if (!class_exists('security')) require_once 'api/model/security.php';
require_once ('Common/RecoverSecurityInfoParam.php');

class PutInbox extends ActionBase{
	public function __construct() {}

    function cpRun($pObjData=null){
		parent::cpValidateLoggedInUser();
        if($pObjData == null){
            parent::cpSendResponse(false,$this->cLang["ParamObjNull"]);
        }
        else{
            try
            {
                $cParam = new RecoverSecurityInfoParam();
                parent::cpDeserialization($pObjData,$cParam);
                if($cParam->cStrUserID != $cLoggedInUser->UserID){
                    parent::cpSendResponse(false,"User authentication failed");
				$cGCResult = $this->cGCSearch->getObject("securityinfo", $cParam->cStrID);                   
				$cGCResult = json_decode($cGCResult);    
				$response = null;
				$cSecurity = new security();
				if($cGCResult->cBSuccess){
					$cSecurity->loadKey($cGCResult->oRESULT->fields->cStrPrivateKey);  
					if($cParam->cIType==1){//user    
						if($cParam->cStrKey != null && $cParam->cStrIV != null){
							$cParam->cStrKey = $cSecurity->RSADecryptWithKey($cParam->cStrKey);
							$cParam->cStrIV = $cSecurity->RSADecryptWithKey($cParam->cStrIV);   
						}
						else{
							$cParam->cStrKey = $cSecurity->cpGenerateBase64StringKey();
							$cParam->cStrIV = $cSecurity->cpGenerateBase64StringKey();     
						}   
					}
					else{//space
						if(cpCheckSpacePermission($cParam->cStrUserID, $cParam->cStrID)){
							if($cParam->cStrKey != null && $cParam->cStrIV != null){
								$cParam->cStrKey = $cSecurity->RSADecryptWithKey($cParam->cStrKey);
								$cParam->cStrIV = $cSecurity->RSADecryptWithKey($cParam->cStrIV);   
							}
							else{
								$cParam->cStrKey = $cGCResult->oRESULT->fields->cStrKey;
								$cParam->cStrIV = $cGCResult->oRESULT->fields->cStrIV; 
							}           
						}
						else
							parent::cpSendResponse(false,"Space authentication failed.");
					}     
					$cStrRSAPublicKeyExponent = $cGCResult->oRESULT->fields->cStrRSAPublicKeyExponent;  
					$cStrRSAPublicKeyModulus = $cGCResult->oRESULT->fields->cStrRSAPublicKeyModulus; 
				}
				else{
					if($cParam->cStrKey != null && $cParam->cStrIV != null){
						$cSecurity->loadKey($cStrPrivateKey);
						$cParam->cStrKey = $cSecurity->RSADecryptWithKey($cParam->cStrKey);
						$cParam->cStrIV = $cSecurity->RSADecryptWithKey($cParam->cStrIV);   
						$cSecurity = new security();
					}        
					else{
						$cParam->cStrKey = $cSecurity->cpGenerateBase64StringKey();
						$cParam->cStrIV = $cSecurity->cpGenerateBase64StringKey();  
					}           
					$cStrPrivateKey = $cSecurity->privateKey;     
					$cXmlPublicKey = new SimpleXMLElement($cSecurity->publicKey);  
					$cStrRSAPublicKeyExponent = (string)$cXmlPublicKey->Exponent; 
					$cStrRSAPublicKeyModulus = (string)$cXmlPublicKey->Modulus;         
				} 
				$cResponse = null;
				$cResponse->cStrRSAPublicKeyExponent = $cStrRSAPublicKeyExponent;
				$cResponse->cStrRSAPublicKeyModulus = $cStrRSAPublicKeyModulus;
				$cResponse->cStrKey = $cParam->cStrKey;
				$cResponse->cStrIV = $cParam->cStrIV;
				parent::cpSendResponse(true,"Data retrived successfully.",$cResponse);
            }
            catch (Exception $mEx)
            {
                parent::cpSendResponse(false, $mEx->getMessage());
            }
        }
    }
	
	function cpCheckSpacePermission($pStrUserID, $pStrModelID){ 
        //TODO:check if user has permission to space. if yes return true otherwise false
        return true;
    }
}
?>
