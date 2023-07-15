// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (context) => {
  try {
    // 添加记录
    await db.collection('fruit').add({
      // data 字段表示需新增的 JSON 数据
      data: context,
    });
    return {
      success: true,
      msg: '添加成功！'
    };
  } catch (e) {
    return {
      success: false,
      msg: '添加失败！'
    };
  }
};