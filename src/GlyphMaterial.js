import { Color, GLSL3, ShaderMaterial, UniformsUtils, MathUtils } from 'three'

import { defaultChunks, negateChunks, progressChunks } from './pure/chunks.js';

const includePattern = /^[ \t]*#include +<([\w\d./]+)>/gm;

const progressUniforms = {
	total: { value: 0 },
	progress: { value: 0 },
	duration: { value: 1 },
	stagger: { value: 0.1 }
}

const GlyphShader = {

	name: 'Glyph',

	glslVersion: GLSL3,

	transparent: true,
	depthTest: false,
	defines: {},

	uniforms: {
		map: { value: null },
		color: { value: new Color(0xffffff) },
		opacity: { value: 1 },
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
		
		#include <position_pars_vertex>
		#include <progress_pars_vertex>
		
		void main() {
			vUv = uv;
			vGuv = guv;

			#include <progress_vertex>

			vec3 transformed = vec3( position );

			#include <transformed_vertex>

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
		#include <alpha_pars_fragment>
		#include <color_pars_fragment>

		float median(float r, float g, float b) {
			return max(min(r, g), min(max(r, g), b));
		}	

		void main() {
			vec3 diffuseColor = vec3(1.0);
			float alpha = 1.0;

			vec3 msd = texture(map, vGuv).rgb;
			#include <negate_fragment>
			
			float sd = median(msd.r, msd.g, msd.b) - 0.5;
			alpha *= clamp(sd/fwidth(sd) + 0.5, 0.0, 1.0);

			#include <color_fragment>
			#include <alpha_fragment>

			myOutputColor = vec4(diffuseColor, alpha);
		}
	`

};

class GlyphMaterial extends ShaderMaterial {
	
	constructor( parameters ) {
		const { addons } = parameters;
		GlyphShader.uniforms = UniformsUtils.merge( [
			GlyphShader.uniforms,
			parameters.uniforms,
			(addons && addons.progress) ? progressUniforms : {}
		]);

		super(GlyphShader);
		
		this.computeChunks(parameters);

		this.isRawShaderMaterial = true;

		this.type = 'GlyphMaterial';

		// TODO refactory CacheKey
		this.customProgramCacheKey = function() { 
      return MathUtils.generateUUID();

		}
    this.onBeforeCompile = shader => {
			let { fragmentShader: fragment, vertexShader: vertex } = shader;
			vertex = this.resolveIncludes(vertex);
			shader.vertexShader = vertex;
			fragment = this.resolveIncludes(fragment);
			shader.fragmentShader = fragment;
    };
	}

	computeChunks(parameters) {
		const { addons = {} } = parameters;
		const { negate, progress, shaderChunks } = addons;
		this.chunks = Object.assign({}, defaultChunks);

		if (negate) {
			Object.assign(this.chunks, negateChunks);
		}

		if (progress) {
			Object.assign(this.chunks, progressChunks);
		}

		if (shaderChunks) {
			Object.assign(this.chunks, shaderChunks);
		}
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
