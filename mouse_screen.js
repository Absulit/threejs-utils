/**
 * ...
 * @author Sebastián Sanabria Díaz
 */
var ABSULIT = ABSULIT || {};
ABSULIT.mouse = ABSULIT.mouse || (function (window) {
    var object = {},
        mouseX = 0, mouseY = 0,
        windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2,
        camera,
        self = this;

    var onWindowResize = function () {
        console.log("onWindowResize");
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        self.camera.aspect = window.innerWidth / window.innerHeight;
        self.camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };


    var onDocumentMouseMove = function (e) {
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    };

    var onDocumentTouchStart = function (e) {
        if ( e.touches.length > 1 ) {
            e.preventDefault();
            mouseX = e.touches[ 0 ].pageX - windowHalfX;
            mouseY = e.touches[ 0 ].pageY - windowHalfY;
        }
    };

    var onDocumentTouchMove = function (e) {
        if ( e.touches.length == 1 ) {
            e.preventDefault();
            mouseX = e.touches[ 0 ].pageX - windowHalfX;
            mouseY = e.touches[ 0 ].pageY - windowHalfY;
        }
    };

    object.init = function (camera) {
        console.log("mouseScreenInit");
        self.camera = camera;
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', onDocumentTouchMove, false );
        window.addEventListener( 'resize', onWindowResize, false );
    };

    object.update = function () {
        self.camera.position.x += ( mouseX - self.camera.position.x ) * .05;
        self.camera.position.y += ( - mouseY + 200 - self.camera.position.y ) * .05;
    };

    return object;

})(window);


/*var myWorker;
if (!!window.Worker) {
    myWorker = new Worker("worker.js");
    myWorker.postMessage(["distance", [new THREE.Vector3(0,0,0), new THREE.Vector3(10,10,10) ] ] );

    myWorker.onmessage = function(e) {
      var result = e.data;
      console.log('%o, %o', result[0], result[1]);
    }

}*/

