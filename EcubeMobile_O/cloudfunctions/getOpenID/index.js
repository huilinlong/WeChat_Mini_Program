// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database(
    { env: '你的云环境地址', } //你的云数据库环境地址
  );
  try {
    return await db.collection('你的集合名称').where({ openId: event.userInfo.openId }) //你的云数据库集合名称
      .get({
        success: function (res) {
          return res
        }
      });
  } catch (e) {
    console.log(e)
  }

}