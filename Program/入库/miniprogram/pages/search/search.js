// miniprogram/pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    house:'',
    House:{},
    count:'',
    time:'',
    date:''
    //最新的10个录入对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    const db = wx.cloud.database();
    var house=new Object();
    var result=this.data.date;
    console.log(result);
    console.log(typeof(result));
    db.collection('warehouse').where({
        time:result
    })
    .get({
        success: function(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        console.log(res.data);
        console.log(res.data.reverse());
        house=res.data;   
        that.setData({
          house:house,
        })
        //console.log(house[0])
      }
    });
  },

  refresh:function(e){
    var _this=this;
    console.log(this.data.house.length);
    var count=this.data.house.length;
    _this.setData({
      count:count
    })
    this.onLoad();
  },

  getmonth:function(e){
    var that=this;
    var val=e.detail.value.input;
    console.log(val);
    that.setData({
      date:val
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