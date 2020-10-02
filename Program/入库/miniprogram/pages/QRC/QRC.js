// pages/QRC/QRC.js
//只显示数据库中的前20个存储记录
//最上边又一个类似搜索的案例，前段传入后端，进行条件匹配并返回
Page({
  /**
   * 页面的初始数据
   */
  data: {
    house:'',
    House:{},
    count:'',
    Time:'',
    reverse:0
    //最新的10个录入对象
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    const db = wx.cloud.database();
    var house=new Object();
    db.collection('warehouse').get({
      success: function(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        console.log(res.data);
        console.log(res.data.reverse());
          house=res.data; 
        that.setData({
          house:house,
        })
        return house;
        //console.log(house[0])
      }
    });
    this.house=house;
    
  },
  //下拉到底触发事件
  lower:function(){
    console.log("我到了底部");
    wx.showToast({
      title: '下拉刷新',
      duration: 1000
    })
  },
  reverse(){
    var that=this;
    that.setData({
      reverse:1
    })
  },
  refresh:function(e){
    var _this=this;
    console.log(this.data.house.length);
    var count=this.data.house.length;
    _this.setData({
      count:count
    });
    if(count==0){
      wx.showToast({
        title: '库存为0请入库',
        duration: 1000
      });
    }
    this.onLoad();
  },
  delete_btn:function(e){
    //var that = this;
    var now=new Date();
    var date=now.getDate();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var hour = now.getHours(); //小时
    var minute = now.getMinutes(); //分
    var second = now.getSeconds();
    var Time =year+"年"+month+"月"+date+"日"+hour+"时"+minute+"分"+second+"秒";

    var index = e.currentTarget.dataset.index;
    console.log(typeof(index));
    var ID = new Object();
    ID = this.data.house[index]._id;
    console.log(ID);
    const db = wx.cloud.database();
    //出库数据定义
    var ID = this.data.house[index]._id;
    var name = this.data.house[index].name;
    var time = this.data.house[index].time;
    var price = this.data.house[index].price;

    db.collection('out').add({
      // data 字段表示需新增的 JSON 数据
      data: {
       //ID,name，price,time,Time
       ID :ID,
       name: name ,
       time: time, 
       Time: Time,
       price:price,
       done:false

      },
    });
    db.collection('warehouse').doc(ID).remove({
      success: function(res) {
        console.log(res.data);
        wx.showToast({
          title: '删除成功',
          duration: 1000
        })
      }
    })
  },
  search(){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})