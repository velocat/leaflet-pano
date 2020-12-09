import 'leaflet-i18n';
import {Pegman} from '~/pegman';

Pegman.addInitHook(function(){
	//if (!this.options.panoDivDialogUI) return;
	let _this = this;
	let _divDialog = this._viewDiv || L.DomUtil.create('div', '');
  
  // Fix Css on resize
	let classStart = _this.options.panoDivDialogClass || 'pano-dialog';
	//let classImportant = _this.options.panoDivDialogClass2 || 'pano-dialog-imp';
	_this.panodialog = createViewDialog();
	
	$(_this).on('add_pegman', function() {
		$(_this._panoDiv).css({'width':'auto', 'height':'auto'});
		_divDialog.append(_this._panoDiv);
  });

	$(_this).on('open_panorama', function() {
    _this.panodialog.dialog('open');
	});
			
	$(_this).on('close_panorama', function() {
    _this.panodialog.dialog('close');
	});

	function createViewDialog(){
		if(_this.panodialog) return _this.panodialog;
		
		let panodialog = $(_divDialog).dialog({
			title: L._('Google Street View'),
			dialogClass: classStart,
			autoOpen: false,
			height: 450,
			width: 650,
			position: {my:'left top', at:'left+50 top+20', of:window },
			close: function() {
				_this.pegmanRemove();
			},
			resizeStop: function() {
				google.maps.event.trigger(_this._panorama, 'resize');
				//panodialog.dialog( 'option', 'classes.ui-dialog', classImportant );
			}
		});	
	
		return panodialog;
	}

});
