import {
	Mesh,
} from 'three'

class Glyph extends Mesh {

	constructor(geometry, material) {

		super( geometry, material );

	}

  dispose() {
    this.geometry.dispose()
  }
}

export { Glyph }
