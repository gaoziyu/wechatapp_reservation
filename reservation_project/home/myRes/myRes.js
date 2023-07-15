// pages/myRes/myRes.js

const appData = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // key：status，判断是否过期，true-未过期，false-已过期，
    resList: [],
  },

  /**
   * 请求数据
   */
  getResList: function () {
    let that = this
    wx.cloud.callFunction({
      name: "getMyRes",
      data: {
        openid: appData.openid
      },
      success(res) {
        // console.log("获取成功：", res.result.data)
        let resList = res.result.data
        resList.sort((i, j) => {
          return i.create_date >= j.create_date ? -1 : 1
        })


        // 判断预约是否过期，并重新修饰时间
        for (let i = 0; i < resList.length; i++) {

          // 修饰时间
          let time = resList[i].time
          let timeStart = time[0]
          let timeEnd = time[time.length - 1].replace("00", "59")
          let timeStr = timeStart + "-" + timeEnd
          resList[i].time = timeStr

          // 判断是否过期
          let date = resList[i].date + " " + timeEnd + ":00"
          // console.log(date.replace(/\./g, '-'))
          let now = Date.parse(new Date())
          // // 预约日期转为时间戳date
          date = Date.parse(new Date(date.replace(/\./g, '-')))
          if (now > date) {
            console.log("已经过期")
            resList[i].status = false
          } else {
            console.log("未过期")
            resList[i].status = true
          }
        }
        that.setData({
          resList: res.result.data
        })
        // console.log(that.data.resList)
      },
      fail(res) {
        console.log("获取失败：", res)
      }
    })
  },

  /**
   * 事件函数
   */

  test: function () {
    let now = Date.parse(new Date())
    let date = Date.parse("2023-6-16");
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取全部预约记录
    this.getResList()
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