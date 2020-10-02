Page({
  /**
   * 页面的初始数据
   */
  data: {
    house:'',
    House:{},
    count:'',
    Time:''
    //最新的10个录入对象
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    const db = wx.cloud.database();
    var house=new Object();
    db.collection('out').get({
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
  refresh:function(e){
    var _this=this;
    console.log(this.data.house.length);
    var count=this.data.house.length;
    _this.setData({
      count:count
    })
    this.onLoad();
  },

  move(){
   wx.cloud.callFunction({
     name:'delete',
     success(res){
       console.log(res)
     },
     fail(res){
      console.log(res)
    }
   })
  },
})