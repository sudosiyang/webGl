var renderer, scene, camera, stats;

var sphere, uniforms, attributes;
var Composer;
var clock = new THREE.Clock();


var e = {
	zoom: 0,
	targetZoom: 0,
	zoomSpeed: 0.1,
	movementEase: 0.1,
	cameraFov: 0
}
var S, x = 225, //SCENE_3D_FOV_MIN,
	T = 100, //SCENE_3D_FOV_MAX,
	N = 750, //SCENE_CAMERA_HORIZONTAL_DISTANCE,
	C = 110, //SCENE_CAMERA_VERTICAL_BASE_DISTANCE,
	k = false, //SCENE_CAMERA_VERTICAL_UP_DISTANCE,
	L = 60, //SCENE_CAMERA_VERTICAL_DOWN_DISTANCE,
	A = 3, //PARTICLE_FIELD_GRID_SEG,
	O = 2000, //t.PARTICLE_FIELD_GRID_SIZE,
	M = O * A,
	_ = -M / 2,
	D = window,
	P, H, B, j, F, I;

e.hasControl = !1, e.canInteractiveWithPost = !1, e.isActive = !0;
var q = !1,
	R = new THREE.Object3D,
	U = new THREE.Object3D,
	z = e.fixedScalePoint = new THREE.Object3D;
e.fixedScalePointLength = 0;
var W = 1,
	X = !1,
	V = !1,
	$ = !1,
	J = !1,
	K;
e.movementEase = .1;
var Q = e.cameraPosition = new THREE.Vector3(0, C, N),
	G = e.cameraTargetPosition = new THREE.Vector3(0, C, N),
	Y = e.lookAtPosition = new THREE.Vector3(0, 0, 0),
	Z = e.lookAtTargetPosition = new THREE.Vector3(0, 0, 0),
	et = e.cameraVector = new THREE.Vector3(0, 0, 0);
e.lookAtHorizontalAngle = 0, e.zoomSpeed = .1, e.zoom = 0, e.targetZoom = 0, e.cameraFov = 0, e.cameraSwingSpeed = .015, e.cameraSwingRadius = .6, e.cameraPosOffset = new THREE.Vector3;
var tt = 0,
	nt = 0,
	rt = 0,
	it, st, ot, ut, at, ft, lt = [],
	ct = 0,
	ht, pt = e.hblur = null,
	dt = e.vblur = null,
	vt = e.blurBlend = null,
	mt = e.rgbShift = null,
	gt = e.customShader = null,
	yt;
e.blurriness = 1.4, e.blurBlendRatio = 1;
var bt = null,
	wt = 0,
	Et = 0,
	St = Q.x,
	xt = Q.z,
	Tt = Y.x,
	Nt = Y.z,
	Ct = 0,
	kt = 0;
var d = e.cameraPosOffset;
d.tX = 0, d.tY = 0, d.tZ = 0, d.a = 0;


init();
animate();


function init() {
	B = D.innerWidth, j = D.innerHeight;


	camera = new THREE.PerspectiveCamera(100, B / j, 1, 3e3);

	camera.position.x = 0;
	camera.position.y = 109;
	camera.position.z = 759;
	var e = screen.width,
		t = screen.height;
	camera.setViewOffset(e, t, e - B >> 1, t - j >> 1, B, j)
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
	renderer.setSize(B, j);



	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
	renderer.domElement.addEventListener("mousedown", OnMousedown);
	renderer.domElement.addEventListener("mouseup", OnMouseup);
	renderer.domElement.addEventListener("wheel", Onwheel);
	renderer.domElement.addEventListener("mousemove", OnMousemove);


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


	//帧数监测

	// stats = new Stats();
	// stats.domElement.style.position = 'absolute';
	// stats.domElement.style.top = '0px';
	// container.appendChild(stats.domElement);
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
	mouse.up = 0;
}

