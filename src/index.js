import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Joystick } from './components/Joystick'
import { Scatter } from './components/scatter/Scatter';
import { ScatterLOD } from './components/scatter_lod/ScatterLOD';
import { Character } from './components/character/Character';


console.log('Hello')
let scene, renderer, reflectionCube, camera, helper, distance = 0, angle = 0, group, arrowHelper;
const assetPath = './assets/';
const sceneMeshes = []
const catchedObjects = []
let cowCount = 60

const joy = new Joystick('body',{ right: 20, bottom: 20})
const joyLeft = new Joystick('body',{ left: 20, bottom: 20})

const sc = new Scatter('cow_edit_ver1.glb', 1, 40)
const scl = new ScatterLOD('pine_tree_triple_no_tank_ver2.glb', 1, 2000, 250)

const ufoPlate = new Character()


// ---------------------------------------------- Raycaster
const raycaster = new THREE.Raycaster();

let rayOrigin = new THREE.Vector3(0, 1, 0)
let rayDirection = new THREE.Vector3(0, -1, 0)
raycaster.set(rayOrigin, rayDirection)
raycaster.far = 20


// //--------------------------------------------------- Audio
// const listener = new THREE.AudioListener();

// // create a global audio source
// const sound = new THREE.Audio( listener );

// // load a sound and set it as the Audio object's buffer
// const audioLoader = new THREE.AudioLoader();
// audioLoader.load( './assets/sounds/bubble-shot.ogg', function( buffer ) {
// 	sound.setBuffer( buffer );
// 	//sound.setLoop( true );
// 	sound.setVolume( 0.5 );
// 	//sound.play();
// });

init();

function init(){
  
    sceneInit()
    geometryInit()

    //rayInit()  //-ArrowInit

    cubesInit()
    //cubesRoundInit()

    // Cows
    sc.registerScene(scene)
    sc.generate()

    // Trees
    scl.registerScene(scene)
    // scl.generateSimple()
    scl.generateDimple()

    // Ufo Plate
    ufoPlate.registerScene(scene)
    ufoPlate.init()
    ufoPlate.registerControllers(joyLeft,joy)


    //----------------------------------------------------------------//
    const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color('red'),
        envMap: reflectionCube
    });

    objLoader('cow_edit_ver1.glb', 0.5, 5, mat)
    //-------------------------------------------------------------//

    //instLoader('cow_edit_ver1.glb', 1, 50, 200)
    //instLoader('pine_tree_triple_no_tank_ver2.glb', 2, 1000, 300)

    let g =[]
    g = posGen(30)
    console.log(g)

    update()  
      
}

//-----------------------------------------------------------------Scene Init -------------------------------//
function sceneInit() { 

    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x00aaff);
    //scene.fog = new THREE.FogExp2(0x00aaff, 0.01);
      
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width/height;
    //clock = new THREE.Clock();

    //----------------------- Lights -----------------------//
    
    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(ambient);
  
    // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.7 );
      // 			hemiLight.color.setHSL( 0.6, 1, 0.6 );
      // 			hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      // 			hemiLight.position.set( 0, 50, 0 );
      // 			scene.add( hemiLight );
  
    const light = new THREE.DirectionalLight(0xFFFFFF, 2);
    light.position.set( 0, 1, 10);
    light.rotation.y = 1;
    scene.add(light);
  
    cubeTextureInit()

    // renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    // camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(3,2,0);

    // controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set(1,2,0);
    controls.update();

    window.addEventListener( 'resize', resize, false);
    
  
}

function cubeTextureInit() {
    reflectionCube = new THREE.CubeTextureLoader()
                      .setPath( './assets/textures/cube/' )
                      .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
                  reflectionCube.encoding = THREE.sRGBEncoding;
  
                  // scene = new THREE.Scene();
                  scene.background = reflectionCube;
    
}

function update(){
    requestAnimationFrame( update );
    renderer.render( scene, camera );
    //const dt = clock.getDelta();
    //objControll()
    ufoPlate.updateCharacter();
}

    
function resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//----------------------------------------------------------- Geometry ------------------------------------------------------------------//

