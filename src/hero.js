let moveTween = null;

export function createHero(scene) {
  const hero = new BABYLON.TransformNode("hero", scene);
  hero.HP = 100;
  hero.target = null;
  hero.speed = 10;
  hero.moveVec = new BABYLON.Vector3(0,0,0);
  hero.mainMesh = null; // 用于碰撞检测

  BABYLON.SceneLoader.ImportMesh(
    null,
    "/static/models/",
    "yasuo.glb",
    scene,
    function (meshes) {
      meshes.forEach(m => m.parent = hero);
      hero.position.y = 1;
      hero.scaling = new BABYLON.Vector3(0.02,0.02,0.02);
      // 选第一个可见mesh作为主mesh
      hero.mainMesh = meshes.find(m => m instanceof BABYLON.Mesh);
    },
    null,
    function (scene, message, exception) {
      // 降级为圆柱体
      const cyl = BABYLON.MeshBuilder.CreateCylinder('hero_cylinder', {height:2, diameter:1}, scene);
      cyl.position.y = 1;
      cyl.parent = hero;
      hero.mainMesh = cyl;
      // 头部标记
      const head = BABYLON.MeshBuilder.CreateSphere('head', {diameter:0.7}, scene);
      head.position.y = 2;
      head.parent = hero;
      head.material = new BABYLON.StandardMaterial('hmat', scene);
      head.material.diffuseColor = BABYLON.Color3.Blue();
    }
  );
  return hero;
}

export function handleHeroMove(scene, hero) {
  const pick = scene.pick(scene.pointerX, scene.pointerY);
  if (pick.hit) {
    hero.target = pick.pickedPoint.clone();
    hero.target.y = 1; // 保持地面高度
  }
}

export function updateHeroMove(hero, scene) {
  if (!hero.target) return;
  const dir = hero.target.subtract(hero.position);
  const dist = dir.length();
  if (dist < 0.1) {
    hero.moveVec.set(0,0,0);
    return;
  }
  // 惯性滑动：插值移动
  const moveStep = Math.min(hero.speed * scene.getEngine().getDeltaTime()/1000, dist);
  hero.moveVec = dir.normalize().scale(moveStep);
  hero.position.addInPlace(hero.moveVec);
}

export function flashHero(hero) {
  if (!hero.target) return;
  // 朝目标方向闪现3单位
  const dir = hero.target.subtract(hero.position).normalize();
  hero.position.addInPlace(dir.scale(3));
} 