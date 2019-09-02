// pages/preScreen/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    userInfo: {},
    showGetUserInfo: true,
    redirect: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { redirect } = options
    let userInfo = wx.getStorageSync('userInfo')
    let openid = wx.getStorageSync('openid')
    if (!redirect) {
      redirect = '/pages/index/index'
    }
    this.setData({
      showGetUserInfo: !userInfo && openid,
      userInfo,
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
        } else if (this.data.userInfo) {
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
        this.setData({ openid, showGetUserInfo: !this.data.userInfo && openid })
        wx.setStorage({ key: 'openid', data: openid })
        if (this.data.userInfo) {
          this.goRedirectTo()
        }
      },
      fail: err => {
        this.goRedirectTo()
      }
    })
  },
  getUserInfo (e) {
    const { userInfo = {} } = e.detail
    if (userInfo && userInfo.nickName) {
      userInfo.type = 'login'
    } else {
      userInfo.nickName = '访客123'
      userInfo.avatarUrl = 'cloud://develop-094aba.6465-develop-094aba/cover/login.png'
      userInfo.city = '北京'
      userInfo.country = '中国'
      userInfo.gender = 1
      userInfo.language = 'zh_CN'
      userInfo.province = '北京'
      userInfo.type = 'nologin'
    }
    this.setData({ userInfo, showGetUserInfo: false })
    wx.setStorage({ key: 'userInfo', data: userInfo })
    this.goRedirectTo()
  },
  goToPage () {
    const userInfo = {
      nickName: '访客123',
      avatarUrl: 'cloud://develop-094aba.6465-develop-094aba/cover/login.png',
      city: '北京',
      country: '中国',
      gender: 1,
      language: 'zh_CN',
      province: '北京',
      type: 'nologin'
    }
    this.setData({ userInfo, showGetUserInfo: false })
    wx.setStorage({ key: 'userInfo', data: userInfo })
    this.goRedirectTo()
  },
  goRedirectTo () {
    wx.reLaunch({ url: this.data.redirect })
  }
})