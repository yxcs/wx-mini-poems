//app.js
App({
  onLaunch: function (options) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'prod-5gw53icy2059663b'
      })
    }
    
    wx.setStorageSync('initData', options)
    this.globalData.initUrl = '/' + options.path
    this.checkLogin()
  },
  globalData: {
    pageShowType: 'init'
  },
  checkLogin () {
    wx.checkSession({
      success: () => {
        let openid = wx.getStorageSync('openid')
        if (!openid) {
          this.goToPreScreen()
        }
      },
      fail: () => {
        this.goToPreScreen()
      },
    })
  },
  goToPreScreen () {
    if (this.globalData.initUrl.indexOf('preScreen') > -1) {
      wx.redirectTo({ url: '/pages/preScreen/index?redirect=pages/index/index' })
    } else {
      wx.redirectTo({ url: `/pages/preScreen/index?redirect=${this.globalData.initUrl}` })
    }
  }
})
