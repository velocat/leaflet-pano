/* eslint-disable no-undef */
'use strict';
//import L from 'leaflet';
import config from '@/config';

class Utils{ 
  
  constructor(caller) {
    this.caller = caller;
    this.__interactURL = config.interactURL;
    this.__gmapsURL = config.gmapsURL;
    this.__mutantURL = config.mutantURL;
    this.__mapillaryURL = config.mapillaryURL;
    //console.log(caller);
  }

  get_caller = () => {
    return this.caller;
  }

  loadScriptsMapillary = (toggleMapillaryView) =>{
    if (this.caller._lazyInteractAdded) return; 
    this.caller._lazyInteractAdded = true;

    this.loadJS(this.__interactURL, this.caller._loadInteractHandlers.bind(this.caller), typeof interact !== 'function');
    if(toggleMapillaryView){
      this.loadJS(this.__mapillaryURL, this.caller._checkSupportBrowser.bind(this.caller, toggleMapillaryView), !('Mapillary' in window) && (typeof Mapillary !== 'object'));
    }
  }

  loadScripts = (toggleStreetView) =>{
    if (this.caller._lazyLoaderAdded) return; //Pegman
    this.caller._lazyLoaderAdded = true;

    console.log(toggleStreetView);

    this.loadJS(this.__interactURL, this.caller._loadInteractHandlers.bind(this.caller), typeof interact !== 'function');

    //if(toggleStreetView){
      this.loadJS(this.__gmapsURL + '&key=' + this.caller.options.apiKey + '&libraries=' + this.caller.options.libraries + '&callback=?', this.caller._loadGoogleHandlers.bind(this.caller, toggleStreetView), !('google' in window) && (typeof google !== 'object' || typeof google.maps !== 'object'));
      this.loadJS(this.__mutantURL, this.caller._loadGoogleHandlers.bind(this.caller, toggleStreetView), typeof L.GridLayer.GoogleMutant !== 'function');
    //}
  }

  loadJS (url, callback, condition){
    if (!condition) {
			callback();
			return;
		}
		if (url.indexOf('callback=?') !== -1) {
			this.jsonp(url, callback);
		} else {
			var script = document.createElement('script');
			script.src = url;
			var loaded = function() {
				script.onload = script.onreadystatechange = null;
				this.log(url + ' loaded');
				callback();
			}.bind(this);
			script.onload = script.onreadystatechange = loaded;

			var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
			head.insertBefore(script, head.firstChild);
		}
  }

  jsonp(url, callback, params){
    var query = url.indexOf('?') === -1 ? '?' : '&';
    params = params || {};
    for (var key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        query += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
      }
    }

    var timestamp = new Date().getUTCMilliseconds();
    var jsonp = 'json_call_' + timestamp; // uniqueId('json_call');
    window[jsonp] = function(data) {
      callback(data);
      window[jsonp] = undefined;
    };

    var script = document.createElement('script');
    if (url.indexOf('callback=?') !== -1) {
      script.src = url.replace('callback=?', 'callback=' + jsonp) + query.slice(0, -1);
    } else {
      script.src = url + query + 'callback=' + jsonp;
    }
    var loaded = function() {
      if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
        script.onload = script.onreadystatechange = null;
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }
    };
    script.async = true;
    script.onload = script.onreadystatechange = loaded;
    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    // Use insertBefore instead of appendChild to circumvent an IE6 bug.
    // This arises when a base node is used.
    head.insertBefore(script, head.firstChild);
  }
  
  setIconPosition(pos){
		var iconPos = '0 0';
		if(pos >= 0 && pos < 22.5 || pos == 360){
			iconPos = '0 0';
		}else if(pos >= 22.5 && pos < 45){
			iconPos = '0 -52px';
		}else if(pos >= 45  && pos < 67.5){
			iconPos = '0 -104px';
		}else if(pos >= 67.5 && pos < 90){
			iconPos = '0 -156px';
		}else if(pos >= 90 && pos < 112.5){
			iconPos = '0 -208px';
		}else if(pos >= 112 && pos < 135){
			iconPos = '0 -260px';
		}else if(pos >= 135 && pos < 157.5){
			iconPos = '0 -312px';
		}else if(pos >= 157.5 && pos < 180){
			iconPos = '0 -364px';
		}else if(pos >= 180 && pos < 202.5){
			iconPos = '0 -416px';
		}else if(pos >= 202.5 && pos < 225){
			iconPos = '0 -468px';
		}else if(pos >= 225 && pos < 247.5){
			iconPos = '0 -520px';
		}else if(pos >= 247.5 && pos < 270){
			iconPos = '0 -572px';
		}else if(pos >= 270 && pos < 292.5){
			iconPos = '0 -624px';
		}else if(pos >= 292.5 && pos < 315){
			iconPos = '0 -676px';
		}else if(pos >= 315 && pos < 337.5){
			iconPos = '0 -728px';
		}else if(pos >= 337.5 && pos < 360){
			iconPos = '0 -780px';
		}
		return iconPos;
	}

  log(args) {
		console.log(args);
	}

}

export {Utils};