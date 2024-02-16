import { Color, GLSL3, ShaderMaterial, UniformsUtils, ShaderChunk } from 'three'

console.log(ShaderChunk);

const GlyphShaderChunks = {
	'negate_fragment': `
		s = vec3(1.0) - s;
	`,
	'progress_pars_vertex':  `
		uniform float progress;
		uniform float total;
		in float index;
		out float vProgress;

		float stagger(float duration, float stagger, float total, float index, float progress) {
			float staggers = (total * stagger);
			float maxDuration = duration + staggers;
			float space = duration / maxDuration;
			float offset = (index * stagger) / maxDuration;    
			return smoothstep(offset, offset + space, progress);
		}
	`,
	'progress_vertex':  `
		vProgress = stagger(1.0, 0.1, total, index, progress);
	`,
	'progress_pars_fragment':  `in float vProgress;`,
	'alphamap_fragment':  `alpha *= vProgress;`,
	'color_pars_fragment':  `uniform vec3 color;`,
	'color_fragment':  `
		// diffuseColor = color;
		diffuseColor = vec3(
			color.x,
			color.y * vProgress,
			color.z * vProgress
		);
	`,
};

const GlyphShader = {

	name: 'Glyph',

	glslVersion: GLSL3,

	transparent: true,
	depthTest: false,
	defines: {},

	uniforms: {
		map: { value: null },
		color: { value: new Color(0xece9e3) },
		total: { value: 6 },
		progress: { value: 0 }
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
		
		#include <progress_pars>
		
		void main() {
			vUv = uv;
			vGuv = guv;

			#include <progress>
			
			gl_Position = projectionMatrix * modelViewMatrix * position;
		}
	`,

	fragmentShader: /* glsl */`
		#define Glyph
		
		precision highp float;

		uniform sampler2D map;
		in vec2 vUv;
		in vec2 vGuv;
		out vec4 myOutputColor;

		#include <progress_pars>
		#include <color_pars>

		float median(float r, float g, float b) {
			return max(min(r, g), min(max(r, g), b));
		}

		void main() {
			vec3 diffuseColor = vec3(0.0);

			vec3 s = texture(map, vGuv).rgb;
			#include <negate>
			
			float sigDist = median(s.r, s.g, s.b) - 0.5;
			float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
			
			#include <color>
			#include <alphamap>

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

		this.isRawShaderMaterial = true;

		this.type = 'GlyphMaterial';

		this.customProgramCacheKey = function() { 
			return parameters.negate;
		}

    this.onBeforeCompile = shader => {
			let { fragmentShader: fragment, vertexShader: vertex } = shader;

			vertex = vertex.replace(
				'#include <progress_pars>',
				GlyphShaderChunks.progress_pars_vertex
			);
			vertex = vertex.replace(
				'#include <progress>',
				GlyphShaderChunks.progress_vertex
			);

			shader.vertexShader = vertex;

			fragment = fragment.replace(
				'#include <negate>',
				parameters.negate ? GlyphShaderChunks.negate_fragment : ''
			);
			fragment = fragment.replace(
				'#include <progress_pars>',
				GlyphShaderChunks.progress_pars_fragment
			);
			fragment = fragment.replace(
				'#include <alphamap>',
				GlyphShaderChunks.alphamap_fragment
			);
			fragment = fragment.replace(
				'#include <color_pars>',
				GlyphShaderChunks.color_pars_fragment
			);
			fragment = fragment.replace(
				'#include <color>',
				GlyphShaderChunks.color_fragment
			);

			shader.fragmentShader = fragment;
    };
	}
	
}

export { GlyphShader };
export default GlyphMaterial;
