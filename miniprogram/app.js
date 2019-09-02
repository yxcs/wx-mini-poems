//app.js
App({
  onLaunch: function (options) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    
    wx.setStorageSync('initData', options)
    this.globalData.initUrl = '/' + options.path
    this.checkLogin()
  },
  globalData: {},
  checkLogin () {
    wx.checkSession({
      success: () => {
        let userInfo = wx.getStorageSync('userInfo')
        let openid = wx.getStorageSync('openid')
        if (!userInfo || !openid) {
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
