/**
 * A flashlight, use key F to turn off and on
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.flashlight = ABSULIT.flashlight || (function (document) {
    'use strict';
    var object = {},
        spotLight;

    function onKeyDownFlashLight(e) {
        switch (e.keyCode) {
            case 70: //F
                //toggle
                spotLight.intensity = !spotLight.intensity;
                break;
        }
    }

    object.init = function () {
        spotLight = new THREE.SpotLight(0xffffff);
        spotLight.intensity = 0;
        spotLight.castShadow = true;

        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;

        spotLight.shadowCameraNear = 500;
        spotLight.shadowCameraFar = 4000;
        spotLight.shadowCameraFov = 30;
        spotLight.shadowCameraVisible = true;

        spotLight.position.set(0, 0, 1);

        camera.add(spotLight);
        spotLight.target = camera;
        document.addEventListener('keydown', onKeyDownFlashLight, false);
    };

    object.update = function () {

    };




    return object;

})(document);
