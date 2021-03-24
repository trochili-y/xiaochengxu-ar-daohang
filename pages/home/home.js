// pages/home/home.js
import {
    getMyAddress,
    getMyLocation,
    lglt2xyz
  } from '../../request/request.js'
  const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        setInterval(this.updatepois,3000)
        // var that=this
    //      wx.startLocationUpdateBackground({

    //   success: (res) => {
    //     // console.log(res)
 
    //     setInterval(that.updatepois,200)
    //   }
    // })

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
    onEnterARGame: function() {
        wx.navigateTo({
            url: '../main/main',
          })
    },

    onEnterDashboard: function() {
        wx.navigateTo({
            url: '../user/dashboard',
          })
    },
    updatepois:async function(){
        //  console.log(111)
        let curPoi=await getMyLocation()
        // console.log(curPoi)
        app.globalData.curpoi=curPoi
        let tempPois=await getMyAddress(curPoi)
        app.globalData.pois=tempPois.pois
        // console.log(tempPois)
    }
})