import { Color, Vector2, GLSL3 } from 'three';
export const GlyphShader = {

	name: 'Glyph',

	glslVersion: GLSL3,

	transparent: true,
	depthTest: false,
	// side: BackSide,
	uniforms: {
		opacity: { type: "f", value: 1.0},
		time: { type: "f", value: 0 },
		stagger: { value: 0.01 },
		direction: { value: 0.0 },
		duration: { value: 1.0 },
		map: { value: null },
		color: { type: "c", value: new Color(0xece9e3) },
		resolution: { type: "c", value: new Vector2(0, 0) },
		mixRatio: { value: 0.0 },
		total: { type: "f", value: 0 },
	},

	vertexShader: /* glsl */`
		#define MSDFText

		in vec2 uv;
		in vec2 guv;
		in vec4 position;
		uniform mat4 projectionMatrix;
		uniform mat4 modelViewMatrix;
		out vec2 vUv;
		out vec2 vGuv;
		
		void main() {
			vUv = uv;
			vGuv = guv;
			gl_Position = projectionMatrix * modelViewMatrix * position;
		}
	`,

	fragmentShader: /* glsl */`
		#define MSDFText
		
		precision highp float;

		uniform vec3 color;
		uniform sampler2D map;
		in vec2 vUv;
		in vec2 vGuv;
		out vec4 myOutputColor;

		float median(float r, float g, float b) {
			return max(min(r, g), min(max(r, g), b));
		}

		void main() {
			vec3 s = texture(map, vGuv).rgb;
			float sigDist = median(s.r, s.g, s.b) - 0.5;
			float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);;

			myOutputColor = vec4(color, alpha);
		}
	`

};
