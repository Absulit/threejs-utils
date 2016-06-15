var scene,
    camera,
    renderer,
    light,
    directionalLight,
    stereoEnabled = true,
    /* stereoFallbackEnabled has a bug */
    stereoFallbackEnabled = false,
    stereoFallback = false,
    stereoEffect,
    vrEffect,
    effectCache,
    noSleep;


var resizeViewport = function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    if(stereoEffect){
        stereoEffect.setSize(window.innerWidth, window.innerHeight);
    }else{
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

var toggleStereo = function(){
    stereoEnabled = !stereoEnabled;
    if(stereoEnabled){
        if(effectCache){
            stereoEffect = effectCache
        }else{
            stereoEffect = new THREE.StereoEffect(renderer);
            stereoEffect.eyeSeparation = 1;
            effectCache = effect;
        }
    }else{
        stereoEffect = null;
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

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1);
    camera.position.set(0, 2, -1);
    camera.lookAt(new THREE.Vector3(0, 1.6, 0));


    controls = new THREE.VRControls( camera );
    controls.standing = true;
    vrEffect = new THREE.VREffect( renderer );

    if(stereoEnabled){
        if ( WEBVR.isAvailable() === true ) {
            document.body.appendChild( WEBVR.getButton( vrEffect ) );
        }else if(stereoFallbackEnabled){
            console.info('Fallback to StereoEffect');
            stereoFallback = true;

            stereoEffect = new THREE.StereoEffect(renderer);
            stereoEffect.eyeSeparation = 1;

            noSleep = new NoSleep();
        }
    }


    var size = 10;
    var step = 1;

    var gridHelper = new THREE.GridHelper( size, step );
    scene.add( gridHelper );

    /*
        My code
    */

    renderer.setClearColor(0xFFFFFF);

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshLambertMaterial( {color: 0xff0000, wireframe:false} );
    var cubeScale = .1;

    var rows=10,columns=10,
        r=0,c=0;

    for(r=-rows/2; r<rows;r++){
        for(c=-columns/2; c<columns;c++){
            cube = new THREE.Mesh( geometry, material );
            cube.position.set(c,3,r);
            cube.scale.set(cubeScale,cubeScale,cubeScale);
            scene.add(cube);
        }
    }

    cubeScale = 100;
    cube = new THREE.Mesh( geometry, material );
    cube.scale.set(cubeScale,cubeScale,cubeScale);
    cube.position.z = 150;
    scene.add( cube );

    light = new THREE.HemisphereLight( 0xffffbb, 0x080820, .5 );

    scene.add( light );

    directionalLight = new THREE.DirectionalLight(0x666666, 1);
    directionalLight.position.set(20,20,0)
    directionalLight.castShadow = true;
    scene.add( directionalLight );

    ABSULIT.lucy.init();

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
        if(stereoFallbackEnabled){
            stereoEffect.render( scene, camera );
        }else{
            vrEffect.render( scene, camera );
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
