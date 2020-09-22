/**
 * ctrlpicUpload.js (TAGAT)
 * Built on top of the jQuery library
  */

(function($) {

    /* ctrlpicUpload */
    $.fn.ctrlpicUpload = function(pElement, canvas, n ,frmID) { return new $.ctrlpicUpload(this, pElement, canvas,n ,frmID) } ;
    $.ctrlpicUpload = function (e,pElement, canvas,n ,frmID) {

        this.type = "ctrlpicUpload";
        this.cDocumentElement = pElement;
        this.parentcanvas = canvas;
        this.order = n;
        this.chtmlElement = $(e);
        this.formID = frmID;
        this.chtmlElementLable;
        this.cPermission = pElement.cSPermissionType;

        this.cpSetup();

        var imgGUID;
        return this;
    }
 
	/* EXTEND ctrlpicUpload */
    $.ctrlpicUpload.fn = $.ctrlpicUpload.prototype = {ctrlpicUpload: '0.0.1'};
	$.ctrlpicUpload.fn.extend = $.ctrlpicUpload.extend = $.extend;
	$.ctrlpicUpload.fn.extend({
	
	
	cpSetup : function()
	{
        var self = this;
		this.chtmlElement.html(String.format('<div class="mobile_element_detail">' +
                                                 '<div class="mobile_element_title">{0}</div>' +
                                                 '<div id="thumbnail" class="mobile_element_data" {1}></div>'  +
                                                 '<div id="Searchloading-wrap" class="input-image-loading-wrap" {2}>'+
                                                     '<div id="Searchloading" class="input-db-loading aa-div-hide">'+
                                                     '</div>'+
                                                     '<div class="input-image-loading-div">'+
                                                        '<div id="input-db-loading" class="input-loading-img"></div><span id="inputLoading" style="font-size:10px;width:auto;">Loading image, Please wait...</span>'+
                                                     '</div>'+
                                                 '</div>'+
                                             '</div>' +
                                             '<div class="mobile_element_expand_btn"></div>',this.cDocumentElement.cSElementLable,
                                             this.cDocumentElement.cSElementTextData != null? "style='height:683px;'" : "",
                                             this.cDocumentElement.cSElementTextData != ""? "style='height:200px'"  : ""
                                             ));
       
        this.chtmlElementLable = $('.mobile_element_title',this.chtmlElement);
        this.chtmlElementdisplay = $('.mobile_element_data',this.chtmlElement);
        this.chtmlElementexpand = $('.mobile_element_expand_btn',this.chtmlElement);
       
        this.chtmlElement.click(function(event){self.chtmlElement_expand();});
                              
        if(this.cDocumentElement.cSElementTextData != null && this.cDocumentElement.cSElementTextData!=''){
            $('#Searchloading-wrap',this.chtmlElement).hide().fadeIn();
            self.actionFuncGetTextImage(this.cDocumentElement.cSElementTextData);
       }else{
            $('.mobile_element_data',this.chtmlElement).text(_LANGAR["canvas.mobiletaphere"]);
            $('#Searchloading-wrap',this.chtmlElement).fadeOut();
            self.cpRedrow();
       }
       
       return;
	},
                              
    actionFuncGetTextImage: function (textImage_ID) {
        var self = this;
                              
        $(_connection).unbind("on_getTextImageFeedback");
        $(_connection).bind("on_getTextImageFeedback", function (event, data) {
            self.on_getTextImageFeedback(data);
        });
                              
        jQuery.amBusy();

        if (__inboxObj.cBTagatCloud) {
            bucket.get('images/' + textImage_ID,
                function(docValue, docMetadata){
                    $('#Searchloading-wrap',self.chtmlElement).fadeOut();

                    docValue = decrypt_string(docValue, _encryption_secret_key);
                    self.img = String.format('<img id="_upldImg" class="twdgtinput_imagedisplayarea" src="{0}" style="width:'+
                        __ScreenWidth/2+';height:'+__ScreenWidth/2 + '">',docValue);
                       
                    if(self.img != undefined || self.img != null || self.img != ""){
                        self.oldImg = self.img;
                    }
                       
                    self.cpRedrow();
                },
                function(code, message){
                    $('#inputLoading').text('error loading image')
                }
            );
        }
        else{
            obj = {};
            obj.sID = textImage_ID;
            obj.sDOC_ID = __inboxObj.cStrObjID;
            obj.sDOC_PARENT_ID = __inboxObj.cStrParentObjID;

            var json = JSON.stringify(obj);
                              
            $.jsonp({
                url: __inboxObj.cStrCloudIPAddress + "api/",
                cache: false,
                data : {jsonData : json,function : 'Get_Text_Image'},
                success: function (json, textStatus, xOptions) {
                    $(_connection).trigger("on_getTextImageFeedback",[json]);
                },
                callbackParameter: 'callback',
                error: function (xOptions, textStatus) {
                    alert(textStatus);
                }
            });
        }
    },

    on_getTextImageFeedback: function (data) {
        var self = this;
        jQuery.amReady();

        $(_connection).unbind("on_getTextImageFeedback");

        if (data.bSUCCESS) {
            var decryptStr = decrypt_string(data.oOBJECT, _encryption_secret_key);
                              
            decryptStr = JSON.parse(decryptStr);

            self.img = String.format('<img id="_upldImg" class="twdgtinput_imagearea" src="{0}"/>', decryptStr.cOSource);
                        
            if(self.img != undefined || self.img != null || self.img != ""){
                self.oldImg = self.img;
            }
                        
            self.cpRedrow();
            $('#Searchloading-wrap',this.chtmlElement).fadeOut();
        }
        else {
            alert("Error occured. Error : " + data.sMSG);
        }
    },
	
	input : function (inputareaelement)
    {
	  this.oldval = this.cDocumentElement.cSElementTextData;
	  var self= this;
                              
      $('#disable_body').remove();
      
      $('#twdgt-input').show();
      $('#twdgt-input').css('left','auto') ;
      $(__objconnection).trigger('navWrapShow');
            
	  inputareaelement.html(String.format(
        '<div class="listHeader">'+
//            '<div class="listEleName2">Photo Upload</div>' +
//            '<div class="listEleNo2">{0}</div>'+
            '<div class="twdgtinput_header_C">' +
                '<div id="date-done" class="twdgtinput_donebtn">Done</div>' +
                '<div id="date-cancel" class="twdgtinput_cancelbtn tempcancel">Cancel</div>' +
            '</div>' +
        '</div>' +
        '<div class="twdgtinput_header_D">' +
//            '<div class="twdgtinput_box">'+
            '<div id="photoInputOutter" class="twdgtinput_photoWrap2">'+
                '<div class="twdgtinput_photoDef"></div>'+
                '<div id="photoInput" class="IUSetp1">'+
                    '<div id="twdgtinputctrl" class="IUBtn">Upload an Image</div>'+
                    '<div class="IUTxt1">( Accepted Filetypes - .jpg .jpeg .png .gif )</div>'+
                '</div>'+
                '<input id="actInput" type="file" style="visibility:hidden;" accept="image/*"/>'+
                '<div id="photoProgress" class="IUSetp2 aa-div-hide">'+
                    '<div class="IUProBarBox">'+
                        '<div class="IUProBar"></div>'+
                    '</div>'+
                    '<div id="_IUFileName" class="IUFileName">Emp-02743-Profile.jpg</div>'+
                '</div>'+
            '</div>'+
            '<div id="photoArea" class="IUSetp3 aa-div-hide">'+
                '<div id="imageWrap" class="twdgtinput_photo">'+
                '</div>'+
                '<div id="_IUEditBtn" class="IUEditBtn"></div>'+
            '</div>'+
            '<div id="Searchloading-wrap" class="input-image-loading-wrap">'+
                '<div id="Searchloading" class="input-db-loading">'+
                '</div>'+
                '<div class="input-image-loading-div">'+
                '<div id="input-db-loading" class="input-loading-img"></div><span style="font-size:10px;">Loading image, Please wait...</span>'+
                '</div>'+
            '</div>'+
//            '</div>' +
        '</div>',
        jQuery._langparam(_LANGAR['canvas.mobileinputdisplay'], [ this.order+1,this.parentcanvas.cDocumentSection.cLElementList.length])
        ));
    
        $('#Searchloading-wrap',inputareaelement).fadeIn();
            
        this.chtmlElementPhotoInputOutter = $('#photoInputOutter',inputareaelement);
        this.chtmlElementPhotoInput = $('#photoInput',inputareaelement);
        this.chtmlElementPhotoArea = $('#photoArea',inputareaelement);
        this.chtmlElementPhotoProgress = $('#photoProgress',inputareaelement);
            
        this.chtmlElementInput = $('#twdgtinputctrl',inputareaelement);
        this.chtmlElementInput.click(function(event) {$('input[type=file]').click(); return false;});
           
        this.chtmlElementInputctrl = $('#_IUFileName',inputareaelement);
        this.chtmlElementEditctrl = $('#_IUEditBtn',inputareaelement);
        this.chtmlElementEditctrl.click(function(event) {$('input[type=file]').click(); return false;});
                              
        $('input[type=file]').unbind();
        $('input[type=file]').bind('change', function(event) {
                                              self.handleImage(this);
                                        });

        this.chtmlElementDone =  $('#date-done',inputareaelement);
        this.chtmlElementcancel =  $('#date-cancel',inputareaelement);
        this.ImageWrap = $('#imageWrap',inputareaelement);
                              
        if(this.cDocumentElement.cSElementTextData !=null && this.cDocumentElement.cSElementTextData != ''){
     
            $(self.chtmlElementPhotoInputOutter).addClass('aa-div-hide');
            $(self.chtmlElementPhotoArea).removeClass('aa-div-hide');
                              
            $('#Searchloading-wrap',inputareaelement).fadeOut();

            self.ImageWrap.html(self.img);
            $('#_upldImg',self.ImageWrap).css('width',__ScreenWidth);
            $('#_upldImg',self.ImageWrap).css('height',__ScreenWidth);

        }
        else{
            $('#Searchloading-wrap',inputareaelement).css('display','none');
        }
                          
        $(this.chtmlElementDone).tapColorJs({data:'NaviSecWrap_click'});
        $(this.chtmlElementcancel).tapColorJs({data:'NaviSecWrap_click'});

        this.chtmlElementDone.click(function(event) {self.done(event); return false;});
        this.chtmlElementcancel.click(function(event) {self.cancel(event); return false;});
                        
        $(__objconnection).bind("upload_success",function(){self.chtmlElementInputctrl_change(imgGUID)});
                              
        $(__objconnection).bind("colapse",function(event){
            self.parentcanvas.drawarea.trigger("elementcolapse",[self]);
        });

	},
                              
    actionFuncSaveTextImage: function (textImage) {
        var self = this;
        $(_connection).unbind("on_saveTextImageFeedback");
        $(_connection).bind("on_saveTextImageFeedback", function (event, data) {
            self.on_saveTextImageFeedback(data);
        });
        jQuery.amBusy("saving data please wait");

        if (__inboxObj.cBTagatCloud) {
            self.uploadImg_s3(textImage);
        }
        else{
                                          
            obj = {};
            obj.sSOURCE = textImage;
            obj.sDOC_ID = __inboxObj.cStrObjID;
            obj.cDOC_PARENT_ID = __inboxObj.cStrParentObjID;
                              
            var json = JSON.stringify(obj);
            
            $.ajax({
                type: "POST",
                url: __inboxObj.cStrCloudIPAddress + "api/?modelID="+__inboxObj.cStrModelID+"&modelPublicID="+__inboxObj.cStrModelNodeID+"&function=Save_Text_Image",
                data : json,
                dataType : "json",
                cache : false,
                success: function (data) {
                    if(data.bSUCCESS){
                        $(_connection).trigger("on_saveTextImageFeedback",[data]);
//                        self.updateDocObject(2,data.oOBJECT.sOBJECT_ID);
                    }
                    else{
                        alert("Error : Error Retrieving Data");
                    }
                },
                error: function (er) {
                    jQuery.amReady();
                    if(er.responseText != undefined && er.responseText != ""){
                        self.on_errorReturnSuccess(er.responseText);
                    }
                }
            });
                 
        }
    },
                              
    on_errorReturnSuccess : function(data){
      var self = this;
      data = data.substring(1, data.length-1);
      data = JSON.parse(data);
        
      if(data.bSUCCESS != undefined){
           if(data.bSUCCESS == true){
               $(_connection).trigger("on_saveTextImageFeedback",[data]);
           }
           else{
               alert("Error : Error retrieving data");
           }
       }
    },
                              
    updateDocObject : function(type,imgID){
        var meidaArr;
        
        if(type == 1){
            imageID = this.formID + ">" + this.cDocumentElement.cSSectionId + ">" + this.cDocumentElement.cSElementId + ">" + imgID;
            meidaArr = updateS3MediaObjectIDList(_DOCUMENTOBJECT.cLMediaObjectIDList,_DOCUMENTOBJECT.cLS3MediaObjectIDList,this.cDocumentElement.cSElementTextData,imageID);
            _DOCUMENTOBJECT.cLMediaObjectIDList = meidaArr.mList;
            _DOCUMENTOBJECT.cLS3MediaObjectIDList = meidaArr.mList2;
            $(__objconnection).trigger("upload_success",[imgID]);
        }
        else{
            meidaArr = updateMediaObjectIDList(_DOCUMENTOBJECT.cLMediaObjectIDList,this.cDocumentElement.cSElementTextData,imgID);
            _DOCUMENTOBJECT.cLMediaObjectIDList = meidaArr;
            $(__objconnection).trigger("upload_success",[imgID]);
        }
    },
      
    on_saveTextImageFeedback: function (data) {
        var self = this;
        jQuery.amReady();
                              
        $(_connection).unbind("on_saveTextImageFeedback");
        if (data.bSUCCESS) {
            self.updateDocObject(2,data.oOBJECT.sOBJECT_ID);
            this.cDocumentElement.cSElementTextData = data.oOBJECT.sOBJECT_ID;
            this.cDocumentElement.cSThumImg = data.oOBJECT.sTHUM_IMAGE;
        }
        else {
            alert("Error occured. Error : " + data.sMSG);
        }
    },
                              
    handleImage : function(imageInput) {
        try{
            $(this.chtmlElementPhotoInput).addClass('aa-div-hide');
            $(this.chtmlElementPhotoProgress).removeClass('aa-div-hide');
                                  
            var self = this;
            
            var images = imageInput.files;
                                  
            var imageSel = images[0];
            var imageType = /image.*/;

            if (!imageSel.type.match(imageType)) {
                return;
            }
            
            if(self.img != undefined || self.img != null || self.img != ""){
                this.oldImg = this.img;
            }
                              
            this.img = document.createElement("img");
            this.img.classList.add("twdgtinput_imagearea");
                                  
            $(self.img).attr('id','_upldImg');
                                  
            $('#imageWrap').html(self.img);
                                  
            $('#_upldImg').css('width',__ScreenWidth);
            $('#_upldImg').css('height',__ScreenWidth);
                                  
            var reader = new FileReader();
            reader.onloadend = (function(aImg) {
                               return function(e) {
                                    aImg.src = '';
                                    aImg.src = e.target.result;
                             
                                    $(__objconnection).unbind("onload_End");
                                    $(__objconnection).bind("onload_End",function(){
                                        var encryptedStr = encrypt_string(reader.result, _encryption_secret_key);
                                        self.actionFuncSaveTextImage(encryptedStr);
                                    });
                               };
                           })(self.img);
                                  
            reader.readAsDataURL(imageSel);
            
            $(this.chtmlElementPhotoInputOutter).addClass('aa-div-hide');
            $(this.chtmlElementPhotoArea).removeClass('aa-div-hide');
        }catch(err){
            alert('This element does not support older browser versions')
        }
    },
      
    uploadImg_s3 : function(_result){
        var self = this;
                              
        jQuery.amBusy("saving data please wait");
        
        var metadata = {}
        metadata.content_type = "text/plain";
        metadata.acl = "private";
                              
        imgGUID = guidGenerator();
        $(__objconnection).bind('onSavingSuccess',function(){ jQuery.amReady();});
 
        var s3 = new S3(__objconnection.session.cStrAWSKey,
                        __objconnection.session.cStrSecretkey,
                        __objconnection.session.cStrSessionToken);
        
        bucket = s3.bucket(__s3BUCKET);
        bucket.put("images/" + imgGUID , _result , metadata, putimgobjSuccess,self.putimgobjerror);
           
        self.updateDocObject(1,imgGUID);
        
    },
                              
	putimgobjerror : function(err){
        alert("error uploading image. Error : " + err);
    },
          
                              
	done : function()
	{
        var self = this;

        $(__objconnection).trigger("onload_End");

   	    this.chtmlElementDone.unbind();
        this.chtmlElementcancel.unbind();
        
	},
                              
	cancel : function()
    {
        var self = this;
                              
	    this.cDocumentElement.cSElementTextData = this.oldval;
        self.img = self.oldImg;
                              
	    if ( _MODIFIEDELMENTS !== undefined && _MODIFIEDELMENTS[this.cDocumentElement.cSElementId])
            delete _MODIFIEDELMENTS[this.cDocumentElement.cSElementId];
                              
        this.cpRedrow();

   	    this.chtmlElementDone.unbind();
        this.chtmlElementcancel.unbind();

	    this.parentcanvas.drawarea.trigger("elementcolapse",[this]);
	    
	},
	
	chtmlElement_expand : function()
	{   
	   this.parentcanvas.drawarea.trigger("elementexpand",[this]);
	},
	
	cpRedrow : function()
	{
        var self = this;
                              
        if(this.cDocumentElement.cSElementTextData == null ||  this.cDocumentElement.cSElementTextData == ''){
            this.chtmlElementdisplay.html(_LANGAR['canvas.mobiletaphere']);
        }else{
            $('#thumbnail').html(self.img);
//            $('#thumbnail img').css('width',__ScreenWidth/2);
//            $('#thumbnail img').css('height',__ScreenWidth/2);
        }
        
        if(this.cDocumentElement.cSElementTextData == null ||  this.cDocumentElement.cSElementTextData == ''){
            this.chtmlElement.addClass("twdgt-mobile-empty-text");
        }else{
            this.chtmlElement.removeClass("twdgt-mobile-empty-text");
        }
                              
        if ( _MODIFIEDELMENTS !== undefined && _MODIFIEDELMENTS[this.cDocumentElement.cSElementId]){
            this.chtmlElementexpand.addClass("mobile_element_expand_btn-modified");
        }else{
            this.chtmlElementexpand.removeClass("mobile_element_expand_btn-modified");
        }
	},
                              
	cpPermission : function()
	{
	    switch(this.cPermission)
	    {
	        case "2":        
	            this.chtmlElementInputctrl.attr('disabled','disabled');  
	            this.chtmlElementInputctrl.addClass('input-ctrl-disable');
	        break;
	        
	        case "3":
	            this.chtmlElementInputctrl.removeAttr('disabled');
	            this.chtmlElementInputctrl.removeClass('input-ctrl-disable');
	        break;
	        
	        case "1":
	            this.chtmlElement.addClass('aa-div-hide');
	            this.chtmlElementInputctrl.removeAttr('disabled');
	            this.chtmlElementInputctrl.removeClass('input-ctrl-disable');
	        break;
	        
	        default:
	            this.chtmlElementInputctrl.attr('disabled','disabled');  
	            this.chtmlElementInputctrl.addClass('input-ctrl-disable');
	        break

	        
	    }
	},
	
	chtmlElementInputctrl_change : function(data)
	{
        if(data != undefined){
            if(this.cDocumentElement.cSElementTextData != data)
            {
               this.cDocumentElement.cSElementTextData = data;

               if (_MODIFIEDELMENTS === undefined)
                 _MODIFIEDELMENTS = [];
             
              _MODIFIEDELMENTS[this.cDocumentElement.cSElementId] = 'true';
              this.cpRedrow();
              $(__objconnection).trigger("colapse");
              jQuery.amReady();
            }
        }
	},
	
	chtmlElementInputctrl_focusout : function(event)
	{
	    
	    this.chtmlElementInputctrl.unbind();
//	    this.parentcanvas.drawarea.trigger("elementcolapse",[this]);
		
		
	}
	
	
	
	
	});
	
})(jQuery)

