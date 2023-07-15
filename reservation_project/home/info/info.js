// pages/info/info.js

const appData = getApp().globalData
const db = wx.cloud.database()
const updataUserInfo = db.collection('user')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 获取用户信息
    userInfo: {},

    editUsernameStatus: false,
    editTelStatus: false,

  },

  /**
   * 请求数据
   */
  // 请求用户信息
  getUserInfo: function () {
    let that = this
    wx.cloud.callFunction({
      name: "getUser",
      data: {
        openid: appData.openid
      },
      success(res) {
        // console.log("查询用户成功", res.result.data)
        let userinfo = res.result.data[0]
        if (userinfo.tel == '') {
          userinfo.tel = "空"
        }
        that.setData({
          userInfo: userinfo
        })
      },
      fail(res) {
        console.log("失败", res);
      }
    })
  },

  /**
   * 事件函数
   */

  // 点击用户名编辑按钮
  editUsernameIcon: function () {
    console.log("editUsernameIcon")
    this.setData({
      editUsernameStatus: !this.data.editUsernameStatus
    })
  },
  // 点击用户名提交按钮
  submitUsernameIcon: function () {
    console.log("submitUsernameIcon")
    this.setData({
      editUsernameStatus: !this.data.editUsernameStatus
    })
    console.log("appData.openid:", appData.openid)
    let that = this
    wx.cloud.callFunction({
      name: 'updateUsername',
      data: {
        openid: appData.openid,
        username: this.data.userInfo.username
      },
      success: function (res) {
        console.log("更新用户名成功", res)
        appData.userInfo = that.data.userInfo
        // console.log(" appData.userInfo :", appData.userInfo )
      },
      fail: function (res) {
        console.log("更新用户名失败", res)
      }
    })
  },
  userNameInputAction: function (options) {
    console.log("userNameInputAction")
    let value = options.detail.value
    let userinfo = this.data.userInfo
    userinfo.username = value
    this.setData({
      userInfo: userinfo
    })
  },

  // 点击联系方式编辑按钮
  editTelIcon: function () {
    console.log("editTelIcon")
    this.setData({
      editTelStatus: !this.data.editTelStatus
    })
  },
  // 点击联系方式提交按钮
  submitTelIcon: function () {
    console.log("submitTelIcon")
    this.setData({
      editTelStatus: !this.data.editTelStatus
    })

    console.log("appData.openid:", appData.openid)

    wx.cloud.callFunction({
      name: 'updateUserTel',
      data: {
        openid: appData.openid,
        tel: this.data.userInfo.tel
      },
      success: function (res) {
        console.log("更新联系方式成功", res)
      },
      fail: function (res) {
        console.log("更新联系方式失败", res)
      }
    })
  },
  userTelInputAction: function (options) {
    console.log("userNameInputAction")
    let value = options.detail.value
    let userinfo = this.data.userInfo
    userinfo.tel = value
    this.setData({
      userInfo: userinfo
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo()
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