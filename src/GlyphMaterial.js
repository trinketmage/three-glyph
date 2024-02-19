import { Color, GLSL3, ShaderMaterial, UniformsUtils } from 'three'

import { defaultChunks, negateChunks, progressChunks } from './pure/chunks.js';

const includePattern = /^[ \t]*#include +<([\w\d./]+)>/gm;

const GlyphShader = {

	name: 'Glyph',

	glslVersion: GLSL3,

	transparent: true,
	depthTest: false,
	defines: {},

	uniforms: {
		map: { value: null },
		color: { value: new Color(0xece9e3) },
		opacity: { value: 1 },
		total: { value: 6 },
		progress: { value: 0.5 }
	},

	vertexShader: /* glsl */`
		#define Glyph

		in vec2 uv;
		in vec2 guv;
		in vec4 position;
		uniform mat4 projectionMatrix;
		uniform mat4 modelViewMatrix;
		out vec2 vUv;
		out vec2 vGuv;
		
		#include <progress_pars_vertex>
		
		float quadraticOut(float t) {
			return -t * (t - 2.0);
		}
		float cubicOut(float t) {
			float f = t - 1.0;
			return f * f * f + 1.0;
		}
		
		void main() {
			vUv = uv;
			vGuv = guv;

			#include <progress_vertex>

			vec3 transformed = vec3( position );
			// transformed.x += 260.0 * 0.5 * (1.0 - quadraticOut(vProgress));
			// transformed.z -= 260.0 * 0.5 * (1.0 - cubicOut(vProgress));

			vec4 mvPosition = vec4(transformed, 1.0);
			mvPosition = modelViewMatrix * mvPosition;

			vec4 pos = projectionMatrix * mvPosition;
			
			gl_Position = pos;
		}
	`,

	fragmentShader: /* glsl */`
		#define Glyph
		
		precision highp float;

		uniform sampler2D map;
		in vec2 vUv;
		in vec2 vGuv;
		out vec4 myOutputColor;

		#include <progress_pars_fragment>
		#include <color_pars_fragment>

		float median(float r, float g, float b) {
			return max(min(r, g), min(max(r, g), b));
		}

		void main() {
			vec3 diffuseColor = vec3(1.0);
			float alpha = 1.0;

			vec3 s = texture(map, vGuv).rgb;
			#include <negate_fragment>
			
			float sigDist = median(s.r, s.g, s.b) - 0.5;
			alpha *= clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
			
			#include <color_fragment>
			#include <alphamap_fragment>

			myOutputColor = vec4(diffuseColor, alpha);
		}
	`

};

class GlyphMaterial extends ShaderMaterial {
	
	constructor( parameters ) {
		GlyphShader.uniforms = UniformsUtils.merge( [
			GlyphShader.uniforms,
			parameters.uniforms,
		]);

		super(GlyphShader);
		
		this.chunks = defaultChunks;

		if (parameters.negate) {
			Object.assign(this.chunks, negateChunks);
		}

		if (parameters.progress) {
			Object.assign(this.chunks, progressChunks);
		}

		this.isRawShaderMaterial = true;

		this.type = 'GlyphMaterial';

		this.customProgramCacheKey = function() { 
			return parameters.negate;
		}
    this.onBeforeCompile = shader => {
			let { fragmentShader: fragment, vertexShader: vertex } = shader;
			vertex = this.resolveIncludes(vertex);
			shader.vertexShader = vertex;
			fragment = this.resolveIncludes(fragment);
			shader.fragmentShader = fragment;
    };
	}
	
	resolveIncludes( string ) {
		return string.replace( includePattern, this.includeReplacer.bind(this) );
	}

	includeReplacer( match, include ) {
		let string = this.chunks[ include ];
		return string || '';
	}
	
}

export { GlyphShader };
export default GlyphMaterial;
