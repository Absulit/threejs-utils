/**
 *
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document, CustomEvent */

var ABSULIT = ABSULIT || {};
ABSULIT.pointer = ABSULIT.pointer || (function () {
    'use strict';
    var object = {},
        raycaster,
        intersected,
        lineMaterial = new THREE.LineBasicMaterial({color: 0x00FF00}),
        geometry = new THREE.Geometry();

    object.objects = [];
    object.IN = 'in';
    object.OUT = 'out';

    geometry.vertices.push(new THREE.Vector3(0, 6, 0));
    geometry.vertices.push(new THREE.Vector3(0, 6, -700));

    object.line = new THREE.Line(geometry, lineMaterial);
    object.line.visible = false;


    object.init = function () {
        raycaster = new THREE.Raycaster();
        raycaster.near = 10;
        raycaster.far = 100;
        scene.add(object.line);
    };

    object.update = function (position, rotation) {
        raycaster.set(position, rotation);
        object.line.geometry.vertices[0] = position;
        object.line.geometry.vertices[1] = new THREE.Vector3(position.x + (rotation.x * 100), position.y + (rotation.y * 100), position.z + (rotation.z * 100));
        object.line.geometry.verticesNeedUpdate = true;

        var collisions = raycaster.intersectObjects(object.objects);

        if (collisions.length > 0) {
            if (intersected !== collisions[0].object) {

                if (intersected) {
                    /*intersected.material.emissive.setHex( intersected.originalHex );*/
                }
                intersected = collisions[0].object;
                /*intersected.originalHex = intersected.material.emissive.getHex();
                intersected.material.emissive.setHex( 0xff0000 );*/
                intersected.dispatchEvent(new CustomEvent(object.IN, { 'detail': intersected }));
            }

        } else {

            if (intersected) {
                /*intersected.material.emissive.setHex( intersected.originalHex );*/
                intersected.dispatchEvent(new CustomEvent(object.OUT, {'detail': intersected}));
                intersected = null;
            }
        }

    };

    return object;

})();
