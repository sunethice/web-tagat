/**
 * ctrlInput.js (TAGAT)
 * Built on top of the jQuery library
 */
(function($) {
 
/* ctrlInput */
 $.fn.ctrlInput = function(pElement, canvas, n) { return new $.ctrlInput(this, pElement, canvas,n) } ;
 $.ctrlInput = function (e,pElement, canvas,n) {
 
 this.type = "ctrlInput";
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
 
/* EXTEND ctrlInput */
 $.ctrlInput.fn = $.ctrlInput.prototype = {ctrlInput: '0.0.1'};
 $.ctrlInput.fn.extend = $.ctrlInput.extend = $.extend;
 $.ctrlInput.fn.extend({
                       
                       
   cpSetup : function()
   {
       var self = this;
       this.chtmlElement.html(String.format('<div id="_divHeader" class="mobile_element_detail">' +
                                                '<div id="_divHeaderTitle" class="mobile_element_title">{0}</div>' +
                                                '<div id="_divHeaderData" class="mobile_element_data"></div>' +
                                            '</div>' +
                                            '<div class="mobile_element_expand_btn"></div>'
                                            ,this.cDocumentElement.cSElementLable
                                            )
                              );
       
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
       //this.chtmlElementctrl=$('#_inputTextData',this.chtmlElement);
       
       //events
//       var self = this;
//       
//       this.chtmlElementdisplay.click(function(event){self.chtmlElement_expand();});
//       this.chtmlElementDone.click(function(event){self.done();});
//       this.chtmlElementcancel.click(function(event){self.cancel();});
//       this.chtmlElementClearText.click(function(event){ self.clearData();});
//       $("#_inputTextData",this.chtmlElement).bind('change', function(event) {self.chtmlElementInputctrl_change(event)});
       
       return;
   
   }
   ,
   
   input : function (inputareaelement)
   {
   
       
       this.oldval = this.cDocumentElement.cSElementTextData;
       var self= this;
                     
       $('#disable_body').remove();

       $('#twdgt-input').show();
       $('#twdgt-input').css('left','auto');
       $(__objconnection).trigger('navWrapShow');
                       
       inputareaelement.html(String.format(
//                                           '<div class="twdgtinput_header">'+
//                                           '<div class="twdgtinput_header_A twdgtinput-icon-input">' +
//                                           '</div>' +
//                                           '<div class="twdgtinput_header_B">' +
//                                           '<div class="twdgtinput_header_B1">{0}</div>' +
//                                           '<div class="twdgtinput_header_B2">{1}</div>' +
//                                           '</div>' +
                                           '<div class="listHeader">'+
                                                '<div class="listEleimg"></div>' +
                                                '<div class="listEleName">{0}</div>'+
                                                '<div class="listEleNo">' +
                                                    '<div class="eleCurrent"></div>' +
                                                    '<div class="eleAll">{1}</div>' +
                                                '</div>' +
                                                '<div class="twdgtinput_header_C">' +
                                                    '<div class="twdgtinput_donebtn">Done</div>' +
                                                    '<div class="twdgtinput_cancelbtn tempcancel">Cancel</div>' +
                                                '</div>' +
                                           '</div>' +
                                           '<div class="twdgtinput_header_D">' +
                                               '<div class="twdgtinput_box">'+
                                                   '<input id="twdgtinputctrl" {2} class="twdgtinput_input" value="{3}" />' +
                                                   '<div class="tab_label_inputter">{4}</div>'+
                                               '</div>' +
                                           '</div>',
                                           _LANGAR['canvas.mobilectrlinput'],
                                           jQuery._langparam(_LANGAR['canvas.mobileinputdisplay'], [ this.order+1,this.parentcanvas.cDocumentSection.cLElementList.length]),
                                           // this.cDocumentElement.cSElementLable,
                                           this.cDocumentElement.cSElementPassword == "1"? "type='password'" : "type='text'",
                                           this.cDocumentElement.cSElementTextData == null ? "" :  this.cDocumentElement.cSElementTextData,
                                           this.cDocumentElement.cSElementLable == null ? "" :  this.cDocumentElement.cSElementLable
                                           ));
       
       
       this.chtmlElementInputctrl = $('#twdgtinputctrl');
       this.chtmlElementInputctrl.unbind();
//       this.chtmlElementInputctrl.bind('change', function(event) {self.chtmlElementInputctrl_change(event)});
//       this.chtmlElementInputctrl.bind('focusout', function(event) {self.chtmlElementInputctrl_focusout(event)});
       
       this.chtmlElementDone =  $('.twdgtinput_donebtn',inputareaelement);
       this.chtmlElementcancel =  $('.twdgtinput_cancelbtn',inputareaelement);
       
       this.chtmlElementDone.click(function(event) {self.done(event); return false;});
       this.chtmlElementcancel.click(function(event) {self.cancel(event); return false;});
       
//       this.chtmlElementnext.click(function(event) {self.next(event); return false;});
                       
       $('.listEleimg',inputareaelement).addClass('aa-div-hide');
       $('.listEleName',inputareaelement).addClass('aa-div-hide');
       $('.listEleNo',inputareaelement).addClass('aa-div-hide');
   
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
//       this.chtmlElement_colapse();
//       this.chtmlElementexpand.show();
//       if ( _MODIFIEDELMENTS !== undefined && _MODIFIEDELMENTS[this.cDocumentElement.cSElementId]){
//           this.chtmlElementexpand.addClass("mobile_element_expand_btn-modified");
//       }else{
//           this.chtmlElementexpand.removeClass("mobile_element_expand_btn-modified");
//       }
//       //Parameters : (tObjectType,tObjID,tObjName,tObjLable,historyValue)
       this.parentcanvas.drawarea.trigger("elementValueChange",
                                          ["4",this.cDocumentElement.cSElementId,this.cDocumentElement.cSElementLable,
                                           ctrlelementarray[this.cDocumentElement.cSElementType],this.cDocumentElement.cSElementTextData]
                                          );
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
       //$("#_inputTextData",this.chtmlElement).unbind();
        this.parentcanvas.drawarea.trigger("elementexpand",[this]);
   },
   
   chtmlElement_colapse : function()
   {
       this.chtmlElementdisplay.show();
       this.ctrlEleEdit.hide();
       this.cpRedrow();
   },
   
   cpRedrow : function()
   {
       this.chtmlElementdisplay.html(this.cDocumentElement.cSElementPassword == "1" ? 
                                     "*****" : this.cDocumentElement.cSElementTextData == null ||  this.cDocumentElement.cSElementTextData == '' ?
                                     _LANGAR['canvas.mobiletaphere'] : this.cDocumentElement.cSElementTextData );
       
       if(this.cDocumentElement.cSElementTextData == null ||  this.cDocumentElement.cSElementTextData == ''){
           this.chtmlElement.addClass("twdgt-mobile-empty-text");
       }
       else{                          
           this.chtmlElement.removeClass("twdgt-mobile-empty-text");   
           this.chtmlElementdisplay.text(this.cDocumentElement.cSElementTextData);
       }
                       
       if ( _MODIFIEDELMENTS !== undefined && _MODIFIEDELMENTS[this.cDocumentElement.cSElementId])
           this.chtmlElementexpand.addClass("mobile_element_expand_btn-modified");
       else
           this.chtmlElementexpand.removeClass("mobile_element_expand_btn-modified");
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
//       this.chtmlElement_colapse();
       this.chtmlElementInputctrl.unbind();
       this.parentcanvas.drawarea.trigger("elementcolapse",[this]);
   }

                       
                       
});
 
 
 
 })(jQuery)


