let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetAllTypes()
  },
  onShareAppMessage: function () {

  },
  async onGetAllTypes () {
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    let res = await db.collection('options').where({ type: 'changjianfenlei' }).get()
    let detail = res.data[0]
    detail = detail.tags.map(item => {
      if (item.mainName === '类型') {
        item.field = 'leixing'
      } else if (item.mainName === '作者') {
        item.field = 'zuozhe'
      } else if (item.mainName === '朝代') {
        item.field = 'chaodai'
      }
    })
    this.setData({ detail: res.data[0] })
    wx.hideLoading()
  },
  goToSearch (e) {
    const { current } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/search/index?type=${current.name}&field=${current.field}` })
  }
})