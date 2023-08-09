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
    userInfo: appData.userInfo,

    timeFlag: false,

    fileID: '',

    editUsernameStatus: false,
    editTelStatus: false,
  },

  /**
   * 请求数据
   */
  // 请求用户信息


  /**
   * 事件函数
   */

  // 点击更换头像
  bindchooseavatar: function (e) {
    console.log("avatarUrl:", e.detail.avatarUrl)
    const that = this
    wx.cloud.uploadFile({
      cloudPath: 'avatarImg/' + that.data.userInfo.openid + '.png',
      filePath: e.detail.avatarUrl, // 文件路径
      success: res => {
        console.log("保存头像成功: ",res.fileID)
        that.data.userInfo.imgUrl = res.fileID
        that.updateAvatarImg()
      },
      fail: err => {
        // handle error
      }
    })


  },

  // 更新头像
  updateAvatarImg: function () {
    const that = this
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        openid: this.data.userInfo.openid,
        imgUrl: this.data.userInfo.imgUrl
      },
      success: function (res) {
        console.log("更新头像成功", res)
        appData.userInfo = that.data.userInfo
      },
      fail: function (res) {
        console.log("更新头像失败", res)
      }
    })
  },

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
    console.log("userInfo.username:", this.data.userInfo.username)
    let that = this
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        openid: this.data.userInfo.openid,
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
    const that = this
    this.setData({
      editTelStatus: !this.data.editTelStatus
    })
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        openid: this.data.userInfo.openid,
        tel: this.data.userInfo.tel
      },
      success: function (res) {
        console.log("更新联系方式成功", res)
        appData.userInfo = that.data.userInfo
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
  getFlagTime() {
    let that = this
    wx.cloud.callFunction({
      name: "getFlagTime",
      success(res) {
        let flagTime = new Date( res.result.data[0].time)
        let time = new Date()
        // console.log("flagtime: ", flagTime)
        // console.log("time: ", time)
        if(flagTime - time > 0){
          
          // console.log("时候没到")
        }else{
          that.setData({
            timeFlag: true
          })
          // console.log("时候到了")
        }
        that.setData({
        })
      },
      fail(res) {
        console.log("获取失败")
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getFlagTime() 
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
    this.setData({
      userInfo: appData.userInfo
    })
    this.getFlagTime() 
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