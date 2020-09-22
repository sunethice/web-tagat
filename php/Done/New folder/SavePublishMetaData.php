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
                $cParam = new PutInboxParam();
                parent::cpDeserialization($pObjData,$cParam);
                if($cParam->cMetadata == null || $cParam->cUser == null)
                    parent::cpSendResponse(false,$this->cLang["Forbidden"]);
                $cUpdateGCUserData = new UpdateGCUserData($loggeinuser);
				$cResult = $cUpdateGCUserData->updateObjectData($cParam->cMetadata); //Update main object's GC data
				if(!$cResult)
					parent::cpSendResponse(false,$cResult);
				if ($paramObj->cBNewData)
				{      
					$cResult = $cUpdateGCUserData->updateParentObjectData($cParam->cMetadata); //Update parent object's GC data
					if(!$cResult)
						parent::cpSendResponse(false,$cResult);
				}
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
