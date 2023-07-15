// app.js
App({

  

  onLaunch() {
    wx.cloud.init({
      env: "myenv-4g5fwgk2a1952600",
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.globalData.openid = res.result.openid
        console.log("this.globalData.openid", this.globalData.openid)
        console.log(res.result.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  globalData: {
    userInfo: {
      username: "点击登录"
    },
    isLogin: false,
    openid: ''
  },
  

})
