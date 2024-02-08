import { Color, Vector2, GLSL3 } from 'three';
export const GlyphShader = {

	name: 'Glyph',

	glslVersion: GLSL3,

	transparent: true,
	depthTest: false,
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

		in float indices;
		in vec2 guv;
		in vec2 uv;
		in vec4 position;
		uniform float opacity;
		uniform float total;
		uniform mat4 projectionMatrix;
		uniform mat4 modelViewMatrix;
		out float vIdx;
		out float mixf;
		out vec2 vGuv;
		out vec2 vUv;
		
		float exponentialOut(float t) {
			return t * t;
		}
		
		void main() {
			vIdx = indices;
			vGuv = guv;
			vUv = uv;
			vec4 pos =  projectionMatrix * modelViewMatrix * position;
			gl_Position = pos;
		}
	`,

	fragmentShader: /* glsl */`
		#define MSDFText
		
		precision highp float;

		uniform float opacity;
		uniform vec3 color;
		uniform sampler2D map;
		uniform sampler2D alphaMap;
		in float mixf;
		in vec2 vGuv;
		in vec2 vUv;
		out vec4 myOutputColor;

		float median(float r, float g, float b) {
			return max(min(r, g), min(max(r, g), b));
		}

		void main() {
			vec3 s = 1.0 - texture(map, vGuv).rgb;
			float sigDist = median(s.r, s.g, s.b) - 0.5;
			float alpha =  1.0 - clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

			myOutputColor = vec4(color, alpha);
		}
	`

};
