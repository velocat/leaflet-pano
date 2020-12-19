/* eslint-disable no-undef */
//import L from 'leaflet';
import {Pegman} from '~/pegman';
import '~/pegman/viewer';
import {Mapi} from '~/mapillary';
import '~/mapillary/viewer';
import {ButtonPano} from '~/control/button';

//L.control.buttonpano = (options) => new ButtonPano(options);
//L.control.pegman = (options) => new Pegman(options);
//L.control.mapillary = (options) => new Mapi(options);

(function (factory, window) {
  // define an AMD module that relies on 'leaflet'
  if (typeof define === 'function' && define.amd) {
    define(['leaflet'], factory); // define a Common JS module that relies on 'leaflet'
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    if (typeof window !== 'undefined' && window.L) {
      module.exports = factory(L);
    } else {
      module.exports = factory(require('leaflet'));
    }
  } // attach your plugin to the global 'L' variable


  if (typeof window !== 'undefined' && window.L) {
    window.L.Control.Pano = factory(L);
  }
})(function (L) {


L.Control.Pano = L.Control.extend({
  
  initialize: function(options) {
    L.Util.setOptions(this, options);
    this.pegmanOn = false;
    this.mapillaryOn = false; 
    this.Button = new ButtonPano(options);
    this.options.button = this.Button;

    this.pegmanControl = this.Button.pegmanControl = new Pegman(this.options);
    this.mapillaryControl = this.Button.mapillaryControl = new Mapi(this.options);
  },

  onAdd: function(map) {
    this._map = map;	
  },
  
  onRemove: function(map) {
    this.Button.Btn.remove();
  },
  
  init: function(map){
    let _this = this;
    this.Button.Btn.addTo(map);
    
    this.Button.on('toggle_google', function() {
      _this.viewStreetView(map);
    });

    this.Button.on('toggle_mapi', function() {
      _this.viewMapillary(map);
    });

  },
  
  viewMapillary: function(map){
    this.Button.togglePano('close');
    this.pegmanControl.remove(map);
    this.mapillaryControl.addTo(map);
    this.pegmanOn = false;
    this.mapillaryOn = true;
  },
  
  viewStreetView: function(map){
    this.Button.togglePano('close');
    this.pegmanControl.addTo(map);
    this.mapillaryControl.remove(map);				
    this.pegmanOn = true;
    this.mapillaryOn = false; 
  }

});

//L.control.pano = (options) => new Pano(options);

L.control.pano = function (options) {
  return new L.Control.Pano(options);
};

return L.Control.Pano;
}, window);
