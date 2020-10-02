// get app

Page({
  data:{
    //要用到，要显示得放data里面
    qRCodeMsg:'',
    scanType:'',
    charSet:'',
    RESULT:'',
    name:'',
    price:'',
    time:''
  },

  getQRCode: function(){
    var _this = this;
    //1、第一步扫描
    wx.scanCode({        //扫描API
      success: function(res){
        console.log(res);
        var scanType = res.scanType;
        var charSet = res.charSet;  //输出回调信息
        var qRCodeMsg=res.result;
        //2、结果赋值
        _this.setData({
          qRCodeMsg: res.result,
          scanType: scanType,
          charSet: charSet
        });
        //3、结果显示
        /*wx.showToast({
          title: '成功',
          duration: 1000
        });*/
        //4、调用云api识别商品类型
        wx.request({
          url: 'https://jisutxmcx.market.alicloudapi.com/barcode2/query',
          method:'get',
          header:{
            'Authorization':'APPCODE 5b7aa2ff0ec64cc9bdced5855aaa5830',
            'content-type': 'application/json',
            'charset': 'utf-8',
          },
          data: {
            barcode: qRCodeMsg,
          },
          success(res){
            
            var RESULT=res.data;
            console.log(RESULT);
            var name=RESULT.result.name;
            var price=RESULT.result.price;

            _this.setData({
              RESULT:RESULT,
              name:name,
              price:price
            });

            //5、入库
        const db = wx.cloud.database();
        //获取时间相关元素
        var now=new Date();
        var date=now.getDate();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var hour = now.getHours(); //小时
        var minute = now.getMinutes(); //分
        var second = now.getSeconds();
        var time =month+"月"+date+"日";
        db.collection('warehouse').add({
        // data 字段表示需新增的 JSON 数据
      data: {
          // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          name:name,
          time:time,
          price:price,
        },
        success: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res._id),
          _this.setData({
            time:time
          })
          wx.showToast({
            title: '成功入库',
            duration: 1500
          });
        },
        fail: function(res) {
          wx.showToast({
            title: "入库失败",
            duration: 1500
          });
        }
        })

          }

        });
    }
  })
}       
})
