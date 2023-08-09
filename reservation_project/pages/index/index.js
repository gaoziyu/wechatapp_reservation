// index.js
// 获取应用实例
const app = getApp()
const DB = wx.cloud.database().collection("list")
const appData = getApp().globalData
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
    // console.log("getSwiperList()")
  },

  getTableList() {
    // console.log("getTableList()")
    let that = this
    wx.cloud.callFunction({
      name: "getTablelist",
      success(res) {
        // console.log("获取成功：", res.result.data)
        that.setData({
          tablelist: res.result.data,
          tablelistLoading: false
        })
      },
      fail(res) {
        console.log("获取失败")
      }
    })
  },

  toRes(e) {
    console.log("toRes")
    let itemIsActive = e.currentTarget.dataset.table_id;
    let item = e.currentTarget.dataset.table_name;
    appData.itemIsActive = itemIsActive
    appData.item = item
    appData.numIsActive = -1
    console.log("appData.itemIsActive:", appData.itemIsActive)
    console.log("appData.item:", appData.item)
    wx.switchTab({
      url: '/pages/reservation/reservation'
    });
    // if(appData.isLogin){
    //   wx.switchTab({
    //     url: '/pages/reservation/reservation'
    //   });
    // }else{
    //   wx.switchTab({
    //     url: '/pages/home/home'
    //   });
    // }
    
  },

 
})


