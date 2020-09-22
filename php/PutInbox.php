<?php
require_once ('ActionBase.php');
require_once ('Common/PutInboxParam.php');
if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';

class PutInbox extends ActionBase{
	public function __construct() {}

    function cpRun($pObjData=null){ 
        //parent::cpValidateLoggedInUser();
        if($pObjData == null){
            parent::cpSendResponse(false,$this->cLang["ParamObjNull"]);
        }
        else{
            try
            {
                $cParam = new PutInboxParam();
                parent::cpDeserialization($pObjData,$cParam);
                if($cParam->cStrTableName == null || $cParam->cStrID == null || $cParam->cBArchive == null)
                    parent::cpSendResponse(false,$this->cLang["Forbidden"]);
                $cGCResult = $this->cGCSearch->getObject($cParam->cStrTableName, $cParam->cStrID); //get meta object from google index           
                $cGCResult = json_decode($cGCResult);
                if(!$cGCResult->cBSuccess)
                    parent::cpSendResponse(false,$this->cLang["MetaObjectError"]);
                $metaData = $cGCResult->oRESULT->fields->json;
                $cFileList = array();
                $cFileList["indextext"] = $cGCResult->oRESULT->fields->indextext;
                $cFileList["type"] = $cGCResult->oRESULT->fields->type;
                $cFileList["indextype"] = $cGCResult->oRESULT->fields->indextype;
                $cFileList["parentid"] = $cGCResult->oRESULT->fields->parentid;
                $cFileList["archived"] = $cParam->cBArchive;
                $cFileList["star"] = $cParam->cBStar;
                $cFileList["json"] = json_encode($metaData);//meta data object
                if (!$this->cGCSearch->putObjectPost($get_tableName,$get_id,$cFileList)) //index in google cloud inbox
                    parent::cpSendResponse(false,$this->cLang["GCSavingError"]);
                else
                    parent::cpSendResponse(true,$this->cLang["GCSavingSuccess"]);
            }
            catch (Exception $mEx)
            {
                parent::cpSendResponse(false, $mEx->getMessage());
            }
        }
    }
}
?>
