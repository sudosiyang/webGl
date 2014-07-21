var renderer, scene, camera, stats;

var sphere, uniforms, attributes;
var Composer, projector;
var clock = new THREE.Clock();


var e = {
	zoom: 0,
	targetZoom: 0,
	zoomSpeed: 0.1,
	movementEase: 0.1,
	cameraFov: 0
}

var mouse = {
	x: 0,
	y: 0,
	deltaX: 0,
	deltaY: 0
}

var S, x = 25, //SCENE_3D_FOV_MIN,
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
	P, H = document.getElementById("container").style,
	B, j, F, I;

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



//各种类
var snoise = (function() {

	return {
		snoise2D: function(e, t) {
			var n = .211324865405187,
				r = -0.577350269189626,
				i = 1.79284291400159,
				s = 1 / 289,
				o = (e + t) * .366025403784439,
				u = Math.floor(e + o),
				a = Math.floor(t + o);
			o = (u + a) * n;
			var f = e - u + o,
				l = t - a + o,
				c = f > l ? 1 : 0,
				h = 1 - c,
				p = f + n - c,
				d = l + n - h,
				v = f + r,
				m = l + r;
			u -= Math.floor(u * s) * 289, a -= Math.floor(a * s) * 289, o = 0, n = .024390243902439, r = .85373472095314;
			var g = .5 - p * p - d * d;
			if (g > 0) {
				var y = a + h;
				y *= y * 34 + 1, y = y - Math.floor(y * s) * 289 + u + c, y *= y * 34 + 1, y = (y - Math.floor(y * s) * 289) * n, y = (y - Math.floor(y)) * 2 - 1;
				var b = Math.abs(y) - .5;
				y -= Math.floor(y + .5), o += g * g * g * g * (i - r * (y * y + b * b)) * (y * p + b * d)
			}
			g = .5 - v * v - m * m;
			if (g > 0) {
				var w = a + 1;
				w *= w * 34 + 1, w = w - Math.floor(w * s) * 289 + u + 1, w *= w * 34 + 1, w = (w - Math.floor(w * s) * 289) * n, w = (w - Math.floor(w)) * 2 - 1;
				var E = Math.abs(w) - .5;
				w -= Math.floor(w + .5), o += g * g * g * g * (i - r * (w * w + E * E)) * (w * v + E * m)
			}
			g = .5 - f * f - l * l;
			if (g > 0) {
				a *= a * 34 + 1, a = a - Math.floor(a * s) * 289 + u, a *= a * 34 + 1, a = (a - Math.floor(a * s) * 289) * n, a = (a - Math.floor(a)) * 2 - 1;
				var S = Math.abs(a) - .5;
				a -= Math.floor(a + .5), o += g * g * g * g * (i - r * (a * a + S * S)) * (a * f + S * l)
			}
			return o * 130
		}
	}
})();


function o(e, t, n) {
	return t + (n - t) * e
}


