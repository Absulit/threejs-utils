/**
 * Based on code from
     http://threejs.org/examples/misc_controls_pointerlock.html
     http://webmaestro.fr/collisions-detection-three-js-raycasting/

 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.gamecontrols = ABSULIT.gamecontrols || (function (window, document) {
    'use strict';
    var object = {},
        self = this,
        cameraRef,
        raycaster,
        moveForward = false,
        moveBackward = false,
        moveLeft = false,
        moveRight = false,
        prevTime = performance.now(),
        velocity = new THREE.Vector3(),
        shiftKey,
        canJump,
        controls,
        rays = [
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(1, 0, 1),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(-1, 0, -1),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 0, 1)
        ];

    object.objects = [];
    object.camera = null;
    object.enabled = false;
    object.position;

    function onKeyDown(e) {
        shiftKey = e.shiftKey;
        switch (e.keyCode) {
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
        case 32: // space
            if (canJump === true) {
                velocity.y += 350;
            }
            canJump = false;
            break;
        }
    }

    function onKeyUp(e) {
        shiftKey = e.shiftKey;
        switch (e.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = false;
            break;
        case 37: // left
        case 65: // a
            moveLeft = false;
            break;
        case 40: // down
        case 83: // s
            moveBackward = false;
            break;
        case 39: // right
        case 68: // d
            moveRight = false;
            break;
        }
    }

    function onWindowResize() {
        cameraRef.aspect = window.innerWidth / window.innerHeight;
        cameraRef.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function pointerLockInit() {
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document,
            element,
            pointerlockchange,
            pointerlockerror;

        if (havePointerLock) {
            element = document.body;
            pointerlockchange = function (e) {
                if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                    object.enabled = true;
                    controls.enabled = true;
                } else {
                    controls.enabled = false;
                }
            };

            pointerlockerror = function (e) {
                console.warn('pointer lock error');
            };

            // Hook pointer lock state change events
            document.addEventListener('pointerlockchange', pointerlockchange, false);
            document.addEventListener('mozpointerlockchange', pointerlockchange, false);
            document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
            document.addEventListener('pointerlockerror', pointerlockerror, false);
            document.addEventListener('mozpointerlockerror', pointerlockerror, false);
            document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

            document.addEventListener('click', function (e) {
                // Ask the browser to lock the pointer
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                if (/Firefox/i.test(navigator.userAgent)) {
                    var fullscreenchange = function (e) {
                        if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                            document.removeEventListener('fullscreenchange', fullscreenchange);
                            document.removeEventListener('mozfullscreenchange', fullscreenchange);
                            element.requestPointerLock();
                        }
                    };
                    document.addEventListener('fullscreenchange', fullscreenchange, false);
                    document.addEventListener('mozfullscreenchange', fullscreenchange, false);
                    element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                    element.requestFullscreen();
                } else {
                    element.requestPointerLock();
                }

            }, false);

        } else {

            console.warn('Your browser doesn\'t seem to support Pointer Lock API');

        }
    }


    object.init = function () {
        cameraRef = camera;
        controls = new THREE.PointerLockControls(camera);
        //window.controls = controls;
        //object.camera = controls.getObject().children[0].children[0];
        object.camera = controls.getObject();
        scene.add(controls.getObject());
        //raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
        raycaster = new THREE.Raycaster();
        raycaster.near = 0;
        raycaster.far = 2;
        //window.raycaster = raycaster;

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);
        window.addEventListener('resize', onWindowResize, false);


    };

    object.setPosition = function (position) {
        controls.getObject().translateX(position.x);
        controls.getObject().translateY(position.y);
        controls.getObject().translateZ(position.z);
    };

    object.setRotation = function (rotation) {
        controls.getObject().rotateX(rotation.x);
        controls.getObject().rotateY(rotation.y);
        controls.getObject().rotateZ(rotation.z);
    };

    object.start = function () {
        pointerLockInit();
    };

    object.update = function () {
        if (object.enabled) {
            raycaster.ray.origin.copy(controls.getObject().position);
            raycaster.ray.origin.y -= 5;

            var intersections = raycaster.intersectObjects(object.objects),
                isOnObject = intersections.length > 0,
                time = performance.now(),
                delta = (time - prevTime) / 1000,
                collisions,
                i,
                // Maximum distance from the origin before we consider collision
                distance = 32,
                shiftKeyAmount = 0;

            if (shiftKey) {
                shiftKeyAmount = 20;
            }

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;

            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            if (moveForward) {
                velocity.z -= 400.0 * delta + shiftKeyAmount;
            }

            if (moveBackward) {
                velocity.z += 400.0 * delta + shiftKeyAmount;
            }

            if (moveLeft) {
                velocity.x -= 400.0 * delta + shiftKeyAmount;
            }

            if (moveRight) {
                velocity.x += 400.0 * delta + shiftKeyAmount;
            }

            if (isOnObject === true) {
                velocity.y = Math.max(0, velocity.y);
                canJump = true;
            }

            //console.clear();

            for (i = 0; i < rays.length; i += 1) {
                // We reset the raycaster to this direction
                raycaster.set(controls.getObject().position, rays[i]);
                raycaster.ray.origin.y -= 5;
                //raycaster.ray.origin.copy( controls.getObject().position );
                //raycaster.ray.direction.copy(rays[i]);

                // Test if we intersect with any obstacle mesh
                collisions = raycaster.intersectObjects(object.objects);

                // And disable that direction if we do
                if (collisions.length > 0 && collisions[0].distance <= distance) {
                    // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
                    if ((i === 0 || i === 1 || i === 7) && moveForward) {
                        velocity.z = 0;
                        //console.log("z");
                    } else if ((i === 3 || i === 4 || i === 5) && moveBackward) {
                        velocity.z = 0;
                        //console.log("-z");
                    }
                    if ((i === 1 || i === 2 || i === 3) && moveRight) {
                        velocity.x = 0;
                        //console.log("x");
                    } else if ((i === 5 || i === 6 || i === 7) && moveLeft) {
                        velocity.x = 0;
                        //console.log("-x");
                    }
                }
            }

            controls.getObject().translateX(velocity.x * delta);
            controls.getObject().translateY(velocity.y * delta);
            controls.getObject().translateZ(velocity.z * delta);

            if (controls.getObject().position.y < 10) {
                velocity.y = 0;
                controls.getObject().position.y = 10;
                canJump = true;
            }

            prevTime = time;

            object.position = controls.getObject().position;
            object.rotation = controls.getDirection(new THREE.Vector3());
        }
    };

    return object;

})(window, document);
