import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/postprocessing/ShaderPass.js';
import {UnrealBloomPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/postprocessing/UnrealBloomPass.js';

export const vid360 = function(vid){
	var isUserInteracting = false,
		lon = 0, lat = 0,
		phi = 0, theta = 0,
		distance = 250,
		onPointerDownPointerX = 0,
		onPointerDownPointerY = 0,
		onPointerDownLon = 0,
		onPointerDownLat = 0;

	var controls, camera, scene, renderer;
	var cameraCube, sceneCube;
	var textureEquirec, equirectMaterial;
	var cubeMesh, sphereMesh;
	var sphereMaterial, geometry;
	var geometries, sky;
	var composer, mobiusPass, mobiusShader;
	var delta, bTime, bhPass;

    // var vids = {
    //     thornhill1: 'vid/thornhill1.webm',
    //     thornhill2: 'vid/thornhill2.webm',
    //     barber: 'vid/barber.webm',
    //     bus: 'vid/bus.webm',
    //     petrol: 'vid/petrol.webm',
    //     wasserturm1: 'vid/wasserturm1.webm',
    //     wasserturm2: 'vid/wasserturm2.webm',
    //     volks_warmup: 'vid/volks_warmup.mp4',
    //     volks_kaleido: 'vid/volks_kaleido.mov',
    //     planetarium_hands: 'vid/planetarium_hands.mp4',
    //     volks_carrying: 'vid/volks_carrying.mp4',
    //     volks_cups: 'vid/volks_cups.mp4',
    //     planetarium_game: 'vid/planetarium_game.mp4',
    //     planetarium_carrying: 'vid/planetarium_carrying.mp4'
    // };

    var sndVids = {
        volks_carrying: 'carrying',
        volks_kaleido: 'mirrors',
        planetarium_hands: 'voices',
        planetarium_game: 'drone',
        volks_cups: 'kaleido',
        planetarium_phrase: 'game',
        planetarium_free: 'glacier',
        volks_kaleido_special: 'gong'
    };


    // var vids = {
    //     thornhill1: 'https://content.jwplatform.com/videos/uyV9eWMN-ac7wx05Q.mp4',
    //     thornhill2: 'https://content.jwplatform.com/videos/pefTTpeR-yhiBISfO.mp4',
    //     barber: 'https://content.jwplatform.com/videos/jzY7TFVz-yhiBISfO.mp4',
    //     bus: 'https://content.jwplatform.com/videos/RTJiWoIP-yhiBISfO.mp4',
    //     petrol: 'https://content.jwplatform.com/videos/MlbrvHu9-yhiBISfO.mp4',
    //     wasserturm1: 'https://content.jwplatform.com/videos/2XjjGkh9-yhiBISfO.mp4',
    //     wasserturm2: 'https://content.jwplatform.com/videos/vAvPamCv-yhiBISfO.mp4',
    // };

    var vids = {
    	volks_carrying: "https://content.jwplatform.com/videos/hMDUGHbK-yhiBISfO.mp4",
    	volks_kaleido: "https://content.jwplatform.com/videos/CAY9lwL7-yhiBISfO.mp4",
    	planetarium_hands: "https://content.jwplatform.com/videos/2z6Qse0T-yhiBISfO.mp4",
    	planetarium_game: "https://content.jwplatform.com/videos/ZFi3B8T7-yhiBISfO.mp4",
    	volks_cups: "https://content.jwplatform.com/videos/M3BtsvPF-yhiBISfO.mp4",
    	planetarium_free: "https://content.jwplatform.com/videos/oPuF8wm3-yhiBISfO.mp4",
    	planetarium_phrase: "https://content.jwplatform.com/videos/xGy2B5Em-yhiBISfO.mp4",
    	volks_kaleido_special: "https://content.jwplatform.com/videos/a2PWp3SQ-SOhSvJ9D.mp4"
    };

	vid.init = function(renderer, name, curves, snd) {
		var Curves = curves;
		vid.playing = false;
	    vid.raycaster = new THREE.Raycaster();
	    vid.playSound = snd;

		// CAMERAS
		camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1100);
		camera.position.set( 0, 0, 1000 );
		cameraCube = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 1100);

		// SCENE
		scene = new THREE.Scene();
		sceneCube = new THREE.Scene();

		// Lights
		var ambient = new THREE.AmbientLight(0xffffff);
		scene.add(ambient);

		vid.sky = new THREE.Group();

		// Textures
		vid.name = name;
		vid.video = document.createElement('video');
		vid.video.crossOrigin = "*";
		vid.video.loop = true;
		vid.video.playsinline = true;
		vid.video.muted = true;
		vid.video.src = vids[name];
		// vid.video.play();

		textureEquirec = new THREE.VideoTexture(vid.video);
		textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
		textureEquirec.encoding = THREE.sRGBEncoding;

		// Materials
		var equirectShader = THREE.ShaderLib['equirect'];
		equirectMaterial = new THREE.ShaderMaterial( {
			uniforms: THREE.UniformsUtils.clone(equirectShader.uniforms),
			fragmentShader: equirectShader.fragmentShader,
			vertexShader: equirectShader.vertexShader,
			depthWrite: false,
			side: THREE.BackSide
		} );
		equirectMaterial.uniforms['tEquirect'].value = textureEquirec;

		// enable code injection for non-built-in material
		Object.defineProperty(equirectMaterial, 'map', {
			get: function () {
				return this.uniforms.tEquirect.value;
			}
		});

		// Skybox
		cubeMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(100, 100, 100), equirectMaterial);
		vid.equirectMaterial = equirectMaterial;

		sceneCube.add(cubeMesh);
		cubeMesh.visible = true;

        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(sceneCube, cameraCube));
        // composer.addPass(new RenderPass(sceneCube, cameraCube));

        // mobiusShader = {
        //     uniforms: {
        //         texture: {type: "t", value: textureEquirec},
        //         time: {type: 'f', value: 0},
        //         resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)}
        //     },
        //     vertexShader: ShaderLoader.get("transformations_vert"),
        //     fragmentShader: ShaderLoader.get("transformations_frag")
        // }
        // mobiusPass = new ShaderPass(mobiusShader);
        // mobiusPass.renderToScreen = true;

        // composer.addPass(mobiusPass);

		// geometry = new THREE.TorusKnotBufferGeometry( 10, 3, 100, 16 );
		geometry = new THREE.SphereBufferGeometry(15, 40, 60),
		sphereMaterial = new THREE.MeshLambertMaterial( { envMap: textureEquirec } );
		sphereMaterial.needsUpdate = true;
		
		sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
		sphereMesh.position.set(
            THREE.Math.randInt(-110, 110),
            THREE.Math.randInt(-50, 50),
            THREE.Math.randInt(-180, 110)
        );
        vid.sky.add(sphereMesh);

        // var options = {
        //     minFilter: THREE.NearestFilter,//important as we want to sample square pixels
        //     magFilter: THREE.NearestFilter,//
        //     format: THREE.RGBAFormat,//180407 changed to RGBAFormat
        //     type:THREE.FloatType//important as we need precise coordinates (not ints)
        // };
        // rtt = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, options);

		vid.renderer = renderer;
		vid.renderer.autoClear = false;
		// vid.renderer.setPixelRatio( window.devicePixelRatio );
		vid.renderer.setSize(window.innerWidth, window.innerHeight);

		vid.origEncoding = vid.renderer.outputEncoding;
		vid.renderer.outputEncoding = THREE.sRGBEncoding;
		vid.disposables = [scene, textureEquirec, equirectMaterial, sphereMaterial, geometry];

        var uniforms = {
            time: { type: "f", value: 0.0 },
            r1: { type: "f", value: 0.1 },
            r2: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            vTexture: {type: 't', value: textureEquirec},
            zoomCoord: {type: 'v2', value: new THREE.Vector2(0.,0.)},
            u_colorFactor: {type: 'f', value: 0.}

        }
        // debugger;
        vid.blackHole = {
            uniforms: uniforms,
            vertexShader: 
            `
			void main()   {
				gl_Position = vec4( position, 1.0 );
			}
            `,
            fragmentShader: ShaderLoader.get("droste_frag"),
        };
        vid.blackHole.needsUpdate = true;
        bhPass = new ShaderPass(vid.blackHole);
        bhPass.renderToScreen = true;
        // composer.addPass(bhPass);

        // var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), vid.blackHole);
        // mesh.position.set(sphereMesh.x, sphereMesh.y, sphereMesh.z);

        // vid.sky.add(mesh);
		// vid.initBlackHole();

		scene.add(vid.sky);

		geometries = [
			new THREE.TorusKnotBufferGeometry(13, 3, 100, 16),
			new THREE.DodecahedronBufferGeometry(15, 0),
			new THREE.IcosahedronBufferGeometry(15, 0),
			new THREE.OctahedronBufferGeometry(15, 0),
			new THREE.TorusBufferGeometry(13, 3, 1000, 16),
			new THREE.SphereBufferGeometry(15, 40, 60),
			new THREE.TubeBufferGeometry(new Curves.GrannyKnot(), 1000, 3, 10, true),
			new THREE.TubeBufferGeometry(new Curves.VivianiCurve(70), 1000, 3, 10, true),
			// new THREE.TubeBufferGeometry(new Curves.CinquefoilKnot(20), 1000, 3, 10, true),
			new THREE.TubeBufferGeometry(new Curves.FigureEightPolynomialKnot(), 1000, 3, 10, true),
			// new THREE.TubeBufferGeometry(new Curves.DecoratedTorusKnot4b(), 1000, 3, 10, true),
			// new THREE.TubeBufferGeometry(new Curves.HelixCurve(), 1000, 3, 10, true),
			// new THREE.TubeBufferGeometry(new Curves.DecoratedTorusKnot4a(), 1000, 3, 10, true),
			// new THREE.TubeBufferGeometry(new Curves.DecoratedTorusKnot5c(), 1000, 3, 10, true),
			// new THREE.TubeBufferGeometry(new Curves.TrefoilKnot(), 1000, 3, 10, true),
			// new THREE.TubeBufferGeometry(new Curves.GrannyKnot(), 1000, 3, 10, true),
			// [THREE.ParametricBufferGeometry, [THREE.ParametricGeometries.klein, 25, 25]]
		];

		return vid;
	}

	vid.sound = function() {
		if (vid.name in sndVids)
			return sndVids[vid.name];
		else
			return false;
	}

	var geomIndex = 0, rotateCamera = true;
	var bufferScene;
    var observer, effectBloom;

    vid.initBlackHole = function() {
        // screen frame

		composer = new EffectComposer(vid.renderer)
		// let renderPass = new RenderPass(scene, camera)
		// let renderPass2 = new RenderPass(sceneCube, cameraCube)
		// strength, kernelSize, sigma, res
		
		// resolution, strength, radius, threshold
		effectBloom = new UnrealBloomPass(128, 0.8, 20.0, 0.0)
		// let effectCopy = new ShaderPass(THREE.CopyShader)
		// effectCopy.renderToScreen = true
		// composer.addPass(renderPass)
		// composer.addPass(renderPass2)
		// composer.addPass(effectBloom)
		// composer.addPass(effectCopy)

		observer = new Observer(60.0, window.innerWidth/window.innerHeight, 1, 80000);
		observer.distance = 12;
		camControl = new THREE.CameraDragControls(observer, vid.renderer.domElement); // take care of camera view
		// camControl sets up vector
		vid.sky.add(observer);
		delta = 0;
		bTime = 0;

		var uniforms = {
		  time: { type: "f", value: 0.0 },
		  resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
		  accretion_disk: {type: "b", value: false},
		  use_disk_texture: {type: "b", value: false},
		  lorentz_transform: {type: "b", value: true},
		  doppler_shift: {type: "b", value: true},
		  beaming: {type: "b", value: false},
		  cam_pos: {type:"v3", value: new THREE.Vector3()},
		  cam_vel: {type:"v3", value: new THREE.Vector3()},
		  cam_dir: {type:"v3", value: new THREE.Vector3()},
		  cam_up: {type:"v3", value: new THREE.Vector3()},
		  fov: {type:"f", value: 90.0},
		  cam_vel: {type:"v3", value: new THREE.Vector3()},
		  bg_texture: {type: "t", value: textureEquirec},
		  star_texture: {type: "t", value: textureEquirec},
		}
		// debugger;
		vid.blackHole = new THREE.ShaderMaterial({
		  uniforms: uniforms,
		  vertexShader: document.getElementById('vertexShader').textContent,
		  fragmentShader: ShaderLoader.get("blackhole_frag"),
		});
		vid.blackHole.needsUpdate = true;
		var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), vid.blackHole);
		vid.sky.add(mesh);
    }


	vid.onDocumentKeyDown = function(event) {
		if (event.keyCode == 39) {
			geomIndex = (geomIndex + 1) % geometries.length;
		} else if (event.keyCode == 37) {
			if (geomIndex > 0) {
				geomIndex = (geomIndex - 1) % geometries.length;
			} else {
				geomIndex = geometries.length - 1;
			}
		}

		if (event.keyCode == 39 || event.keyCode == 37) {
			event.preventDefault();
			sphereMesh.geometry.dispose();
			sphereMesh.geometry = geometries[geomIndex];
            if (geomIndex > 5) {
                sphereMesh.scale.set(0.5, 0.5, 0.5);
            } else {
                sphereMesh.scale.set(1, 1, 1);
            }
		}

		if (event.keyCode == 40 || event.keyCode == 38) {
			event.preventDefault();
			if (textureEquirec.mapping == THREE.EquirectangularReflectionMapping) {
				textureEquirec.mapping = THREE.EquirectangularRefractionMapping;
			} else {
				textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
			}
		}

		if (event.keyCode == 32)
			rotateCamera = !rotateCamera;

		sphereMaterial.needsUpdate = true;
	}

	vid.onDocumentMouseDown = function(event) {
		event.preventDefault();
		isUserInteracting = true;

		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;
		if (vid.isMouseOn(event, sphereMesh)) {
			vid.delayStop(event.clientX, event.clientY);
		}
	}

	var droste = false, drosteStart;
	vid.delayStop = function(mouseX, mouseY) {
		if (mouseX / window.innerWidth >= 0.5) {
			mouseX = 3 - mouseX / window.innerWidth * 2;
		} else {
			mouseX = 6 - mouseX / window.innerWidth * 7;
		}
		bhPass.uniforms.zoomCoord.value = new THREE.Vector2(mouseX, mouseY);

        composer.addPass(bhPass);
        droste = true;
		setTimeout(vid.stop, 14000);
		drosteStart = Date.now();
	}

    var mouse = new THREE.Vector2();
	vid.isMouseOn = function(event, mesh) {
	    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	    vid.raycaster.setFromCamera(mouse, camera);
	    var intersects = vid.raycaster.intersectObjects([mesh]);

	    return intersects.length > 0;
	}

	var dragging = false;
	vid.onDocumentMouseMove = function(event) {
		if (vid.isMouseOn(event, sphereMesh)) {
			document.body.style.cursor = "pointer";
		} else {
            document.body.style.cursor = "url('css/chaos-magick.png'), auto";
		}

		if (isUserInteracting && !dragging) {
			lon = (onPointerDownPointerX - event.clientX) * 0.3 + onPointerDownLon;
			lat = (onPointerDownPointerY - event.clientY) * 0.3 + onPointerDownLat;
		}
		// if (dragging) {
		//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
 			
 	// 		var intersects = new THREE.Vector3();
		//     vid.raycaster.setFromCamera(mouse, camera);
		//     vid.raycaster.ray.intersectPlane(cubeMesh, intersects);
		// 	dragging.position.set(mouse.x, mouse.y, 0);
		// }
	}

	vid.onDocumentMouseUp = function() {
		isUserInteracting = false;
		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;
		dragging = false;

		onPointerDownLon = lon;
		onPointerDownLat = lat;
	}

	vid.onDocumentMouseWheel = function(event) {
		distance += event.deltaY * 0.05;
		distance = THREE.MathUtils.clamp(distance, 1, 500);
	}

	vid.animate = function() {
		requestAnimationFrame(vid.animate);
		vid.update();
	}

	vid.start = function() {
		document.addEventListener('keydown', vid.onDocumentKeyDown, false);
		document.addEventListener('mousedown', vid.onDocumentMouseDown, false);
		document.addEventListener('mousemove', vid.onDocumentMouseMove, false);
		document.addEventListener('mouseup', vid.onDocumentMouseUp, false);
		document.addEventListener('wheel', vid.onDocumentMouseWheel, false);
		window.addEventListener('resize', vid.onWindowResize, false);
		if (vid.name == 'volks_cups') {
			vid.video.currentTime = 10;
		} else {
			vid.video.currentTime = 0;
		}
		vid.video.play();
		vid.playing = true;

	}

	vid.stop = function() {
		document.removeEventListener('keydown', vid.onDocumentKeyDown, false);
		document.removeEventListener('mousedown', vid.onDocumentMouseDown, false);
		document.removeEventListener('mousemove', vid.onDocumentMouseMove, false);
		document.removeEventListener('mouseup', vid.onDocumentMouseUp, false);
		document.removeEventListener('wheel', vid.onDocumentMouseWheel, false);
		window.removeEventListener('resize', vid.onWindowResize, false);
		vid.video.pause();
		vid.playing = false;
		vid.video.remove();
		vid.renderer.outputEncoding = vid.origEncoding;
		vid.renderer.autoClear = true;
		droste = false;

		bhPass.uniforms.time.value = 0;
		bhPass.uniforms.r1.value = 0.1;
		bhPass.uniforms.r2.value = 1.0;
		bhPass.uniforms.u_colorFactor.value = 0;
		for (var i = 0; i < vid.disposables.length; i++)
			vid.disposables[i].dispose();
		for (var i = 0; i < geometries.length; i++)
			geometries[i].dispose();
	}


	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		cameraCube.aspect = window.innerWidth / window.innerHeight;
		cameraCube.updateProjectionMatrix();

        composer.setSize(window.innerWidth, window.innerHeight);
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	var camControl;
	var delta, lastframe = Date.now();
	var bTime;

	vid.update = function(rotateSpeed) {
		if (droste) {
			// if (bhPass.uniforms.time.value < 1)
        	// bhPass.uniforms.time.value += 0.008 * (Math.floor(bhPass.uniforms.time.value) + 0.8);
        	bhPass.uniforms.time.value += 0.03;
	       	// else
	       		// bhPass.uniforms.time.value += 0.1;
	       	bhPass.uniforms.u_colorFactor.value = (Date.now() - drosteStart) / 10000 - .15;
	        bhPass.uniforms.r1.value += 0.001;
 	       //  if (bhPass.uniforms.r2.value < 2)
	        // 	bhPass.uniforms.r2.value -= 0.001;
	        // else
	        // 	bhPass.uniforms.r2.value += 0.01;
		}

		if (rotateCamera)
			lon += rotateSpeed;

		lat = Math.max(-85, Math.min(85, lat));
		phi = THREE.MathUtils.degToRad(90 - lat);
		theta = THREE.MathUtils.degToRad(lon);

		sphereMesh.rotation.y += Math.PI / 180 * 0.3;

		camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
		camera.position.y = distance * Math.cos(phi);
		camera.position.z = distance * Math.sin(phi) * Math.sin(theta);

		camera.lookAt(scene.position);
		cameraCube.rotation.copy(camera.rotation);

		composer.render();
		// vid.renderer.render(sceneCube, cameraCube);
		vid.renderer.render(scene, camera);

		// delta = (Date.now()-lastframe)/1000  
		// bTime += delta

		// // vid.renderer.setPixelRatio( window.devicePixelRatio);
		// // vid.renderer.setSize(window.innerWidth, window.innerHeight)
		// composer.setSize(window.innerWidth, window.innerHeight)
		// // update what is drawn
		// observer.update(delta)
		// camControl.update(delta)

  //       vid.blackHole.uniforms.time.value += delta;
  //       vid.blackHole.uniforms.cam_pos.value = observer.position;
  //       vid.blackHole.uniforms.cam_dir.value = observer.direction;
  //       vid.blackHole.uniforms.cam_up.value = observer.up;
  //       vid.blackHole.uniforms.fov.value = observer.fov;
  //       vid.blackHole.uniforms.cam_vel.value = observer.velocity;

		lastframe = Date.now();

	}
    return vid;
}({});
