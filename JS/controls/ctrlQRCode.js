/**
 * ctrlQRCode.js (TAGAT)
 * Built on top of the jQuery library
  */
  
(function($) {

    /* ctrlQRCode */
    $.fn.ctrlQRCode = function(pElement, canvas, n) { return new $.ctrlQRCode(this, pElement, canvas, n) } ;
	$.ctrlQRCode = function (e,pElement, canvas, n) {

		this.type = "ctrlQRCode"; 
    	this.cDocumentElement = pElement;
		this.parentcanvas = canvas;
		this.order = n;
		this.chtmlElement = $(e);
		this.chtmlElementLable;
		this.cPermission = pElement.cSPermissionType;
		
		this.cpSetup();
		this.cpRedrow();
							
		return this;
   }
    				
	/* EXTEND dctrlInput */
    $.ctrlQRCode.fn = $.ctrlQRCode.prototype = {ctrlQRCode: '0.0.1'};
	$.ctrlQRCode.fn.extend = $.ctrlQRCode.extend = $.extend;
	$.ctrlQRCode.fn.extend({
	
	
	cpSetup : function()
	{
	
	
	    var self = this;
        this.chtmlElement.html(String.format('<div id="_divHeader" class="mobile_element_detail">' +
                                                 '<div id="_divHeaderTitle" class="mobile_element_title">{0}</div>' +
                                                 '<div id="_divHeaderData" class="mobile_element_data"></div>' +
//                                                 '<div id = "_divEleEdit" class="eleEdit aa-div-hide">' +
//                                                     '<div class="eleTextbox">' +
//                                                         '<input type="text" id="_inputTextData" class="eleInputBox"/>'+
//                                                         '<div id="_divClearText" class="textClear"></div>'+
//                                                     '</div>' +
//                                                     '<div id = "_divDone" class="editDone">Done</div>' +
//                                                     '<div id = "_divCancel" class="editCancel">Cancel</div>'+
//                                                 '</div>' +
                                              '</div>' +
                                              '<div class="mobile_element_expand_btn"></div>'
                                             ,this.cDocumentElement.cSElementLable));
       
       this.chtmlElementLable = $('.mobile_element_title',this.chtmlElement);
       this.chtmlElementdisplay = $('.mobile_element_data',this.chtmlElement);
       this.chtmlElementexpand = $('.mobile_element_expand_btn',this.chtmlElement); 
       
       this.chtmlElement.click(function(event){self.chtmlElement_expand();});
//       this.chtmlElementdisplay=$('#_divHeaderData',this.chtmlElement);
//       this.ctrlEleEdit=$('#_divEleEdit',this.chtmlElement);
//       this.chtmlElementDone=$('#_divDone',this.chtmlElement);
//       this.chtmlElementcancel=$('#_divCancel',this.chtmlElement);
//       this.chtmlElementClearText=$('#_divClearText',this.chtmlElement);
//       this.chtmlElementexpand = $('.mobile_element_expand_btn',this.chtmlElement);
       
//       this.chtmlElementDone.click(function(event){self.done();});
//       this.chtmlElementcancel.click(function(event){self.cancel();});
//       this.chtmlElementClearText.click(function(event){ self.clearData();});
//       this.chtmlElementdisplay.click(function(event){self.chtmlElement_expand();});
       
       return;
       
	   /* 
		var self = this;
		
		this.chtmlElement.html(String.format(
		"<div id='ctrlqrcode' class='des-element-content'>"+
			"<div id='Label'> {0} </div>"+
			"<div id='ctrlcontent' style='width:auto;'>"+
			"<div id='qrdatacontent'><input id='ctrl' type='text' name='txt' class='des-InputBoxSmall-st0 aa-f-left'/><div id='btnok' class='des-Img-btn aa-f-left' >Done</div></div>"+
			"<div id='qrcode' src='' style='cursor:pointer;' class='aa-div-hide' title='edit'></div>"+
			"</div>"+
		"</div>",
		this.cDocumentElement.cSElementLable));
				
		this.chtmlElementLable = $('#Label',this.chtmlElement);
		this.chtmlElementQRInputctrl = $('#ctrl',this.chtmlElement);
		this.chtmlElementContent = $('#ctrlqrcode',this.chtmlElement);
		this.chtmlElementCtrlContent = $('#ctrlcontent',this.chtmlElement);	
		this.chtmlQRImage = $('#qrcode',this.chtmlElement);
		this.chtmldataContent = $('#qrdatacontent',this.chtmlElement);
		this.chtmlbtnok = $('#btnok',this.chtmlElement);
		

			
		this.cpPermission();*/
	},
	
	

	input : function (inputareaelement)
	{
	  this.oldval = this.cDocumentElement.cSElementTextData;
    
      $('#disable_body').remove();
//      $('#tagatwidget').prepend('<div id="disable_body" class="disableBody"> </div>');
      $('#twdgt-input').show();
      $('#twdgt-input').css('left','auto') ;
      $(__objconnection).trigger('navWrapShow');
                           
	  var self= this;
	  inputareaelement.html(String.format(
      '<div class="listHeader">'+
        '<div class="listEleimg"></div>' +
        '<div class="listEleName">{0}</div>'+
        '<div class="listEleNo">' +
            '<div class="eleCurrent"></div>' +
            '<div class="eleAll">{1}</div>' +
        '</div>' +
        '<div class="twdgtinput_header_C">' +
            '<div class="twdgtinput_donebtn">Done</div>' +
            '<div class="twdgtinput_cancelbtn">Cancel</div>' +
        '</div>' +
    '</div>' +
    '<div class="twdgtinput_header_D">' +
        '<div class="twdgtinput_box">'+
        	'<input type="text" id="twdgtinputctrl" class="twdgtinput_input" value="{2}" />' +
        '</div>' +
    '</div>' 
    
    , 
        _LANGAR['canvas.mobilectrlqrcode'],
  		jQuery._langparam(_LANGAR['canvas.mobileinputdisplay'], [ this.order+1,this.parentcanvas.cDocumentSection.cLElementList.length]),
		this.cDocumentElement.cSElementTextData == null ? "" :  this.cDocumentElement.cSElementTextData
		)); 
    
         this.chtmlElementInputctrl = $('#twdgtinputctrl');
         this.chtmlElementInputctrl.unbind();
//         this.chtmlElementInputctrl.bind('change', function(event) {self.chtmlElementInputctrl_change(event)});
//         this.chtmlElementInputctrl.bind('focusout', function(event) {self.chtmlElementInputctrl_focusout(event)});

        this.chtmlElementDone =  $('.twdgtinput_donebtn',inputareaelement);
        this.chtmlElementcancel =  $('.twdgtinput_cancelbtn',inputareaelement);
         this.chtmlElementDone.click(function(event) {self.done(event); return false;});
         this.chtmlElementcancel.click(function(event) {self.cancel(event); return false;});

             
	},
	done : function()
	{
        this.chtmlElementInputctrl_change();
   	    this.chtmlElementInputctrl.unbind();
   	    this.chtmlElementDone.unbind();
        this.chtmlElementcancel.unbind();
        this.cpRedrow();
	    this.parentcanvas.drawarea.trigger("elementcolapse",[this]);
//       this.cDocumentElement.cSElementTextData=$("#_inputTextData",this.chtmlElement).val();
//       this.chtmlElementInputctrl_change();
//       this.chtmlElement_colapse();
//       this.chtmlElementexpand.show();
//       
//       
//       if ( _MODIFIEDELMENTS !== undefined && _MODIFIEDELMENTS[this.cDocumentElement.cSElementId]){
//           this.chtmlElementexpand.addClass("mobile_element_expand_btn-modified");
//       }else{
//           this.chtmlElementexpand.removeClass("mobile_element_expand_btn-modified");
//       }
//       //Parameters : (tObjectType,tObjID,tObjName,tObjLable,historyValue)
//       this.parentcanvas.drawarea.trigger("elementValueChange",
//                                          ["4",this.cDocumentElement.cSElementId,this.cDocumentElement.cSElementLable,
//                                           ctrlelementarray[this.cDocumentElement.cSElementType],this.cDocumentElement.cSElementTextData]
//                                          );
	},
   clearData : function()
   {
       $("#_inputTextData",this.chtmlElement).val("");
   },
	cancel : function()
	{
//       this.cDocumentElement.cSElementTextData = this.oldval;
//       this.chtmlElement_colapse();
	    this.cDocumentElement.cSElementTextData = this.oldval;
	    if ( _MODIFIEDELMENTS !== undefined && _MODIFIEDELMENTS[this.cDocumentElement.cSElementId])
	    delete _MODIFIEDELMENTS[this.cDocumentElement.cSElementId];
	    
//        $('#disable_body').remove();
        this.cpRedrow();
	    this.chtmlElementInputctrl.unbind();
   	    this.chtmlElementDone.unbind();
        this.chtmlElementcancel.unbind();
	    this.parentcanvas.drawarea.trigger("elementcolapse",[this]);
	    
	},
	
	chtmlElement_expand : function()
	{
//       this.oldval = this.cDocumentElement.cSElementTextData;
//       $("#_inputTextData",this.chtmlElement).val(this.cDocumentElement.cSElementTextData);
//       
//       $('.eleEdit').hide();
//       this.chtmlElementexpand.hide();
//       $('.mobile_element_data').show();
//       this.chtmlElementdisplay.hide();
//       this.ctrlEleEdit.show();
	   this.parentcanvas.drawarea.trigger("elementexpand",[this]);
	},
//    chtmlElement_colapse : function()
//    {
//       this.chtmlElementdisplay.show();
//       this.ctrlEleEdit.hide();
//       this.cpRedrow();
//    },
	cpRedrow : function()
	{
	   var self = this;
	   if(this.cDocumentElement.IsDocumentID == "1")
	   {
	        this.cDocumentElement.cSElementTextData = "http://203.143.28.164/input/DOCUMENT/NDbMFMABD/xx.htm";
	        //http://203.143.28.164/input/DOCUMENT/NDbMFMABD/xx.htm
	        // this.cDocumentElement.cSElementTextData = "" + window.location + "";
	        this.chtmlElementexpand.hide(); 
            this.chtmlElement.unbind();

	   }
	    
       if (this.cDocumentElement.cSElementTextData == null ||  this.cDocumentElement.cSElementTextData == '')
		 this.chtmlElementdisplay.html(_LANGAR['canvas.mobiletaphere']);
	   else
	   {    
		  this.chtmlElementdisplay.html("<div class='aa-div-hide twgt-qr-center' id='qrcode'></div>");
		  this.chtmlQRImage = $('#qrcode',this.chtmlElementdisplay);
		   
		   setTimeout( function() { self.genqrcode(); }, 500);    

	   }
	   
	   if(this.cDocumentElement.cSElementTextData == null ||  this.cDocumentElement.cSElementTextData == '')
	    this.chtmlElement.addClass("twdgt-mobile-empty-text");
	   else
	   this.chtmlElement.removeClass("twdgt-mobile-empty-text");
	   
	   if ( _MODIFIEDELMENTS !== undefined && _MODIFIEDELMENTS[this.cDocumentElement.cSElementId])
	    this.chtmlElementexpand.addClass("mobile_element_expand_btn-modified");
	   else
	    this.chtmlElementexpand.removeClass("mobile_element_expand_btn-modified");
	    
	},
	
	genqrcode : function()
	{
	   // alert("gen");
	        var _width;
		    var _height;
		    _width = 120;
			_height =  120;
			
	  this.chtmlQRImage.html('');
			this.chtmlQRImage.qrcode({
		        text : this.cDocumentElement.cSElementTextData,
		        width : _width,
		        height : _height
	        });
		
		    this.chtmlQRImage.removeClass('aa-div-hide');
		    this.parentcanvas.iscrollCanvas.refresh();
							  
		// alert("endgen");
	},
	
	chtmlElementInputctrl_change : function(event)
	{
//       if(this.cDocumentElement.cSElementTextData != $("#_inputTextData",this.chtmlElement).val())
//       {
//           this.cDocumentElement.cSElementTextData = $("#_inputTextData",this.chtmlElement).val();
//           
//           this.oldval = this.cDocumentElement.cSElementTextData;
//           
//           if (_MODIFIEDELMENTS === undefined){
//               _MODIFIEDELMENTS = [];
//           }
//           _MODIFIEDELMENTS[this.cDocumentElement.cSElementId] = 'true';
//           this.cpRedrow();                          
//       }
	    if(this.cDocumentElement.cSElementTextData != this.chtmlElementInputctrl.val())
		{
		   this.cDocumentElement.cSElementTextData = this.chtmlElementInputctrl.val();
		
		   if (_MODIFIEDELMENTS === undefined)
		  _MODIFIEDELMENTS = [];
		 
		  _MODIFIEDELMENTS[this.cDocumentElement.cSElementId] = 'true';
		
		  this.cpRedrow();
//          $('#disable_body').remove();
          this.parentcanvas.drawarea.trigger("elementValueChange",
                                              ["4",this.cDocumentElement.cSElementId,this.cDocumentElement.cSElementLable,
                                               ctrlelementarray[this.cDocumentElement.cSElementType],this.cDocumentElement.cSElementTextData]
                                              );
		}
		
		
	},
	
	chtmlElementInputctrl_focusout : function(event)
	{
	    
	    this.chtmlElementInputctrl.unbind();
	    this.parentcanvas.drawarea.trigger("elementcolapse",[this]);
		
		
	}
	});
})(jQuery)