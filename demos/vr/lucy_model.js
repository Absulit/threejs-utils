/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.lucy = ABSULIT.lucy || (function () {
    'use strict';
    var object = {};
    var pivot = new THREE.Object3D();
    var scale = .3;

    object.model = null;

    object.init = function (onComplete) {
        var mtlloader = new THREE.MTLLoader();
        var loader = new THREE.OBJLoader();
        mtlloader.load( 'lucy_10000.obj.mtl', function( materials ) {
            materials.preload();
            //loader.setMaterials(materials);
            loader.load('lucy_10000.obj', function (o) {
                object.model = o;

                o.scale.set(scale,scale,scale);
                o.position.y -= 2;
                o.position.z = 5;
                o.rotation.x -= Math.PI / 2;
                o.rotation.z -= Math.PI;

                scene.add(o);
                if(onComplete){
                    onComplete(o);
                }
            });

        });

    };

    object.update = function () {

    };

    return object;

})();
