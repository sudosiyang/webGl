var renderer, scene, camera, stats;

var sphere, uniforms, attributes;
var Composer;
var lt = [];

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var clock = new THREE.Clock();
var zoom = 10e-34;


init();
animate();


function init() {
	camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 1, 3e3);

	camera.position.x = 0;
	camera.position.y = 109;
	camera.position.z = 759;
	var e = screen.width,
		t = screen.height;
	camera.setViewOffset(e, t, e - WIDTH >> 1, t - HEIGHT >> 1, WIDTH, HEIGHT)
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(460551, 6e-4)
	//粒子系统
	var A = 3,
		amount = 2000,
		pos = 3000;
	for (var o = 0, c = A * A; o < c; o++) {
		lt[o] = new ParticleField(o % A * amount - pos, Math.floor(o / A) * amount - pos);
		scene.add(lt[o].particle);
	}

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);



	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
	renderer.domElement.addEventListener("mousedown", OnMousedown);
	renderer.domElement.addEventListener("mouseup", OnMouseup);


	//特效处理
	Composer = new THREE.EffectComposer(renderer);
	Composer.addPass(new THREE.RenderPass(scene, camera));
	mt = new THREE.ShaderPass(THREE.RGBShiftShader);
	mt.uniforms.amount.value = 0.0004;
	yt = new THREE.SavePass;
	pt = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
	pt.uniforms.h.value = 0.0010019681517266057;
	pt.uniforms.r.value = 0.5;
	pt.uniforms.blendRatio = {
		type: "f",
		value: 1
	}
	dt = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);
	dt.uniforms.v.value = 0.0025605852766346594;
	dt.uniforms.r.value = 0.5;
	dt.uniforms.blendRatio = {
		type: "f",
		value: 1
	}
	vt = new THREE.ShaderPass(THREE.BlendShader);
	vt.uniforms.tDiffuse2.value = yt.renderTarget;

	gt = new THREE.ShaderPass(THREE.CustomShader);
	gt.noiseSpeed = 0;


	Composer.addPass(yt);
	Composer.addPass(mt);
	Composer.addPass(pt);
	Composer.addPass(dt);
	Composer.addPass(vt);
	Composer.addPass(gt);
	gt.renderToScreen = !0;
}
var mouse = {
	x: 0,
	y: 0,
	deltaX: 0,
	deltaY: 0
}

function OnMouseup(event) {

	mouse.x = event.pageX;
	mouse.y = event.pageY;
	mouse.up = 1;
}

function OnMousemove(event) {
	if (mouse.up) return;
	mouse.deltaX = event.pageX - mouse.x;
	mouse.deltaY = event.pageY - mouse.y;
	mouse.x = event.pageX;
	mouse.y = event.pageY;
	CameraMove();
}

var lon = 0,
	lat = 0,
	phi = 0,
	theta = 0,
	targetPosition = new THREE.Vector3(0, 0, 0);

function CameraMove() {
	camera.translateZ(-mouse.deltaY * (1 - zoom * .75) * .7);

	lon += -mouse.deltaX * 0.05;
	lat = Math.max(-85, Math.min(85, lat));
	phi = THREE.Math.degToRad(90 - lat);

	theta = THREE.Math.degToRad(lon);

	targetPosition.x = camera.position.x + 1000 * Math.sin(phi) * Math.cos(theta);
	targetPosition.y = camera.position.y + 1000 * Math.cos(phi);
	targetPosition.z = camera.position.z + 1000 * Math.sin(phi) * Math.sin(theta);

	camera.lookAt(targetPosition);
}

function OnMousedown(event) {
	mouse.x = event.pageX;
	mouse.y = event.pageY;
	renderer.domElement.addEventListener("mousemove", OnMousemove);
	mouse.up = 0;
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

	var time = Date.now() * 0.005,
		A = 3;
	var delta = clock.getDelta();
	// controls.update(delta);
	var u = zoom += -zoom * 0.01;
	u < 0 ? 1e-33 : u;
	for (var $ = 0, J = A * A; $ < J; $++) {
		V = lt[$];
		// V.particles.position.x = -Math.floor((-D + V.offsetX + M / 2 + O / 2) / M) * M;
		// 	V.particles.position.z = -Math.floor((-P + V.offsetZ + M / 2 + O / 2) / M) * M;
		// 	V.uniforms.posFieldOffset.value.x = V.offsetX + V.particles.position.x;
		// 	V.uniforms.posFieldOffset.value.z = V.offsetZ + V.particles.position.z;
		// 	V.move(D, P);
		// 	V.uniforms.time.value += .2;
		V.uniforms.zoom.value = u;
		// 	V.uniforms.cameraVector.value.copy(e.cameraVector);
	}
	// renderer.render(scene, camera);
	Composer.render(delta);
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