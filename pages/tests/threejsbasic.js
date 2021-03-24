// pages/tests/threejsbasic.js
// import {
//     createScopedThreejs
// } from 'threejs-miniprogram'
import * as THREE from '../../libs/three.weapp.min'

import {renderBasis} from '../../test-cases/threejstest'

var count = 1
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pois: new Array()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const sysinfo = wx.getSystemInfoSync()
        wx.createSelectorQuery()
            .select('#webgl')
            .node()
            .exec((res) => {
                // const canvas = res[0].node
                const canvas = new THREE.global.registerCanvas(res[0].node)
                this.canvas = canvas
                const THREE = createScopedThreejs(canvas)

                let isAndroid = false
                if (sysinfo.system.indexOf('Android') !== -1) {
                    isAndroid = true;
                }
                // wxss: 300rpx, 400rpx
                //   canvas, 152, 202
                // => 可以推导出 canvas 使用的是 px（逻辑像素,iphone 6 是375x667）
                console.log('canvas', canvas.width, canvas.height)
                renderBasis(canvas, THREE, isAndroid, this.onPoisUpdate)
            })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onPoisUpdate: function(_pois) {
        // setData 数据不能过大，这里需要精简，直接传递给 setData 会出现异常
        // Maximum call stack size exceeded 
        count++
        var ret = new Array();
        for(let i = 0; i < _pois.length; i++) {
            ret.push({
                name: _pois[i].name,
                xy: _pois[i].xy
            })
            if (count < 5) {
                console.log(_pois[i])
            }
        }
        this.setData({
            pois: ret
        })
    }
})