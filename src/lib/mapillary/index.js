/* eslint-disable no-unused-vars */
//import L from 'leaflet';
//import 'leaflet-easybutton';
import {MapillaryCoverage} from '~/mapillary/mapillary-coverage-layer';
//import {PanoMarker} from '~/mapillary/marker';
import config from '@/config';
import {Utils} from '~/utils';
//import * as Mapillary from 'mapillary-js';

export const Mapi = L.Control.Mapi = L.Control.extend({
	includes: L.Evented ? L.Evented.prototype : L.Mixin.Events, 
	options: {
		position: 'topleft',
		theme: 'leaflet-pegman-v3-small', // or "leaflet-pegman-v3-default"
		debug: false,
		mapillaryKey: '',
		viewDiv: '#pano-div-dialog',
		layerOptions: {opacity: 0.7, zIndex: 8},
		enable: true,		
		button: null,
	},  

	initialize: function(options){
		L.Util.setOptions(this, options);

		// Grab Left/Right/Up/Down Direction of Mouse for Pegman Image
		this._mousePos = {
			direction: {},
			old: {},
		};

		this.nearbyPoints = [];  
		this.provider = {}; 
		this._button = options.button.Btn;

		this._dropzoneMapOpts = {
			accept: '.draggable', // Only Accept Elements Matching this CSS Selector
			overlap: 0.75, // Require a 75% Element Overlap for a Drop to be Possible
			ondropactivate: L.bind(this.onDropZoneActivated, this),
			ondragenter: L.bind(this.onDropZoneDragEntered, this),
			ondragleave: L.bind(this.onDropZoneDragLeaved, this),
			ondrop: L.bind(this.onDropZoneDropped, this),
			ondropdeactivate: L.bind(this.onDropZoneDeactivated, this),
		};
		this._draggableMarkerOpts = {
			inertia: false,
			onmove: L.bind(this.onDraggableMove, this),
			onend: L.bind(this.onDraggableEnd, this),
		};

		this._pegmanMarkerOpts = {
			draggable: true,
			icon: L.icon({
				className: 'pegman-marker',
				iconSize: [52, 52],
				iconAnchor: [26, 26],
				iconUrl: 'data:image/png;base64,' + 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=',
			}),
		};
		this._lazyInteractAdded = false;
		this.componentOptions = null;
		this.Utils = new Utils(this);	
	},
    
	onAdd: function(map) {
		this._map = map;
		map.createPane('rasterOverlay').style.zIndex = 300;

		this.options.mapillaryKey = config.mapillary ? config.mapillary : this.options.mapillaryKey;
		this._container = L.DomUtil.create('div', 'leaflet-pegman pegman-control leaflet-bar');
		this._pegman = L.DomUtil.create('div', 'pegman draggable drag-drop', this._container);
		this._pegmanButton = L.DomUtil.create('div', 'pegman-button', this._container);
		this._pegmanMarker = L.marker([0, 0], this._pegmanMarkerOpts);

		this.provider.container = this._panoDiv;

		this._viewDiv = document.querySelector(this.options.viewDiv);
		this._panoDivView = L.DomUtil.create('div', '', this._viewDiv);
		this._panoDivView.id = 'pano-div-mapi';
		
		L.DomUtil.addClass(this._map._container, this.options.theme);

		L.DomEvent.on(this._container, 'click mousedown touchstart dblclick', this._disableClickPropagation, this);
		L.DomEvent.on(this._container, 'click mousedown dblclick', this._disableClickPropagation, this);

		this._checkSupportBrowser();

		this.Utils.loadScriptsMapillary.bind(this, true).call();
		this._loadInteractHandlers();
		this._loadMapillaryHandlers();

		L.DomEvent.on(document, 'mousemove', this.mouseMoveTracking, this);
		L.DomEvent.on(document, 'keyup', this.keyUpTracking, this);

		this._pegmanMarker.on('dragend', this.onPegmanMarkerDragged, this);

		this.enableControl();
		this.fire('add_pegman');
		return this._container;   
	},

	onRemove: function() {
		if (this._pegmanMarker) this._pegmanMarker.remove();
		if (this.controlEnabled) this.disableControl();		

		L.DomUtil.remove(this._panoDivView);

		L.DomEvent.off(document, 'mousemove', this.mouseMoveTracking, this);
		L.DomEvent.off(document, 'keyup', this.keyUpTracking, this);

		map.off('mousemove', this._setMouseCursor, this);
	},

	_log: function(args) {
		if (this.options.debug) {
			console.log(args);
		}
	},

	_checkSupportBrowser: function(){
		if (Mapillary.isSupported()) {
			// Enable or disable any components, e.g. tag and popup which requires WebGL support
			// or use the default components by not supplying any component options.
			this.componentOptions = { /* Default options */ };

			this._log('MapillaryJS is fully supported by your browser.');
		} else if (Mapillary.isFallbackSupported()) {
			// On top of the disabled components below, also the popup, marker and tag
			// components require WebGL support and should not be enabled (they are
			// disabled by default so does not need to be specified below).
			this.componentOptions = {
					// Disable components requiring WebGL support
					direction: false,
					imagePlane: false,
					keyboard: false,
					mouse: false,
					sequence: false,

					// Enable fallback components
					image: true,
					navigation: true,
			};
			this._log('MapillaryJS fallback functionality is supported by your browser.');
		}else{
			// Handle the fact that MapillaryJS is not supported in a way that is
			// appropriate for your application.
			this._log('MapillaryJS is not supported by your browser.');
		}

		if(this.componentOptions){
			// Deactivate cover without interaction needed.
			this.componentOptions.cover = false;

			// Viewer size is dynamic so resize should be called every time the window size changes
			//window.addEventListener('resize', function() { mly.resize(); });
		}
	},

	_initMapillaryView: function(){
		let _this = this;
		
		this.mly = new Mapillary.Viewer(
			'pano-div-mapi',
			this.options.mapillaryKey,
			null, //'oN2hgqTaLoHA1HEdaJNZrw', // 
			{ component: this.componentOptions }
		);

		this.mly.on('nodechanged', this.onNodeChanged.bind(this));
		this.mly.on('bearingchanged', this.onBearingChanged.bind(this));
	},

	activate: function() {
		this.mly.resize();
		this.mly.deactivateCover();
		if (!this._updateHandler) {
			this._updateHandler = setInterval(() => this.updateZoomAndCenter(), 200);
		}
	},

	deactivate: function() {
		this.mly.activateCover();
		if (this._updateHandler) {
			clearInterval(this._updateHandler);
			this._updateHandler = null;
		}
	},

	updateZoomAndCenter: function() {
		this.mly.getZoom().then((zoom) => {
			this._zoom = zoom;
		});
		this.mly.getCenter().then((center) => {
			this._center = center;
		});
		this.mly.getBearing().then((bearing) => {
			this.onBearingChanged(bearing);
		});
		
	},

	onBearingChanged: function(bearing) {
		bearing -= this.getBearingCorrection();
		if (this._bearing === bearing) {
			return;
		}
		this._bearing = bearing;
		this.fireChangeEvent();
	},

	fireChangeEvent: function() {
		if (this._node) {
			const latlon = this._node.originalLatLon;
			this.fire('change', {
				latlng: L.latLng(latlon.lat, latlon.lon),
				heading: this._bearing,
				pitch: this._pitch,
				zoom: this._zoom
			}
			);
		}
	},

	onNodeChanged: function(node) {
		if (this._node && (node.key === this._node.key)) {
			return;
		}
		this._node = node;
		this.fireChangeEvent();
	},

	getBearingCorrection: function() {
		if (this._node && 'computedCA' in this._node) {
			return (this._node.computedCA - this._node.originalCA);
		}
		return 0;
	},

	_invalidateSize: function() {
		this.mly.resize();
	},


	_disableClickPropagation: function(e) {
		L.DomEvent.stopPropagation(e);
		L.DomEvent.preventDefault(e);
	},

	_addClasses: function(el, classNames) {
		classNames = classNames.split(' ');
		for (var s in classNames) {
			L.DomUtil.addClass(el, classNames[s]);
		}
	},

	_removeClasses: function(el, classNames) {
		classNames = classNames.split(' ');
		for (var s in classNames) {
			L.DomUtil.removeClass(el, classNames[s]);
		}
	},

	_removeAttributes: function(el, attrNames) {
		for (var a in attrNames) {
			el.removeAttribute(attrNames[a]);
		}
	},

	_insertAfter: function(targetNode, newNode) {
		targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
	},

	_translateElement: function(el, dx, dy) {
		if (dx === false && dy === false) {
			this._removeAttributes(this._pegman, ['style', 'data-x', 'data-y']);
		}
		// Element's position is preserved within the data-x/data-y attributes
		var x = (parseFloat(el.getAttribute('data-x')) || 0) + dx;
		var y = (parseFloat(el.getAttribute('data-y')) || 0) + dy;

		// Translate element
		el.style.webkitTransform = el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

		// Update position attributes
		el.setAttribute('data-x', x);
		el.setAttribute('data-y', y);
	},

	onButtonClick: function() {
		this.switchControl();
	},

	switchControl: function() {
		if (this.controlEnabled) {
			this.disableControl();
		} else {
			this.enableControl();
		}
	},

	enableControl: function() {
		this.controlEnabled = true;
		this.updateCoverageVisibility();
		this._map.on('click', this.onMapClick, this);
		L.DomUtil.addClass(this._map._container, 'panoramas-control-active');
		this._updateClasses('pegman-added');
	},

	disableControl: function() {
		this.controlEnabled = false;
		this.updateCoverageVisibility();
		this._map.off('click', this.onMapClick, this);
		L.DomUtil.removeClass(this._map._container, 'panoramas-control-active');
		this._updateClasses('pegman-removed');
	},

	onMapClick: function(e) {
		this.mly.moveCloseTo(e.latlng.lat, e.latlng.lng);
	},

	getCoverageLayer: function(options) {
		return new MapillaryCoverage(options);
	},

	updateCoverageVisibility: function(){
		if (!this._map) return;
		
		if (this.controlEnabled) {
			if (!this.provider.coverageLayer) {
        const options = L.extend({pane: 'rasterOverlay'}, this.options.layerOptions);
				this.provider.coverageLayer = this.getCoverageLayer(options);
			}
			this.provider.coverageLayer.addTo(this._map);
			this._log('coverageLayer.addTo');
		} else {
			if (this.provider.coverageLayer) {
				this._map.removeLayer(this.provider.coverageLayer);
				this._log('removeLayer');
			}
		}
	},

	_updateClasses: function(action) {
		switch (action) {
			case 'pegman-dragging':
				this._removeClasses(this._pegman, 'dropped');
				this._addClasses(this._container, 'dragging');
				break;
			case 'pegman-dragged':
				this._removeClasses(this._pegman, 'can-drop dragged left right active dropped');
				this._removeAttributes(this._pegman, ['style', 'data-x', 'data-y']);
				break;
			case 'dropzone-actived':
				this._addClasses(this._map._container, 'drop-active');
				break;
			case 'dropzone-drag-entered':
				this._addClasses(this._pegman, 'active can-drop');
				this._addClasses(this._map._container, 'drop-target');
				break;
			case 'dropzone-drag-leaved':
				this._removeClasses(this._map._container, 'drop-target');
				this._removeClasses(this._pegman, 'can-drop');
				break;
			case 'dropzone-drop':
				this._removeClasses(this._container, 'dragging');
				this._removeClasses(this._pegman, 'active left right');
				this._addClasses(this._pegman, 'dropped');
				this._removeClasses(this._pegman, 'can-drop dragged left right active dropped');
				break;
			case 'dropzone-deactivated':
				this._removeClasses(this._pegman, 'active left right');
				this._removeClasses(this._map._container, 'drop-active drop-target');
				break;
			case 'mousemove-top':
				this._addClasses(this._pegman, 'top');
				this._removeClasses(this._pegman, 'bottom right left');
				break;
			case 'mousemove-bottom':
				this._addClasses(this._pegman, 'bottom');
				this._removeClasses(this._pegman, 'top right left');
				break;
			case 'mousemove-left':
				this._addClasses(this._pegman, 'left');
				this._removeClasses(this._pegman, 'right top bottom');
				break;
			case 'mousemove-right':
				this._addClasses(this._pegman, 'right');
				this._removeClasses(this._pegman, 'left top bottom');
				break;
			case 'pegman-added': //enable
				this._addClasses(this._container, 'active');
				break;
			case 'pegman-removed': //disable
				this._removeClasses(this._container, 'active');
				break;
			case 'streetview-shown':
				this._addClasses(this._container, 'streetview-layer-active');
				break;
			case 'streetview-hidden':
				this._removeClasses(this._container, 'streetview-layer-active');
				break;
			default:
				throw 'Unhandled event:' + action;
		}
		this.fire('mapillary_' + action);
	},

	/**
	 * mouseMoveTracking
	 * @desc internal function used to style pegman while dragging
	 */
	mouseMoveTracking: function(e) {
		var mousePos = this._mousePos;

		// Top <--> Bottom
		if (e.pageY < mousePos.old.y) {
			mousePos.direction.y = 'top';
			this._updateClasses('mousemove-top');
		} else if (e.pageY > mousePos.old.y) {
			mousePos.direction.y = 'bottom';
			this._updateClasses('mousemove-bottom');
		}
		// Left <--> Right
		if (e.pageX < mousePos.old.x) {
			mousePos.direction.x = 'left';
			this._updateClasses('mousemove-left');
		} else if (e.pageX > mousePos.old.x) {
			mousePos.direction.x = 'right';
			this._updateClasses('mousemove-right');
		}

		mousePos.old.x = e.pageX;
		mousePos.old.y = e.pageY;
	},

	/**
	* keyUpTracking
	* @desc internal function used to track keyup events
	*/
	keyUpTracking: function(e) {
		if (e.keyCode == 27) {
			this._log('escape pressed');
			this.clear();
		}
	},

	clear: function() {
		this.pegmanRemove();
		this.disableControl();
		this.closeMapillaryPanorama();
	},

	pegmanAdd: function() {
		this._pegmanMarker.addTo(this._map);
		this._pegmanMarker.setLatLng(this._pegmanMarkerCoords);
		this._updateClasses('pegman-added');
	},

	pegmanRemove: function() {
		this._pegmanMarker.remove(this._map);
		this._updateClasses('pegman-removed');
	},

	closeMapillaryPanorama: function() {
		this.fire('close_panorama');
	},

	openMapillaryPanorama: function() {
		this.fire('open_panorama');
	},

	_loadMapillaryHandlers: function(toggleView){
		this._initMapillaryView(toggleView);
	},

	_loadInteractHandlers: function() {
		// TODO: trying to replace "interact.js" with default "L.Draggable" object
		// var draggable = new L.Draggable(this._container);
		// draggable.enable();
		// draggable.on('drag', function(e) { console.log(e); });
		if (typeof interact !== 'function') return;

		// Enable Draggable Element to be Dropped into Map Container
		this._draggable = interact(this._pegman).draggable(this._draggableMarkerOpts);
		this._dropzone = interact(this._map._container).dropzone(this._dropzoneMapOpts);

		this._draggable.styleCursor(false);

		// Toggle on/off SV Layer on Pegman's Container single clicks
		//interact(this._container).on('tap', L.bind(this.toggleStreetViewLayer, this));

		// Prevent map drags (Desktop / Mobile) while dragging pegman control
		L.DomEvent.on(this._container, 'touchstart', function(e) { this._map.dragging.disable(); }, this);
		L.DomEvent.on(this._container, 'touchend', function(e) { this._map.dragging.enable(); }, this);
	},

	onDraggableMove: function(e) {
		this.mouseMoveTracking(e);
		this.pegmanRemove();
		this._updateClasses('pegman-dragging');
		this._translateElement(this._pegman, e.dx, e.dy);
	},

	onDraggableEnd: function(e) {
		this._pegmanMarkerCoords = this._map.mouseEventToLatLng(e);
		this.pegmanAdd();
		this.findMapillaryViewData(this._pegmanMarkerCoords.lat, this._pegmanMarkerCoords.lng);
		this._updateClasses('pegman-dragged');
	},

	onDropZoneActivated: function(e) {
		this._updateClasses('dropzone-actived');
	},

	onDropZoneDragEntered: function(e) {
		this._updateClasses('dropzone-drag-entered');
	},

	onDropZoneDragLeaved: function(e) {
		this._updateClasses('dropzone-drag-leaved');
	},

	onDropZoneDropped: function(e) {
		this._updateClasses('dropzone-drop');
		this._translateElement(this._pegman, false, false);
	},

	onDropZoneDeactivated: function(e) {
		this._updateClasses('dropzone-deactivated');
	},

	onPegmanMarkerDragged: function(e) {
		this._pegmanMarkerCoords = this._pegmanMarker.getLatLng();
		this.findMapillaryViewData(this._pegmanMarkerCoords.lat, this._pegmanMarkerCoords.lng);
	},

	findMapillaryViewData: function(lat, lng) {
		if (!this._pegmanMarker._map && this._map) {
			this._pegmanMarkerCoords = L.latLng(lat, lng);
			return this.pegmanAdd();
		}
		this._log(this.mly.isNavigable);
		if(!this.mly.isNavigable) this.activate();
		this.mly.moveCloseTo(lat, lng)
			.then(
				function(node) { /*console.log(node.key);*/ },
				function(error) { /*console.error(error);*/ }
			);

		this.setMapillaryView();
	},

	setMapillaryView: function(){
		this.openMapillaryPanorama();
	}

});