function geometryInit() {
 
    //--------------------------- Floor --------------------------//
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
  
    //---------------- Grid -------------------//
    const grid = new THREE.GridHelper(500,100)
    scene.add(grid)
    grid.position.y = -0.6
  
}
  
   
function cubesInit(){

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    geometry.translate( 0, 0.5, 0 );

    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color('grey'),
        envMap: reflectionCube
    });
  
    for ( let i = 0; i < 500; i ++ ) {
      const mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = Math.random() * 400-200;
      mesh.position.y = 0;
      mesh.position.z = Math.random() * 400-200;
      mesh.scale.x = Math.random() * 4 + 2;
      mesh.scale.y = Math.random() * 1.5 + 0.1;
      mesh.scale.z = Math.random() * 3 + 1;
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      scene.add( mesh );
  
    }
  
}


//----------------------------------------- obj Generators --------------------------------------------------------------------//

function objLoader(link,scale,count=1,material){

    const positions = new Array()
    for (let i = 0; i < count; i++) {
        positions.push({
            x: Math.random() * 10 - 5,
            y: 0,
            z: Math.random() * 10 - 5
        })
    }

    let obj;
    const loader = new GLTFLoader();

    loader.setPath(assetPath);
    loader.load(link, function(object){
        object.scene.traverse(function(child){
            if (child.isMesh){  
                child.castShadow = true;
                //child.receiveShadow = true;
                if(material){
                    child.material =material
                }
                
            }
          })
        
        obj = object.scene;

        positions.forEach((item)=>{
            const mesh = obj.clone();
            mesh.position.copy(item)
            mesh.scale.set(scale, scale, scale)
            scene.add(mesh);
            
        })

        // obj.position.y = -0.6
        // scene.add(obj);
        // obj.scale.set(scale, scale, scale)

    });
}


function posGen (count) {

    const positions =[];
    
    const raycaster = new THREE.Raycaster();

    let rayOrigin = new THREE.Vector3(0, 5, 0)
    let rayDirection = new THREE.Vector3(0, -1, 0)
    raycaster.set(rayOrigin, rayDirection)
    raycaster.far = 20

    for( let i = 0; i < count; i ++ ){

        const itemPosition = new THREE.Vector3();

        itemPosition.x = Math.random() * 20+1;
        itemPosition.y = Math.random() * 20+1;
        itemPosition.z = Math.random() * 20+1;

        positions.push(itemPosition)
    }

    // console.log(positions)


    // const n = new THREE.Vector3();
    // const origin = new THREE.Vector3();
    // n.copy(group.children[1].rotation);

   
    //origin.set(group.position.x, 1.9, group.position.z)

    //arrowHelper.setDirection(n);
    //arrowHelper.position.copy(origin)
    //arrowHelper.position.set(group.position)
    // 
    // raycaster.set(origin, rayDirection)

    return positions;

}


//---------------------------------------------------------------Character------------------------------------------//


function objControll(area = 200){

    // if(group.position.x >== area && (group.position.x >== area)){} // Ограничение движения в одной области
    group.position.x += Math.sin(group.rotation.y) * + joy.get().y/4; // Движение вперёд
    group.position.z += Math.cos(group.rotation.y) * + joy.get().y/4;

    group.position.x += Math.sin(group.rotation.y + Math.PI / 2) * +joyLeft.get().x/4;
    group.position.z += Math.cos(group.rotation.y + Math.PI / 2) * +joyLeft.get().x/4;

    group.rotation.y -= +joy.get().x/100; // Разворот

    group.children[0].rotation.x = joy.get().y/3  // Наклон вперед

    group.children[0].rotation.y = +joy.get().x/4*-1
    group.children[0].rotation.z = +joy.get().x/5*-1 + +joyLeft.get().x/5*-1 //Наклон в бок

    //group.children[0].rotation.z = +joyLeft.get().x/5*-1
    //console.log(group.children)

    
    // -------------------------------------- Arrow --------//
    const n = new THREE.Vector3();
    const origin = new THREE.Vector3();
    n.copy(group.children[0].rotation);

   
    origin.set(group.position.x, 1.9, group.position.z)

    //arrowHelper.setDirection(n);
    //arrowHelper.position.copy(origin)
    //arrowHelper.position.set(group.position)
    raycaster.set(origin, rayDirection)


}
