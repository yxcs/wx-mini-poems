// pages/preScreen/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    redirect: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { redirect } = options
    let openid = wx.getStorageSync('openid')
    if (!redirect) {
      redirect = '/pages/index/index'
    }
    this.setData({
      redirect,
      openid
    }, () => {
      this.login()
    })
  },
  login () {
    wx.checkSession({
      success: () => {
        if (!this.data.openid) {
          this.getOpenid()
        } else {
          this.goRedirectTo()
        }
      },
      fail: () => {
        wx.login({
          success: () => {
            this.getOpenid()
          }
        })
      },
    })
  },
  getOpenid () {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        const { openid } = res.result
        this.setData({ openid })
        wx.setStorage({ key: 'openid', data: openid })
        this.goRedirectTo()
      },
      fail: err => {
        this.goRedirectTo()
      }
    })
  },
  goRedirectTo () {
    if (this.data.redirect) {
      wx.reLaunch({ url: this.data.redirect })
    } else {
      wx.reLaunch({ url: '/pages/index/index' })
    }
  }
})