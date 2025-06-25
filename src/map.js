const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// 添加摄像机
const camera = new BABYLON.ArcRotateCamera(
  "camera", 
  Math.PI / 2, Math.PI / 2.5, // 角度
  25,                          // 距离
  new BABYLON.Vector3(0, 0, 0), // 目标点
  scene
);
camera.attachControl(canvas, true); // 允许鼠标拖拽旋转

export function createMap(scene) {
  // 绿色地面
  const ground = BABYLON.MeshBuilder.CreateGround('ground', {width:30, height:30}, scene);
  const mat = new BABYLON.StandardMaterial('mat', scene);
  mat.diffuseColor = BABYLON.Color3.FromHexString('#3fa34d');
  ground.material = mat;
  // 可添加河道/塔基贴图等
} 