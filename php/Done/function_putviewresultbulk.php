<?php

require_once ('include/header.php');
require_once ('include/session.php');    
require_once ('model/tagat_email.php');
require_once ('model/baseconv.php');

if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';
if (!class_exists('gcsearch')) require_once 'model/googleCon.php';

//google index connection
$gcsearch = new gcsearch();

//REQUEST VARIABLES
$paramJson = $_POST["json"];
$get_callback = $_GET["callback"];
if ($paramJson == null )
{
    _senderror("Forbidden");    
}
$paramObj=json_decode($paramJson);
if(!$paramObj->cBConfigured){
    //here delete viewResult bucket is already existing viewID
    $deleted= $gcsearch->deleteTable($paramObj->cStrViewID);  
    if (!$deleted)
    {
        _senderror("Error deleting existing data");      
    }      
}

$rowsList = array();
$rowID=$paramObj->cIStartIndex+1;
foreach ($paramObj->cLResultViewList as $dataRow)
{
    $indexConfigured=false;
    $indexText=null;
    $indexDataList=array();
    $hashDaraRow=array();
	foreach ($dataRow as $dataColumn)
    {       
        //add column index population        
        $hashDaraRow[$dataColumn->cStrID]=$dataColumn->cStrValue;    
        //add column value to indexText search : if not existing
        if(!in_array($dataColumn->cStrValue,$indexDataList)){
            array_push($indexDataList,$dataColumn->cStrValue);      
            if(!$indexConfigured){
                $indexText=$dataColumn->cStrValue;     
                $indexConfigured=true;
            }
            else{
                $indexText=$indexText." ".$dataColumn->cStrValue;     
            }
        }
    }
    $hashDaraRow["indextext"]=$indexText;  
    //here add row to rows list
    $dataRow = null;
    $dataRow->id = strval($rowID);
    $dataRow->fields = $hashDaraRow;    
    array_push($rowsList,$dataRow);   
   
    ////here save indexes in google index  
    //$saved= $gcsearch->putObjectPost($paramObj->cStrViewID,$rowID,$hashDaraRow);      
    //if (!$saved)
    //{
    //    _senderror("Error saving data row");      
    //}   
    
    //here set arrays to null
    $indexDataList=null;
    $hashDaraRow=null;    
    $rowID++;
}
$saved= $gcsearch->putObjectBulkPost($paramObj->cStrViewID,$rowsList);      
if (!$saved)
{
    _senderror("Error saving data rows");      
}  

$response = null;
$response->bSUCCESS = true;
_send($response);

?>
