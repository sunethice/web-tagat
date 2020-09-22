<?php
require_once ('ActionBase.php');
if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';
if (!class_exists('UpdateGCUserData')) require_once 'api/model/UpdateGCUserData.php';

class PutInbox extends ActionBase{
	public function __construct() {}

    function cpRun($pObjData=null){ 
        if($pObjData == null){
            parent::cpSendResponse(false,$this->cLang["ParamObjNull"]);
        }
        else{
            try
            {
                $cParam = json_decode($pObjData);
                if($cParam == null)
                    parent::cpSendResponse(false,$this->cLang["Forbidden"]);
				$cSharedRecipientsFolder = "sharedRecipients/".$cParam->cStrObjID."/".$cParam->cStrUserEmail; //delete from sharedRecipients
				$cBDelete = $this->cS3->deleteObjectCustom($cSharedRecipientsFolder);
				if (!$cBDelete)
					parent::cpSendResponse(false,"Error deleting.");
				$cBDelete = $gcsearch->deleteObject($cParam->cStrUserEmail, $cParam->cStrObjID); //deleting from google index
				if (!$cBDelete)
					parent::cpSendResponse(false,"Error deleting index.");
				parent::cpSendResponse(true,"");
            }
            catch (Exception $mEx)
            {
                parent::cpSendResponse(false, $mEx->getMessage());
            }
        }
    }
}
?>
