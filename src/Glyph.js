import {
  Object3D,
	Mesh,
  Vector2,
} from 'three'

class Glyph extends Object3D {

  anchor = new Vector2(0, 0)

	constructor(params) {
		super();

    const { geometry, material } = params;

    this.geometry = geometry;
    this.material = material;

    this.mesh = new Mesh(geometry, material);

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
    this.anchor.y = 0;
    this.update();
  }

  alignBottom() {
    this.anchor.y = 1;
    this.update();
  }

  update(params = {}) {
    const { text } = params;
    const { mesh, geometry, anchor } = this;
    if (text) geometry.update(text);
    mesh.position.x = -mesh.geometry.layout.width * anchor.x;
    mesh.position.y = mesh.geometry.layout.height * anchor.y;
  }

  dispose() {
    const { mesh } = this;
    this.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
}

export { Glyph }
