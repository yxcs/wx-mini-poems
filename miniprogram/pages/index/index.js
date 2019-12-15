let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
//获取应用实例
const app = getApp()

Page({
  data: {
    isShowRecommend: false,
    detail: {}
  },
  onLoad: function () {
    this.getRecommend()
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
  },
  async getRecommend () {
    const rOrder = wx.getStorageSync('rOrder')
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    let res = await db.collection('recommend').orderBy('order', 'desc').limit(1).get()
    wx.hideLoading()
    const detail = res.data.length ? res.data[0] : {}
    if (rOrder === detail.order) {
      this.setData({ detail: {} , isShowRecommend: false })
    } else {
      this.setData({ detail , isShowRecommend: !!res.data.length })
      wx.setStorageSync('rOrder', detail.order)
    }
  },
  goToDetail () {
    let  { detail } = this.data
    if (detail.poemsId) {
      wx.navigateTo({ url: `/pages/poemDetail/index?id=${detail.poemsId}`})
    } else {
      this.setData({ detail: {} , isShowRecommend: false })
    }
  }
})
