import {
  Object3D,
	Mesh,
  Vector2,
  Uniform,
} from 'three'

import GlyphGeometry from './GlyphGeometry';
import GlyphMaterial from './GlyphMaterial';

class Glyph extends Object3D {

  anchor = new Vector2(0, 1)

	constructor(params) {
		super();

    const {
      text,
      font,
      letterSpacing,
      map,
      color,

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

    if (material && material.uniforms.map) {
      this.material = material;
    } else if (map) {
      const uniforms = {
        map: new Uniform(map),
      };
      if (color) {
        uniforms.color = new Uniform(color);
      }
      this.material = new GlyphMaterial({
        addons,
        uniforms,
      });
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
    const entries = [ 'text', 'letterSpacing', 'lineHeight', 'align' ];
    const { mesh, geometry, anchor, material, addons = {} } = this;
    const opt = {
    }
    entries.forEach((entry) => {
      if (params[entry]) opt[entry] = params[entry];
    });
    geometry.update(opt);
    mesh.position.x = -mesh.geometry.layout.width * anchor.x;
    mesh.position.y = mesh.geometry.layout.height * (1.0 - anchor.y);

    if (addons.progress) {
      material.uniforms.total.value = geometry.layout.glyphs.length;
    }
  }

  dispose() {
    const { mesh } = this;
    this.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
}

export { Glyph }
