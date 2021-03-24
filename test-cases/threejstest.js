export function renderBasis(canvas, THREE, isAndroid, onPoisUpdate) {
  var camera, scene, renderer;
  var count = 0;

  // 保存几何体
  var meshes = new Array()
  // 保存用来在屏幕上绘制 view 组件的数据
  var pois = new Array()
  init();
  animate();

  function init() {
    // fov:60 影响物体大小
    camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 5000);
    camera.position.z = 5
    camera.position.y = 0
    // camera.rotation.x = 10;
    camera.rotation.z = 0;
    scene = new THREE.Scene();
    // scene.background = null;

    // https://stackoverflow.com/questions/41086806/draw-3d-object-axes-threejs
    // https://www.cnblogs.com/baby123/p/12191637.html
    // threejs中采用的是右手坐标系, 红线是X轴，绿线是Y轴（向上），蓝线是Z轴
    // The X axis is red. The Y axis is green. The Z axis is blue.
    var axes = new THREE.AxisHelper(50);
    // axes.position.y = 5;
    // scene.add(axes); // 全局坐标系

    var cube0 = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), new THREE.MeshNormalMaterial())
    cube0.position.set(1, 0, 0)
    // cube0.add(new THREE.AxesHelper(5))
    scene.add(cube0)
    meshes.push(cube0)

    var cube1 = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, 0.5), new THREE.MeshNormalMaterial())
    cube1.position.set(0, 1, 0)
    // cube1.add(new THREE.AxesHelper(5))
    scene.add(cube1)
    meshes.push(cube1)

    var cube2 = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, 0.5), new THREE.MeshNormalMaterial())
    cube2.position.set(-3, 0, -8)
    // cube2.add(new THREE.AxesHelper(5))
    scene.add(cube2)
    meshes.push(cube2)

    pois = new Array() // required
    for (let i = 0; i < meshes.length; i++) {
      pois.push({
        name: "#" + i,
        mesh: meshes[i],
        active: false
      })
    }

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    // renderer.setClearAlpha(0);
    renderer.setClearColor(0xEEEEEE, 0.0);
    // renderer.setPixelRatio(1);
    // 不要设pixelRatio
    // renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
    renderer.setSize(canvas.width, canvas.height);
    console.log('画布大小',canvas.width, canvas.height, wx.getSystemInfoSync().pixelRatio)

  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
  }

  function animate() {
    canvas.requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;

    count++;
    for (let i = 0; i < pois.length; i++) {
      // 计算坐标和距离 
      var rt = new THREE.Vector3(pois[i].mesh.position.x, pois[i].mesh.position.y, pois[i].mesh.position.z)
      var dis = rt.distanceTo(camera.position)
      // 计算投影平面坐标
      var rtd = rt.project(camera)
      pois[i].xy = {
        x: rtd.x,
        y: rtd.y
      }
      pois[i].distance = dis
      if (count < 10) {
        console.log(pois[i].xy)
      }
    }
    onPoisUpdate(pois)

    renderer.render(scene, camera);
  }
}