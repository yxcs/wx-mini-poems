let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
import { formatTime, showCal } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    isHideTip: true,
    detail: {},
    startX: 0,
    startY: 0,
    isNoLess: false,
    isNoMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const isHideTip = wx.getStorageSync('isHideTip')
    if (!isHideTip) {
      wx.showModal({
        title: '提示',
        content: '上下滑动，切换推荐内容',
        success: (res) => {
          this.setData({ isHideTip })
          wx.setStorageSync('isHideTip', true)
        }
      })
    }
    this.getRecommend()
  },
  onShareAppMessage: function () {},
  goToDetail () {
    let  { detail } = this.data
    wx.navigateTo({ url: `/pages/poemDetail/index?id=${detail.poemsId}`})
  },
  onStart (e) {
    if (e.touches.length === 1) {
      this.setData({
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      })
    }
  },
  onEnd (e) {
    if (e.changedTouches.length == 1) {
      let moveX = e.changedTouches[0].clientX;
      let disX = this.data.startX - moveX;
      if (disX > 60) {
        return false
      }
      let moveY = e.changedTouches[0].clientY;
      let disY = this.data.startY - moveY;
      if (disY > 180) {
        this.getRecommend()
      } else if (disY < -180) {
        this.getRecommendPre()
      }
      this.setData({
        startX: 0,
        startY: 0
      })
    }
  },
  onCancel (e) {
    this.setData({
      startX: 0,
      startY: 0
    })
  },
  async getRecommend () {
    let { detail, isNoMore } = this.data
    if (isNoMore) {
      return false
    }
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    const _ = db.command
    const order = detail.order || 0
    let res = await db.collection('recommend').orderBy('order', 'asc').where({ order: _.gt(order) }).limit(1).get()
    let list = res.data.map(item => {
      item.updateTxt = showCal(item.updateAt)
      return item
    })
    wx.hideLoading()
    isNoMore = !list.length
    if (isNoMore) {
      wx.showToast({ title: '暂无更多推荐', icon: 'none', duration: 1500 })
    }
    this.setData({ isNoMore, detail: isNoMore ? detail : list[0] })
  },
  async getRecommendPre () {
    let { detail, isNoLess } = this.data
    if (isNoLess) {
      return false
    }
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    const _ = db.command
    const order = detail.order || 0
    let res = await db.collection('recommend').orderBy('order', 'asc').where({ order: _.lt(order) }).limit(1).get()
    let list = res.data.map(item => {
      item.updateTxt = item.updateTxt = showCal(item.updateAt)
      return item
    })
    wx.hideLoading()
    isNoLess = !list.length
    if (isNoLess) {
      wx.showToast({ title: '已经是第一个了', icon: 'none', duration: 1500 })
    }
    this.setData({ isNoLess, detail: isNoLess ? detail : list[0] })
  }
})