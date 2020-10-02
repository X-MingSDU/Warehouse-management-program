//app.js
//全局逻辑，里面要加上云函数
// App是用来注册一个小程序

App({
  onLaunch: function () { //生命周期函数，监视小程序的初始化。初始化完成后触发，只触发一次
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'firsttest-n27bb', //编号
        traceUser: true,  //必不可少
      })
    }

    let capsuleInfo = wx.getMenuButtonBoundingClientRect();
    this.globalData.capsuleInfo = capsuleInfo //获取胶囊信息，左上角的胶囊信息，navigationstyle：“custom”
  },
  globalData: {}
})
