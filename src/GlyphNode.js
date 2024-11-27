import {
  Object3D,
  Mesh,
  Vector2,
} from 'three/webgpu'


import GlyphGeometry from './GlyphGeometry';

class Glyph extends Object3D {

  anchor = new Vector2(0, 1)

  constructor(params) {
    super();

    const {
      text,
      font,
      letterSpacing,

      geometry,
      material,
      width,

      addons
    } = params;

    this.addons = addons;

    this.geometry = geometry || new GlyphGeometry({
      text,
      font,
      letterSpacing,
      width,
    });

    if (material) {
      this.material = material;
    }
    
    this.mesh = new Mesh(this.geometry, this.material);

    this.update();

    this.add(this.mesh);
  }

  center() {
    this.anchor.set(0.5, 0.5);
    this.update();
  }

  alignLeft() {
    this.anchor.x = 0;
    this.update();
  }

  alignRight() {
    this.anchor.x = 1;
    this.update();
  }

  alignTop() {
    this.anchor.y = 1;
    this.update();
  }

  alignBottom() {
    this.anchor.y = 0;
    this.update();
  }

  update(params = {}) {
    const entries = ['text', 'letterSpacing', 'lineHeight', 'align'];
    const { mesh, geometry, anchor = {} } = this;
    const opt = {
    }
    entries.forEach((entry) => {
      if (params[entry]) opt[entry] = params[entry];
    });
    geometry.update(opt);
    mesh.position.x = -mesh.geometry.layout.width * anchor.x;
    mesh.position.y = mesh.geometry.layout.height * (1.0 - anchor.y);
  }

  dispose() {
    const { mesh } = this;
    this.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
}

export { Glyph }
