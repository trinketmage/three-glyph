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

  update() {
    const { mesh, geometry, anchor } = this;
    mesh.position.x = -geometry.layout.width * anchor.x;
    mesh.position.y = geometry.layout.height * anchor.y;
  }

  dispose() {
    const { mesh } = this;
    this.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
}

export { Glyph }
