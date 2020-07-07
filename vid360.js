var vid360 = function(vid){
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
	var geometries;

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

		// Textures
		vid.name = name;
		vid.video = document.createElement('video');
		vid.video.crossOrigin = "*";
		vid.video.loop = true;
		vid.video.playsinline = true;
		vid.video.muted = true;
		vid.video.src = name;
		vid.video.play();

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

		sceneCube.add(cubeMesh);
		cubeMesh.visible = true;

		geometry = new THREE.TorusKnotBufferGeometry( 10, 3, 100, 16 );
		sphereMaterial = new THREE.MeshLambertMaterial( { envMap: textureEquirec } );
		sphereMaterial.needsUpdate = true;
		
		sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
		scene.add(sphereMesh);

		vid.renderer = renderer;
		vid.renderer.autoClear = false;
		// vid.renderer.setPixelRatio( window.devicePixelRatio );
		vid.renderer.setSize( window.innerWidth, window.innerHeight );

		vid.origEncoding = vid.renderer.outputEncoding;
		vid.renderer.outputEncoding = THREE.sRGBEncoding;
		vid.disposables = [scene, textureEquirec, equirectMaterial, sphereMaterial, geometry];

		geometries = [
			new THREE.TorusKnotBufferGeometry(13, 3, 100, 16),
			new THREE.DodecahedronBufferGeometry(15, 0),
			new THREE.IcosahedronBufferGeometry(15, 0),
			new THREE.OctahedronBufferGeometry(15, 0),
			new THREE.TorusBufferGeometry(13, 3, 1000, 16),
			new THREE.SphereBufferGeometry(15, 40, 60),
			new THREE.TubeBufferGeometry(new Curves.GrannyKnot(), 1000, 3, 10, true),
			new THREE.TubeBufferGeometry(new Curves.VivianiCurve(70), 1000, 3, 10, true),
			new THREE.TubeBufferGeometry(new Curves.CinquefoilKnot(20), 1000, 3, 10, true),
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
	var geomIndex = 0, rotateCamera = true;

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
			vid.stop();
		}
	}

    var mouse = new THREE.Vector2();
	vid.isMouseOn = function(event, mesh) {
	    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	    vid.raycaster.setFromCamera(mouse, camera);
	    var intersects = vid.raycaster.intersectObjects([mesh]);

	    return intersects.length > 0;
	}

	vid.onDocumentMouseMove = function(event) {
		if (vid.isMouseOn(event, sphereMesh)) {
			document.body.style.cursor = "pointer";
		} else {
            document.body.style.cursor = "url('css/chaos-magick.png'), auto";
		}

		if (isUserInteracting) {
			lon = (onPointerDownPointerX - event.clientX) * 0.3 + onPointerDownLon;
			lat = (onPointerDownPointerY - event.clientY) * 0.3 + onPointerDownLat;
		}
	}

	vid.onDocumentMouseUp = function() {
		isUserInteracting = false;
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

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	vid.update = function(rotateSpeed) {
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

		vid.renderer.render(sceneCube, cameraCube);
		vid.renderer.render(scene, camera);
	}
    return vid;
}({});
