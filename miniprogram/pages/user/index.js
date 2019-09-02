// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    userInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = wx.getStorageSync('openid')
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({ openid, userInfo })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShareAppMessage: function () {

  },
  goToCollection () {
    wx.navigateTo({ url: '/pages/collection/index'})
  },
  goToAboutUs () {
    wx.navigateTo({ url: '/pages/aboutUs/index'})
  },
  goToOptions () {
    wx.navigateTo({ url: '/pages/options/index'})
  },
  exit () {
    console.log('退出登录')
  }
})