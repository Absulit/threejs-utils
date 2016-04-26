var scene,
    camera,
    renderer,
    light,
    stereoEnabled = true,
    /* stereoFallbackEnabled has a bug */
    stereoFallbackEnabled = false,
    stereoFallback = false,
    effect,
    effectCache,
    noSleep;


var resizeViewport = function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    if(stereoEnabled){
        effect.setSize(window.innerWidth, window.innerHeight);
    }else{
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

var toggleStereo = function(){
    stereoEnabled = !stereoEnabled;
    if(stereoEnabled){
        if(effectCache){
            effect = effectCache
        }else{
            effect = new THREE.StereoEffect(renderer);
            effect.eyeSeparation = 1;
            effectCache = effect;
        }
    }else{
        effect = null;
    }
    resizeViewport();
}

function init() {
    if ( stereoEnabled && (WEBVR.isLatestAvailable() === false) && !stereoFallbackEnabled ) {
        document.body.appendChild( WEBVR.getMessage() );
    }


    renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);


    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1);
    camera.position.set(0, 0, -6);
    camera.lookAt(new THREE.Vector3(0, 0, 0));


    controls = new THREE.VRControls( camera );
    effect = new THREE.VREffect( renderer );

    if(stereoEnabled){
        if ( WEBVR.isAvailable() === true ) {
            document.body.appendChild( WEBVR.getButton( effect ) );
        }else if(stereoFallbackEnabled){
            console.info('Fallback to StereoEffect');
            stereoFallback = true;

            effect = new THREE.StereoEffect(renderer);
            effect.eyeSeparation = 1;

            noSleep = new NoSleep();
        }
    }

    /*
        My code
    */

    var geometry = new THREE.BoxGeometry( 2, 2, 2 );
    var material = new THREE.MeshLambertMaterial( {color: 0xff0000, wireframe:false} );
    cube = new THREE.Mesh( geometry, material );
    cube.position.z = 5;
    scene.add( cube );

    light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );

    scene.add( light );

    /*
        - My code ends
    */
    window.addEventListener('click',function(){
        noSleep.enable();
        fullscreen();
    });

    window.addEventListener( 'resize', resizeViewport, false );
    document.body.appendChild( renderer.domElement );

    resizeViewport();
}

function update() {
    requestAnimationFrame(update);

    /*
        My code
    */

    cube.rotation.x += .01;
    cube.rotation.y += .01;

    /*
        - My code ends
    */

    if(stereoEnabled){
        effect.render( scene, camera );
        if(!stereoFallbackEnabled){
            controls.update();
        }
    }else{
        renderer.render(scene, camera);
    }


}

function fullscreen() {
    console.log('---- fullscreen');
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  } else if (renderer.domElement.msRequestFullscreen) {
    window.msRequestFullscreen();
  } else if (renderer.domElement.mozRequestFullScreen) {
    document.body.mozRequestFullScreen();
  } else if (renderer.domElement.webkitRequestFullscreen) {
    document.body.webkitRequestFullscreen();
  }
}

init();
update();