var PostParticles = (function() {
	return {
		a: 2e3 / 200,
		f: .7,
		l: 50,
		c: 100,
		h: 200,
		p: 512,
		d: 20,
		v: [],
		m: new THREE.Vector3,
		g: new THREE.Vector3,
		h: 200,
		o: function(e, t, n) {
			return t + (n - t) * e
		},
		init: function(e) {
			var t, r = this.h;
			while (r--) {
				t = fakePoint();
				t.scale.x = t.scale.y = t.scale.z = .01;
				t.position.y = 9999;
				t.material.uniforms.fade.value = 0;
				t.material.uniforms.popScale.value = 3;
				this.v.push(t);
				e.add(t);
			}
		},
		update: function(i) {
			var e = i.cameraPosition,
				t = i.lookAtPosition,
				n = t.x,
				u = t.z,
				p = 0,
				y = [],
				b = 0,
				w = n / this.a | 0,
				E = u / this.a | 0,
				S = 0,
				x = i.zoom,
				T = snoise.snoise2D,
				N, C, k, L, A, O, M, _, D, P = this.a,
				H = 3.141592653589793,
				B = [],
				j, F, I = x > this.f,
				q = I ? 1 : 0;
			g.x = n - e.x, g.z = u - e.z, g.y = Math.atan2(t.y - e.y, Math.sqrt(g.x * g.x + g.z * g.z));
			if (I) {
				var R = (this.o(x, this.c, this.l) / 2 | 0) + 1,
					U, z = .5;
				C = 0;
				for (;;) {
					if (C === 0) S++;
					else {
						O = (2 * S - 1) * (2 * S - 1);
						if (C === O) E--;
						else {
							U = (C - O) * z | 0, U === 0 && w++, U === 1 && E++, U === 2 && w--;
							if (U === 3) {
								E--;
								if ((C - O + 1) * z === 4) {
									S++;
									if (S >= R) break;
									z = .5 / S
								}
							}
						}
					}
					M = w * P;
					_ = E * P;
					A = T(M * .1, _ * .1);
					N = (A + T(M * .005, _ * .005)) * .5;
					N = 1 - (Math.cos(N * H) + 1) / 2 - A - T(M * .03, _ * .03);
					N -= T(M * .003 + 2.1, _ * .003 + 2.1) * 1.5 + T(M * .3 + 1.1, _ * .3 + 1.1) + T(M * .001 + 1.1, _ * .001 + 1.1), N *= .5;
					if (N > .75) {
						B.push(w, E, N, !1), p++;
						if (p >= this.h) break
					}
					C++
				}
			}
			for (C = 0; C < this.h; C++) {
				D = this.v[C], D.hasMatch = !1;
				D.material.uniforms.fade.value += (q - D.material.uniforms.fade.value) * .03;
			}
			for (C = 0; C < p; C++) {
				w = B[C * 4], E = B[C * 4 + 1];
				for (k = 0, L = this.v.length; k < L; k++) {
					D = this.v[k];
					if (D.gridX === w && D.gridY === E) {
						D.hasMatch = !0, B[C * 4 + 3] = D;
						break
					}
				}
			}
			var W = 0;
			for (C = 0; C < p; C++) {
				w = B[C * 4], E = B[C * 4 + 1], N = B[C * 4 + 2], D = B[C * 4 + 3];
				if (!D) {
					for (k = 0, L = this.v.length; k < L; k++) {
						D = this.v[k];
						if (!D.hasMatch) {
							D.gridX = w, D.gridY = E, D.hasMatch = !0;
							//D.changePost(r.takePost());// 换图
							M = D.sumX = w * P, _ = D.sumY = E * P, D.position.x = M + (T(M * .3, _ * .3) - .5) * 8, D.position.y = T(M * .0013 + 4, _ * .0013 + 4) * -40 + T(M * 6e-4 + 32, _ * 6e-4 + 32) * -90 + T(M * 200 + 12, _ * 200 + 12) * 10, D.position.z = _ + (T(M * .4, _ * .4) - .5) * 8, D.material.uniforms.fade.value = 0;
							break
						}
					}
					W++
				}
				this.m.copy(D.position);
				this.m.sub(e);
				this.m.x -= i.cameraVector.x * (-0.2 + .4 * x);
				this.m.y -= i.cameraVector.y * (-0.2 + .4 * x);
				this.m.z -= i.cameraVector.z * (-0.2 + .4 * x);
				D.scale.x = D.scale.y = D.scale.z = 3 / this.m.length() * this.o(N, .4, 1) * (window.devicePixelRatio || 1);
				D.up.copy(g);
				D.lookAt(e);
				//D.update();
				y.push(D);
				if (W >= d) break
			}
			return y.sort(function(e, t) {
				return e - t
			}), y
		}
	}
})()



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



function fakePoint() {
	var c = 80;
	var img = THREE.ImageUtils.loadTexture("1.jpg");
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


	return new THREE.Mesh(geometry, material);
}

var postImg = (function() {
		return {
			show: function(e) {
				a = e.material.uniforms.pop;
				EKTweener.to(a, (1 - a.value) * .3, {
					value: 1
				})
			},
			hide: function(e) {
				a = e.material.uniforms.pop;
				EKTweener.to(a, a.value * .3, {
					value: 0
				})
			}
		}
	})()
	//类结束


