/**
 * @author mrdoob / http://mrdoob.com/
 * @author Tapani Jämsä (free look modification)
 */
var yawObject;
var yawObject2;

var pitchObject;
var pitchObject2;

var geometry = new THREE.SphereGeometry( 5, 32, 32 ); 
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var sphere = new THREE.Mesh( geometry, material ); 
 
THREE.FreeLookControls = function(camera, camera2, domElement) {

	var scope = this;
	this.domElement = (domElement !== undefined) ? domElement : document;

	camera.rotation.set(0, 0, 0);
	camera2.rotation.set(250, 0, 0);
	
	pitchObject = new THREE.Object3D();
	pitchObject.add(camera);

	pitchObject2 = new THREE.Object3D();
	pitchObject2.add(camera2);
	
	yawObject = new THREE.Object3D();
	yawObject.position.set(2.3, 14, -25.24);
	yawObject.add(pitchObject);

	yawObject2 = new THREE.Object3D();
	yawObject2.position.set(-119, 100, 115);
	yawObject2.add(pitchObject2);
	
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var moveUp = false;
	var moveDown = false;

	var dragging = false;

	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();
	var speed = .5;

	var PI_2 = Math.PI / 2;
	
	var onMouseDown = function(event) {
		dragging = true;

		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('mouseup', onMouseUp, false);
	};

	var onMouseUp = function(event) {
		dragging = false;

		document.removeEventListener('mousemove', onMouseMove, false);
		document.removeEventListener('mouseup', onMouseUp, false);
	};

	var onMouseMove = function(event) {

		if (scope.enabled === false || dragging === false || HOulu.currPortal || HOulu.paused) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.004;
		yawObject2.rotation.y -= movementX * 0.002;
		
		pitchObject.rotation.x -= movementY * 0.004;
		
		if (yawObject.rotation.y > 6.28318)
			yawObject.rotation.y -= 6.28318;
		else if (yawObject.rotation.y < -6.28318)
			yawObject.rotation.y += 6.28318;
		
		pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));

	};

	var onKeyDown = function(event) {

		switch (event.keyCode) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			/*case 32: // space
				// if ( canJump === true ) velocity.y += 10;
				// canJump = false;
				moveUp = true;
				break;

			case 16: // shift
				moveDown = true;
				break;*/

		}

	};

	var onKeyUp = function(event) {

		switch (event.keyCode) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // a
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

			case 32: // space
				// if ( canJump === true ) velocity.y += 10;
				// canJump = false;
				velocity.y = 0;
				moveUp = false;
				break;

			case 16: // shift
				velocity.y = 0;
				moveDown = false;
				console.log(yawObject.position);
				console.log(pitchObject.rotation.x, yawObject.rotation.y);
				break;

		}

	};


	this.enabled = false;

	this.getObject = function() {

		return yawObject;

	};
	
	this.getObject2 = function()
	{
		return yawObject2;
	};

	this.getVelocity = function() {

		return velocity;

	};

	this.isOnObject = function(boolean) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3(0, 0, -1);
		var rotation = new THREE.Euler(0, 0, 0, "YXZ");

		return function(v) {

			rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

			v.copy(direction).applyEuler(rotation);

			return v;

		}

	}();

	this.update = function(delta) {

		if (scope.enabled === false || HOulu.currPortal || HOulu.paused) return;

		delta *= 0.1;

		velocity.x += (-velocity.x) * 0.08 * delta;
		velocity.y += (-velocity.y) * 0.08 * delta;
		velocity.z += (-velocity.z) * 0.08 * delta;

		// velocity.y -= 0.25 * delta;

		if (moveForward) velocity.z -= 0.12 * delta;
		if (moveBackward) velocity.z += 0.12 * delta;

		if (moveLeft) velocity.x -= 0.12 * delta;
		if (moveRight) velocity.x += 0.12 * delta;

		if (moveDown) velocity.y -= 0.12 * delta;
		if (moveUp) velocity.y += 0.12 * delta;

		// if ( isOnObject === true ) {

		// 	velocity.y = Math.max( 0, velocity.y );

		// }

		yawObject.translateX(velocity.x * speed);
		yawObject.translateY(velocity.y * speed);
		yawObject.translateZ(velocity.z * speed);

		sphere.position = yawObject.position;
        yawObject2.position.x  =  yawObject.position.x;
        yawObject2.position.z  =  yawObject.position.z;
		
		// if ( yawObject.position.y < 10 ) {

		// 	velocity.y = 0;
		// 	yawObject.position.y = 10;

		// 	canJump = true;

		// }

	};

	this.domElement.addEventListener('mouseup', onMouseUp, false);
	this.domElement.addEventListener('mousedown', onMouseDown, false);
	this.domElement.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('keydown', onKeyDown, false);
	window.addEventListener('keyup', onKeyUp, false);
};