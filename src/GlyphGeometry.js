import  {
  Box3,
  BufferGeometry,
  BufferAttribute,
  Sphere
} from "three";

import { createLayout } from './pure/layout-text'
import createIndices from 'quad-indices'

import * as vertices from './pure/vertices'
import { computeBox, computeSphere } from './pure/utils'

export default class GlyphGeometry extends BufferGeometry {
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
    console.log(flipY);

    var font = opt.font

    // determine texture size from font file
    var texWidth = font.common.scaleW
    var texHeight = font.common.scaleH

    // get visible glyphs
    var glyphs = this.layout.glyphs.filter(function (glyph) {
      var bitmap = glyph.data
      return bitmap.width * bitmap.height > 0
    })

    // provide visible glyphs for convenience
    this.visibleGlyphs = glyphs

    // get common vertex data
    var positions = vertices.positions(glyphs)
    var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
    var indices = createIndices([], {
      clockwise: true,
      type: 'uint16',
      count: glyphs.length
    })

    // update vertex data
    this.setIndex(indices)
    this.setAttribute('position', new BufferAttribute(positions, 2))
    this.setAttribute('uv', new BufferAttribute(uvs, 2))
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
    computeSphere(positions, this.boundingSphere)
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
    computeBox(positions, bbox)
  }
}
