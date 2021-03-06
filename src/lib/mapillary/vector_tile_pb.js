// code generated by pbf v3.0.5

// Tile ========================================

var Tile = {};

Tile.read = function (pbf, end) {
    return pbf.readFields(Tile._readField, {layers: []}, end);
};
Tile._readField = function (tag, obj, pbf) {
    if (tag === 3) obj.layers.push(Tile.Layer.read(pbf, pbf.readVarint() + pbf.pos));
};

Tile.GeomType = {
    'UNKNOWN': 0,
    'POINT': 1,
    'LINESTRING': 2,
    'POLYGON': 3
};


// Tile.Feature ========================================

Tile.Feature = {};

Tile.Feature.read = function (pbf, end) {
    return pbf.readFields(Tile.Feature._readField, {id: 0, tags: [], type: 0, geometry: []}, end);
};
Tile.Feature._readField = function (tag, obj, pbf) {
    if (tag === 3) obj.type = pbf.readVarint();
    else if (tag === 4) pbf.readPackedVarint(obj.geometry);
};

// Tile.Layer ========================================

Tile.Layer = {};

Tile.Layer.read = function (pbf, end) {
    return pbf.readFields(Tile.Layer._readField, {version: 0, name: '', features: [], keys: [], values: [], extent: 0}, end);
};
Tile.Layer._readField = function (tag, obj, pbf) {
    if (tag === 15) obj.version = pbf.readVarint();
    else if (tag === 1) obj.name = pbf.readString();
    else if (tag === 2) obj.features.push(Tile.Feature.read(pbf, pbf.readVarint() + pbf.pos));
    else if (tag === 5) obj.extent = pbf.readVarint();
};

export {Tile};