function putimgobjSuccess(){
    $(__objconnection).trigger("onSavingSuccess");
}

function updateMediaObjectIDList(IdList,eleTextData,newObjID)
{
    
    if(IdList == null){
        IdList = [];
    }
    
    if(eleTextData != null && eleTextData != ""){
        var oldID = eleTextData;
        
        if(IdList.length != 0){
            $.each(IdList,function(index,value){
                if(value == oldID){
                   IdList.splice(index,1);
                   IdList.push(newObjID);
                }
            });
        }
    }
    else{
        IdList.push(newObjID);
    }
    
    return IdList;
}

function updateS3MediaObjectIDList(IdList1,IdList2,eleTextData,newObjID)
{
    
    if(IdList1 == null){
        IdList1 = [];
    }
    
    if(IdList2 == null){
        IdList2 = [];
    }
    
    if(eleTextData != null && eleTextData != ""){
        var oldID = eleTextData;
        
//        var guID = newObjID.split(">")[newObjID.split(">").length-1];
        if(IdList1.length != 0){
            $.each(IdList1,function(index,value){
                if(value == oldID){
                   IdList1.splice(index,1);
                }
            });
        }
        
        if(IdList2.length != 0){
            $.each(IdList2,function(index,value){
                if(value == oldID){
                   IdList2.splice(index,1);
                   IdList2.push(newObjID);
                }
            });
        }
    }
    else{
        IdList2.push(newObjID);
    }
    
    obj = {};
    obj.mList = IdList1;
    obj.mList2 = IdList2;
    
    
    return obj;
}
