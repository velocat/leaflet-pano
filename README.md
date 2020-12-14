# Leaflet-pano ![Version](https://img.shields.io/github/package-json/v/velocat/leaflet-pano "Version")
Google Street View and Mapillari panoramas for leaflet maps.

(This is part of the Gpsies.ru track editor, but can be used as a standalone plugin)

**Screenshots:**
<p style="text-align: center;">
    <a href="#"><img src="https://github.com/velocat/leaflet-pano/blob/master/images/mappi.png" alt="Mapillary viewer" width="450px" height="250px" /></a>
    <a href="#"><img src="https://github.com/velocat/leaflet-pano/blob/master/images/google-street.png" alt="Google Street viewer" width="350px" height="250px" /></a>
</p>


It is based on the [Leaflet-Pegman plugin](https://github.com/Raruto/leaflet-pegman/)

**Demo:** [Test Demo](https://velocat.github.io/leaflet-pano/ "Test Demo")

---
### Install with npm ![npm Version](https://img.shields.io/npm/v/leaflet-pano "npm Version")
```
npm i leaflet-pano
```

### How to use:

**Add the following libraries in head**
```html
<!-- Librarys -->
<link href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" rel="stylesheet">

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>

<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/hot-sneaks/jquery-ui.css" />
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

<script src='https://unpkg.com/mapillary-js@2.18.0/dist/mapillary.min.js'></script>
<link href='https://unpkg.com/mapillary-js@2.18.0/dist/mapillary.min.css' rel='stylesheet' />	
```
**Add this plugin in head**
```html
<!-- Main -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-pano@0.1.1/dist/leaflet-pano.css"/>
<script src="https://cdn.jsdelivr.net/npm/leaflet-pano@0.1.1/dist/leaflet-pano.min.js"></script>
```
**Add this code in you page body**
```html
<script>
	var pegmanOn, mapillaryOn; 

	var map = L.map('map').setView([55.598, 38.12], 14);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var optionsPano = {
		position: 'topleft', // position of control inside the map
		theme: "leaflet-pegman-v3-small", // or "leaflet-pegman-v3-small"
		panoDiv: "#pano-div",
		viewDiv: "#pano-div-dialog",
		panoDivDialogUI: true,
		panoDivDialogClass: 'pano-dialog',
		mapclick: true,
		apiKey: '', // You Google API key
		mapillaryKey: '' //Your own client ID from mapillary.com
	}

	var Pano = L.control.pano(optionsPano);
</script>
```

> _**NB** to be able to use the "pegman”(a.k.a.“Street View Control") you **MUST** use a valid [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)._

---

### Compatibile with:

[![Leaflet 1.x compatible!](https://img.shields.io/badge/Leaflet-1.7.1-green)](http://leafletjs.com/reference.html)
[![interactJS 1.2.8 compatibile!](https://img.shields.io/badge/interactJS-1.2.8-green)](https://interactjs.io/)
[![Leaflet.GoogleMutant 0.10.0 compatibile!](https://img.shields.io/badge/Leaflet.GoogleMutant-0.10.0-green)](https://gitlab.com/IvanSanchez/Leaflet.GridLayer.GoogleMutant)
[![gmaps 3.34 compatibile!](https://img.shields.io/badge/gmaps-3.34-green)](https://interactjs.io/)

---

### TODO
 - Automatic connection of necessary libraries if they were not previously connected in the header;
 - Using without JQuery and Fontawesome (pure JS modal viewer and custom button style);

### License:
![License](https://img.shields.io/github/license/velocat/leaflet-pano "License")
