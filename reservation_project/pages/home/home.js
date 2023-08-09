// pages/home/home.js

const appData = getApp().globalData

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 全局变量，用户登录信息
    userInfo: appData.userInfo,

    // 是否登录
    isLogin: true,

    avatarUrl:"../../img/blank-profile.png",
  },

  bindchooseavatar: function (e) {
    console.log("avatarUrl:",e.detail.avatarUrl)
    this.setData({
      avatarUrl: e.detail.avatarUrl
    })
  },

  // 跳转 -> 我的预约
  myRes: function () {
    console.log("toMyRes")
    wx.navigateTo({
      url: '/home/myRes/myRes',
      success: function (res) {
        console.log("跳转成功")
      },
      fail: function (res) {
        console.log("跳转失败")
      }
    })
  },

  // 跳转 -> 个人信息
  info: function () {
    console.log("toinfo")
    wx.navigateTo({
      url: '/home/info/info',
      success: function (res) {
        console.log("跳转成功")
      },
      fail: function (res) {
        console.log("跳转失败")
      }
    })
  },

  // 跳转 -> 关于我们
  about: function () {
    console.log("toabout")
    wx.navigateTo({
      url: '/home/about/about',
      success: function (res) {
        console.log("跳转成功")
      },
      fail: function (res) {
        console.log("跳转失败")
      }
    })
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("onShow")
    this.setData({
      userInfo: appData.userInfo,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})