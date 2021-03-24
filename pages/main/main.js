// const { createScopedThreejs } = require('threejs-miniprogram')
// import {
//     createScopedThreejs
// } from 'threejs-miniprogram'
import * as THREE from '../../libs/three.weapp.min'
// var bmap = require('../../libs/bmap-wx.min.js'); 
import {
    artour
} from '../../bll/artour'
import {
    getMyAddress,
    getMyLocation,
    lglt2xyz
  } from '../../request/request.js'
// import encode from '../../libs/encoder'

const app = getApp()
var frame;
var count = 0
const isDebug = true

Page({
    data: {
        // canvasWidth: 0,
        // canvasHeight: 0,
        poiMarkers: new Array()
    },
    onReady: function () {

    },
    onLoad: function () {
        /////////////Wx实时更新
        // var BMap = new bmap.BMapWX({ 
        //     ak: 'fGnj2MowKhbIeDYw35s0iM8PgyVL7s9f' 
        //   }); 
          
   // 实时位置更新(高德地图)
    // wx.startLocationUpdateBackground({

    //   success: () => {

    //     wx.onLocationChange(async (_res) => {
    //     //   console.log(_res)
    //       app.globalData.cutpoi=_res
    //       let poires = await getMyAddress(_res)

    //       app.globalData.pois=poires.pois
    //     //   console.log(app.globalData.pois)
    //     })

    //   }
    // })
    // setInterval(this.updatepois,3000)
    
        ///////////////////
        const sysinfo = wx.getSystemInfoSync()
        const context = wx.createCameraContext()
        const listener = context.onCameraFrame((_frame) => {
            // console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height)
            frame = _frame
        })
        listener.start()
        // console.log(res)
        // this.setData({
        //     canvasWidth: res.windowWidth,
        //     canvasHeight: res.windowHeight
        //   });
        // ps: (min) 这里 createSelectorQuery 是异步操作
        wx.createSelectorQuery()
            .select('#webgl')
            .node()
            .exec((res) => {
                // const canvas = res[0].node
                const canvas = new THREE.global.registerCanvas(res[0].node)

                this.canvas = canvas
                // const THREE = createScopedThreejs(canvas)

                let isAndroid = false
                if (sysinfo.system.indexOf('Android') !== -1) {
                    isAndroid = true;
                }
                if (isDebug) {
                    console.log('canvas scales: ', canvas.width, canvas.height)
                    console.log(sysinfo)
                }
                console.log("进入createselectorquery")
                artour(canvas, THREE, this.callbackPoiMarkersUpdate, isAndroid)
            })
        // let temp=await this.test
        // wx.createSelectorQuery()
        //     .select('#getImgCanvas')
        //     .node()
        //     .exec((res) => {
        //         const canvas = res[0].node
        //     })
    },
    // test(){
    //     return new Promise(function(resolve,reject){
    //         wx.createSelectorQuery()
    //         .select('#webgl')
    //         .node()
    //         .exec((res) => {
    //             // const canvas = res[0].node
    //             const canvas = new THREE.global.registerCanvas(res[0].node)

    //             this.canvas = canvas
    //             // const THREE = createScopedThreejs(canvas)

    //             let isAndroid = false
    //             if (sysinfo.system.indexOf('Android') !== -1) {
    //                 isAndroid = true;
    //             }
    //             if (isDebug) {
    //                 console.log('canvas scales: ', canvas.width, canvas.height)
    //                 console.log(sysinfo)
    //             }
    //             console.log("进入createselectorquery")
    //             artour(canvas, THREE, this.callbackPoiMarkersUpdate, isAndroid)
    //         })
    //     })
    // },
    touchStart(e) {
        this.canvas.dispatchTouchEvent({
            ...e,
            type: 'touchstart'
        })
    },
    touchMove(e) {
        this.canvas.dispatchTouchEvent({
            ...e,
            type: 'touchmove'
        })
    },
    touchEnd(e) {
        this.canvas.dispatchTouchEvent({
            ...e,
            type: 'touchend'
        })
    },
    onUnload: function() {
        THREE.global.clearCanvas()
    },
    callbackPoiMarkersUpdate: function (poi_markers) {
        // setData 数据不能过大，这里需要精简，直接传递给 setData 会出现异常
        // Maximum call stack size exceeded 
        var ret = new Array();
        for (var i = 0; i < poi_markers.length; i++) {
            // TODO: 将世界坐标转换为屏幕坐标然后显示
            if (poi_markers[i].active) {
                ret.push({
                    name: poi_markers[i].name,
                    key: poi_markers[i].key?poi_markers[i].key:'000',
                    distance: Math.ceil(poi_markers[i].distance),
                    xy: poi_markers[i].xy
                });
                if (count++ < 5) {
                    console.log(poi_markers[i].key,poi_markers[i].xy,poi_markers[i].distance)
                }
            }
        }
        // 单次设置的数据不能超过1024kB
        this.setData({
            poiMarkers: ret
        });
    },
    captureFrameAndUpload: function () {
        console.log(frame)
        var data = new Uint8Array(frame.data)
        var clamped = new Uint8ClampedArray(data)
        wx.canvasPutImageData({
            canvasId: 'getImgCanvas',
            data: clamped,
            height: frame.height,
            width: frame.width,
            x: 0,
            y: 0,
            success(res) {
                console.log('getimg', res)
            },
            fail(err) {
                console.log(err)
            }
        }, this)
    },
    //  updatepois:async function(){
    //     //  console.log(111)
    //     let curPoi=await getMyLocation()
    //     // console.log(curPoi)
    //     app.globalData.curpoi=curPoi
    //     let tempPois=await getMyAddress(curPoi)
    //     app.globalData.pois=tempPois.pois
    //     // console.log(tempPois)
    // }
})