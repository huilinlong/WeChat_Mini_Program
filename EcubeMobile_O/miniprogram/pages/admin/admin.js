const app = getApp()
Page({
  data: {
    name:'',
  }, 
  onLoad: function () {
    let that = this;
    wx.showLoading({
      title: '载入中',
    })
    //获取用户名
    wx.cloud.callFunction({
      name: 'getOpenID', 
      complete: res => {
        var name = res.result.data[0].name;
        var id = res.result.data[0].openId;
        app.this_user = name
        that.setData({
          name: name,
        })
        wx.hideLoading();
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络或服务器异常',
          icon: 'none',
          duration: 1500
        })
      }
    })
  }, 

})
