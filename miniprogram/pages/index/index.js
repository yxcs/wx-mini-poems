//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isShowRecommend: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    
  },
  goToSearch: function (e) {
    const { type = '' } = e.currentTarget.dataset
    wx.navigateTo({url: `/pages/search/index?type=${type}`})
  },
  goToCategory: function (e) {
    const { type = '' } = e.currentTarget.dataset
    if (type === 'cipai') {
      wx.navigateTo({url: '/pages/cipai/index'})
    } else if (type === 'chaodai') {
      wx.navigateTo({url: '/pages/dynasty/index'})
    } else if (type === 'leixing') {
      wx.navigateTo({url: '/pages/typeList/index'})
    }
  },
  closeRecommmend: function () {
    this.setData({
      isShowRecommend: false
    })
  },
  preventScroll: function () {
    return false;
  }
})
