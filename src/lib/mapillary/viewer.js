import 'leaflet-i18n';
import {Mapi} from '~/mapillary';

Mapi.addInitHook(function(){
	let _this = this;
	let _divDialog = this._viewDiv || L.DomUtil.create('div', '');
	let classStart = _this.options.panoDivDialogClass || 'pano-dialog';

	_this.panodialog = createViewDialog();

	$(_this).on('add_pegman_mapi', function() {
		$(_this._panoDivView).css({'width':'100%', 'height':'100%'});
		console.log('add_pegman_mapi');
		_divDialog.append(_this._panoDivView);
  });

	$(_this).on('open_panorama', function(){
		var isOpen =_this.panodialog.dialog('isOpen');
		if(!isOpen) _this.panodialog.dialog('open');
	});				

	$(_this).on('close_panorama', function(){
		var isOpen =_this.panodialog.dialog('isOpen');
		if(isOpen) _this.panodialog.dialog('close');
		_this._button.state('add-pano');
		_this.pegmanRemove();
	});	

	function createViewDialog(){
		if(_this.panodialog) return _this.panodialog;
		
		let panodialog = $(_divDialog).dialog({
			title: L._('Mapillary View'),
			dialogClass: classStart,
			autoOpen: false,
			height: 450,
			width: 650,
			position: {my:'left top', at:'left+50 top+20', of:window },
			open: function() {
				_this.activate();
				_divDialog.append(_this._loader);
			},
			close: function() {
				_this.deactivate();
				_this.pegmanRemove();
			},
			resizeStop: function() {
				_this._invalidateSize();
			}
		});	
		return panodialog;
	}

	$(_this).on('change', function(e){
		let event = e.originalEvent;
		let iconPos = _this.Utils.setIconPosition(event.heading);
		let markerPos = event.latlng;
		this._pegmanMarker.setLatLng(markerPos);
		this._pegmanMarker.getElement().style.backgroundPosition = iconPos;
		//this.fire('svpc_change', { latlng: pos, heading: pov.heading, zoom: pov.zoom, pitch: pov.pitch });
	});
});
