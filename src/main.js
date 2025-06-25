import { createMap } from './map.js';
import { createHero, handleHeroMove, flashHero, updateHeroMove } from './hero.js';
import { spawnSkill, updateSkills } from './skill.js';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// 添加摄像机
const camera = new BABYLON.ArcRotateCamera(
  "camera", 
  Math.PI / 4,         // alpha，正对Z轴
  Math.PI / 2.5,       // beta，接近俯视
  32,                  // radius，稍微拉近
  new BABYLON.Vector3(0, 0, 0), 
  scene
);
// 禁止一切交互，固定视角
camera.attachControl(canvas, false); // 不允许鼠标控制
camera.lowerBetaLimit = camera.beta;
camera.upperBetaLimit = camera.beta;
camera.lowerAlphaLimit = camera.alpha;
camera.upperAlphaLimit = camera.alpha;
camera.lowerRadiusLimit = camera.radius;
camera.upperRadiusLimit = camera.radius;
camera.panningSensibility = 0;
camera.wheelPrecision = 0;

createMap(scene);
const hero = createHero(scene);

// 鼠标点击移动
scene.onPointerDown = (evt) => handleHeroMove(scene, hero);

// 闪现（空格键）
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') flashHero(hero);
});

// 技能生成计时
let lastSpawn = 0;

engine.runRenderLoop(() => {
  updateHeroMove(hero, scene);
  updateSkills(scene, hero);
  // 每秒生成技能，后续可加速
  const now = performance.now();
  if (now - lastSpawn > 1000) {
    spawnSkill(scene, hero);
    lastSpawn = now;
  }
  scene.render();
});

window.addEventListener('resize', () => engine.resize()); 