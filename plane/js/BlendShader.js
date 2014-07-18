// /**
//  * @author alteredq / http://alteredqualia.com/
//  *
//  * Blend two textures
//  */

// THREE.BlendShader = {

// 	uniforms: {

// 		"tDiffuse1": { type: "t", value: null },
// 		"tDiffuse2": { type: "t", value: null },
// 		"mixRatio":  { type: "f", value: 0.5 },
// 		"opacity":   { type: "f", value: 1.0 }

// 	},

// 	vertexShader: [

// 		"varying vec2 vUv;",

// 		"void main() {",

// 			"vUv = uv;",
// 			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// 		"}"

// 	].join("\n"),

// 	fragmentShader: [

// 		"uniform float opacity;",
// 		"uniform float mixRatio;",

// 		"uniform sampler2D tDiffuse1;",
// 		"uniform sampler2D tDiffuse2;",

// 		"varying vec2 vUv;",

// 		"void main() {",

// 			"vec4 texel1 = texture2D( tDiffuse1, vUv );",
// 			"vec4 texel2 = texture2D( tDiffuse2, vUv );",
// 			"gl_FragColor = opacity * mix( texel1, texel2, mixRatio );",

// 		"}"

// 	].join("\n")

// };
THREE.BlendShader = {
	uniforms: {
		tDiffuse: {
			type: "t",
			value: null
		},
		tDiffuse2: {
			type: "t",
			value: null
		},
		v: {
			type: "f",
			value: 1 / 512
		},
		h: {
			type: "f",
			value: 1 / 512
		},
		r: {
			type: "f",
			value: .35
		},
		blendRatio: {
			type: "f",
			value: 1
		}
	},
	vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
	fragmentShader: ["uniform sampler2D tDiffuse;", "uniform sampler2D tDiffuse2;", "uniform float v;", "uniform float h;", "uniform float r;", "uniform float blendRatio;", "varying vec2 vUv;", "void main() {", "vec4 sum = vec4( 0.0 );", "float vv = v * abs( r - vUv.y );", "float hh = h * abs( r - vUv.y );", "vec4 base = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );", "vec4 center = texture2D( tDiffuse2, vec2( vUv.x, vUv.y ) );", "sum += texture2D( tDiffuse2, vec2( vUv.x - 2.0 * hh, vUv.y - 2.0 * vv ) ) * 0.051;", "sum += texture2D( tDiffuse2, vec2( vUv.x, vUv.y - 2.0 * vv ) ) * 0.1531;", "sum += texture2D( tDiffuse2, vec2( vUv.x + 2.0 * hh, vUv.y - 2.0 * vv ) ) * 0.051;", "sum += texture2D( tDiffuse2, vec2( vUv.x - 2.0 * hh, vUv.y ) ) * 0.1531;", "sum += center * 0.1633;", "sum += texture2D( tDiffuse2, vec2( vUv.x + 2.0 * hh, vUv.y ) ) * 0.1531;", "sum += texture2D( tDiffuse2, vec2( vUv.x - 2.0 * hh, vUv.y + 2.0 * vv ) ) * 0.051;", "sum += texture2D( tDiffuse2, vec2( vUv.x, vUv.y + 2.0 * vv ) ) * 0.1531;", "sum += texture2D( tDiffuse2, vec2( vUv.x + 2.0 * hh, vUv.y + 2.0 * vv ) ) * 0.051;", "gl_FragColor = mix(base * (1. + blendRatio * 3.), mix(max(center, sum), center / (vec4(1.0) - sum), .9), blendRatio * .3);", "}"].join("\n")
}