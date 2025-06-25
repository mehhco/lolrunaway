let skills = [];

function randomEdgePos() {
  // 随机从四边发射
  const edge = Math.floor(Math.random()*4);
  const val = (Math.random()-0.5)*28;
  if (edge===0) return new BABYLON.Vector3(-15,1,val); // 左
  if (edge===1) return new BABYLON.Vector3(15,1,val); // 右
  if (edge===2) return new BABYLON.Vector3(val,1,-15); // 上
  return new BABYLON.Vector3(val,1,15); // 下
}

export function spawnSkill(scene, hero) {
  // 随机类型
  const types = ['Q', 'W', 'R'];
  const type = types[Math.floor(Math.random()*types.length)];
  let mesh, speed, damage, dir;
  if (type === 'Q') {
    mesh = BABYLON.MeshBuilder.CreateBox('q', {height:0.2, width:0.2, depth:4}, scene);
    mesh.material = new BABYLON.StandardMaterial('mat', scene);
    mesh.material.diffuseColor = BABYLON.Color3.Red();
    speed = 6; damage = 10;
    dir = hero.position.subtract(mesh.position).normalize();
  } else if (type === 'W') {
    mesh = BABYLON.MeshBuilder.CreateTorus('w', {thickness:0.1, diameter:3}, scene);
    mesh.material = new BABYLON.StandardMaterial('mat', scene);
    mesh.material.diffuseColor = BABYLON.Color3.Yellow();
    speed = 0; damage = 20;
    dir = new BABYLON.Vector3(0,0,0);
  } else {
    mesh = BABYLON.MeshBuilder.CreateSphere('r', {diameter:1}, scene);
    mesh.material = new BABYLON.StandardMaterial('mat', scene);
    mesh.material.diffuseColor = BABYLON.Color3.Blue();
    speed = 12; damage = 30;
    dir = hero.position.subtract(mesh.position).normalize();
  }
  mesh.position = randomEdgePos();
  mesh.direction = dir;
  mesh.speed = speed;
  mesh.damage = damage;
  mesh.type = type;
  mesh.birth = performance.now();
  skills.push(mesh);
}

export function updateSkills(scene, hero) {
  for (let i = skills.length-1; i >= 0; i--) {
    const s = skills[i];
    if (s.speed > 0) {
      s.position.addInPlace(s.direction.scale(s.speed * scene.getEngine().getDeltaTime()/1000));
    }
    // W型圆环扩散
    if (s.type==='W') {
      const age = (performance.now()-s.birth)/1000;
      s.scaling.x = s.scaling.z = 1+age*1.5;
      if (age>1.2) { // 1.2秒后消失
        s.dispose();
        skills.splice(i,1);
        continue;
      }
    }
    // 碰撞检测
    if (hero.mainMesh && s.intersectsMesh(hero.mainMesh, false)) {
      hero.HP -= s.damage;
      s.dispose();
      skills.splice(i, 1);
      // 受击反馈（可加动画/音效）
      continue;
    }
    // 超出边界销毁
    if (Math.abs(s.position.x) > 20 || Math.abs(s.position.z) > 20) {
      s.dispose();
      skills.splice(i, 1);
    }
  }
} 