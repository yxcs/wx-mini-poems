// miniprogram/pages/single/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type } = options
    if (type) {
      this.setData({ type })
      this.getDetails(type)
    }
  },
  onShareAppMessage: function () {},
  getDetails (type) {
    const db = wx.cloud.database()
    db.collection('single').where({ type }).get()
    .then(res => {
      this.setData({ detail: res.data[0] })
    })
  }
})