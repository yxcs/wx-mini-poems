let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    author: '',
    dynasty: '',
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { author, dynasty } = options
    this.setData({ author, dynasty })
    this.getAuthorDetail(author, dynasty)
  },
  onShareAppMessage: function () {},
  async getAuthorDetail (author, dynasty) {
    const db = wx.cloud.database()
    const res = await db.collection('authors').where({name: author, dynasty}).get()
    this.setData({ detail: res.data.length && res.data[0]})
  },
  goToSearch () {
    const { author } = this.data
    wx.navigateTo({ url: `/pages/search/index?type=${author}&field=zuozhe` })
  }
})