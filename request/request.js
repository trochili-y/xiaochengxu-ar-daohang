import * as THREE from '../libs/three.weapp.min.js' 

// //export将函数暴露出去，以便其他页面调用
// export function getMyAddress(callback){
//     // wx.getLocation({
//     //   type: 'gcj02',
//     //   isHighAccuracy:true,
//     //   success: (res) => {
//     //     wx.request({
//     //       url: 'https://apis.map.qq.com/ws/geocoder/v1/',
//     //       // data是该请求需要的数据，如文档，location和key是必须的
//     //       data: {
//     //         location: [res.latitude, res.longitude].join(','),
//     //         key:'S2LBZ-2FVRS-4LXOU-6WULV-UVVUV-PMB2G',
//     //       },
//     //       success: ({data}) => {
//     //         //callback中的变量将传递出去，因为每次需要的数据都在res.data.result中，所以可以将res.data.result传出去,再运用解构
//     //         callback(data.result)
//     //       }
//     //     })
//     //   },
//     // })
//     wx.onLocationChange((_res)=>{
//         // console.log(res)

//         wx.request({
//             url: 'https://apis.map.qq.com/ws/geocoder/v1/',
//             data: {
//                         location: [_res.latitude, _res.longitude].join(','),
//                         key:'S2LBZ-2FVRS-4LXOU-6WULV-UVVUV-PMB2G',
//                       },
//                       success: ({data}) => {
//                         //callback中的变量将传递出去，因为每次需要的数据都在res.data.result中，所以可以将res.data.result传出去,再运用解构
//                         callback(data.result)
//                       }
//         })

//     })
//   }

export function getMyAddress(_res) {
  //返回值以便后期调用，因为成功失败出来的是resolve, rejected结果，所以就不需要回调函数传参
  return new Promise((resolve, rejected) => {

    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: [_res.latitude, _res.longitude].join(','),
        key: 'S2LBZ-2FVRS-4LXOU-6WULV-UVVUV-PMB2G',
        get_poi: 1
      },
      //成功执行resolve
      success: ({
        data
      }) => {
        resolve(data.result)
      },
      //失败执行reject
      fail: (_res) => {
        rejected(_res)
      }
    })

  })

}

export function lglt2xyz(longitude, latitude, radius) {
  var lg = THREE.Math.degToRad(longitude), lt = THREE.Math.degToRad(latitude);
  var y = radius * Math.sin(lt);
  var temp = radius * Math.cos(lt);
  var x = temp * Math.sin(lg);
  var z = temp * Math.cos(lg);
  // console.log(x+","+y+","+z);
  return { x: x, y: y, z: z }
}

export function getPicBase64(tempFilePath) {
  return new Promise(function (resolve, reject) {
    wx.getFileSystemManager().readFile({
      filePath: tempFilePath, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        // console.log('data:image/png;base64,' + res.data)
        resolve(res.data)
      },
      fail: res => {
        console.log(res)
      }
    })
  })

}

export function aliyunSB(base64img) {
  var APP_CODE = "9eff836c9ff04251931912c55be2f532";
  var BASE_URL = "http://plantgw.nongbangzhu.cn/";
  var apiContextUrl = 'plant/recognize2';
  var img_base64 = base64img;
  var formData = {
    img_base64: img_base64
  };
  return new Promise(function (resolve, reject) {
    wx.request({
      url: BASE_URL+apiContextUrl,
      method: 'POST',
      header: { 'Authorization': 'APPCODE ' + APP_CODE, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: formData,
      fail: function (err) {
        console.log('请求出错：' + JSON.stringify(err));
      },
      success: function (data) {
        // console.log('请求成功：' + JSON.stringify(data));
        // console.log(data)
        resolve(data)
      },
      // complete:function(){
      //     console.log("请求处理结束。");
      // }
    })
  })
}


/////'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'


export function getMyLocation() {
  return new Promise(function(resolve, reject){
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        // wgs84_location = res
        // console.log('current position', res)
        resolve(res)
      }
    })
  })

}