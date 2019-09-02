let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    field: '',
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { field } = options
    this.setData({ field })
    this.getList(field)
  },
  onShareAppMessage: function () {},
  goToSearch: function (e) {
    const { type = '' } = e.currentTarget.dataset
    wx.navigateTo({url: `/pages/search/index?type=${type}`})
  },
  async getList (field) {
    const db = wx.cloud.database()
    const _ = db.command
    let type = field
    if (field === 'leixing') {
      type = 'type'
    } else if (field === 'zuozhe') {
      type = 'author'
    } else if (field === 'chaodai') {
      type = 'dynasty'
    } else if (field === 'cipai') {
      type = 'cipai'
    }
    let res = await db.collection('options').where({ type }).get()
    console.log(res)
    this.setData({ detail: res.data[0] })
  }
})