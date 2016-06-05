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
        var mtlloader = new THREE.MTLLoader();
        var loader = new THREE.OBJLoader();
        var textureLoader = new THREE.TextureLoader();
        //mtlloader.load( 'models/lucy_10000.obj.mtl', function( materials ) {
            //materials.preload();
            //loader.setMaterials(materials);
            loader.load('models/lucy.obj', function (o) {
                object.model = o;

                o.scale.set(scale,scale,scale);
                o.position.y = -0.01;
                o.position.z = .5;

                o.rotation.x -= Math.PI / 2;
                o.rotation.z -= Math.PI;

                var map =  textureLoader.load('textures/lucy_normals.png');
                //bumpMap.bumpScale = 0.001;
                //o.children[0].material = new THREE.MeshLambertMaterial();
                //o.children[0].material.normalMap = map;

                o.children[0].material.displacementMap = map;
                o.children[0].material.displacementScale = 0.01
                //o.children[0].material.displacementBias = - 0.428408;


                o.children[0].material.normalScale = new THREE.Vector2( 0.8, 0.8 );

                scene.add(o);
                if(onComplete){
                    onComplete(o);
                }
            });

        //});

    };

    object.update = function () {

    };

    return object;

})();
