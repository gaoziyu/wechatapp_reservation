// index.js
// 获取应用实例
const app = getApp()
const DB = wx.cloud.database().collection("list")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    swiperList: [],
    tablelist: [],
    tablelistLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSwiperList()
    this.getTableList()
  },

  // 获取轮播图数据
  getSwiperList() {
    console.log("getSwiperList()")
  },

  getTableList() {
    console.log("getTableList()")
    let that = this
    wx.cloud.callFunction({
      name: "get_items",
      success(res) {
        console.log("获取成功：", res.result.data)
        that.setData({
          tablelist: res.result.data,
          tablelistLoading: false
        })
      },
      fail(res) {

      }
    })
  }
})


