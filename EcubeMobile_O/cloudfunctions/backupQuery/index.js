// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database(
    { env: '你的云环境地址', } //你的云数据库环境地址
  );
  var returnlist=[]
  var returnlist2=[]
  var shops=[2,3]
  var returnlist3=[]
  try {

    for (var i = 0; i < event.types.length; i++) {
      for (var j = 0; j < shops.length; j++) {
      let this_num = await db.collection('backup').where({ 
        type: event.types[i],
        shop: shops[j]
        }).count()
        switch(shops[j]){
          case 2:
            returnlist2[i] = this_num.total;
            break;
          case 3:
            returnlist[i] = this_num.total;
            break;
          }
        }
        returnlist3[i]=returnlist[i]+returnlist2[i]
    }
    return {
      list2 : returnlist2,
      list3 : returnlist3,
    }
  } catch (e) {
    console.log(e)
  }
}