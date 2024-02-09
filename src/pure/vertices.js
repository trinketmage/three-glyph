export const ligatures = ["º", "Ȑ"];

export const pages = function pages(glyphs) {
  var pages = new Float32Array(glyphs.length * 4 * 1);
  var i = 0;
  glyphs.forEach(function(glyph) {
    var id = glyph.data.page || 0;
    pages[i++] = id;
    pages[i++] = id;
    pages[i++] = id;
    pages[i++] = id;
  });
  return pages;
};

// uv inside group
export const guvs = function guvs(glyphs, texWidth, texHeight, flipY) {
  var uvs = new Float32Array(glyphs.length * 4 * 2);
  var i = 0;
  glyphs.forEach(function(glyph) {
    var bitmap = glyph.data;
    var bw = bitmap.x + bitmap.width;
    var bh = bitmap.y + bitmap.height;

    // top left position
    var u0 = bitmap.x / texWidth;
    var v1 = bitmap.y / texHeight;
    var u1 = bw / texWidth;
    var v0 = bh / texHeight;

    if (flipY) {
      v1 = (texHeight - bitmap.y) / texHeight;
      v0 = (texHeight - bh) / texHeight;
    }

    // BL
    uvs[i++] = u0;
    uvs[i++] = v0;
    // TL
    uvs[i++] = u0;
    uvs[i++] = v1;
    // TR
    uvs[i++] = u1;
    uvs[i++] = v1;
    // BR
    uvs[i++] = u1;
    uvs[i++] = v0;
  });
  return uvs;
};

export const uvs = function uvs(glyphs) {
  var uvs = new Float32Array(glyphs.length * 4 * 2);
  var i = 0;
  glyphs.forEach(function() {
    var u0 = 0;
    var v1 = 1;
    var u1 = 1;
    var v0 = 0;

    // BL
    uvs[i++] = u0;
    uvs[i++] = v1;
    // TL
    uvs[i++] = u0;
    uvs[i++] = v0;
    // TR
    uvs[i++] = u1;
    uvs[i++] = v0;
    // BR
    uvs[i++] = u1;
    uvs[i++] = v1;
  });
  return uvs;
};

export const positions = function positions(glyphs) {
  var positions = new Float32Array(glyphs.length * 4 * 2);
  var i = 0;
  glyphs.forEach(function(glyph) {
    var bitmap = glyph.data;

    // bottom left position
    var x = glyph.position[0] + bitmap.xoffset;
    // var y = glyph.position[1] + bitmap.yoffset;
    var y = glyph.position[1];

    // quad size
    var w = bitmap.width;
    var h = bitmap.height;

    // BL
    positions[i++] = x;
    positions[i++] = y;
    // TL
    positions[i++] = x;
    positions[i++] = y + h;
    // TR
    positions[i++] = x + w;
    positions[i++] = y + h;
    // BR
    positions[i++] = x + w;
    positions[i++] = y;
  });
  return positions;
};

export const indices = function indices(glyphs) {
  var indices = new Float32Array(glyphs.length * 4);
  var i = 0;
  var weightI = 0;
  glyphs.forEach(function(glyph) {
    indices[i++] = weightI;
    indices[i++] = weightI;
    indices[i++] = weightI;
    indices[i++] = weightI;
    
    weightI += characterWeight(glyph.data.char) + 1;
  });
  return indices;
};
export const weights = function weights(glyphs) {
  var indices = new Float32Array(glyphs.length * 4);
  var i = 0;
  glyphs.forEach(function(glyph) {
    var weightI = characterWeight(glyph.data.char);
    indices[i++] = weightI;
    indices[i++] = weightI;
    indices[i++] = weightI;
    indices[i++] = weightI;
  });
  return indices;
};

export const characterWeight = function characterWeight(char) {
  return (ligatures.indexOf(char) > -1) ? 1 : 0;
};

export const lineIndices = function indices(glyphs) {
  var indices = new Float32Array(glyphs.length * 4);
  var i = 0;
  glyphs.forEach(function(glyph) {
    indices[i++] = glyph.line;
    indices[i++] = glyph.line;
    indices[i++] = glyph.line;
    indices[i++] = glyph.line;
  });
  return indices;
};

export const lineCount = function indices(glyphs) {
  var max = 0;
  glyphs.forEach(function(glyph) {
    if (glyph.line > max) {
      max = glyph.line;
    }
  });
  return max;
};
