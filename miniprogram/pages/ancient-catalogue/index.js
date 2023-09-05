// pages/ancient-catalogue/index.js
let count = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    idjm: '',
    book: {},
    catalogue: [],
    hasMore: true,
    page: 1,
    pageSize: 20,
    coverUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) { 
    const { id, idjm } = options
    this.setData({ id, idjm })
    await this.getBook(id)
    await this.getCount(idjm)
    await this.getCatalogue(idjm)
  },
  async getCount(idjm) {
    const db = wx.cloud.database()
    const searchCount = await db.collection('ancient_book_views').where({ bookIDjm: idjm }).count()
    count = searchCount.total
  },
  async getBook(id) {
    const db = wx.cloud.database()
    let res = await db.collection('ancients').where({ id: +id }).limit(1).get()
    if (res && res.errMsg === "collection.get:ok" && res.data && res.data.length) {
      const book = res.data[0]
      book.cont = book.cont.replace(/<[^>]+>/gim, '')
      this.setData({ book })
    }
    this.getBookCover(42, 12)
  },
  async getCatalogue(idjm) {
    const { catalogue, pageSize, page } = this.data
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    const limit = pageSize * (page - 1)
    let res = await db.collection('ancient_book_views').where({ bookIDjm: idjm }).orderBy('id', 'asc').limit(pageSize).skip(limit).get()
    if (res && res.errMsg === "collection.get:ok" && res.data && res.data.length) {
      const newCatalogue = catalogue.concat(res.data)
      this.setData({
        catalogue: newCatalogue,
        hasMore: count > newCatalogue.length
      })
    }
    wx.hideLoading()
  },
  goToCatalogue(e) {
    const { item } = e.currentTarget.dataset
    wx.navigateTo({url: `/pages/ancient-detail/index?idjm=${item.idjm}`})
  },
  onReachBottom() {
    const { idjm, hasMore, page } = this.data
    if (hasMore) {
      this.setData({
        page: page + 1
      }, () => {
        this.getCatalogue(idjm)
      })
    }
  },
  getBookCover(n = 42, m = 12) {
    const num = Math.round(Math.random() * (n - m) + m)
    this.setData({
      coverUrl: 'cloud://prod-5gw53icy2059663b.7072-prod-5gw53icy2059663b-1257623689/bg'+num+'.jpg'
    })
  }
})