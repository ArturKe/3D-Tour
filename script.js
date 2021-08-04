console.log('Hello')
let scene, renderer, cameras, camera, helper, axisVector, startVector, targetVector, distance = 0, angle = 0, group, box;

const joyLeft = new Joystick('body',{ left: 20, bottom: 20})
const joy = new Joystick('body',{ right: 20, bottom: 20})




// let forwardVector = new THREE.Vector3(0,0,1)


init();

function init(){
scene = new THREE.Scene();
scene.background = new THREE.Color(0x00aaff);
  
const width = window.innerWidth;
const height = window.innerHeight;
const aspect = width/height;
clock = new THREE.Clock();


//--------------------------------------------------------------Vectors
forwardVector = new THREE.Vector3(0,0,1)
axisVector = new THREE.Vector3(0,1,0)
startVector = new THREE.Vector3(0,0,0)
targetVector = new THREE.Vector3(0,0,0)
// let angle = Math.PI/2

// axisVector.set(0,1,0)
// forwardVector.applyAxisAngle(axisVector, 1)
// forwardVector.rotateOnAxis(axisVector, 1.5)
console.log(forwardVector)

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
geometry.translate( 0, 0.5, 0 );
const material = new THREE.MeshPhongMaterial({color: new THREE.Color('grey')});

for ( let i = 0; i < 500; i ++ ) {

        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = Math.random() * 400-200;
        mesh.position.y = 0;
        mesh.position.z = Math.random() * 400-200;
        mesh.scale.x = Math.random() * 10 + 2;
        mesh.scale.y = Math.random() * 2 + 0.1;
        mesh.scale.z = Math.random() * 5 + 3;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add( mesh );

}

box = new THREE.Mesh( geometry, material );
box.position.y = 2
group  = new THREE.Group()
group.add(box)
scene.add(group)



// floor--------------------------
const floorGeometry = new THREE.PlaneGeometry( 500, 500 );
const floorMaterial = new THREE.MeshStandardMaterial( {
    color: 0xeeeeee,
    roughness: 1.0,
    metalness: 0.0
} );
const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = - Math.PI / 2;
floor.receiveShadow = true;
scene.add( floor );
floor.position.y = -0.6;

//Grid
const grid = new THREE.GridHelper(500,100)
scene.add(grid)
// grid.position.y = -0.6

  
  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 5, 5);
  camera.rotation.x = -0.3
//   camera.lookAt(160, 0, 20)
  group.add(camera)
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 2);
  light.position.set( 0, 1, 10);
  light.rotation.y = 1;
  scene.add(light);
  
renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const controls = new THREE.OrbitControls( camera, renderer.domElement );
// controls.target.set(1,2,0);
// controls.update();

  window.addEventListener( 'resize', resize, false);
  
  update()
}



function update(){
    requestAnimationFrame( update );
      renderer.render( scene, camera );
    const dt = clock.getDelta();
    // camera.position.x += joy.get().x/5
    // camera.position.z += joy.get().y/5
    //distance += +joy.get().y

    // group.translateX += 0.05
     //group.rotation.x += 0.01

    
  objControll()
  //cameraControll()

    // forwardVector.multiplyScalar(2)

    // forwardVector.applyAxisAngle(axisVector, angle)
    // forwardVector *= 3 

    // targetVector.x = joy.get().x
    // targetVector.z = joy.get().y
 
    // let angleR = startVector.angleTo(targetVector)
    // axisVector.x += joy.get().x/2
    // axisVector.y += joy.get().y/2
    // camera.lookAt(axisVector)


   
    // camera.rotation.y += joy.get().x/100
   
    // if(joy.get().x > 0 ){
    // //     console.log(camera.position)
    // console.log(distance)
    // console.log(forwardVector)
    // }
  }

  function objControll(){
    group.position.x += Math.sin(group.rotation.y) * + joy.get().y/2;
    group.position.z += Math.cos(group.rotation.y) * + joy.get().y/2;

    group.position.x += Math.sin(group.rotation.y + Math.PI / 2) * +joyLeft.get().x/2;
    group.position.z += Math.cos(group.rotation.y + Math.PI / 2) * +joyLeft.get().x/2;

    group.rotation.y -= +joy.get().x/200;



    group.children[0].rotation.x = joy.get().y/3

    group.children[0].rotation.y = +joy.get().x/4*-1
    group.children[0].rotation.z = +joy.get().x/5*-1
    //console.log(group.children)


  }

  function cameraControll(){
    camera.position.x += Math.sin(camera.rotation.y) * +joy.get().y/2;
    camera.position.z += Math.cos(camera.rotation.y) * +joy.get().y/2;

    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * +joyLeft.get().x/2;
    camera.position.z += Math.cos(camera.rotation.y + Math.PI / 2) * +joyLeft.get().x/2;
    
    camera.rotation.y -= +joy.get().x/200;
    //camera.rotation.y -= +joyLeft.get().x/100;
    camera.position.y -= +joyLeft.get().y/5;

  }
  
  function resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }


