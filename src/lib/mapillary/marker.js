//import L from 'leaflet';

export var PanoMarker = L.Marker.extend({
	options: {
		zIndexOffset: 10000
	},

	initialize: function() {
		const icon = L.divIcon({
			className: 'leaflet-panorama-marker-wraper',
			html: '<div class="leaflet-panorama-marker"></div>'
		}
		);
		L.Marker.prototype.initialize.call(this, [0, 0], {icon, interactive: false});
	},

	getIcon: function() {
		let markerIcon = this.getElement();
		markerIcon = markerIcon.children[0];
		return markerIcon;
	},

	setHeading: function(angle) {
		const markerIcon = this.getIcon();
		markerIcon.style.transform = `rotate(${angle || 0}deg)`;
	},

	setType: function(markerType) {
		const className = {
			slim: 'leaflet-panorama-marker-circle',
			normal: 'leaflet-panorama-marker-binocular'
		}[markerType];
		this.getIcon().className = className;
	}
});
