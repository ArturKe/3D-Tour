console.log('Hello')
let scene, renderer, cameras, camera, helper, axisVector, startVector, targetVector, distance = 0, angle = 0, group, box, ufoobject;
const assetPath = './assets/';

const joyLeft = new Joystick('body',{ left: 20, bottom: 20})
const joy = new Joystick('body',{ right: 20, bottom: 20})
const raycaster = new THREE.Raycaster();
raycaster.origin = new THREE.Vector3(5, 5, 0)
raycaster.direction = new THREE.Vector3(0, -1, 0)
raycaster.far = 5

//let a = new THREE.GLTFLoader()
init();


function init(){
  
  sceneInit()
  geometryInit()
  // cubesInit()
  cubesRoundInit()

  flightObject()

  
  treesLoader({fileName:'pine_tree_double_ver1.glb', count: 800, scale: 0.5, scaleDivider: 2, area: 150})
  treesLoader({fileName:'cow_edit_ver1.glb', count: 60, scale: 0.08})
  treesLoader({fileName:'farm_house_ver1.glb', count: 50, scale: 2.3, area: 200})


  // const controls = new THREE.OrbitControls( camera, renderer.domElement );
  // controls.target.set(1,2,0);
  // controls.update();

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', resize, false);
    
  update()
}

function ray(){
  const raycaster = new THREE.Raycaster();
}

function rayUpdate(){
  const intersects = raycaster.intersectObjects( scene.children );

	// for ( let i = 0; i < intersects.length; i ++ ) {

	// 	//intersects[ i ].object.material.color.set( 0xff0000 );
  //   console.log(intersects[ i ])

	// }

  
  console.log(intersects);
}


function flightObject(){
  //-----------------flight Cube ----------------------//
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshPhongMaterial({color: new THREE.Color('grey')});
  geometry.translate( 0, 0.5, 0 );

  box = new THREE.Mesh( geometry, material );
  box.position.y = 2
  group  = new THREE.Group()
  //group.add(box)
  scene.add(group)


  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 2.8, 5);
  camera.rotation.x = -0.35
  //   camera.lookAt(160, 0, 20)
  group.add(camera)

  //fileLoader('ufo_edit_fudailshajahan.glb', 0.6)  //Загрузка тарелки

  fileLoader('ufo_edit_fudailshajahan.glb', 0.6)
 
  setTimeout(()=>{ 
    console.log(ufoobject)
    console.log(scene.children)
  
  },3000)
  


}



function sceneInit() { //-----------------------------------------------------------------Scene Init -------------------------------//
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00aaff);
  scene.fog = new THREE.FogExp2(0x00aaff, 0.01);
    
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width/height;
  clock = new THREE.Clock();


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
  
}


