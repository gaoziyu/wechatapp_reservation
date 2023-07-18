// pages/home/home.js

const appData = getApp().globalData

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 全局变量，用户登录信息
    userInfo: appData.userInfo,
    openid: appData.openid,

    // 是否登录
    isLogin: appData.isLogin,

    test: 'test',
  },

  test: function () {
    // wx.cloud.callFunction({
    //   name: "getMyRes",
    //   success(res) {
    //     console.log("成功", res.result.data)
    //   },
    //   fail(res) {
    //     console.log("失败", res);
    //   }
    // })
    this.setData({
      openid: appData.openid
    })
    console.log("openid:", this.data.openid)
  },

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

  login: function () {
    console.log("登录")
    let that = this
    wx.cloud.callFunction({
      name: "getUser",
      data: {
        openid: appData.openid
      },
      success(res) {
        // console.log("查询用户成功", res.result.data[0].username)
        let data = res.result.data
        if (res.result.data.length != 0) {
          if (that.data.isLogin) {
            return
          }
          appData.userInfo = {
            username: data[0].username,
            tel: data[0].tel
          }
          appData.isLogin = !appData.isLogin
          that.setData({
            userInfo: appData.userInfo,
            isLogin: appData.isLogin
          })
        }
        else {
          console.log("未找到用户")
          wx.cloud.callFunction({
            name: "addUser",
            data: {
              openid: appData.openid,
              username: '匿名用户',
              tel: ''
            },
            success: function (res) {
              console.log(res.result)
              appData.userInfo = {
                username: "nimingyonghu"
              }
              appData.isLogin = !appData.isLogin
              that.setData({
                userInfo: appData.userInfo,
                isLogin: appData.isLogin
              })
            },
            fail: console.error
          })
        }
      },
      fail(res) {
        console.log("失败", res);
      }
    })





  },

  logout: function () {
    console.log("退出登录")
    if (!this.data.isLogin) {
      return
    }
    appData.userInfo = {
      username: "点击登录"
    }
    appData.isLogin = !appData.isLogin
    this.setData({
      userInfo: appData.userInfo,
      isLogin: appData.isLogin
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