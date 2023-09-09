// pages/ancient-detail/index.js
const InitPage = require('../../utils/page')
InitPage({

  /**
   * 页面的初始数据
   */
  data: {
    idjm: '',
    detail: {}
  },
  async onLoad (options) {
    this.setData({ idjm: options.idjm })
    await this.getDetail(options.idjm)
  },
  async getDetail(idjm) {
    const db = wx.cloud.database()
    let res = await db.collection('ancient_book_views').where({ idjm: idjm }).limit(1).get()
    if (res && res.errMsg === "collection.get:ok" && res.data && res.data.length) {
      const detail = res.data[0]
      detail.content.tb_bookview.cont = detail.content.tb_bookview.cont.replace(/<[^>]+>/gim, '')
      this.setData({ detail })
    }
  },
  goToPrev() {
    const detail = this.data.detail
    if (detail.content.prevId) {
      wx.redirectTo({url: `/pages/ancient-detail/index?idjm=${detail.content.prevIdjm}`})
    }
  },
  goToNext() {
    const detail = this.data.detail
    if (detail.content.nextId) {
      wx.redirectTo({url: `/pages/ancient-detail/index?idjm=${detail.content.nextIdjm}`})
    }
  }
})