function cubesInit(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  geometry.translate( 0, 0.5, 0 );
  const material = new THREE.MeshPhongMaterial({color: new THREE.Color('grey')});

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

function cubesRoundInit(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  geometry.translate( 0, 0.5, 0 );
  const material = new THREE.MeshPhongMaterial({color: new THREE.Color('grey')});

  for ( let i = 0; i < 500; i ++ ) {
    const mesh = new THREE.Mesh( geometry, material );

    let length = Math.random() * 150+110;
    let angle = Math.random() * (2*Math.PI)

    mesh.position.x = length * Math.sin(angle)
    mesh.position.y = 0;
    mesh.position.z =length * Math.cos(angle)


    mesh.scale.x = Math.random() * 5 + 2;
    mesh.scale.y = Math.random() * 3 + 0.5;
    mesh.scale.z = Math.random() * 3 + 1;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add( mesh );

  }

}

function geometryInit() {
 
  //--------------------------- Floor--------------------------//
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

  //----------------Grid
  const grid = new THREE.GridHelper(500,100)
  scene.add(grid)
  // grid.position.y = -0.6

}



async function fileLoader(fileName,objScale){
  let venus;
  const loader = new THREE.GLTFLoader();
  loader.setPath(assetPath);

  loader.load(fileName, function(object){
      object.scene.traverse(function(child){
          if (child.isMesh){  
            child.castShadow = true;
          //   child.receiveShadow = true;
          }
        })
      
  venus = object.scene;
  
  //----------------------------------------------------------Main Spot Light-------------------//
  const spotLight = new THREE.SpotLight( 0xffffff, 1 );
  spotLight.angle = Math.PI / 8;
  spotLight.penumbra = 0.5;
  spotLight.decay = 2;
  spotLight.rotation.x = Math.PI/2

  const targetObject = new THREE.Object3D();
  targetObject.position.y = -1;
  venus.add(targetObject);

  spotLight.target = targetObject;

  venus.add(spotLight)
  //----------------------------------------------------------CONE------------//
  const geometry = new THREE.ConeGeometry( 2, 5, 32 );
  // const material = new THREEx.VolumetricSpotLightMaterial();
  // material.uniforms.lightColor.value.set('white')
	// material.uniforms.spotPosition.value	= mesh.position

  const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  material.transparent = true
  material.opacity = 0.1
  const cone = new THREE.Mesh( geometry, material );
  cone.position.y = -2
  venus.add( cone );

  //--------------------------------------------------Point Light-----------------//

  // const pLight = new THREE.PointLight( 0xaa0000, 2, 20 );
  // pLight.position.set( 0, -1, 0 );
  // venus.add( pLight );
 //------------------------------------------------------------------------------//

  group.add(venus);
  venus.scale.set(objScale, objScale, objScale)
  venus.position.y = 2

  ufoobject = venus

  console.log( 'Venus ' + venus)
  console.log(venus)
  
  
  }, function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded')});
  

}



async function treesLoader(params){
  const defaultParams = {fileName:'', scale: 1 , scaleDivider: 1, count: 1, area: 100}
  params = {...defaultParams, ...params}

  let obj;
  const loader = new THREE.GLTFLoader();
  loader.setPath(assetPath);

  loader.load(params.fileName, function(object){
      object.scene.traverse(function(child){
          if (child.isMesh){  
            child.castShadow = true;
          //   child.receiveShadow = true;
          }
        })

        
        obj = object.scene;
        obj.scale.set(params.scale, params.scale, params.scale)
       
       
        for ( let i = 0; i < params.count; i ++ ) {
          const mesh = obj.clone();
      
          mesh.position.x = Math.random() * params.area-params.area/2;
          // mesh.position.y = 0;
          mesh.position.z = Math.random() * params.area-params.area/2;

          if (params.scaleDivider > 1){
            let itemScale =Math.random() * params.scale + params.scale/params.scaleDivider;
            mesh.scale.set(itemScale,itemScale,itemScale)
          }

          // mesh.scale.x = Math.random() * 10 + 2;
          // mesh.scale.y = Math.random() * 2 + 0.1;
          // mesh.scale.z = Math.random() * 5 + 3;

          mesh.rotation.y = Math.random() * 3;
          scene.add(mesh);
      
      
        }

  }, function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded')});
  

}


function cubeTextureInit() {
  const reflectionCube = new THREE.CubeTextureLoader()
					.setPath( './assets/textures/cube/' )
					.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
				reflectionCube.encoding = THREE.sRGBEncoding;

				// scene = new THREE.Scene();
				//scene.background = reflectionCube;
  
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

    //rayUpdate()
  }

  function objControll(){
    group.position.x += Math.sin(group.rotation.y) * + joy.get().y/2;
    group.position.z += Math.cos(group.rotation.y) * + joy.get().y/2;

    group.position.x += Math.sin(group.rotation.y + Math.PI / 2) * +joyLeft.get().x/2;
    group.position.z += Math.cos(group.rotation.y + Math.PI / 2) * +joyLeft.get().x/2;

    group.rotation.y -= +joy.get().x/200;



    group.children[1].rotation.x = joy.get().y/3  // Наклон вперед

    group.children[1].rotation.y = +joy.get().x/4*-1
    group.children[1].rotation.z = +joy.get().x/5*-1 + +joyLeft.get().x/5*-1 //Наклон в бок

    //group.children[0].rotation.z = +joyLeft.get().x/5*-1
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


