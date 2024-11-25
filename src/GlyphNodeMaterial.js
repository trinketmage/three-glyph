import { NodeMaterial } from "three";

import {
    vec2,
    vec3,
    vec4,
    texture,
    Fn,
    positionLocal,
    varyingProperty,
    varying,
    attribute,
    fwidth,
    clamp,
} from 'three/tsl';

export var sdGlyph = Fn(([sample]) => {
    var sd = median(sample.r, sample.g, sample.b).sub(0.5);
    return clamp(sd.div(fwidth(sd)).add(0.5), 0.0, 1.0);
});

class GlyphNodeMaterial extends NodeMaterial {

	static get type() {        
		return 'GlyphNodeMaterial';
	}

	constructor( parameters ) {

		super();
		this.isGlyphMaterial = true;
        this.transparent = true
        this.map = parameters.map

		this.setValues( parameters );

        this.positionNode = Fn(() => {
            varyingProperty('vec2', 'vUv').assign(attribute('guv'));
            return positionLocal
          })();

        this.colorNode = Fn(() => {
            const vUv = varying(vec2(), 'vUv');

            const diffuseColor = vec3(0.0);
            var sample = texture(this.map, vUv);
            var alpha = sdGlyph(sample);

            return vec4(diffuseColor, alpha);
        })();
	}
}

export default GlyphNodeMaterial;