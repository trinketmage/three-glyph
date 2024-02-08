import  {
  Box3,
  BufferGeometry,
  BufferAttribute,
  Sphere
} from "three";

var createLayout = require('layout-bmfont-text')
var createIndices = require('quad-indices')

var vertices = require('./pure/vertices')
var utils = require('./pure/utils')

export default class MSDFTextGeometry extends BufferGeometry {
  constructor(opt){
    super(opt);
    if (opt) this.update(opt)
  }

  update(opt) {
    if (typeof opt === 'string') {
      opt = { text: opt }
    }

    opt = Object.assign({}, this._opt, opt)

    if (!opt.font) {
      throw new TypeError('must specify a { font } in options')
    }

    this.layout = createLayout(opt)

    var flipY = opt.flipY !== false

    var font = opt.font

    var texWidth = font.common.scaleW
    var texHeight = font.common.scaleH

    var glyphs = this.layout.glyphs.filter(function (glyph) {
      var bitmap = glyph.data
      return bitmap.width * bitmap.height > 0
    })

    this.visibleGlyphs = glyphs

    var positions = vertices.positions(glyphs)
    var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
    var guvs = vertices.guvs(glyphs, texWidth, texHeight, flipY)
    var idxs = vertices.indices(glyphs)
    var indices = createIndices([], {
      clockwise: true,
      type: 'uint16',
      count: glyphs.length
    });

    this.setIndex(indices)
    this.setAttribute('index', new BufferAttribute(idxs, 1))
    this.setAttribute('position', new BufferAttribute(positions, 2))
    this.setAttribute('uv', new BufferAttribute(uvs, 2))
    this.setAttribute('guv', new BufferAttribute(guvs, 2))

    if (opt.animate) {
      var animate = opt.animate;
    
      var animWidth = animate.common.scaleW;
      var animHeight = animate.common.scaleH;
      const aOpt = { ...opt };
      aOpt.font = aOpt.animate;
      this.layoutAnimate = createLayout(aOpt);

      var animateGlyphs = this.layoutAnimate .glyphs.filter(function(glyph) {
        var bitmap = glyph.data;
        return bitmap.width * bitmap.height > 0;
      });
      var auvs = vertices.guvs(animateGlyphs, animWidth, animHeight, flipY);
      this.setAttribute("auv", new BufferAttribute(auvs, 2));
    }

    if (!opt.multipage && 'page' in this.attributes) {
      this.removeAttribute('page')
    } else if (opt.multipage) {
      var pages = vertices.pages(glyphs)
      this.setAttribute('page', new BufferAttribute(pages, 1))
    }
  }

  computeBoundingSphere() {
    if (this.boundingSphere === null) {
      this.boundingSphere = new Sphere()
    }

    var positions = this.attributes.position.array
    var itemSize = this.attributes.position.itemSize
    if (!positions || !itemSize || positions.length < 2) {
      this.boundingSphere.radius = 0
      this.boundingSphere.center.set(0, 0, 0)
      return
    }
    utils.computeSphere(positions, this.boundingSphere)
    if (isNaN(this.boundingSphere.radius)) {
      console.error('THREE.BufferGeometry.computeBoundingSphere(): ' +
        'Computed radius is NaN. The ' +
        '"position" attribute is likely to have NaN values.')
    }
  }

  computeBoundingBox() {
    if (this.boundingBox === null) {
      this.boundingBox = new Box3()
    }

    var bbox = this.boundingBox
    var positions = this.attributes.position.array
    var itemSize = this.attributes.position.itemSize
    if (!positions || !itemSize || positions.length < 2) {
      bbox.makeEmpty()
      return
    }
    utils.computeBox(positions, bbox)
  }
}
