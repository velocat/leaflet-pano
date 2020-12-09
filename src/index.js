/* eslint-disable no-undef */
//import L from 'leaflet';
import {Pegman} from '~/pegman';
import '~/pegman/viewer';
import {Mapi} from '~/mapillary';
import '~/mapillary/viewer';
import {ButtonPano} from '~/control/button';

L.control.buttonpano = (options) => new ButtonPano(options);
L.control.pegman = (options) => new Pegman(options);
L.control.mapillary = (options) => new Mapi(options);
