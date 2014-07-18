THREE.CustomShader = {
	uniforms: {
		tDiffuse: {
			type: "t",
			value: null
		},
		time: {
			type: "f",
			value: 0
		},
		alpha: {
			type: "f",
			value: .08
		},
		gradientOffset: {
			type: "f",
			value: 3.2408590664521597
		},
		gradientOpacity: {
			type: "f",
			value: .1
		},
		vRadius: {
			type: "f",
			value: 1
		},
		vSoftness: {
			type: "f",
			value: 1
		},
		zoom: {
			type: "f",
			value: 0
		},
		opacity: {
			type: "f",
			value: 0.88
		},
		vAlpha: {
			type: "f",
			value: .36
		}
	},
	vertexShader: "varying vec2 vUv;\nvoid main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n",
	fragmentShader: "precision mediump float;\nuniform sampler2D tDiffuse;\nuniform float time;\nuniform float alpha;\nuniform float gradientOffset;\nuniform float gradientOpacity;\nuniform float vRadius;\nuniform float vSoftness;\nuniform float vAlpha;\nuniform float zoom;\nuniform float opacity;\n\n\nconst float PI = 3.14159265358979323846264;\n\n\nvarying vec2 vUv;\nfloat rand(vec2 co){\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\nvoid main() {\n    vec4 color = texture2D(tDiffuse, vUv);\n\n    color.rgb = mix(color.rgb, vec3(.043, .043, .043), 1.0 - opacity);\n\n    float r = rand(gl_FragCoord.xy + rand(gl_FragCoord.yx + time));\n    color.rgb = mix(color.rgb, vec3(r, r, r), alpha);\n\n    // radial gradient\n    // float distanceToGradientCenter = clamp(length((vUv - vec2(.5, .5 + zoom + .5)) * 2.0), 0., 1.);\n    // color.rgb = mix(color.rgb, mix(color.rgb, vec3(.909, .945,.95), .1), 1. - smoothstep(0., 1., distanceToGradientCenter));\n\n    // linear gradient\n    float linearGradientRatio = clamp((1. - vUv.y * (.85 + sin((vUv.x * 1.0 * PI + gradientOffset )) * .05) + pow(zoom, 1.3)) * 2., 0., 1.);\n    color.rgb = mix(color.rgb, mix(color.rgb, vec3(.909, .945,.95), gradientOpacity), 1. - smoothstep(0., 1., linearGradientRatio));\n\n    vec2 posToCenter = (vUv - vec2(.5, .5)) * 2.0;\n    float len = length(posToCenter);\n    float vignette = smoothstep(vRadius, vRadius-vSoftness, len);\n    color.rgb = mix(color.rgb, color.rgb * vignette, vAlpha);\n    gl_FragColor = color;\n}\n"
};