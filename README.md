# Leaflet-pano
Google Street View and Mapillari panoramas for leaflet maps.

**Screenshots:**
<p style="text-align: center;">
    <a href="#"><img src="https://github.com/velocat/leaflet-pano/blob/master/images/mappi.png" alt="Mapillary viewer" /></a>
</p>


<p style="text-align:center;">
    <a href="#"><img src="https://github.com/velocat/leaflet-pano/blob/master/images/google-street.png" alt="Google Street viewer" /></a>
</p>


It is based on the [Leaflet-Pegman plugin](https://github.com/Raruto/leaflet-pegman/)

**Demo:** [Test Demo](https://velocat.github.io/leaflet-pano/ "Test Demo")

---

### How to use:


> TODO...

**Example**
```html
<script>
var pegmanOn, mapillaryOn; 

let map = L.map('map').setView([55.598, 38.12], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/* Control Button */
let Button =	new L.control.buttonpano({position: 'topleft'});

let optionsPano = {
	position: 'topleft', // position of control inside the map
	theme: 'leaflet-pegman-v3-small', // or "leaflet-pegman-v3-small"
	panoDiv: '#pano-div',
	viewDiv: '#pano-div-dialog',
	panoDivDialogUI: true,
	panoDivDialogClass: 'pano-dialog',
	button: Button,
};

/*  Mapillary  */
let mapillaryControl  = L.control.mapillary(optionsPano);

function viewMapillary(){
	Button.togglePano('close');
	pegmanControl.remove();
	mapillaryControl.addTo(map);
	pegmanOn = false;
	mapillaryOn = true;
} 

/*  Google Street Pano  */
var pegmanControl = new L.control.pegman(optionsPano);

function viewStreetView(){
	Button.togglePano('close');
	pegmanControl.addTo(map);
	mapillaryControl.remove();				
	pegmanOn = true;
	mapillaryOn = false; 
}
</script>
```

> _**NB** to be able to use the "pegman”(a.k.a.“Street View Control") you **MUST** use a valid [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)._

---

###Compatibile with:

[![Leaflet 1.x compatible!](https://img.shields.io/badge/Leaflet-1.7.1-green)](http://leafletjs.com/reference.html)
[![interactJS 1.2.8 compatibile!](https://img.shields.io/badge/interactJS-1.2.8-green)](https://interactjs.io/)
[![Leaflet.GoogleMutant 0.10.0 compatibile!](https://img.shields.io/badge/Leaflet.GoogleMutant-0.10.0-green)](https://gitlab.com/IvanSanchez/Leaflet.GridLayer.GoogleMutant)
[![gmaps 3.34 compatibile!](https://img.shields.io/badge/gmaps-3.34-green)](https://interactjs.io/)

---

### License:
![License](https://img.shields.io/github/license/velocat/leaflet-pano "License")
