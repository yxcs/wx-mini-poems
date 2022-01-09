// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = wx.getStorageSync('openid')
    this.setData({ openid })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    let userInfo = wx.getStorageSync('userInfo') || '{}'
    userInfo = typeof userInfo === 'object' ? userInfo : JSON.parse(userInfo)
    if (userInfo && userInfo.avatarUrl && userInfo.nickName) {
      this.setData({
        hasUserInfo: true,
        userInfo
      })
    }
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
  goToUpdate () {
    wx.navigateTo({ url: '/pages/myPoems/index'})
  },
  exit () {
    console.log('退出登录')
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.setStorageSync('userInfo', e.detail.userInfo)
  }
})