function OnMousemove(event) {
	if (!mouse.up) {
		mouse.x = event.pageX;
		mouse.y = event.pageY;
		wt = mouse.x / B * 2 - 1, Et = -mouse.y / j * 2 + 1;
		return;
	}
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

	tt += mouse.deltaX * .002 * (1 - e.zoom * .25), nt -= mouse.deltaY * (1 - e.zoom * .75) * .7
	// camera.translateZ(-mouse.deltaY * (1 - e.zoom * .75) * .7);

	// lon += -mouse.deltaX * 0.05;
	// lat = Math.max(-85, Math.min(85, lat));
	// phi = THREE.Math.degToRad(90 - lat);

	// theta = THREE.Math.degToRad(lon);

	// targetPosition.x = camera.position.x + 100 * Math.sin(phi) * Math.cos(theta);
	// targetPosition.y = camera.position.y + 100 * Math.cos(phi);
	// targetPosition.z = camera.position.z + 100 * Math.sin(phi) * Math.sin(theta);

	// camera.lookAt(targetPosition);
}

function y(e, t, n) {
	return e < t ? t : e > n ? n : e
}

function OnMousedown(event) {
	mouse.x = event.pageX;
	mouse.y = event.pageY;
	mouse.up = 1;
}

function Onwheel(event) {
	var t = event.wheelDelta > 0 ? 1 : 0;
	t > 0 && (tt -= wt * (B / 2) * 2e-4 * (1 - e.zoom * .25) * (1 - e.targetZoom)), e.targetZoom = y(e.targetZoom + t * .05, 0, 1)

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

	requestAnimationFrame(animate);

	render();
	// stats.update();

}

function g(e, t, n) {
	return t + (n - t) * e
}

function Bt() {
	return Math.atan2(Z.z - G.z, Z.x - G.x) + Math.PI / 2
}

function jt(e, t) {
	return Math.sqrt(e * e + t * t)
}

