//import L from 'leaflet';
//import 'leaflet-easybutton';
import {Custom} from '~/control/custom';

export const ButtonPano = L.Control.ButtonPano = L.Control.extend({
  options:{
    panoopened: false,
    pegmanOn: false,
    mapillaryOn: false,
    position: 'bottomright', 
  },

  initialize: function(options){ 
    L.Control.prototype.initialize.call(this, options);
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
          _this.mapillaryControl.remove();
          _this.pegmanControl.remove();
          control.state('add-pano');
        },
        title: 'remove pano'
      }],
      position: this.options.position,
      id: 'pano-btn'
    });

    /*this._toolsButtonsBar = L.easyBar([this.Btn], {
      id: 'toolsbar',
      position: this.options.position,
    }).addTo(map);*/
  },

  onAdd: function(map){
    this._map = map;
    return this.Btn.container; //this._toolsButtonsBar.container;
  },
  
  onRemove: function(map) {
    this.togglePano('close');
    this.closeDialogs();
    this.mapillaryControl.remove();
    this.pegmanControl.remove();
  },

  closeDialogs: function(){
    this.pegmanControl.panodialog.dialog('close');
    this.mapillaryControl.panodialog.dialog('close');
  },
  
  togglePano: function(action){
    this.panoControlDiv = this.panoControlDiv ? this.panoControlDiv : this._createPanoControl();
    if(action){
      if(action === 'open'){
        this.panoControlDiv.addTo(map);
        this.panoopened = true;
      }else{
        this.panoControlDiv.remove();
        this.panoopened = false;
      }
    }
    else if(!this.panoopened){
      this.panoControlDiv.addTo(map);
      this.panoopened = true;
    }else{
      this.panoControlDiv.remove();
      this.panoopened = false;
    }
  },

  _createPanoControl: function (){
    let _this = this;
    console.log(this.Btn);

    //let mapHeight = this.Btn._map.getSize().y;
    //let offsetTop = this.Btn._container.parentNode.offsetTop; //document.getElementById('pano-btn').offsetTop - 10; 
    const divHeight = 91; //TODO calculate height

    let offsetTop = (this.options.position == 'bottomleft' || this.options.position == 'bottomright')
      ? this.Btn._container.offsetTop + this.Btn._container.offsetHeight - divHeight
      : this.Btn._container.offsetTop-10; 

    const mainstyle = { 
      position: 'absolute',
      top: offsetTop+'px',
      width: '200px',
      cursor: 'pointer'
    };
    const styled = (this.options.position == 'bottomleft' || this.options.position == 'topleft')
      ? { left: '50px' }
      : { right: '50px' };
    const style = { ...mainstyle, ...styled };
    
    let panoControlDiv = new Custom({
      position: _this.options.position,
      content: '<div class="control-custom-head"><i class="fa fa-lg fa-male orange control-custom-head-icon"></i><b class="ml-10">Choice Panorama:</b></div>'+
            '<div class="control-custom-content">'+
            '<div onclick="Pano.viewStreetView();"><input type="radio" class="control-custom-item" name="pano" id="setStreetView" '+( _this.pegmanOn ? ' checked ' : '' )+'> <label for="setStreetView"> "Google"</label></div>'+
            '<div onclick="Pano.viewMapillary();"><input type="radio" class="control-custom-item" name="pano" id="setMapinary"'+( _this.mapillaryOn ? ' checked ' : '' )+'> <label for="setMapinary"> "Mapillary"</label></div>'+
            '</div>',
      classes: 'control-custom',
      style: style,
    });	

    return panoControlDiv;
  }
  
});
