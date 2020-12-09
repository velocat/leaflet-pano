//import L from 'leaflet';
import 'leaflet-easybutton';
import {Custom} from '~/control/custom';

export const ButtonPano = L.Control.ButtonPano = L.Control.extend({
  options:{
    panoopened: false,
    pegmanOn: false,
    mapillaryOn: false,
    position: 'topleft', 
  },

  initialize: function(options){ 
    L.Control.prototype.initialize.call(this, options);
    console.log(this.map);
    let _this = this;
    this.Btn = L.easyButton({ 
      states: [{
        stateName: 'add-pano',
        icon: 'fa-binoculars fa-lg',
        title: 'add pano',
        onClick: function(control) {
          _this.togglePano('open');
          control.state('remove-pano');
        }
      }, {
        icon: 'fa-binoculars fa-lg light-blue',
        stateName: 'remove-pano',
        onClick: function(control) {
          _this.togglePano('close');
          _this.closeDialogs();
          mapillaryControl.remove();
          pegmanControl.remove();
          control.state('add-pano');
        },
        title: 'remove pano'
      }]
    });

    this._toolsButtonsBar = L.easyBar([this.Btn], {
      id: 'toolsbar',
      position: this.options.position,
    }).addTo(map);
  },

  onAdd: function(map){
    return this._toolsButtonsBar.container;
  },
  
  onRemove: function(map) {
    _this.togglePano('close');
    _this.closeDialogs();
    mapillaryControl.remove();
    pegmanControl.remove();
  },

  closeDialogs: function(){
    pegmanControl.panodialog.dialog('close');
    mapillaryControl.panodialog.dialog('close');
  },
  
  togglePano: function(action){
    this.panoControlDiv = this.panoControlDiv ? this.panoControlDiv : this._createPanoControl();
    if(action){
      if(action === 'open'){
        this.panoControlDiv.addTo(map);
        panoopened = true;
      }else{
        this.panoControlDiv.remove();
        panoopened = false;
      }
    }
    else if(!panoopened){
      this.panoControlDiv.addTo(map);
      panoopened = true;
    }else{
      this.panoControlDiv.remove();
      panoopened = false;
    }
  },

  _createPanoControl: function (){
    let _this = this;
    let offsetTop = document.getElementById('toolsbar').offsetTop - 10;
    let panoControlDiv = new Custom({
      position: 'topleft',
      content: '<div class="control-custom-head"><i class="fa fa-lg fa-male orange control-custom-head-icon"></i><b class="ml-10">Choice Panorama:</b></div>'+
            '<div class="control-custom-content">'+
            '<div onclick="viewStreetView();"><input type="radio" class="control-custom-item" name="pano" id="setStreetView" '+( _this.pegmanOn ? ' checked ' : '' )+'> <label for="setStreetView"> "Google"</label></div>'+
            '<div onclick="viewMapillary();"><input type="radio" class="control-custom-item" name="pano" id="setMapinary"'+( _this.mapillaryOn ? ' checked ' : '' )+'> <label for="setMapinary"> "Mapillary"</label></div>'+
            '</div>',
      classes: 'control-custom',
      style:
      {
        position: 'absolute',
        left: '50px',
        top: offsetTop+'px',
        width: '200px',
        cursor: 'pointer'
      },
    });	

    return panoControlDiv;
  }
  
});
