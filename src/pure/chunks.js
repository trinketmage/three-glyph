export const defaultChunks = {
	'color_pars_fragment':  `
		uniform vec3 color;
	`,
	'color_fragment':  `
		diffuseColor = color;
	`,
	'alpha_pars_fragment':  `
		uniform float opacity;
	`,
	'alpha_fragment':  `alpha *= opacity;`,
};

export const progressChunks = {
	'progress_pars_vertex':  `
    uniform float progress;
    uniform float total;
    uniform float duration;
    uniform float stagger;
		in float index;
		out float vProgress;

    // source https://github.com/trinketmage/sword
		float computeStagger(float duration, float stagger, float total, float index, float progress) {
			float staggers = (total * stagger);
			float maxDuration = duration + staggers;
			float space = duration / maxDuration;
			float offset = (index * stagger) / maxDuration;    
			return smoothstep(offset, offset + space, progress);
		}
	`,
	'progress_vertex':  `
		vProgress = computeStagger(duration, stagger, total, index, progress);
	`,
	'progress_pars_fragment':  `in float vProgress;`,
};

export const negateChunks = {
	'negate_fragment':  `s = vec3(1.0) - s;`
};
