import {
  registerGLTFLoader
} from '../loaders/gltf-loader'
const appData = getApp()

import * as deviceOrientationControl from '../libs/DeviceOrientationControl'
import {
  qqMapTransBMap
} from './utils'
import gLTF from '../loaders/GLTFLoader'

const deviceMotionInterval = 'ui'
var count = 0
var location_gcj02

// TODO: (min) 在 main.js 中监听位置变化，传入 callbackLocationUpdate 来更新位置
export function artour(canvas, THREE, callbackPoiMarkersUpdate, isAndroid, callbackLocationUpdate) {
  var camera0, scene, renderer;
  var device = {};
  var lon, lat, gradient;

  // registerGLTFLoader(THREE)
  var GLTFLoader = gLTF(THREE)

  var seletedModel, requestId;
  var isDeviceMotion = false;
  var last_lon, last_lat, last_device = {};

  // gps
  var wgs84_location = {};
  // wgs84_location=appData.globalData.curpoi
  var pois = new Array()
  // pois=appData.globalData.pois
  // initPoisWithBaiduMap()
  // TODO: （min)从外部或后台服务抓取 pois 信息然后缓存
  // initPoisWithGoogleMap()

  var pois_markers = new Array()
  var callbackPoiMarkersUpdate;

  init();
  animate();

  function init() {
    last_device = {}
    initScene(THREE)
    getMyLocation()
    startDeviceMotion(isAndroid)
    console.log(111)
  }

  function animate() {
    requestId = canvas.requestAnimationFrame(animate);
    // ps：(min)发挥再进入这个 requestId 编号会继续递增
    // console.log('requestAnimationFrame#',requestId);
  pois=appData.globalData.pois

    if (lon !== last_lon ||
      lat !== last_lat) {

      last_lon = lon;
      last_lat = lat; 

      // deviceOrientationControl.modelRotationControl(seletedModel, lon, lat, gradient, THREE);
    }

    if (last_device.alpha !== device.alpha ||
      last_device.beta !== device.beta ||
      last_device.gamma !== device.gamma) {

      last_device.alpha = device.alpha;
      last_device.beta = device.beta;
      last_device.gamma = device.gamma;

      console.log('[DEVICE]', device)
      if (isDeviceMotion) {
        // 需要 isandroid 参数来适配
        deviceOrientationControl.deviceControl(camera0, device, THREE, isAndroid);
      }
    }

    activeMarkers2();

    renderer.render(scene, camera0);
  }

  function initScene(THREE) {
    // GLTFLoader = gLTF(THREE)
    lon = 0,
      lat = 0

    camera0 = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 10000);
    // according to camera position
    camera0.position.set(0, 1.4, 0);
    // 初始化摄像机朝向，与实际地理方位对齐
    camera0.rotation.x = 0
    camera0.rotation.y = -Math.PI/2.0
    camera0.rotation.z = 0
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff));
    // 参考测试对象 ============================================
    const cube10z = new THREE.Mesh(new THREE.BoxGeometry( 500, 500, 500), new THREE.MeshBasicMaterial({
      color: 0x0000ff
    }));
    // （蓝色）测试立方体在正北方，选择10公里之外的点校准方向（远一点）
    cube10z.position.set(0, 0, -10000);
    // The X axis is red. The Y axis is green. The Z axis is blue.
    cube10z.add(new THREE.AxesHelper(20));

    const cube10x = new THREE.Mesh(new THREE.BoxGeometry( 500, 500, 500), new THREE.MeshBasicMaterial({
      color: 0xff0000
    }));
    // （红色）测试立方体在正西方
    cube10x.position.set(-10000, 0, 0);
    cube10x.add(new THREE.AxesHelper(20));

    scene.add(cube10z);
    scene.add(cube10x);

    // ---------------------------------------------------------- endl

    loadModelOnly('https://xiaomin1978.oss-cn-beijing.aliyuncs.com/public/two_markers_v1.glb',  
      (model, gltf) => { 
        // ps：(min)可以改变单个物体的位置等信息
        // 因此，可以所有物体放到一个 glb 中，然后按照名字查找后设置其位置。
        // 下面代码仅仅测试
        // model.position.set(0,0,0)
        model.children[2].position.set(5,0,0)
        model.children[3].position.set(-5,0,0)
        // model.scale.set(0.5,0.5,0.5)
        console.log('[gltf]', gltf)  
        console.log(model)
        scene.add(model)
      })

    // 预先创建标识，默认不激活
    addAllMarkers();
    /*
    if (!isAndroid) {
        // init Orthographic Camera
        initBackroundScene();
    }
    */
    // init render
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    console.log('canvas size for reander', canvas.width, canvas.height);
    renderer.setSize(canvas.width, canvas.height);
    /*
    if (!isAndroid) {
        renderer.autoClear = false;
    }
    */
    animate();
  }

  function addAllMarkers() {
    // ps：(min)这里一定呀初始化，否则返回再进来导致对象越来越多，是的 threejs 不显示这些对象
  pois=appData.globalData.pois
    pois_markers = new Array();

    loadModelOnly('https://newhouse-marketing.oss-cn-shenzhen.aliyuncs.com/miniprogram/bangongshi.glb',
      model => {
        for (var i = 0; i < pois.length; i++) {
          console.log(pois[i].id, pois[i].title)
          let instance = model.clone()
          pois_markers.push({
            name: pois[i].name,
            // key: pois[i].key,
            key: pois[i].id,
            mesh: instance,
            active: false
          });
          scene.add(instance);
        }
      }
    )
  }

  function activeMarkers2() {
    // console.log(wgs84_location)
    let wgsLat=appData.globalData.curpoi.latitude
    let wgsLng=appData.globalData.curpoi.longitude
    
    // console.log(pois)
    var currentPosition= lonlatToMercator(wgsLng, wgsLat, 10);
    // var currentPosition= lonlatToMercator(wgsPoi.lng,wgsPoi.lat, 10);
    // TODO: 假定当前在这里 
    // currentPosition = lonlatToMercator(113.16464233398438, 23.39507293701172, 10) // home(google)
    for (var i = 0; i < pois_markers.length; i++) {
      let p = lonlatToThree(pois[i].location.lng, pois[i].location.lat, 10, currentPosition);
      let dis = p.distanceTo(camera0.position)
      // console.log(pois[i].name,'-', p, dis);
      if (dis < 300000) {
        pois_markers[i].active = true;

        pois_markers[i].mesh.position.set(p.x, p.z, -p.y)
        pois_markers[i].mesh.lookAt(camera0.position)
        pois_markers[i].distance = dis

        // views for wxml
        let rt = new THREE.Vector3(p.x, p.z, -p.y)

        // 如果 rtd.z > 1 ，点会在相机后面
        let rtd = rt.project(camera0)
        pois_markers[i].xy = {
          x: rtd.x,
          y: rtd.y
        }

        if (rtd.z > 1) {
          pois_markers[i].active = false
        }

        if (count < 5) {
          console.log(pois_markers[i], p)
          count++
        }

      } else {
        console.log(pois_markers[i].name, '不显示', dis);
        pois_markers[i].active = false;
        pois_markers[i].mesh.position.set(10000, 10000, 10000);
      }
    }
    // callbackPoiMarkersUpdate(pois_markers);
    if (typeof callbackPoiMarkersUpdate === 'function') {
      // callbackPoiMarkersUpdate(pois_markers);
    }
    // console.log(camera0.position, camera0.rotation)

  }

  function startDeviceMotion(_isAndroid) {
    isDeviceMotion = true;
    // isAndroid = _isAndroid;
    wx.onDeviceMotionChange(function (_device) {
      device = _device;
      console.log(device.alpha, device.beta, device.gamma);
    });
    wx.startDeviceMotionListening({
      interval: deviceMotionInterval,
      success: function () {
        console.log('startDeviceMotionListening', 'success');
      },
      fail: function (error) {
        console.log('startDeviceMotionListening', error);
      }
    });
  }

  function stopDeviceMotion() {
    isDeviceMotion = false;
    wx.offDeviceMotionChange();
    wx.stopDeviceMotionListening({
      success: function () {
        console.log('stopDeviceMotionListening', 'success');
      },
      fail: function (error) {
        console.log('stopDeviceMotionListening', error);
      }
    });
  }

  function getMyLocation() {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        wgs84_location = res
        console.log('current position', res)
      }
    })
  }

  function lonlatToMercator(lon, lat, height) {
    var z = height ? height : 0;
    var x = (lon / 180.0) * 20037508.3427892;
    var y = (Math.PI / 180.0) * lat;
    var tmp = Math.PI / 4.0 + y / 2.0;
    y = 20037508.3427892 * Math.log(Math.tan(tmp)) / Math.PI;
    // return { x: x, y: y, z: z };
    return new THREE.Vector3(x, y, z);
  }

  function lonlatToThree(lon, lat, height, center) {
    var z = height ? height : 0;
    var x = (lon / 180.0) * 20037508.3427892;
    var y = (Math.PI / 180.0) * lat;
    var tmp = Math.PI / 4.0 + y / 2.0;
    y = 20037508.3427892 * Math.log(Math.tan(tmp)) / Math.PI;
    var result = {
      x: x - center.x,
      y: y - center.y,
      z: z - center.z
    };
    return new THREE.Vector3(result.x, result.y, result.z);
  }

  function loadModelOnly(modelUrl, callback) {
    const gltfloader = new GLTFLoader()
    gltfloader.load(modelUrl,
      function (gltf) {
        console.log('loadModel', 'success');
        var model = gltf.scene;
        model.scale.set(20, 20, 20)
        if (callback) {
          callback(model, gltf)
        }
      },
      null,
      function (error) {
        console.log(modelUrl, error);
        const cube = new THREE.Mesh(new THREE.BoxGeometry(10.40, 10),
          new THREE.MeshNormalMaterial())
        cube.add(new THREE.AxesHelper(20))
        if (typeof callback === 'function') {
          callback(cube)
        }
      })
  }

  function loadModel(modelUrl) {
    const gltfloader = new THREE.GLTFLoader()
    wx.showLoading({
      title: 'Loading Model...',
    });
    gltfloader.load(modelUrl,
      function (gltf) {
        console.log('loadModel', 'success');
        var model = gltf.scene;
        model.position.set(5, 10, -30);
        model.scale.set(1, 1, 1)
        scene.add(model);
        wx.hideLoading();
      },
      null,
      function (error) {
        console.log(modelUrl, error);
        wx.hideLoading();
        wx.showToast({
          title: error.message,
          icon: 'none',
          duration: 3000,
        });
      });
  }

  function initPoisWithBaiduMap() {

    pois.push({
      name: '广州塔',
      key: '102',
      longtitude: 113.331084,
      latitude: 23.112223
    })

    pois.push({
      name: '天河体育中心',
      key: '101',
      longtitude: 113.331575,
      latitude: 23.143232
    })
    // endl

    pois.push({
      name: '世间香境·七溪地',
      key: '110',
      longtitude: 113.396518,
      latitude: 23.536177
    })
  }

  // 我家附近的 poi 测试
  function initPoisWithGoogleMap() {
    pois.push({
      name: '（正北 500m）',
      latitude: 23.39987336462477, 
      longtitude: 113.16452010856051
    })

    pois.push({
      name: '（正西 500m）',
      latitude: 23.395232486198807, 
      longtitude: 113.15977621173435
    })
    pois.push({
      name: '宝莱雅居（北略偏西100m）',
      latitude: 23.396097920504335, 
      longtitude: 113.16432132547851
    })

    pois.push({ //
      name: '潮味大排档（西北）',
      latitude: 23.39695082347292, 
      longtitude: 113.16212668135495
    })
    pois.push({
      name: '渔痴鱼醉私房菜（东北 878m）',
      latitude: 23.397768244050525, 
      longtitude: 113.1728349607359
    })

    pois.push({
      name: '广州远扬音响有限公司（西南偏西 234m）',
      latitude: 23.39395262766576, 
      longtitude: 113.16287799047264
    })
    pois.push({
      name: '富邦超市（西南偏南 500m）',
      latitude: 23.39114168008428, 
      longtitude: 113.16251307535002
    })
  }


}