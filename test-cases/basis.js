export function renderBasis(canvas, THREE) {
  var camera, scene, renderer;
  var cube;
  init();
  animate();
  function init() {
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
    camera.position.z = 10;
    // camera.rotation.x = 10;
    camera.rotation.z = 5;
    scene = new THREE.Scene();
    // scene.background = null;

    // https://stackoverflow.com/questions/41086806/draw-3d-object-axes-threejs
    // https://www.cnblogs.com/baby123/p/12191637.html
    // threejs中采用的是右手坐标系, 红线是X轴，绿线是Y轴（向上），蓝线是Z轴
    // The X axis is red. The Y axis is green. The Z axis is blue.
    var axes = new THREE.AxisHelper(50);
    // axes.position.y = 5;
    scene.add(axes); // 全局坐标系
    
    // var myGridHelper = new THREE.GridHelper(10, 20);
    // var gridHelper = new THREE.GridHelper( 100, 30, 0x2C2C2C, 0x888888 );
    // scene.add(myGridHelper);

    // Add grid helper
    var gridHelper = new THREE.GridHelper( 90, 9 );
    gridHelper.colorGrid = 0xE8E8E8;
    scene.add( gridHelper );
    
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh( geometry, material );
    cube.add(new THREE.AxesHelper(20));

    // 小程序端模拟器模式看不到（预览可以看到），html 页面可以
    scene.add( cube );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // renderer.setClearAlpha(0);
    renderer.setClearColor(0xEEEEEE, 0.0);
    renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
    renderer.setSize(canvas.width, canvas.height);
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
  }
  function animate() {
    canvas.requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
}