function reset() {
	B = D.innerWidth, j = D.innerHeight;
	var e = screen.width,
		t = screen.height;
	camera.setViewOffset(e, t, e - B >> 1, t - j >> 1, B, j)
}

function init() {
	camera = new THREE.PerspectiveCamera(100, 1, 1, 3e3);

	camera.position.x = 0;
	camera.position.y = 109;
	camera.position.z = 759;
	reset();
	projector = new THREE.Projector();
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


	PostParticles.init(scene);

	//帧数监测

	// stats = new Stats();
	// stats.domElement.style.position = 'absolute';
	// stats.domElement.style.top = '0px';
	// container.appendChild(stats.domElement);
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


function CameraMove() {

	tt += mouse.deltaX * .002 * (1 - e.zoom * .25);
	nt -= mouse.deltaY * (1 - e.zoom * .75) * .7;
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
	if (t > 0) {
		(tt -= wt * (B / 2) * 2e-4 * (1 - e.zoom * .25) * (1 - e.targetZoom));
		e.targetZoom = y(e.targetZoom + t * .05, 0, 1)
	}
}

function onWindowResize() {

	reset();

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
	mt = PostParticles.update(e);

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
		V.uniforms.time.value += .2;
		V.uniforms.zoom.value = u;
		V.uniforms.cameraVector.value.copy(e.cameraVector);
	}

	var vector = new THREE.Vector3(wt, Et, 1);
	projector.unprojectVector(vector, camera);
	var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	var Lt = null;
	for ($ = 0, J = mt.length; $ < J; $++) {
		Lt = raycaster.intersectObject(mt[$])[0];
		if (Lt) {
			break;
		}
	}
	if (!Lt && bt || bt && Lt && Lt.object != bt) postImg.hide(bt), bt = null;
	Lt && bt != Lt.object && (bt = Lt.object, postImg.show(bt))

	bt ? H.cursor = "pointer" : e.hasControl ? (H.cursor = K ? "grabbing" : "grab", H.cursor = K ? "-webkit-grabbing" : "-webkit-grab") : H.cursor = "auto";
	gt.uniforms.zoom.value = Math.pow(u, 1.5), gt.uniforms.time.value += gt.noiseSpeed;
	var At = e.blurriness;
	pt.uniforms.h.value = At / (.75 * B);
	dt.uniforms.v.value = At / (.75 * j);
	vt.uniforms.h.value = At / (.75 * B);
	vt.uniforms.v.value = At / (.75 * j);
	pt.uniforms.r.value = dt.uniforms.r.value = vt.uniforms.r.value = .5;
	pt.uniforms.blendRatio.value = dt.uniforms.blendRatio.value = vt.uniforms.blendRatio.value = e.blurBlendRatio * (1 - u);
	// r.particles.position.copy(z.position), r.particles.rotation.copy(z.rotation), r.particles.translateX(-F + r.offsetLeft), r.particles.translateY(r.offsetTop);
	// var Ot = D - I,
	// 	Mt = P - X,
	// 	_t = Tt - St,
	// 	Dt = Nt - xt,
	// 	Pt = Math.atan2(Mt, Ot) - Math.atan2(Dt, _t);
	// Pt > Math.PI ? Pt -= Math.PI * 2 : Pt < -Math.PI && (Pt += Math.PI * 2), U.rotateZ(-Pt);
	// var Ht = Q.x - St,
	// 	Ft = Q.z - xt,
	// 	It = jt(Ht, Ft),
	// 	qt = (Ht * Ot + Ft * Mt) / (It * jt(Ot, Mt)) > 0;

	// camera.near = 1e-5, camera.updateProjectionMatrix();
	// camera.near = 1, camera.updateProjectionMatrix(), St = Q.x, xt = Q.z, Tt = Y.x, Nt = Y.z, Q.sub(y), camera.position.sub(y)
	Composer.render(delta);
}



init();
animate();