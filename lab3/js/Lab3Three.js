// declare a bunch of variable we will need later
var camera, scene, renderer;
var cube, tetrahedron;

/**
 * Initialize Three.js including the scene that we are going to use and adding the camera to that scene
 * @param theCanvas The canvas that will be used for the rendering
 */
function initThree(theCanvas) {

    // init the WebGL renderer and append it to the canvas
    renderer = new THREE.WebGLRenderer( {canvas: theCanvas} );
    renderer.setClearColorHex( 0x000000, 1 ); //We want black were nothing is rendered in the canvas

    // create the scene. Scenes are used to group all different parts that are needed.
    scene = new THREE.Scene();

    // create the camera and add it to the scene.
    camera = new THREE.PerspectiveCamera( 45, theCanvas.width / theCanvas.height, 0.1, 100 );
    scene.add( camera );
}

/**
 * Create the geometries that will be use and add them to the scene
 */
function initGeometry() {
    //Create the materials that will be used by the different sides of our geometries
    var texture = new THREE.ImageUtils.loadTexture('images/wood_new_seam.png');
    //var texture = new THREE.ImageUtils.loadTexture('images/wood2.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2,2);
    var cube_material = new THREE.MeshPhongMaterial( { ambient: 0x808080, map: texture } );

    //Create the Cube with size 2
    var temp_cube = new THREE.CubeGeometry( 2, 2, 2 );

    cube = new THREE.Mesh( temp_cube, cube_material );

    // Set the position of the cube
    cube.position.set(-1.5, 0, -8);

    // We must add the cube to the scene for it to rendered.
    scene.add( cube );

    //Add your tetrahedron under this line
    //You can reuse materials from the cube just keep in mind that it only have 4 sides

    // Meh, its the same but using TetrahedronGeometry instead.
    var materials_tetra = [];
    materials_tetra[0] = new THREE.MeshPhongMaterial( { ambient: 0xff0000, color: 0xff0000 } );
    materials_tetra[1] = new THREE.MeshPhongMaterial( { ambient: 0x00ff00, color: 0x00ff00 } );
    materials_tetra[2] = new THREE.MeshPhongMaterial( { ambient: 0x0000ff, color: 0x0000ff } );
    materials_tetra[3] = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff } );

    var temp_tetra = new THREE.TetrahedronGeometry(1.73);

    temp_tetra.materials = materials_tetra;

    for (var i in temp_tetra.faces) {
        temp_tetra.faces[i].materialIndex = i;
    }

    tetrahedron = new THREE.Mesh(temp_tetra, new THREE.MeshFaceMaterial());
    tetrahedron.position.set(1.5, 1.0, -8.0);

    scene.add(tetrahedron);

    var light = new THREE.AmbientLight( 0x505050 );
    scene.add( light );

    var light_point_1 = new THREE.PointLight( 0xffffff, 1, 10);
    light_point_1.position.set( 3, 3, 0 );
    scene.add( light_point_1 );

    var light_point_2 = new THREE.PointLight( 0xffffff, 3, 10);
    light_point_2.position.set( -3, 3, 0 );
    scene.add( light_point_2 );

    var light_point_3 = new THREE.PointLight( 0xffffff, 1, 10);
    light_point_3.position.set( 3, -2, 0);
    scene.add( light_point_3 );

    var light_point_4 = new THREE.PointLight( 0xffffff, 1, 10);
    light_point_4.position.set( 1, -2, 0);
    scene.add( light_point_4 );
}

/**
 * This function takes care of all changes that are needed to animate our objects
 */
function animateThree() {

    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        rotationCube -= ((75 * elapsed) / 1000.0) * Math.PI / 180;
    }
    lastTime = timeNow;

    // Rotate the cube
    cube.rotation.x = rotationCube;
    cube.rotation.y = rotationCube/2;

    tetrahedron.rotation.x = rotationCube;
    tetrahedron.rotation.z = -rotationCube/2;
}

/**
 * Main loop function. Called periodacilly by the system
 */
function tickThree() {
    if (running == 1) { //Check if we are still running
        requestAnimationFrame(tickThree); //Tell browser to call us again next screen update
        animateThree();
        renderer.render( scene, camera );
    }
}

/**
 * Start our Three.js program
 */
function startThree() {
    // test if webgl is supported
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    //This part replaces the current canvas with a new one so that we start fresh
    var canvas = document.createElement('canvas');
    var oldCanvas = document.getElementById("glCanvas");
    canvas.id = "glCanvas";
    canvas.width = oldCanvas.width;
    canvas.height = oldCanvas.height;
    oldCanvas.parentNode.replaceChild(canvas, oldCanvas);

    //Setup Three.js
    initThree(canvas);

    //Setup our scene and the objects we will be using
    initGeometry();

    //Initialize some values that are being used
    rotationCube = 0;
    lastTime = 0;
    running = 1; //Make Three the running process

    tickThree(); //Lets start things
}
