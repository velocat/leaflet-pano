import secrets from './secrets';

export default {
    defaultLocation: [55.6, 36.8],
    defaultZoom: 10,
    googleApiUrl: `https://maps.googleapis.com/maps/api/js?v=3&key=${secrets.google}`,
    CORSProxyUrl: '',
    elevationsServer: '',
    mutantURL: 'https://unpkg.com/leaflet.gridlayer.googlemutant@0.10.0/Leaflet.GoogleMutant.js',
    interactURL: 'https://unpkg.com/interactjs@1.2.9/dist/interact.min.js',//'https://unpkg.com/interactjs@1.2.9/dist/interact.min.js',
    gmapsURL: 'https://maps.googleapis.com/maps/api/js?v=3',
    mapillaryURL: 'https://a.mapillary.com/v3',

    ...secrets
};
