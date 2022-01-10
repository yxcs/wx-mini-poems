const regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")

let count = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 20,
    list: [],
    isMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this.getCount()
    await this.getList()
  },
  async getCount() {
    const db = wx.cloud.database()
    const searchCount = await db.collection('ancients').count()
    count = searchCount.total
  },
  async getList() {
    const { page, pageSize, list } = this.data
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    const limit = pageSize * (page - 1)
    let res = await db.collection('ancients').orderBy('id', 'asc').limit(pageSize).skip(limit).get()
    if (res.errMsg && res.errMsg === 'collection.get:ok' && res.data) {
      const clearList = res.data.map(item => {
        item.cont = item.cont.replace(/<[^>]+>/gim, '')
        item.cont = item.cont.replace(/<[^>]+>/gim, '')
        return item
      })
      const newList = list.concat(clearList)
      this.setData({
        list: newList,
        isMore: count > newList.length
      })
    }
    wx.hideLoading()
  },
  loadMore() {
    if (this.data.isMore) {
      this.setData({
        page: this.data.page + 1
      }, () => {
        this.getList()
      })
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 2000
      })      
    }
  },
  goToSearch() {
    wx.navigateTo({url: '/pages/ancient-search/index'})
  },
  goToCatalogue(e) {
    const { item } = e.currentTarget.dataset
    wx.navigateTo({url: `/pages/ancient-catalogue/index?id=${item.id}&idjm=${item.idjm}`})
  }
})