function render() {

	var time = Date.now() * 0.005,
		A = 3,
		kt = 0;

	var t = +(new Date),
		n = t - kt,
		o = e.movementEase,
		u = e.zoom += (e.targetZoom - e.zoom) * e.zoomSpeed;
	e.cameraFov = camera.fov = g(u, T, x), camera.updateProjectionMatrix();
	var c = 0,
		p = 0,
		d = 0,
		v = (1 - u) * (N - 5) + 5;
	var m = Bt();
	c = tt * .1;
	tt -= c;
	Ct += Math.abs(tt * 5);
	G.x = Z.x - Math.sin(m) * v;
	G.y = C + Math.pow(u, .15) * k - Math.pow(u, 40) * L;
	G.z = Z.z + Math.cos(m) * v;
	m -= Math.PI;
	m -= c;
	Z.x = G.x - Math.sin(m) * v;
	Z.y = (1 - u) * C;
	Z.z = G.z + Math.cos(m) * v;
	Y.x += (Z.x - Y.x) * o, Y.y += (Z.y - Y.y) * o, Y.z += (Z.z - Y.z) * o, Q.x += (G.x - Q.x) * o, Q.y += (G.y - Q.y) * o, Q.z += (G.z - Q.z) * o;
	var y = e.cameraPosOffset,
		w = y.a,
		E = Math.pow(Math.sin(w * Math.PI), 3);
	y.x = E * y.tX, y.y = E * y.tY, y.z = E * y.tZ, Q.add(y), camera.position.copy(Q), R.position.copy(Y);
	R.position.y = Q.y, camera.lookAt(R.position), p = nt * .1, nt -= p, d = rt * .1, rt -= d, camera.translateZ(p), camera.position.y += Math.abs(p) * .3, camera.translateX(d), Ct += Math.abs(p);
	var S = {
		x: camera.position.x - Q.x,
		y: 0,
		z: camera.position.z - Q.z
	};
	G.add(S), Z.add(S), Q.add(S), Y.add(S), R.position.copy(Y)

	R.lookAt(camera.position), ct += e.cameraSwingSpeed;
	var _ = e.cameraSwingRadius;
	camera.translateX(Math.sin(ct) * _ * (1 - u)), camera.translateY(Math.sin(ct * 2) * _ / 2), camera.lookAt(R.position), e.lookAtHorizontalAngle = Bt(), gt.uniforms.gradientOffset.value = e.lookAtHorizontalAngle;
	var D = Y.x,
		P = Y.z,
		I = Q.x,
		X = Q.z;
	e.cameraVector.copy(Q), e.cameraVector.sub(Y), W = 2 * Math.tan(camera.fov / 360 * Math.PI) / screen.height, z.position.copy(camera.position), z.rotation.copy(camera.rotation), e.fixedScalePointLength = 1 / W, z.translateZ(-e.fixedScalePointLength);

	var delta = clock.getDelta();

	for (var $ = 0, J = A * A; $ < J; $++) {
		V = lt[$];
		V.particle.position.x = -Math.floor((-D + V.offsetX + M / 2 + O / 2) / M) * M;
		V.particle.position.z = -Math.floor((-P + V.offsetZ + M / 2 + O / 2) / M) * M;
		V.uniforms.posFieldOffset.value.x = V.offsetX + V.particle.position.x;
		V.uniforms.posFieldOffset.value.z = V.offsetZ + V.particle.position.z;
		// V.move(D, P);
		V.uniforms.time.value += .2;
		V.uniforms.zoom.value = u;
		V.uniforms.cameraVector.value.copy(e.cameraVector);
	}



	// bt ? H.cursor = "pointer" : e.hasControl ? (H.cursor = K ? "grabbing" : "grab", H.cursor = K ? "-webkit-grabbing" : "-webkit-grab") : H.cursor = "auto";
	gt.uniforms.zoom.value = Math.pow(u, 1.5), gt.uniforms.time.value += gt.noiseSpeed;
	var At = e.blurriness;
	pt.uniforms.h.value = At / (.75 * B);
	dt.uniforms.v.value = At / (.75 * j);
	vt.uniforms.h.value = At / (.75 * B);
	vt.uniforms.v.value = At / (.75 * j);
	pt.uniforms.r.value = dt.uniforms.r.value = vt.uniforms.r.value = .5;
	pt.uniforms.blendRatio.value = dt.uniforms.blendRatio.value = vt.uniforms.blendRatio.value = e.blurBlendRatio * (1 - u);
	// r.particles.position.copy(z.position), r.particles.rotation.copy(z.rotation), r.particles.translateX(-F + r.offsetLeft), r.particles.translateY(r.offsetTop);
	var Ot = D - I,
		Mt = P - X,
		_t = Tt - St,
		Dt = Nt - xt,
		Pt = Math.atan2(Mt, Ot) - Math.atan2(Dt, _t);
	Pt > Math.PI ? Pt -= Math.PI * 2 : Pt < -Math.PI && (Pt += Math.PI * 2), U.rotateZ(-Pt);
	var Ht = Q.x - St,
		Ft = Q.z - xt,
		It = jt(Ht, Ft),
		qt = (Ht * Ot + Ft * Mt) / (It * jt(Ot, Mt)) > 0;

	camera.near = 1e-5, camera.updateProjectionMatrix();
	camera.near = 1, camera.updateProjectionMatrix(), St = Q.x, xt = Q.z, Tt = Y.x, Nt = Y.z, Q.sub(y), camera.position.sub(y)
	// renderer.render(scene, camera);
	Composer.render(delta);
}



function ParticleField(offsetX, offsetZ) {
	this.offsetX = offsetX;
	this.offsetZ = offsetZ;
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
			value: new THREE.Vector3(offsetX, 0, offsetZ)
		},
		posFieldOffset: {
			type: "v3",
			value: new THREE.Vector3(offsetX, 0, offsetZ)
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