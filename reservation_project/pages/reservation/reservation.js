// pages/reservation/reservation.js

const db = wx.cloud.database()
const userCollection = db.collection('reservation')
const appData = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: appData.userInfo,
    isLogin: appData.isLogin,
    address: {},
    // isLogin: false,


    // 选择项目相关数据
    // 选项
    itemList: ["选项一", "选项二", "选项三", "选项四", "选项五", "选项六", "选项七", "选项八"],
    // 样式激活
    itemIsActive: -1,
    // 选择
    item: "",

    // 人数相关数据
    // 人数
    peoNum: [1, 2, 3, 4],
    // 样式激活
    numIsActive: -1,
    // 选择
    res_number: 0,


    // 选择日期相关数据
    // 获取当前年、月、日
    thisYear: new Date().getFullYear(),
    thisMonth: new Date().getMonth() + 1,
    thisDay: new Date().getDate(),
    week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    // 获取未来六天日期信息，{日期，星期}
    dates: [],
    // 当前日期信息
    thisDate: '',
    // 样式激活
    dateIsActive: -1,

    // 选择时间相关数据
    // 状态码status：0-可选，1-已被选，2-不可选，
    // 样式控制timeIsSelect
    timelist: [
      { time: "10:00", status: 0, timeIsSelect: 0 },
    ],
    selectedTimeList: [],
    selectedTimeListLength: 0,
    isTimeContinuous: false,

    // 预约列表
    reservedUser: {},
    userList: [],

    // 联系方式相关数据
    // playerName: this.userInfo.username,
    // telephoneNum: this.userInfo.tel,
    playerName: '',
    telephoneNum: '',
    telephoneNumIsWrong: false,

    // 备注信息
    notes: "",

    // 返回的完整的预约信息
    retData: {},

  },

  /**
   * 获取初始数据函数
   */
  // 获取店铺信息
  getAddress: function () {
    let that = this
    wx.cloud.callFunction({
      name: "getAddress",
      success(res) {

        that.setData({
          address: res.result.data[0]
        })
        // console.log("address", that.data.address)
      },
      fail(res) {
        console.log("getAddress" + res)
      }
    })
  },


  // 获取预约项目
  getItems: function (e) {
    let that = this
    wx.cloud.callFunction({
      name: "get_items",
      success(res) {
        // console.log("getItems成功：", res.result.data)
        that.setData({
          itemList: res.result.data
        })
      },
      fail(res) {
        console.log("getItems失败：" + res)
      }
    })
  },

  // 获取预约时间列表
  getTimes: function (e) {
    let that = this
    let timelist
    // 当前时间，只保留小时
    let now = new Date().toTimeString().substring(0, 2)
    // let today = this.data.dateIsActive
    // console.log("today:", today)
    wx.cloud.callFunction({
      name: "get_times",
      success(res) {
        // console.log("getTimes成功", res.result.data)
        timelist = res.result.data
        // console.log("getTimes成功", timelist)
        for (let i = 0; i < timelist.length; i++) {
          // 定义已定人数属性
          timelist[i].res_number = 0
          // 定义状态属性
          let t = timelist[i].time.substring(0, 2)
          if (now - t >= 0 && that.data.dateIsActive == 0) {
            timelist[i].status = 2
          }else{
            timelist[i].status = 0
          }
          // 定义是否已经选择属性
          timelist[i].timeIsSelect = 0
        }
        that.setData({
          timelist: timelist
        })
        that.getReservedTime()
      },
      fail(res) {
        console.log("getTimes失败：" + res)
      }
    })
  },

  // 获取已被预约时间
  getReservedTime: function () {
    // this.getTimes()
    let that = this
    let reservedTime = []
    let timelist = this.data.timelist
    // console.log("timelist:", timelist)
    wx.cloud.callFunction({
      name: "getReservedTime",
      data: {
        date: that.data.thisDate,
        item: that.data.item,
      },
      success(res) {
        // console.log("已预约时间：",res.result.data)
        // let timeUserList = {}
        // 定义已预约时间对象
        for (let i = 0; i < res.result.data.length; i++) {
          // 提取预约时间与预约人数信息
          let obj = {
            time: res.result.data[i].time,
            res_number: res.result.data[i].res_number
          }
          
          reservedTime = reservedTime.concat(obj)
        }
        for (let i = 0; i < reservedTime.length; i++) {
          let time = reservedTime[i].time
          let res_num = reservedTime[i].res_number
          // 更新时间列表已预定人数属性
          for (let i = 0; i < time.length; i++) {
            timelist.find(item => {
              if (item.time == time[i]) {
                item.res_number += res_num
              }
            })
          }

          // 判断是否满足人数要求，更新时间列表状态
          for (let i = 0; i < timelist.length; i++) {
            if (timelist[i].res_number + that.data.res_number > 4) {
              timelist[i].status = 1
            }
          }
      
        }
        that.setData({
          timelist: timelist
        })

        
      },
      fail(res) {
        console.log("reservedTime失败")
      }
    })

  },

  // 获取预约人列表
  getReservedUser: function(){
    const that = this
    wx.cloud.callFunction({
      name: "getReservedTime",
      data: {
        date: that.data.thisDate,
        item: that.data.item,
      },
      success(res) {
        // console.log("预约列表：",res.result.data)
        let data = res.result.data
        let list = {}
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          for (let i = 0; i < item.time.length; i++) {
            let key = item.time[i]
            let value = new Array(item.name + "*" + item.res_number)
            // console.log(value)
            if(!(key in list)){
              list[key] = value
            }else{
              list[key].push(item.name  + "*" + item.res_number)
              // console.log(list[key])
            }
          }
        }
        // console.log(list)
        that.setData({
          reservedUser: list
        })
      },
      fail(res) {
        console.log("getReservedTime失败")
      }
    })
  },

  // 获取日期，用于渲染日历
  getDate: function () {
    /**
     * 用于渲染日历
     */
    // 测试数据，测试蔡勒公式
    // let thisYear = 2023 % 100;
    // let thisMonth = 5;
    // let thisDay = 21;

    // 获取当天年月日
    let thisYear = this.data.thisYear % 100;
    let thisMonth = this.data.thisMonth;
    let thisDay = this.data.thisDay;
    let thisCentury = parseInt(thisYear / 100);
    // 计算星期，蔡勒公式，某年的1、2月份要看作上一年的13、14月份来计算
    let thisWeekday;
    if (thisMonth == 1) {
      let month = 13
      let year = (this.data.thisYear - 1) % 100
      thisWeekday = (parseInt(thisCentury / 4) - 2 * thisCentury + year + parseInt(year / 4) + parseInt((13 * (month + 1)) / 5) + thisDay - 1) % 7;
    } else if (thisMonth == 2) {
      let month = 14
      let year = (this.data.thisYear - 1) % 100
      thisWeekday = (parseInt(thisCentury / 4) - 2 * thisCentury + year + parseInt(year / 4) + parseInt((13 * (month + 1)) / 5) + thisDay - 1) % 7;
    } else {
      thisWeekday = (parseInt(thisCentury / 4) - 2 * thisCentury + thisYear + parseInt(thisYear / 4) + parseInt((13 * (thisMonth + 1)) / 5) + thisDay - 1) % 7;
    }
    // console.log(thisWeekday);
    // 循环计算未来六天的日期和星期并保存，用于页面渲染
    for (let i = 0; i < 6; i++) {
      // 获取日期
      let date;
      // let date = thisMonth + "." + (thisDay + i);
      // console.log("thisMonth:", thisMonth)
      switch (thisMonth) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
          // console.log("大月")
          if (thisDay + i > 31) {
            if (thisMonth < 10) {
              date = "0" + (thisMonth + 1) + "." + (thisDay + i) % 31
            } else {
              date = (thisMonth + 1) + "." + (thisDay + i) % 31
            }
          } else {
            if (thisMonth < 10) {
              date = "0" + thisMonth + "." + (thisDay + i);
            } else {
              date = thisMonth + "." + (thisDay + i);
            }

          }
          break;
        case 4: case 6: case 9: case 11:
          // console.log("小月")
          if (thisDay + i > 30) {
            if (thisMonth < 9) {
              date = "0" + (thisMonth + 1) + "." + (thisDay + i) % 30
            } else {
              date = (thisMonth + 1) + "." + (thisDay + i) % 30
            }

          } else {
            if (thisMonth < 9) {
              date = "0" + thisMonth + "." + (thisDay + i);
            } else {
              date = thisMonth + "." + (thisDay + i);
            }

          }
          break;
        case 2:
          // console.log("平月")
          if (thisDay + i > 28) {
            date = "0" + (thisMonth + 1) + "." + (thisDay + i) % 28
          } else {
            date = "0" + thisMonth + "." + (thisDay + i);
          }
          break;
      }
      let weekday = this.data.week[(thisWeekday + i) % 7];
      let dateObj = {
        date: date,
        weekday: weekday
      }
      // 记录未来六天日期和星期
      // 记录当前激活状态的日期
      this.setData({
        dates: this.data.dates.concat(dateObj),
      });
    }
    // console.log(this.data.dates)

    // 记录当前日期
    let thisDate = this.data.thisYear + "." + this.data.dates[0].date
    this.setData({
      thisDate: thisDate
    });
    console.log(this.data.thisDate)
  },



  /**
   * 事件函数
   */
  // 项目选择点击事件
  selectItems: function (e) {
    this.getTimes();
    let itemId = e.currentTarget.dataset.id;
    let item = this.data.itemList[itemId];
    // console.log(item);
    this.setData({
      itemIsActive: itemId,
      item: item.name,
      isTimeContinuous: false,
      selectedTimeList: [],
      userList: []
    })
    // console.log(this.data.item)

  },

  // 人数选择点击事件
  selectNum: function (e) {
    this.getTimes()
    let index = e.currentTarget.dataset.index;
    this.setData({
      numIsActive: index,
      res_number: this.data.peoNum[index],
      isTimeContinuous: false,
      selectedTimeList: [],
      userList: []
    })
    // this.getTimes()
    // this.getReservedTime()
    
  },

  // 日期选择点击事件
  selectDates: function (e) {
    this.getTimes()
    
    // this.getReservedTime()

    // 切换日期情况时间按钮选择状态(样式)
    let index = e.currentTarget.dataset.index;
    let thisDate = this.data.thisYear + "." + this.data.dates[index].date
    console.log(thisDate)
    this.setData({
      dateIsActive: index,
      isTimeContinuous: false,
      selectedTimeList: [],
      thisDate: thisDate,
      userList: []
    })
    // console.log(this.data.dateIsActive)
    // this.getTimes()
    // this.getReservedTime()
    this.getReservedUser()
    // console.log(this.data.reservedUser)
  },

  // 时间选择点击事件
  selectTime: function (e) {
    // 获取时间信息，更新该时间已预约用户列表
    let time = e.currentTarget.dataset.time
    let list = this.data.reservedUser[time] != null ? this.data.reservedUser[time] : []
    console.log(this.data.reservedUser[time])
    // 获取点击目标的状态码
    let status = e.currentTarget.dataset.status
    // 获取点击目标的下标
    let index = e.currentTarget.dataset.index
    // 得到时间列表
    let thisTimelist = this.data.timelist
    // 得到已选时间数组
    let thisSelectedTimeList = this.data.selectedTimeList
    // 时间是否连续flag
    let isTimeContinue = false
    // 只有状态码为0的选项可以改变样式
    if (status == 0) {
      // 可选且未选，点击选择，加入选择数组
      if (this.data.timelist[index].timeIsSelect == 0) {
        // 更新时间列表状态
        thisTimelist[index].timeIsSelect = 1
        this.setData({
          timelist: thisTimelist
        })
        // console.log(index)
        thisSelectedTimeList.push(index)
        // console.log(thisSelectedTimeList)
      } else {
        // 可选且已选，点击取消选择，从选择数组中删除
        thisTimelist[index].timeIsSelect = 0
        this.setData({
          timelist: thisTimelist
        })

        let tar = thisSelectedTimeList.indexOf(index)
        thisSelectedTimeList.splice(tar, 1)

      }

    }

    // 更新时间列表
    thisTimelist = this.data.timelist
    // 判断所选择时间是否连续
    thisSelectedTimeList.sort((i, j) => {
      return i - j <= 0 ? -1 : 1
    })
    console.log(thisSelectedTimeList)
    this.setData({
      selectedTimeList: thisSelectedTimeList,
      userList: list
    })
    // console.log(thisSelectedTimeList)
    for (let i = 0; i < thisSelectedTimeList.length - 1; i++) {
      if (thisSelectedTimeList[i] + 1 != thisSelectedTimeList[i + 1] && thisSelectedTimeList.length > 1) {
        isTimeContinue = true
        console.log("时间选择不连续")
        break
      }
    }
    if (isTimeContinue) {
      this.setData({
        isTimeContinuous: true
      })
    } else {
      this.setData({
        isTimeContinuous: false
      })
    }
    isTimeContinue = false
  },

  // 输入联系人事件
  playerName: function (e) {
    // 不重要
  },

  // 输入联系方式事件，包含简单的正则判断
  telephoneNum: function (e) {
    // 电话输入的正则判断
    let telephoneNum = this.data.telephoneNum

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (telephoneNum == 0) {
      this.setData({
        telephoneNumIsWrong: true
      })
    } else if (telephoneNum < 11) {
      this.setData({
        telephoneNumIsWrong: true
      })
    } else if (!myreg.test(telephoneNum)) {
      this.setData({
        telephoneNumIsWrong: true
      })
    } else {
      this.setData({
        telephoneNumIsWrong: false
      })
    }
  },

  // 备注框输入事件
  notes: function (e) {
    console.log(e.detail.value)
    this.setData({
      notes: e.detail.value
    })
  },

  // 提交预约信息事件
  submit: function (e) {
    let thisSelectedTimeList = this.data.selectedTimeList
    let selectedTimeList = []
    for (let i = 0; i < thisSelectedTimeList.length; i++) {
      selectedTimeList.push(this.data.timelist[(thisSelectedTimeList[i])].time)
    }
    // 定义预约信息，数据项由reservation表决定 
    let retData = {
      openid: appData.openid,
      username: getApp().globalData.userInfo.username,
      name: this.data.playerName,
      tel: this.data.telephoneNum,
      item: this.data.item,
      time: selectedTimeList,
      date: this.data.thisDate,
      res_number: this.data.res_number,
      notes: this.data.notes,
      create_date: Date.parse(new Date()),
    }
    this.setData({
      retData: retData
    })
    console.log(this.data.retData)
    if (retData.item == '') {
      console.log("请选择项目")
      wx.showToast({
        title: "请选择项目", // 提示的内容
        icon: "error", // 图标，默认success
      })
    } else if (retData.res_number == 0) {
      console.log("请选择人数")
      wx.showToast({
        title: "请选择人数", // 提示的内容
        icon: "error", // 图标，默认success
      })
    } else if (retData.date == '') {
      console.log("请选择日期")
      wx.showToast({
        title: "请选择日期", // 提示的内容
        icon: "error", // 图标，默认success
      })
    } else if (retData.time == '') {
      console.log("请选择时间")
      wx.showToast({
        title: "请选择时间", // 提示的内容
        icon: "error", // 图标，默认success
      })
    } else if (this.data.isTimeContinuous) {
      console.log("时间选择不连续")
      wx.showToast({
        title: "时间选择不连续", // 提示的内容
        icon: "error", // 图标，默认success
      })
    } else if (retData.name == '') {
      console.log("请填写联系人")
      wx.showToast({
        title: "请填写联系人", // 提示的内容
        icon: "error", // 图标，默认success
      })
    } else if (retData.tel == '') {
      console.log("请填写联系方式")
      wx.showToast({
        title: "请填写联系方式", // 提示的内容
        icon: "error", // 图标，默认success
      })
    } else if (this.data.telephoneNumIsWrong) {
      console.log("请填写正确的联系方式")
      wx.showToast({
        title: "联系方式有误", // 提示的内容
        icon: "error", // 图标，默认success
      })
    } else {
      // 添加预约记录
      userCollection.add({
        data: this.data.retData
      }).then(res => {
        console.log('添加成功', res)
        wx.showToast({
          title: "预约成功！", // 提示的内容
          icon: "success", // 图标，默认success
        })
        this.getTimes()
        this.setData({
          playerName: '',
          telephoneNum: '',
          notes: ''
        })
      }).catch(err => {
        console.log('添加失败', err)//失败提示错误信息
      })
    }

    this.setData({
      isTimeContinuous: false,
      selectedTimeList: [],
      userList: []
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    /**
     * 初始化数据
     */
    this.getItems()
    this.getTimes()
    this.getAddress()
    this.getDate()
    // console.log(this.data.userInfo, ",")
  },

  /**
* 监听 TabBar 切换点击
*/
  onTabItemTap: function (item) {
    this.setData({
      isLogin: appData.isLogin
    })
    console.log(this.data.isLogin)
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
    console.log("???")
    this.setData({
      userInfo: appData.userInfo
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