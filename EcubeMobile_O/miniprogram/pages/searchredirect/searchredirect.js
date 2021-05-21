const app = getApp()
wx.cloud.init();
const db = wx.cloud.database({
  env: '你的云数据库环境地址',//替换成你的云数据库环境地址
})
var searchtj = {}

function isInArray(arr,value){
  for(var i=0; i<arr.length;i++){
    if(value === arr[i]){
      return true;
    }
  }
  return false;
}

async function getAllNumber() {
  let count = db.collection('backup').where(searchtj).count();
  return count;
}

Page({
  data: {
    ne: [],

  },

  onLoad: function (options) {
    searchtj = {
      type: options.type,
      model: db.RegExp({
        regexp: options.model,
        options: 'i',
      }),
      name: db.RegExp({
        regexp: options.name,
        options: 'i',
      }),
    }
    if (options.shop=="2"){
      searchtj.shop=2
    }
    console.log(searchtj)
    var that = this;
    wx.showLoading({
      title: '请稍候',
    })
    db.collection('backup').where(searchtj).orderBy('name','asc')
    .get({
      success: (res) => {
        wx.hideLoading();
        app.globalData.searchResult = res.data;
        that.setData({
          ne: res.data,
        })
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '网络或服务器异常',
          icon: 'none',
          duration: 1500
        })
      }

    })
  },

//onReachBottom触发异步搜索直至查询所有数据
  onReachBottom: async function(){
    var total = await getAllNumber()
    console.log(total.total)
    if (app.globalData.searchResult.length==total.total){
      wx.showToast({
        icon:'success',
        title: '已加载全部'
      })
    }else{
      wx.showLoading({
        title: '刷新中',
        duration: 1000
      }),
        db.collection('backup').where(searchtj)
          .orderBy('name', 'asc')
          .skip(app.globalData.searchResult.length)
          .get()
          .then(res =>{
            let newData = app.globalData.searchResult.concat(res.data);
            app.globalData.searchResult = newData;
            this.setData({
              ne: newData
            })
          })
          .catch(err=>{
            console.error(err)
          })
    }
  },
})