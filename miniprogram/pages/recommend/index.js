let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
import { formatTime } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    isHideTip: true,
    detail: {},
    startX: 0,
    startY: 0
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
        this.setData({
          startX: 0,
          startY: 0
        })
      }
    }
  },
  onCancel (e) {
    this.setData({
      startX: 0,
      startY: 0
    })
  },
  async getRecommend () {
    const { detail } = this.data
    if (this.data.isNoMore) {
      return false
    }
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    const _ = db.command
    const order = detail.order || 0
    let res = await db.collection('recommend').orderBy('order', 'desc').where({ order: _.gt(order) }).limit(1).get()
    let list = res.data.map(item => {
      item.updateTxt = formatTime(new Date(item.updateAt), 2)
      return item
    })
    wx.hideLoading()
    if (!list.length) {
      wx.showToast({ title: '暂无推荐', icon: 'none', duration: 1500 })
    }
    console.log(list)
    this.setData({ isNoMore: !!list.length, detail: list[0] })
  }
})