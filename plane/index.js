var renderer, scene, camera, stats;

var sphere, uniforms, attributes;

var lt = [];

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var clock = new THREE.Clock();


init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 1, 3e3);
	camera.position.z = 300;
	camera.position.x = 200;
	camera.position.y = 200;
	var e = screen.width,
		t = screen.height;
	camera.setViewOffset(e, t, e - WIDTH >> 1, t - HEIGHT >> 1, WIDTH, HEIGHT)
	scene = new THREE.Scene();

	controls = new THREE.FirstPersonControls(camera);

	controls.movementSpeed = 70;
	controls.lookSpeed = 0.05;
	controls.noFly = true;
	controls.lookVertical = false;

	var A = 2,
		amount = 2000,
		pos = 3000;
	for (var o = 0, c = A * A; o < c; o++) {
		lt[o] = new ParticleField(o % A * amount, Math.floor(o / A) * amount - pos);
		scene.add(lt[o].particle);
	}

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);

	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

	requestAnimationFrame(animate);

	render();
	//stats.update();

}

function render() {

	var time = Date.now() * 0.005;
	lt = scene.children, A = 3;
	var delta = clock.getDelta();
	controls.update(delta);
	// for (var $ = 0, J = A * A; $ < J; $++) {
	// 	V = lt[$], V.particles.position.x = -Math.floor((-D + V.offsetX + M / 2 + O / 2) / M) * M;
	// 	V.particles.position.z = -Math.floor((-P + V.offsetZ + M / 2 + O / 2) / M) * M;
	// 	V.uniforms.posFieldOffset.value.x = V.offsetX + V.particles.position.x;
	// 	V.uniforms.posFieldOffset.value.z = V.offsetZ + V.particles.position.z;
	// 	V.move(D, P);
	// 	V.uniforms.time.value += .2;
	// 	V.uniforms.zoom.value = u;
	// 	V.uniforms.cameraVector.value.copy(e.cameraVector);
	// }
	renderer.render(scene, camera);

}



function ParticleField(offsetX, offsetY) {
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.uniforms = {
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
		fading: {
			type: "f",
			value: 0.5
		},
		colorMap: {
			type: "t",
			value: THREE.ImageUtils.loadTexture("colorMap.png")
		},
		colorMapScale: {
			type: "f",
			value: 1
		},
		time: {
			type: "f",
			value: 0
		},
		zoom: {
			type: "f",
			value: 0.2
		},
		globalPos: {
			type: "v3",
			value: new THREE.Vector3(0, 0, 0)
		},
		posOffset: {
			type: "v3",
			value: new THREE.Vector3(offsetX, 0, offsetY)
		},
		posFieldOffset: {
			type: "v3",
			value: new THREE.Vector3(offsetX, 0, offsetY)
		},
		cameraVector: {
			type: "v3",
			value: new THREE.Vector3(0, 0, 0)
		},
		dpi: {
			type: "f",
			value: window.devicePixelRatio || 1
		}
	}

	var shaderMaterial = new THREE.ShaderMaterial({

		uniforms: this.uniforms,
		vertexShader: document.getElementById('vertexshader').textContent,
		fragmentShader: document.getElementById('fragmentshader').textContent,

		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true,
		fog: true

	});


	var geometry = new THREE.Geometry();
	var f = 10,
		i, u = 200;
	for (i = 0; i < u; i++) {
		o = i * f;
		for (s = 0; s < u; s++)
			geometry.vertices.push(new THREE.Vector3(o, 0, s * f))
	}
	var sphere = new THREE.ParticleSystem(geometry, shaderMaterial);

	sphere.dynamic = true;
	this.particle = sphere;
	return this;
}