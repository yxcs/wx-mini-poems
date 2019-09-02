let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    openid: '',
    isCollection: false,
    showCard: false,
    detail: {},
    collections: { list: [] }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options
    const openid = wx.getStorageSync('openid')
    this.setData({ id, openid })
    this.getPoemDetail(id)
    this.getCollection(openid)
  },
  onShareAppMessage: function () {},
  async getPoemDetail (id) {
    const db = wx.cloud.database()
    const res = await db.collection('poems').doc(id).get()
    let detail = res.data
    detail.content = detail.content.map(item => {
      item = item.replace(/<\/?.+?\/?>/g, '')
      return item;
    })
    this.setData({ detail })
  },
  goToAuthor () {
    const { author, dynasty } = this.data.detail
    wx.navigateTo({ url: `/pages/author/index?author=${author}&dynasty=${dynasty}` })
  },
  showCardDialog () {
    this.setData({ showCard: true })
  },
  closeCard () {
    this.setData({ showCard: false })
  },
  async getCollection (openid) {
    const db = wx.cloud.database()
    const res = await db.collection('collections').where({_openid: openid}).get()
    let collections = res && res.data && res.data.length ? res.data[0] : {}
    let isCollection = false
    collections.list && collections.list.forEach(item => {
      if (item.poemId === this.data.id) {
        isCollection = true
      }
    })
    this.setData({ collections, isCollection })
  },
  async setCollection () {
    const { id, openid, collections, isCollection, detail } = this.data
    const db = wx.cloud.database()
    if (collections._id) {
      let list = []
      if (isCollection) {
        list = collections.list.filter(item => item.poemId !== id)
      } else {
        list = collections.list.concat([{createAt: new Date(), poemId: id, poemName: detail.name, poemAuthor: detail.author, poemDynasty: detail.dynasty}]) 
      }
      const res = await db.collection('collections').doc(collections._id).update({
        data: {
          updateAt: new Date(),
          list: [...list]
        }
      })
    } else {
      const res = await db.collection('collections').add({
        data: {
          updateAt: new Date(),
          list: [{
            createAt: new Date(),
            poemId: id,
            poemName: detail.name,
            poemAuthor: detail.author,
            poemDynasty: detail.dynasty
          }]
        }
      })
    }
    wx.showToast({
      title: isCollection ? '取消收藏成功' : '收藏成功',
      icon: 'none',
      duration: 2000
    })
    this.getCollection(openid)
  }
})