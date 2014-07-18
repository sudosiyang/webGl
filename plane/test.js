var camera, scene, renderer;
var plane, c = 51.2;
var img = THREE.ImageUtils.loadTexture("1.jpg");
var projector,container;
var L = [];
init();
animate();

function init() {



	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	projector = new THREE.Projector();

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 500;

	var h = document.createElement("canvas");
	h.width = h.height = c;
	var e = h.getContext("2d");
	e.fillStyle = "#fefcfe", e.fillRect(0, 0, c, c);
	scene = new THREE.Scene();
	var geometry = new THREE.PlaneGeometry(c, c, 1, 1)
	var material = new THREE.ShaderMaterial({
		uniforms: {
			fogColor: {
				type: "c",
				value: new THREE.Color(0)
			},
			fogDensity: {
				type: "f",
				value: .025
			},
			fogFar: {
				type: "f",
				value: 2e3
			},
			fogNear: {
				type: "f",
				value: 1
			},
			texture: {
				type: "t",
				value: img //new THREE.Texture(h)
			},
			u_time: {
				type: "f",
				value: Math.random() * 100
			},
			alpha: {
				type: "f",
				value: 1
			},
			fade: {
				type: "f",
				value: 1
			},
			pop: {
				type: "f",
				value: 0
			},
			popScale: {
				type: "f",
				value: 1.3
			},
			showScale: {
				type: "f",
				value: 1
			}
		},
		attributes: {},
		vertexShader: "varying vec2 vUv;\nvarying float u_pop;\nuniform float pop;\nuniform float popScale;\nuniform float showScale;\n\nvoid main() {\n    vUv = uv;\n    vec4 pos = vec4( position, 1.0 );\n    pos.xyz *= clamp(pow(showScale, 10.), .08, 1.);\n    pos.xyz *= mix(1., popScale, pop);\n    vec4 modelViewPos = modelViewMatrix * pos;\n    gl_Position = projectionMatrix * modelViewPos;\n\n    u_pop = pop;\n}\n",
		fragmentShader: "precision mediump float;\n\nuniform sampler2D texture;\nuniform float u_time;\nuniform float fade;\nuniform float alpha;\nvarying float u_pop;\n\nvarying vec2 vUv;\n\n/*EVAL THREE.ShaderChunk['fog_pars_fragment'];*/\n\nconst float PI = 3.14159265358979323846264;\n\nfloat clampNorm(float val, float min, float max) {\n    return clamp((val - min) / (max - min), 0.0, 1.0);\n}\n\nvec2 getDisplacement(vec2 uv, float time) {\n\n    time *= 5.0; // speed\n\n    float a = sin(time + uv.x * 10.0);\n    float b = cos(time + uv.y * 10.0);\n\n    return vec2( a + cos(b), b + sin(a) ) * 0.005; // size\n}\n\nfloat rand(vec2 co){\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nvoid main() {\n\n    vec2 posToCenter = (vUv - vec2(.5, .5)) * 2.0;\n\n    float innerThreshold = .1;\n    float threshold = .8;\n    float direction = 45.0 / 180.0 * PI;\n    float monoNoise = rand(vUv * 10.0 + u_time * .0001);\n\n\n    float angle = atan(posToCenter.y, posToCenter.x);\n    float distanceToCenter = length(posToCenter);\n\n    float angleRatio1 = (cos((angle + direction) * 2.0) + 1.0) / 2.0;\n    float angleRatio2 = (cos(angle + direction) + 1.0) / 2.0;\n    float angleRatio = (angleRatio1 + angleRatio2) / 2.0;\n\n    float fadeOpacity = 1. - smoothstep(threshold, 1., distanceToCenter);\n    float opacity = (1. - step(threshold, distanceToCenter)) + mix(1., monoNoise, 1. - fadeOpacity) * fadeOpacity;\n\n    vec3 bgColor = mix(vec3(255., 255., 255.), vec3(252., 222., 184.), distanceToCenter) / 255.;\n\n    vec2 uv = vUv;\n\n    vec4 imageColor= texture2D(texture, uv);\n\n\n    vec4 color = vec4(mix(bgColor, imageColor.rgb, u_pop), 1.);\n\n    color.a = opacity * alpha * fade;\n    color.r *= .9 + monoNoise * .2;\n    color.g *= .9 + monoNoise * .2;\n    color.b *= .9 + monoNoise * .2;\n\n    gl_FragColor = color;\n\n/*EVAL THREE.ShaderChunk['fog_fragment'];*/\n\n}\n",
		depthTest: !1,
		transparent: !0,
		fog: !0
	})


	plane = new THREE.Mesh(geometry, material);
	L.push(plane);
	scene.add(plane);

	//

	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	container=document.getElementsByTagName("canvas")[0];
}



var INTERSECTED;

function onDocumentMouseMove(event) {
	event.preventDefault();

	var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
	projector.unprojectVector(vector, camera);

	var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

	var intersects = raycaster.intersectObjects(L);
	if (intersects.length > 0) {
		if (INTERSECTED != intersects[0].object) {
			INTERSECTED = intersects[0].object;
			a = INTERSECTED.material.uniforms.pop;
			EKTweener.to(a, a.value * .3, {
				value: 0
			})
		};
		a = INTERSECTED.material.uniforms.pop;
		EKTweener.to(a, (1 - a.value) * .3, {
			value: 1
		})
		container.style.cursor = 'pointer';
	} else {
		container.style.cursor = 'auto';
		if (INTERSECTED) {
			a = INTERSECTED.material.uniforms.pop;
			EKTweener.to(a, a.value * .3, {
				value: 0
			})
		}
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

	requestAnimationFrame(animate);

	// mesh.rotation.x += 0.005;
	// mesh.rotation.y += 0.01;

	renderer.render(scene, camera);

}