<?php
require_once ('ActionBase.php');
require_once ('Common/PutInboxParam.php');
if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';

class PutViewResultBulk extends ActionBase{
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
                if($cParam == null)
                    parent::cpSendResponse(false,$this->cLang["Forbidden"]);
				if(!$cParam->cBConfigured){
					$cBDeleted = $gcsearch->deleteTable($cParam->cStrViewID); //Delete bucket if viewID exist
					if (!$cBDeleted)
						parent::cpSendResponse(false,"Error deleting existing data.");
				}
				$cRowsList = array();
				$cRowID = $cParam->cIStartIndex + 1;
				foreach($cParam->cLResultViewList as $cDataRow)
				{
					$cIndexConfigured = false;
					$cIndexText = null;
					$cIndexDataList = array();
					$cHashDataRow = array();
					foreach ($cDataRow as $cDataColumn)
					{       
						$cHashDataRow[$cDataColumn->cStrID] = $cDataColumn->cStrValue; //add column index population
						if(!in_array($cDataColumn->cStrValue,$cIndexDataList)){ //add column value to indexText search : if not existing
							array_push($cIndexDataList,$cDataColumn->cStrValue);      
							if(!$cIndexConfigured){
								$cIndexText = $cDataColumn->cStrValue;     
								$cIndexConfigured = true;
							}
							else
								$cIndexText = $cIndexText." ".$cDataColumn->cStrValue;
						}
					}
					$cHashDataRow["indextext"] = $cIndexText;  
					$cDataRow = null;
					$cDataRow->id = strval($cRowID);
					$cDataRow->fields = $cHashDataRow;    
					array_push($cRowsList,$cDataRow); //Add row to row list 
					$cIndexDataList = null;
					$cHashDataRow = null;    
					$cRowID++;
				}
				$cBSaved= $gcsearch->putObjectBulkPost($cParam->cStrViewID,$cRowsList);      
				if (!$cBSaved)
					parent::cpSendResponse(false, "Error saving data rows");
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
