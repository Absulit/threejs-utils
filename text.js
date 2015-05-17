/**
 * Requires the fonts provided y Threejs
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.text = ABSULIT.text || (function () {
    'use strict';
    var object = {},
        SPACE = 1,
        cachedObjects = {},
        textOptions = {

            size: 3,
            height: 0.1,
            curveSegments: 1,

            font: "droid sans", /* helvetiker, optimer, gentilis, droid sans, droid serif */
            weight: "normal", /* normal bold */
            style: "normal",/* normal italic */

            bevelThickness: 1,
            bevelSize: 0.1,
            bevelEnabled: true,

            material: 1,
            extrudeMaterial: 1

        },
        material;

    object.model = null;
    object.cache = true;

    material = new THREE.MeshFaceMaterial([
        new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.FlatShading, transparent: true }), // front
        new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.SmoothShading, transparent: true }) // side
    ]);

    object.init = function (scene, stringArray, position) {
        var key,
            cachedObject,
            i,
            string,
            textGeo,
            model,
            mergedModels;

        if (object.cache) {
            key = stringArray.join('');
            cachedObject = cachedObjects[key];
        }


        if (object.model) {
            scene.remove(object.model);
        }

        if (object.cache && cachedObject) {
            object.model = cachedObject;
        } else {
            mergedModels = new THREE.Object3D();

            for (i = stringArray.length - 1; i >= 0; i--) {
                string = stringArray[i];
                textGeo = new THREE.TextGeometry(string, textOptions);
                model = new THREE.Mesh(textGeo, material);
                model.position.y = (i * textOptions.size) + (i * SPACE);
                mergedModels.add(model);
            }
            object.model = mergedModels;

            if (object.cache) {
                cachedObjects[key] = object.model;
            }
        }
        scene.add(object.model);

    };

    object.update = function () {
        //TWEEN.update();
    };

    return object;

})();

