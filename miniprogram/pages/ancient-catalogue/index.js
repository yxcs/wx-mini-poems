// pages/ancient-catalogue/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    idjm: '',
    book: {},
    catalogue: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) { 
    const { id, idjm } = options
    this.setData({ id, idjm })
    await this.getBook(id)
    await this.getCatalogue(idjm)
  },
  async getBook(id) {
    const db = wx.cloud.database()
    let res = await db.collection('ancients').where({ id: +id }).limit(1).get()
    if (res && res.errMsg === "collection.get:ok" && res.data && res.data.length) {
      const book = res.data[0]
      book.cont = book.cont.replace(/<[^>]+>/gim, '')
      this.setData({ book })
    }
  },
  async getCatalogue(idjm) {
    const db = wx.cloud.database()
    let res = await db.collection('ancient_book_views').where({ bookIDjm: idjm }).orderBy('id', 'asc').get()
    if (res && res.errMsg === "collection.get:ok" && res.data && res.data.length) {
      this.setData({
        catalogue: res.data
      })
    }
  },
  goToCatalogue(e) {
    const { item } = e.currentTarget.dataset
    wx.navigateTo({url: `/pages/ancient-detail/index?idjm=${item.idjm}`})
  }
})