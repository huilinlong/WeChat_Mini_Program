var numberlist = []

Page({
  //页面变量
  data: {
    parameter: [
      { id: 1, name: "冲头", type:"ct"},
      { id: 2, name: "凹刀", type: "ad" },
      { id: 3, name: " 弹簧", type: "th" },
      { id: 4, name: "气缸", type: "qg" },
      { id: 5, name: "氮气缸", type: "dqg" },
      { id: 6, name: "导板", type: "db" },
      { id: 7, name: "弹顶", type: "td" },
      { id: 8, name: "钢印", type: "gy"},
      { id: 9, name: "橡皮", type: "xp" },
      { id: 10, name: "横销", type: "hx"},
      { id: 11, name: "工具", type: "gj" },
      { id: 12, name: "其他", type: "qt" },
    ],
    checkedtype : 'ct',
    checkedmodel: '',
    checkedname: '',
    checkedshop:'2',
    types:['ct','ad','th','qg','dqg','db','td','gy','xp','hx','gj','qt'],
    names:['冲头', '凹刀', '弹簧', '气缸', '氮气缸', '导向', '弹顶', 
    '钢印', '橡皮', '横销', '工具', '其他'],
    list2:[],
    list3:[]
  },
//模糊搜索框信息同步
  fuzzysearchInput: function (e) {
    switch (e.currentTarget.dataset.id) {
      case "siname":
        this.setData({checkedname: e.detail.value})
        break;
      case "simodel":
        this.setData({checkedmodel: e.detail.value})
        break;
    }
  },
//设置checkbox
  checkboxChange:function(e){
    var selected = e.detail.value.length
    if(selected==1){
      numberlist = this.data.list3

      this.setData({
        checkedshop: '',
      })
    }else{
      numberlist = this.data.list2
      this.setData({
        checkedshop: '2',
      })
    }
    var parameterList = this.data.parameter
    for (var i = 0; i < parameterList.length; i++) {
        parameterList[i].checked = false;
    }
    parameterList[0].checked = true;
    this.onLoad()
  },
//obload中预加载各分类的个数
  onLoad: function(e){
    var that=this
    if (numberlist.length == 0) {
    wx.showLoading({
      title: '载入中',
    })
    //异步查询数据库
    var p=new Promise((reslove, reject) => {
      wx.cloud.callFunction({
        name: 'backupQuery',
        data: {
          types: this.data.types,
        },
        complete(res) {
          numberlist = res.result.list2
          that.setData({
            list2: res.result.list2,
            list3: res.result.list3
          })
          reslove();
          wx.hideLoading();
        },
        fail(res){
          wx.showToast({
            title: '网络或服务器异常',
            icon: 'none',
            duration: 1500
          })
        }
      })
    })
    p.then(res => {
      for (var i = 0; i < 12; i++) {
        var number = 2
        var newname = that.data.names[i]
        var listtarget = "parameter[" + i + "].name"
        number = numberlist[i]
        newname = newname + "(" + number + ")"
        that.setData({
          [listtarget]: newname,
        })
      };
      that.data.parameter[0].checked = true;
      that.setData({
        parameter: that.data.parameter,
      })
    }) 
    }else{
    for (var i = 0; i < 12; i++) {
      var number = 2
      var newname = that.data.names[i]
      var listtarget = "parameter[" + i + "].name"
      number = numberlist[i]
      newname = newname + "(" + number + ")"
      that.setData({
        [listtarget]: newname,
      })
    };
    that.data.parameter[0].checked = true;
    that.setData({
      parameter: that.data.parameter,
    })
    } 
  },
  parameterTap: function(e){
    var that=this;
    var this_checked = e.currentTarget.dataset.id;
    var this_type = e.currentTarget.dataset.type;
    var parameterList = this.data.parameter
    for(var i=0;i<parameterList.length;i++){
      if(parameterList[i].id == this_checked){
        parameterList[i].checked = true;
      }else{
        parameterList[i].checked = false;
      }
    }
    that.setData({
      parameter: parameterList,
      checkedtype: this_type,
    })
  },
//跳转
  searchresult: function (e) {
    wx.navigateTo({
      url: '/pages/searchredirect/searchredirect?type=' + this.data.checkedtype + '&model=' + this.data.checkedmodel + '&name=' + this.data.checkedname + '&shop=' + this.data.checkedshop,
    })
  }
})