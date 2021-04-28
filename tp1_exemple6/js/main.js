let canvas;
let engine;
let scene;
// vars for handling inputs
let inputStates = {};

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();

    // modify some default settings (i.e pointer events to prevent cursor to go 
    // out of the game window)
    modifySettings();

    let tank = scene.getMeshByName("heroTank");

    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); // remind you something ?

        tank.move();
        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene);
    let freeCamera = createFreeCamera(scene);

    let tank = createTank(scene);
    let poto = createpoto(scene)
    let filet = createFilet()
    let poto2 = createpoto2(scene)
    let filet2 = createFilet2()

    // second parameter is the target to follow
    let followCamera = createFollowCamera(scene, tank);
    scene.activeCamera = followCamera;

    createLights(scene);
 
   return scene;
}

function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene); 

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/sadio.jpeg");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
    }
    return ground;
}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0.5), scene);
    let light1 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(1, 1, 0), scene);
    let light2 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(0, 0, 3), scene);
   let light3 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(3, 0, 650), scene);
   let light4 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(2, 0, 5), scene);
}

function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 10), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true; 
    // avoid flying with the camera
    camera.applyGravity = true;

    // Add extra keys for camera movements
    // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
    camera.keysUp.push('z'.charCodeAt(0));
    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysLeft.push('q'.charCodeAt(0));
    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysUp.push('Z'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('Q'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));

    return camera;
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("tankFollowCamera", target.position, scene, target);

    camera.radius = 300; // how far from the object to follow
	camera.heightOffset = 40; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 6; // speed limit

    return camera;
}

let zMovement = 5;
function createTank(scene) {
   let tank = new BABYLON.MeshBuilder.CreateSphere("heroTank", {diameter: 10, segments: 13}, scene);  
    let tankMaterial = new BABYLON.StandardMaterial("tankMaterial", scene);
    tankMaterial.diffuseTexture = new BABYLON.Texture("images/ball.jpg", scene);
   tankMaterial.diffuseColor = new BABYLON.Color3.White;
    tank.material = tankMaterial;
    tank.position.y = 5;
    tank.speed = 1;
    tank.frontVector = new BABYLON.Vector3(0, 0, 1);
    tank.move = () => {
 
        let yMovement = 0;
        if (tank.position.y > 2) {
            zMovement = 0;
            yMovement = -2;
        } 
        //tank.moveWithCollisions(new BABYLON.Vector3(0, yMovement, zMovement));

        
        if(inputStates.up) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*tank.speed));
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, tank.speed, tank.speed));
            tankMaterial.diffuseTexture.uOffset += -0.02;
        }    
        if(inputStates.down) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*tank.speed));
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, -tank.speed, -tank.speed));
            tankMaterial.diffuseTexture.uOffset += -0.02;

        }  
        if(inputStates.left) {
            //tank.moveWithCollisions(new BABYLON.Vector3(-1*tank.speed, 0, 0));
            tank.rotation.y -= 0.02;

            tank.frontVector = new BABYLON.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
        }    
        if(inputStates.right) {
            //tank.moveWithCollisions(new BABYLON.Vector3(1*tank.speed, 0, 0));
            tank.rotation.y += 0.02;
            tank.frontVector = new BABYLON.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
        }
    }

    return tank;
}

const createpoto = (scene) => {
    
    const myPoints = [
        new BABYLON.Vector3(-40, 40, 0),
        new BABYLON.Vector3(-40, -20, 0),
        new BABYLON.Vector3(40, -20, 0),
        new BABYLON.Vector3(40, 40, 0),
        
    ]

    myPoints.push(myPoints[0]);
    
    const lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints},scene);

    lines.position.y = 6,
    lines.position.z = 600;
    
   
    return scene;

};
const createFilet = () => {

    const myPoints = [
        new BABYLON.Vector3(-40, 40, 0.01),
       new BABYLON.Vector3(-40, -20, 0.01),
       new BABYLON.Vector3(40, -20, 0.01),
       new BABYLON.Vector3(40, 40, 0.01),
       
   ]

   myPoints.push(myPoints[0]);
   
   const box = BABYLON.MeshBuilder.CreateBox("box", {height: 78, width: 78, depth: 0.001});
   
 
   let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
   boxMaterial.diffuseTexture = new BABYLON.Texture("images/fillet.jpeg", scene);
  boxMaterial.diffuseColor = new BABYLON.Color3.Blue;
  box.material = boxMaterial;
  box.position.y = 6,
  box.position.z = 640;
  
   return scene;

};

const createpoto2 = (scene) => {
    
    const myPoints = [
        new BABYLON.Vector3(-40, 40, 0),
        new BABYLON.Vector3(-40, -20, 0),
        new BABYLON.Vector3(40, -20, 0),
        new BABYLON.Vector3(40, 40, 0),
        
    ]

    myPoints.push(myPoints[0]);
    
    const lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints},scene);

    lines.position.y = 6,
    lines.position.z = -500;
    
   
    return scene;

};
const createFilet2 = () => {

    const myPoints = [
        new BABYLON.Vector3(-40, 40, 0.01),
       new BABYLON.Vector3(-40, -20, 0.01),
       new BABYLON.Vector3(40, -20, 0.01),
       new BABYLON.Vector3(40, 40, 0.01),
       
   ]

   myPoints.push(myPoints[0]);
   
   const box = BABYLON.MeshBuilder.CreateBox("box", {height: 78, width: 78, depth: 0.001});
   
 
   let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
   boxMaterial.diffuseTexture = new BABYLON.Texture("images/fillet.jpeg", scene);
  boxMaterial.diffuseColor = new BABYLON.Color3.White;
  box.material = boxMaterial;
  box.position.y = 6,
  box.position.z = -540;
  
   return scene;

};

window.addEventListener("resize", () => {
    engine.resize()
});

function modifySettings() {
    // as soon as we click on the game window, the mouse pointer is "locked"
    // you will have to press ESC to unlock it
    scene.onPointerDown = () => {
        if(!scene.alreadyLocked) {
            console.log("requesting pointer lock");
            canvas.requestPointerLock();
        } else {
            console.log("Pointer already locked");
        }
    }

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if(element) {
            // lets create a custom attribute
            scene.alreadyLocked = true;
        } else {
            scene.alreadyLocked = false;
        }
    })

    // key listeners for the tank
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;
    
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = true;
        }  else if (event.key === " ") {
           inputStates.space = true;
        }
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = false;
        }  else if (event.key === " ") {
           inputStates.space = false;
        }
    }, false);
}

