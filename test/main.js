/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
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