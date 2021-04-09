
//                                 <babylon model="../models/Dude/Dude.babylon"> </babylon>

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
// Add your code here matching the playground format
const createScene =  () => {
const scene = new BABYLON.Scene(engine);

/**** Set camera and light *****/
const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

const ground = buildGround();

const detached_house = buildHouse(1);
detached_house.rotation.y = -Math.PI / 16;
detached_house.position.x = -6.8;
detached_house.position.z = 2.5;

const semi_house = buildHouse(2);
semi_house .rotation.y = -Math.PI / 16;
semi_house.position.x = -4.5;
semi_house.position.z = 3;

const places = []; //each entry is an array [house type, rotation, x, z]
places.push([1, -Math.PI / 16, -6.8, 2.5 ]);
places.push([2, -Math.PI / 16, -4.5, 3 ]);
places.push([2, -Math.PI / 16, -1.5, 4 ]);
places.push([2, -Math.PI / 3, 1.5, 6 ]);
places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
places.push([1, 5 * Math.PI / 4, 0, -1 ]);
places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
places.push([2, Math.PI / 1.9, 4.75, -1 ]);
places.push([1, Math.PI / 1.95, 4.5, -3 ]);
places.push([2, Math.PI / 1.9, 4.75, -5 ]);
places.push([1, Math.PI / 1.9, 4.75, -7 ]);
places.push([2, -Math.PI / 3, 5.25, 2 ]);
places.push([1, -Math.PI / 3, 6, 4 ]);

//Create instances from the first two that were built 
const houses = [];
for (let i = 0; i < places.length; i++) {
if (places[i][0] === 1) {
houses[i] = detached_house.createInstance("house" + i);
}
else {
houses[i] = semi_house.createInstance("house" + i);
}
houses[i].rotation.y = places[i][1];
houses[i].position.x = places[i][2];
houses[i].position.z = places[i][3];
};
BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
const car = scene.getMeshByName("car");
car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2);
car.position.y = 0.16;
car.position.x = -3;
car.position.z = 8;

const animCar = new BABYLON.Animation("carAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

const carKeys = []; 

carKeys.push({
frame: 0,
value: 8
});

carKeys.push({
frame: 150,
value: -7
});

carKeys.push({
frame: 200,
value: -7
});

animCar.setKeys(carKeys);

car.animations = [];
car.animations.push(animCar);

scene.beginAnimation(car, 0, 200, true);

//wheel animation
const wheelRB = scene.getMeshByName("wheelRB");
const wheelRF = scene.getMeshByName("wheelRF");
const wheelLB = scene.getMeshByName("wheelLB");
const wheelLF = scene.getMeshByName("wheelLF");

scene.beginAnimation(wheelRB, 0, 30, true);
scene.beginAnimation(wheelRF, 0, 30, true);
scene.beginAnimation(wheelLB, 0, 30, true);
scene.beginAnimation(wheelLF, 0, 30, true);
});
const walk = function (turn, dist) {
this.turn = turn;
this.dist = dist;
}

const track = [];
track.push(new walk(180, 2.5));
track.push(new walk(0, 5));

// Dude
BABYLON.SceneLoader.ImportMeshAsync("him", "/scenes/Dude/", "Dude.babylon", scene).then((result) => {
var dude = result.meshes[0];
dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);


dude.position = new BABYLON.Vector3(1.5, 0, -6.9);
dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-90), BABYLON.Space.LOCAL);
const startRotation = dude.rotationQuaternion.clone();    

scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

let distance = 0;
let step = 0.015;
let p = 0;

scene.onBeforeRenderObservable.add(() => {
if (carReady) {
if (!dude.getChildren()[1].intersectsMesh(hitBox) && scene.getMeshByName("car").intersectsMesh(hitBox)) {
    return;
}

}
dude.movePOV(0, 0, step);
distance += step;

if (distance > track[p].dist) {
    
dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
p +=1;
p %= track.length; 
if (p === 0) {
    distance = 0;
    dude.position = new BABYLON.Vector3(1.5, 0, -6.9);
    dude.rotationQuaternion = startRotation.clone();
}
}

})
});




return scene;
}

/******Build Functions***********/
const buildGround = () => {
//color
const groundMat = new BABYLON.StandardMaterial("groundMat");
groundMat.diffuseTexture = new BABYLON.Texture("images/grass.jpg");
groundMat.diffuseColor = new BABYLON.Color3(0, 1, 1);

const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:15, height:16});
ground.material = groundMat;
}





const buildHouse = (width) => {
const box = buildBox(width);
const roof = buildRoof(width);

return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
}

const buildBox = (width) => {
//texture
const boxMat = new BABYLON.StandardMaterial("boxMat");
if (width == 2) {
boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/semihouse.png") 
}
else {
boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/cubehouse.png");   
}

//options parameter to set different images on each side
const faceUV = [];
if (width == 2) {
faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side
}
else {
faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
}
// top 4 and bottom 5 not seen so not set

/**** World Objects *****/
const box = BABYLON.MeshBuilder.CreateBox("box", {width: width, faceUV: faceUV, wrap: true});
box.material = boxMat;
box.position.y = 0.5;

return box;
}

const buildRoof = (width) => {
//texture
const roofMat = new BABYLON.StandardMaterial("roofMat");
roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg");

const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
roof.material = roofMat;
roof.scaling.x = 0.75;
roof.scaling.y = width;
roof.rotation.z = Math.PI / 2;
roof.position.y = 1.22;

return roof;
}        

const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});
