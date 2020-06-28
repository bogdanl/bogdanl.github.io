var vid360 = function(vid){

	var isUserInteracting = false,
		lon = 0, lat = 0,
		phi = 0, theta = 0,
		distance = 90,
		onPointerDownPointerX = 0,
		onPointerDownPointerY = 0,
		onPointerDownLon = 0,
		onPointerDownLat = 0;

	vid.init = function(renderer, name) {
		vid.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
		vid.camera.target = new THREE.Vector3(0, 0, 0);
		vid.scene = new THREE.Scene();
	    vid.raycaster = new THREE.Raycaster();

		var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
		// invert the geometry on the x-axis so that all of the faces point inward
		geometry.scale(-1, 1, 1);

		vid.video = document.createElement('video');
		vid.video.crossOrigin = "*";
		vid.video.loop = true;
		vid.video.playsinline = true;
		vid.video.muted = true;
		vid.video.src = 'vid/' + name;

		var material = new THREE.MeshBasicMaterial(
			{map: new THREE.VideoTexture(vid.video)}
		);
		vid.mesh = new THREE.Mesh(geometry, material);
		vid.renderer = renderer;
		// vid.renderer.setPixelRatio(window.devicePixelRatio);
		vid.renderer.setSize(window.innerWidth, window.innerHeight);
		vid.scene.add(vid.mesh);

		return vid;
	}

	vid.onDocumentMouseDown = function(event) {
		event.preventDefault();
		isUserInteracting = true;

		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;
	}

	vid.isMouseOn = function(event) {
	    var mouse = new THREE.Vector2();
	    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	    vid.raycaster.setFromCamera(mouse, vid.camera);
	    var intersects = vid.raycaster.intersectObjects([vid.mesh]);

	    return intersects.length > 0;
	}

	vid.onDocumentMouseMove = function(event) {
		if (isUserInteracting) {
			lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
			lat = (onPointerDownPointerY - event.clientY) * 0.1 + onPointerDownLat;
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
		document.addEventListener('mousedown', vid.onDocumentMouseDown, false);
		document.addEventListener('mousemove', vid.onDocumentMouseMove, false);
		document.addEventListener('mouseup', vid.onDocumentMouseUp, false);
		document.addEventListener('wheel', vid.onDocumentMouseWheel, false);
		window.addEventListener('resize', vid.onWindowResize, false);
		vid.video.play();
		// vid.video.currentTime = 5;

	}

	vid.stop = function() {
		document.removeEventListener('mousedown', vid.onDocumentMouseDown, false);
		document.removeEventListener('mousemove', vid.onDocumentMouseMove, false);
		document.removeEventListener('mouseup', vid.onDocumentMouseUp, false);
		document.removeEventListener('wheel', vid.onDocumentMouseWheel, false);
		window.removeEventListener('resize', vid.onWindowResize, false);
		vid.video.pause();
		// video.currentTime = 0;
		// vid.scene.remove(vid.mesh);
	}

	vid.update = function(rotateSpeed) {
		lon += rotateSpeed;
		lat = Math.max(-85, Math.min(85, lat));
		phi = THREE.MathUtils.degToRad(90 - lat);
		theta = THREE.MathUtils.degToRad(lon);

		vid.camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
		vid.camera.position.y = distance * Math.cos(phi);
		vid.camera.position.z = distance * Math.sin(phi) * Math.sin(theta);

		vid.camera.lookAt(vid.camera.target);
		vid.renderer.render(vid.scene, vid.camera);
	}
    return vid;
}({});
