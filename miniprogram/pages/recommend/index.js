let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
import { formatTime } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    list: [],
    isNoMore: false,
    count: 0,
    current: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetRecommend()
  },
  onReachBottom: function () {
    if (!this.data.isNoMore) {
      this.onScrollToLower()
    }
  },
  onShareAppMessage: function () {},
  async onScrollToLower () {
    let { page, pageSize, count, isNoMore, list } = this.data
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    const total = Math.ceil(count / pageSize)
    if (page < total) {
      page ++
    } else {
      isNoMore = true
    }
    const skip = (page - 1) * pageSize
    let res = await db.collection('recommend').orderBy('updateAt', 'desc').skip(skip).limit(this.data.pageSize).get()
    list = list.concat(res.data)
    this.setData({ list, isNoMore, page })
    wx.hideLoading()
  },
  async onGetRecommend () {
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    let searchCount = await db.collection('recommend').count()
    let res = await db.collection('recommend').orderBy('updateAt', 'desc').limit(this.data.pageSize + 1).get()
    let isNoMore = searchCount.total <= (this.data.pageSize + 1)
    let list = res.data.map(item => {
      item.updateTxt = formatTime(new Date(item.updateAt), 2)
      return item
    })
    let current = list.splice(0, 1)
    this.setData({ list, count: searchCount.total, isNoMore, current: current[0] })
    wx.hideLoading()
  },
  goToDetail (e) {
    let  { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/poemDetail/index?id=${id}`})
  }
})