// app.js
App({
  data: {
    openid: '',
    isLogin: true
  },


  onLaunch() {

    wx.cloud.init({
      env: "cloud1-7gnjhxitb84adbe7",
    })

    this.login()


    wx.showShareMenu({
      withShareTicket: true,
      menu: ['shareAppMessage', 'shareTimeline']
    })
  },

  globalData: {
    userInfo: {},
  },

  getOpenid: function () {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log("获取openid")
        const openid = res.result.openid
        this.data.openid = openid
        this.getUser()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

  },

  login: function () {
    console.log("login")
    this.getOpenid()
  },

  getUser: function () {
    const that = this
    wx.cloud.callFunction({
      name: "getUser",
      data: {
        openid: this.data.openid
      },
      success(res) {
        let data = res.result.data
        if (data != '') {
          console.log("查询用户成功", res.result.data)
          const data = res.result.data[0]
          that.globalData.userInfo = {
            openid: data.openid,
            username: data.username,
            tel: data.tel,
            imgUrl: data.imgUrl,
          }
          console.log("userInfo: ", that.globalData.userInfo)
        } else {
          console.log("查询用户失败", res.result.data)
          that.addUser()
        }
      },
      fail(res) {
        console.log("查询用户失败", res);
      }
    })

  },

  addUser: function () {
    const that = this
    wx.cloud.callFunction({
      name: "addUser",
      data: {
        openid: this.data.openid,
        username: '微信用户',
        tel: '',
        imgUrl: '../../img/blank-profile.png',
      },
      success: function (res) {
        console.log("添加用户成功 ", res.result)
        that.getUser()
      },
      fail: console.error
    })
  }
})
