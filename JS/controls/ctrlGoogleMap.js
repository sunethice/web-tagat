/**
 * ctrlGoogleMap.js (TAGAT)
 * Built on top of the jQuery library
  */

(function($) {

    /* dctrlQRCode */
    $.fn.ctrlGoogleMap = function(pElement, canvas, n) { return new $.ctrlGoogleMap(this, pElement, canvas, n) } ;
	$.ctrlGoogleMap = function (e,pElement, canvas, n) {



        this.type = "ctrlDate"; 
    	this.cDocumentElement = pElement;
		this.parentcanvas = canvas;
		this.order = n;
		this.chtmlElement = $(e);
		this.chtmlElementLable;
		this.cPermission = pElement.cSPermissionType;
		
		this.geocoder = new google.maps.Geocoder();
		this.lat;
		this.lang;
		this.zoom;
        this.maptype;
		this.gMap;
		this.gPointer;
		this.address;
		
		this.cpSetup();
		this.cpRedrow();
 
		
		return this;
   }
    				
	/* EXTEND dctrlInput */
    $.ctrlGoogleMap.fn = $.ctrlGoogleMap.prototype = {ctrlGoogleMap: '0.0.1'};
	$.ctrlGoogleMap.fn.extend = $.ctrlGoogleMap.extend = $.extend;
	$.ctrlGoogleMap.fn.extend({
	
	
	cpSetup : function()
	{
        var self = this;
		
        if(this.cDocumentElement.cSElementTextData != null && this.cDocumentElement.cSElementTextData != "")
            this.address = this.cDocumentElement.cSElementTextData;
        else
         {
           this.address = "";
           this.cDocumentElement.cSElementTextData= "";
         }
         
		this.chtmlElement.html(String.format('<div class="mobile_element_detail">' +
                '<div class="mobile_element_title">{0}</div>' +       
                '<div class="mobile_element_mapdata"></div>' +
                '</div>' +
                '<div class="mobile_element_expand_btn"></div>',this.cDocumentElement.cSElementLable));
       
       this.chtmlElementLable = $('.mobile_element_title',this.chtmlElement);
       this.chtmlElementdisplay = $('.mobile_element_mapdata',this.chtmlElement);
       this.chtmlElementexpand = $('.mobile_element_expand_btn',this.chtmlElement); 
       this.chtmlElement.click(function(event){self.chtmlElement_expand();});
       
       return;
       
       
       
        //        
     	var self = this;
		
        if(this.cDocumentElement.cSElementTextData != null && this.cDocumentElement.cSElementTextData != "")
            this.address = this.cDocumentElement.cSElementTextData;
        else
         {
           this.address = "";
           this.cDocumentElement.cSElementTextData= "";
         }
        		
		this.chtmlElement.html(String.format(
		"<div id='close' class='aa-close'></div><div id='copy' class='aa-copy'></div>"+
		"<div id='ctrlMap' class='des-element-content'>"+
			"<div id='Label'> {0} </div>"+
			"<div id='ctrlcontent' style='width:auto;float:left;position:relative;'>"+
            "<div id='searchtextcontent' class='Search-area'><div class='input-map-search-wrap'>"+
                "<div class='input-map-searchtext'>"+
                    "<input id='map-txtsearch' type='text' class='txtsearch'></div>"+
                "</div>"+
            "</div>"+
            "<div  class='Search-area'><div id='displayname' class='input-map-selectresult-txt' title='edit'></div></div>"+
			     "<div id='search-result' class='des-map-search aa-div-hide'></div>"+
			     "<div id='mapcontent_{1}' class='input-map'></div>"+
			"</div>"+
		"</div>",
		this.cDocumentElement.cSElementLable,
		this.cDocumentElement.cSElementId));
				
		this.chtmlElementLable = $('#Label',this.chtmlElement);
		this.chtmlElementContent = $('#ctrlMap',this.chtmlElement);
		this.chtmlElementCtrlContent = $('#ctrlcontent',this.chtmlElement);
		this.chtmlGoogleMap = $(String.format('#mapcontent_{0}',this.cDocumentElement.cSElementId));
		this.chtmlTxtSearch = $('#map-txtsearch',this.chtmlElement);
        this.chtmlBtnSearch = $('#map-btnsearch',this.chtmlElement);
        this.chtmlResultContent = $('#search-result',this.chtmlElement);
       

        this.chtmlResultContent.bind('focusout',function(event){self.chtmlResultContent_focusout(event)});
        
        if(this.cDocumentElement.cMapCoordinate != null && this.cDocumentElement.cMapCoordinate != undefined)
        {
        
            this.lat = parseFloat(this.cDocumentElement.cMapCoordinate.lat);
            this.lang = parseFloat(this.cDocumentElement.cMapCoordinate.lang);
            this.zoom = parseInt(this.cDocumentElement.cMapCoordinate.zoom);
            this.maptype = this.cDocumentElement.cMapCoordinate.maptype;
            
        }
        else
        {
            this.lat = 51.508515;
            this.lang = -0.12548719999995228;
            this.zoom = 10;
            this.maptype = google.maps.MapTypeId.ROADMAP;
            
        }
        
        _myLatlng = new google.maps.LatLng(this.lat, this.lang);
        _myOptions = {zoom: this.zoom, streetViewControl: false, center: _myLatlng, mapTypeId: this.maptype };
        this.gMap = new google.maps.Map(document.getElementById("mapcontent_" + this.cDocumentElement.cSElementId), _myOptions);
        
        this.gPointer = new google.maps.Marker({
	        position: _myLatlng,
	        map: this.gMap, 
            title: "",
            draggable:true,
            animation: google.maps.Animation.DROP
            });
                  
    	    google.maps.event.addListener(this.gMap, 'zoom_changed', function() { self.gMap_zoom_changed()}); 
            google.maps.event.addListener(this.gPointer, 'dragend', function() { self.gPointer_onMove()}); 
            //google.maps.event.addListener(this.gPointer, "click", function() {self.gPointer_onClick(event)});     
            google.maps.event.addListener(this.gMap, 'click', function(event) {self.placeMarker(event.latLng,self.gMap);});
            google.maps.event.addListener(this.gMap, 'maptypeid_changed', function() {self.gMap_type_changed()});
    

        
      /* contentString = String.format("<div class='temp-map-tagarea'>"+
                        "<textarea id='map-input-textare' class='temp-map-textarea' type='text' name='txt' >{0}</textarea>"+
                        "<div class='temp-map-btn-wrap'><div id='maptextOk' class='temp-map-btn'>Ok</div>"+
                        "<div id='maptextCancel' class='temp-map-btn'>Cancel</div></div>"+
                        "</div>",this.cDocumentElement.cSElementTextData);
*/
       // google.maps.event.addListener(self.gPointer, 'click', function(){
        
      /*  if(self.infoWindow  == null  || self.infoWindow == undefined)
        {
             self.infoWindow = new google.maps.InfoWindow({
                content: contentString
                });

        }
            self.infoWindow.open(self.gMap,self.gPointer);
            $('#maptextOk',self.chtmlElement).unbind();
            $('#maptextCancel',self.chtmlElement).unbind();
            $('#maptextOk',self.chtmlElement).bind('click',{'html':self.infoWindow}, function(event){self.maptextOk_click(event)});
            $('#maptextCancel',self.chtmlElement).bind('click', function(event){limitEvent(event);self.maptextCancel_click(event)});
            $('#map-input-textare',self.chtmlElement).bind('change', function(event){self.mapinputtextare_change(event)});
            
            $('#map-input-textare',self.chtmlElement).val(self.cDocumentElement.cSElementTextData);          



        });*/
     
        google.maps.event.addListener(self.gMap, "idle", function(){
                center = self.gMap.getCenter();
                zoom = self.gMap.getZoom()
                google.maps.event.trigger(self.gMap, "resize");
                self.gMap.setCenter(center);
                self.gMap.setZoom(zoom);
                google.maps.event.clearListeners(self.gMap, 'idle');
        });	
	},
	
    set_current_location:function(map) {
        var self = this;
                         
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                                                     
                _myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                _myOptions = {zoom: 17, streetViewControl: false, center: _myLatlng, mapTypeId: self.gMap.getMapTypeId() };

                                                     self.cDocumentElement.cMapCoordinate.lat = position.coords.latitude;
                                                     self.cDocumentElement.cMapCoordinate.lang = position.coords.longitude;
                                                     self.cDocumentElement.cMapCoordinate.zoom = 17;
                                                     self.openmap();
                self.populate_cur_location(position.coords.latitude,position.coords.longitude);
                
                                    }, function error(err) {
                                        alert('Error occurred. Error message: ' + err.message);
                                        console.log('error: ' + err.message);
                                    },{
                                        timeout:50000
                                    });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },
                              
	chtmlElement_expand : function()
	{
	   this.parentcanvas.drawarea.trigger("elementexpand",[this]);
	},
	
    change_loc_name : function(){
        Obj = {};
        Obj.lat = "" + this.lat + "";
        Obj.lang = "" + this.lang + "";
        Obj.zoom =  "" + this.zoom + "";
        Obj.maptype = "" + this.gMap.getMapTypeId() + "";
                     
        this.cDocumentElement.cMapCoordinate = Obj;
                          
        if(this.cDocumentElement.cSElementTextData != null && this.cDocumentElement.cSElementTextData != "")
        {
            if(this.cDocumentElement.cSElementTextData != $('#displayname', this.inputareaelement).val()){
                this.cDocumentElement.cSElementTextData = $('#displayname', this.inputareaelement).val();
            }
        }
    },
	
    populate_cur_location : function(lat,lng){
        var self = this;
        this.lat = lat;
        this.lang = lng;
        this.zoom = 17;
        this.maptype = this.cDocumentElement.cMapCoordinate.maptype;
                              
        self.getAddress();
    },
	
	input : function (inputareaelement)
	{
 	  this.oldval = this.cDocumentElement.cSElementTextData;
 	  this.oldcoord = this.cDocumentElement.cMapCoordinate;
 	  this.inputareaelement = inputareaelement;
                              
      $('#disable_body').remove();
//      $('#tagatwidget').prepend('<div id="disable_body" class="disableBody"> </div>');
      $('#twdgt-input').show();
      $('#twdgt-input').css('left','auto') ;
      $(__objconnection).trigger('navWrapShow');
 	  
	  var self= this;
	  inputareaelement.html(String.format(
	   '<div class="listHeader">'+
//            '<div class="listEleimg {0}"></div>' +
//    	    '<div class="listEleName">{1}</div>' +
//            '<div class="listEleNo">' +
//        	    '<div class="eleCurrent"></div>' +
//                '<div class="eleAll">{2}</div>' +
//            '</div>' +
            
            '<div class="twdgtinput_header_C">' +
                '<div id="date-done" class="twdgtinput_donebtn">Done</div>' +
                '<div id="date-cancel" class="twdgtinput_cancelbtn tempcancel">Cancel</div>' +
            '</div>' +
        '</div>' +
        '<div class="twdgtinput_header_D">' +
        '<div  class="Display-area">'+
            '<input id="displayname" class="input-map-selectresult-txt" title="edit" value="{3}"></input>'+
        '</div>'+
            '<div id="twdgtmap" class="twdgtmap">'+
            '</div>'+
            
            '<div id="searchtextcontent" class="Search-area">' +
                '<div class="input-map-search-wrap">' +                    
                    '<div class="input-map-searchtext">'+
                        '<input id="map-txtsearch" type="text" class="txtsearchmap" placeholder="Search Location..">'+
                        '<div id="_clrText" class="clrText aa-div-hide"></div>'+
                    '</div>' +
					'<div id="map-btnsearch" class="input-map-btnsearch"></div>'+
                    '<div id="location-btnsearch" class="input-location-btnsearch"></div>'+
                '</div>' +
            '</div>'+
            '<div id="search-result" class="des-map-search aa-div-hide"></div>'+
			'<div id="location-btnsearch" class="des-map-myloc"></div>'+
        '</div>', 
                
        "London, UK",
        _LANGAR['canvas.mobilectrlmap'],
        jQuery._langparam(_LANGAR['canvas.mobileinputdisplay'],
        [ this.order+1,this.parentcanvas.cDocumentSection.cLElementList.length]),
        this.cDocumentElement.cSElementTextData
		));
    
       
        this.chtmlElementDone =  $('.twdgtinput_donebtn',inputareaelement);
        this.chtmlElementcancel =  $('.twdgtinput_cancelbtn',inputareaelement);
        
                              
        this.chtmlTxtClr = $('#_clrText',inputareaelement);
		this.chtmlTxtSearch = $('#map-txtsearch',inputareaelement);
        this.chtmlBtnSearch = $('#map-btnsearch',inputareaelement);
        this.chtmlResultContent = $('#search-result',inputareaelement);
        this.chtmlBtnCurLoc = $('#location-btnsearch',inputareaelement);
       
              
        
        this.chtmlElementDone.click(function(event, data) {self.done_click(event, data); return false;});
        this.chtmlElementcancel.click(function(event) {self.cancel_click(event); return false;});
        
        this.chtmlBtnSearch.unbind('click');
        this.chtmlBtnSearch.bind('click', function(event){self.chtmlBtnSearch_click(event)});
        this.chtmlBtnCurLoc.bind('click',function(event){
                                        self.set_current_location(self.gMap);
                                     }
                                 );
                              
        this.chtmlTxtClr.click(function(event){
                               self.chtmlTxtSearch.val('');
                               $(this).addClass('aa-div-hide');
                             });
                              
         this.chtmlTxtSearch.unbind('keydown');
         this.chtmlTxtSearch.bind('keydown',function(e) {
                    if (e.keyCode == 13) {
                        self.chtmlBtnSearch_click(e); return false;
                    }
                    else{
                        if($(this).val()!=''){
                          self.chtmlTxtClr.removeClass('aa-div-hide');
                        }
                    }
                });
                
         $('#displayname',inputareaelement).unbind();
         $('#displayname',inputareaelement).bind('click', function(event){self.displayname_click(event)});
         $('#displayname',inputareaelement).bind('change',function(event){self.change_loc_name();})
                
        
        
        this.openmap();  

	},
	
	openmap : function()
	{
	   
	    var self = this;
	    if(this.cDocumentElement.cMapCoordinate != null && this.cDocumentElement.cMapCoordinate != undefined)
        {
       
            this.lat = parseFloat(this.cDocumentElement.cMapCoordinate.lat);
            this.lang = parseFloat(this.cDocumentElement.cMapCoordinate.lang);
            this.zoom = parseInt(this.cDocumentElement.cMapCoordinate.zoom);
            this.maptype = this.cDocumentElement.cMapCoordinate.maptype;
            
        }
        else
        {
                              
            this.lat = 51.508515;
            this.lang = -0.12548719999995228;
            this.zoom = 10;
            this.maptype = google.maps.MapTypeId.ROADMAP;
            this.cDocumentElement.cSElementTextData = 'London, UK';
            
        }
        
        _myLatlng = new google.maps.LatLng(this.lat, this.lang);
        _myOptions = {zoom: this.zoom, streetViewControl: false, center: _myLatlng, mapTypeId: this.maptype };
        
       this.gMap = new google.maps.Map(document.getElementById("twdgtmap"), _myOptions);
       this.gPointer = new google.maps.Marker({
	        position: _myLatlng,
	        map: this.gMap, 
            title: "",
            draggable:true,
            animation: google.maps.Animation.DROP
            });
         
    	    google.maps.event.addListener(this.gMap, 'zoom_changed', function() { self.gMap_zoom_changed()});
            google.maps.event.addListener(this.gPointer, 'dragend', function() {self.gPointer_onMove()});
            google.maps.event.addListener(this.gMap, 'click', function(event) {self.placeMarker(event.latLng,self.gMap);});
            google.maps.event.addListener(this.gMap, 'maptypeid_changed', function() {self.gMap_type_changed()});
                              
    
          
            google.maps.event.addListener(self.gMap, "idle", function(){
                center = self.gMap.getCenter();
                zoom = self.gMap.getZoom()
                google.maps.event.trigger(self.gMap, "resize");
                self.gMap.setCenter(center);
                self.gMap.setZoom(zoom);
                google.maps.event.clearListeners(self.gMap, 'idle');
        });	
        
	},
	
	setLocation : function()
	{
	    var self = this;
		var _myLatlng = new google.maps.LatLng(this.lat, this.lang);
        
        this.gMap.panTo(_myLatlng);
		this.gPointer.setPosition(_myLatlng);
		this.genarateElementTxtData();
		  
	},
	
	placeMarker : function (location,map)
	{
	   var self = this;
	   this.lat = location.lat();
       this.lang = location.lng();
	   this.getAddress();
	   var _myLatlng = new google.maps.LatLng(this.lat, this.lang);
       this.gMap.panTo(_myLatlng);
	   this.gPointer.setPosition(_myLatlng);
       
    },
	
	gMap_zoom_changed : function(event)
	{
	    this.zoom = this.gMap.getZoom();
	    this.genarateElementTxtData(0);
	},
                              
    gMap_type_changed : function(event){
        this.maptype = this.gMap.getMapTypeId();
        this.genarateElementTxtData(0);
    },
	
	gPointer_onMove : function(event)
	{
	    _latLang = this.gPointer.getPosition();
	    this.lat = _latLang.lat()
        this.lang = _latLang.lng();
        this.getAddress();
        
	},
	
	getAddress : function()
	{
	    var self = this;
                              
	    _myLatlng = new google.maps.LatLng(this.lat, this.lang);
	    self.address = _LANGAR['canvas.mobilectrlmapnoadress']; // "No formatted address for this location";
	    this.geocoder.geocode({'latLng': _myLatlng}, function(results, status) 
        {
            if (status == google.maps.GeocoderStatus.OK) 
            {   
                self.address = results[0].formatted_address;
                self.genarateElementTxtData();
            }
        })
	},
	
	genarateElementTxtData : function(lod)
	{
	    var self = this;
          
        if(lod != 0){
            this.cDocumentElement.cSElementTextData = this.address;
        }
//        this.chtmlTxtSearch.val(this.cDocumentElement.cSElementTextData);

	    Obj = {};
	    Obj.lat = "" + this.lat + "";
	    Obj.lang = "" + this.lang + "";
	    Obj.zoom =  "" + this.zoom + "";
        Obj.maptype = "" + this.gMap.getMapTypeId() + "";
	    
	    this.cDocumentElement.cMapCoordinate = Obj;
        if(this.cDocumentElement.cSElementTextData != null && this.cDocumentElement.cSElementTextData != "")
        {
            $('#displayname', this.inputareaelement).val(this.cDocumentElement.cSElementTextData);
        }
        else
        {
//            $('#searchtextcontent', this.inputareaelement).removeClass('aa-div-hide');
        }
        
         if (_MODIFIEDELMENTS === undefined)
		  _MODIFIEDELMENTS = [];
		  _MODIFIEDELMENTS[this.cDocumentElement.cSElementId] = 'true';        
        
    },
    
	
	done_click : function(event,data)
	{
	
        this.cpRedrow();
   	    this.chtmlElementDone.unbind();
        this.chtmlElementcancel.unbind();
	    this.parentcanvas.drawarea.trigger("elementcolapse",[this]);
	},
	cancel_click : function()
	{   
	    this.cDocumentElement.cSElementTextData = this.oldval;
	    this.cDocumentElement.cMapCoordinate = this.oldcoord;
 	  
	    if ( _MODIFIEDELMENTS !== undefined && _MODIFIEDELMENTS[this.cDocumentElement.cSElementId])
	    delete _MODIFIEDELMENTS[this.cDocumentElement.cSElementId];
        this.cpRedrow();
        //SpinningWheel.close();
   	    this.chtmlElementDone.unbind();
        this.chtmlElementcancel.unbind();
	    this.parentcanvas.drawarea.trigger("elementcolapse",[this]);
	    
	},
	
                         
	

    mapinputtextare_change : function()
    {
 
    //   $('#map-input-textare',self.chtmlElement).val());
    },

    maptextOk_click : function(event)
    {
        window.event.cancelBubble = true;
       this.cDocumentElement.cSElementTextData = $('#map-input-textare',this.inputareaelement).val();
        $('#displayname',this.inputareaelement).html(this.cDocumentElement.cSElementTextData)
       event.data.html.close();
       
        
    },
    
    maptextCancel_click : function()
    {
        this.infoWindow.close();
    }, 

    displayname_click : function()
    {
        $('#displayname',this.chtmlElement).focus();
        
    },


    gPointer_onClick : function(event)
    {
              var self = this;
                contentString = String.format("<div class='temp-map-tagarea'>"+
                        "<textarea id='map-input-textare' class='temp-map-textarea' type='text' name='txt' >{0}</textarea>"+
                        "<div class='temp-map-btn-wrap'><div id='maptextOk' class='temp-map-btn'>Ok</div>"+
                        "<div id='maptextCancel' class='temp-map-btn'>Cancel</div></div>"+
                        "</div>",this.cDocumentElement.cSElementTextData);
    
        if(self.infoWindow  == null  || self.infoWindow == undefined)
        {
             self.infoWindow = new google.maps.InfoWindow({
                content: contentString
                });

        }
            self.infoWindow.open(self.gMap,self.gPointer);
            $('#maptextOk',self.chtmlElement).unbind();
            $('#maptextCancel',self.chtmlElement).unbind();
            $('#maptextOk',self.chtmlElement).bind('click',{'html':self.infoWindow}, function(event){self.maptextOk_click(event)});
            $('#maptextCancel',self.chtmlElement).bind('click', function(event){limitEvent(event);self.maptextCancel_click(event)});
            $('#map-input-textare',self.chtmlElement).bind('change', function(event){self.mapinputtextare_change(event)});
            
            $('#map-input-textare',self.chtmlElement).val(self.cDocumentElement.cSElementTextData);          



       
    },
    
    result_Select : function()
    {
            var self = this;

    },

	cpRedrow : function()
	{
	
	    if(this.cDocumentElement.cMapCoordinate != null && this.cDocumentElement.cMapCoordinate != undefined)
        {
        
            this.lat = parseFloat(this.cDocumentElement.cMapCoordinate.lat);
            this.lang = parseFloat(this.cDocumentElement.cMapCoordinate.lang);
            this.zoom = parseInt(this.cDocumentElement.cMapCoordinate.zoom);
            this.maptype = this.cDocumentElement.cMapCoordinate.maptype;
                     
            this.chtmlElementdisplay.html(
             '<div class="twdgt-mapstat"><img style="width:auto;height:180px" src="http://maps.googleapis.com/maps/api/staticmap?center=' + this.lat + ',' + this.lang + '&zoom=' + this.zoom + '&maptype=' + this.maptype +'&sensor=false' +
             '&markers=icon:http://d3k0dfbpd1kgat.cloudfront.net/staticFiles/css/IPHONE/images/LocMarker.png|' + this.lat + ',' + this.lang + 
             
             //'&style=hue:0x005DC6|lightness:0' +
             '&scale=2' +
             '&size=260x90' +
             '"/></div>' +
            '<div class="twdgt-mapdata">' + this.cDocumentElement.cSElementTextData + '</div>'
            );
            
            
        }
        else
        {
            this.chtmlElement.addClass("twdgt-mobile-empty-text");
	        this.chtmlElementdisplay.html(_LANGAR['canvas.mobiletaphere']);
            
        }
        
        
	  
	   if ( _MODIFIEDELMENTS !== undefined && _MODIFIEDELMENTS[this.cDocumentElement.cSElementId])
	    this.chtmlElementexpand.addClass("mobile_element_expand_btn-modified");
	   else
	    this.chtmlElementexpand.removeClass("mobile_element_expand_btn-modified");
	
	    return;
     
        setElementAlign(this.cDocumentElement,this.chtmlElementLable,this.chtmlElementCtrlContent,this.chtmlElementContent);
        
		this.chtmlElementLable = $('#Label',this.chtmlElement);
		this.chtmlElementContent = $('#ctrlMap',this.chtmlElement);
		this.chtmlElementCtrlContent = $('#ctrlcontent',this.chtmlElement);
		this.chtmlGoogleMap = $(String.format('#mapcontent_{0}',this.cDocumentElement.cSElementId));
		
		switch (this.cDocumentElement.cSElementSize)
		{
			 case '0':
			    this.chtmlGoogleMap.css({'width':'350px','height':'350px'});
		    break;
		    case '1':
			    this.chtmlGoogleMap.css({'width':'650px','height':'350px'});
		    break;
		    case '2':
			    this.chtmlGoogleMap.css({'width':'350px','height':'650px'});
		    break;
		    case '4':
			    this.chtmlGoogleMap.css({'width': this.cDocumentElement.cWidth});
			    this.chtmlGoogleMap.css({'height':this.cDocumentElement.cHeight});
		    break;
		    
		    default:
            this.chtmlGoogleMap.css({'width':'350px','height':'350px'});

		    break;
		}
       this.cpPermission();
	},
	
	chtmlResultContent_focusout : function()
	{
	    this.chtmlResultContent.addClass('aa-div-hide');
	},
	
	chtmlBtnSearch_click : function()
	{
	    var self = this;
	    _query =  this.chtmlTxtSearch.val();
	    this.chtmlResultContent.removeClass('aa-div-hide');
	    
    	this.geocoder.geocode({ 'address': _query }, function(results, status) 
	    {
            if (status == google.maps.GeocoderStatus.OK) {
               self.drowResults(results);
            } else {
               self.chtmlResultContent.html("<div id='noresult' class='input-map-result-content'>Result not found</div>");
               htmlresult = $('#noresult',self.inputareaelement);
	           htmlresult.bind('click',function(event){self.chtmlResultContent_focusout(event)});
            }                           
         });
	    
	},
	
	cpPermission : function()
	{
    
        var self = this;
	    switch(this.cPermission)
	    {
	        case "2":   
	            this.chtmlElementContent.attr('disabled','disabled');  
	            this.chtmlElementContent.addClass('input-ctrl-disable');
	            this.gMap.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});
	            google.maps.event.clearListeners(self.gMap, 'click');
	            google.maps.event.clearListeners(self.gPointer,'drag');
	        break;
	        
	        case "3":
	            this.chtmlElementContent.removeAttr('disabled');
	            this.chtmlElementContent.removeClass('input-ctrl-disable');
	            
	            this.chtmlBtnSearch.unbind('click');
                this.chtmlBtnSearch.bind('click', function(event){self.chtmlBtnSearch_click(event)});
                this.chtmlTxtSearch.unbind('keydown');
                this.chtmlTxtSearch.bind('keydown',function(e) {
                    if (e.keyCode == 13) {
                        self.chtmlBtnSearch_click(e); return false;
                    }
                });
                
                $('#displayname',this.chtmlElement).unbind();
                $('#displayname',this.chtmlElement).bind('click', function(event){self.displayname_click(event)});
	

	        break;
	        
	        case "1":
	            this.chtmlElement.addClass('aa-div-hide');
	        break;
	        
	        default:
	        break;
	        
	    }
	},
	
	
	
	
	drowResults: function(presult)
	{
	    var self = this;
	    this.chtmlResultContent.html('');
	    $.each(presult, function(index, value){
	        self.chtmlResultContent.append(String.format(
	        "<div id='result{0}' class='input-map-result-content'>"+
	            "<div class='input-map-result-txt'>{1}</div>"+
	            "<div class='input-map-result-other'> {2}</div>"+
	        "</div>",
	        index,
	        value.formatted_address,
	        value.geometry.location
	        ));
	       
	       htmlresult = $(String.format('#result{0}',index),self.inputareaelement);
	       htmlresult.bind('click',{'val': value}, function(event){self.htmlresult_click(event)});
	       
	    });

	},
	
	htmlresult_click : function(event)
	{
	    var _selectLocation = event.data.val;
	    this.lat = _selectLocation.geometry.location.lat();
        this.lang =  _selectLocation.geometry.location.lng();
        this.address = _selectLocation.formatted_address;
	    this.setLocation();
	    this.chtmlResultContent.addClass('aa-div-hide');
	}
	
	
	
	});
})(jQuery)