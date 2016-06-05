/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.lucy = ABSULIT.lucy || (function () {
    'use strict';
    var object = {};
    var pivot = new THREE.Object3D();
    var scale = .15 * .6;

    object.model = null;

    object.init = function (onComplete) {
        var loader = new THREE.OBJLoader();
        var textureLoader = new THREE.TextureLoader();
        var normalMap =  textureLoader.load('textures/lucy_normals.png');

            loader.load('models/lucy.obj', function (o) {
                object.model = o;


                o.scale.set(scale,scale,scale);
                o.position.y = -0.01;
                o.position.z = .5;

                o.rotation.x -= Math.PI / 2;
                o.rotation.z -= Math.PI;

                o.traverse(function(c) {
                    if ( c instanceof THREE.Mesh ) {

                        c.material = new THREE.MeshPhongMaterial({
                            normalMap: normalMap,
                            normalScale: new THREE.Vector2( 1, 1 )
                        });

                    }

                });


                scene.add(o);
                if(onComplete){
                    onComplete(o);
                }
            });


    };

    object.update = function () {

    };

    return object;

})();
