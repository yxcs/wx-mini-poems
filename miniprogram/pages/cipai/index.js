let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
Page({
  data: {
    detail: {},
    current: {_id: 0}
  },
  onLoad: function (options) {
    this.onGetAllCiPai()
  },
  onShareAppMessage: function () {
  },
  async onGetAllCiPai () {
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    let res = await db.collection('options').where({ type: 'cipaidaquan' }).get()
    this.setData({ detail: res.data[0] })
    wx.hideLoading()
  },
  showPopup (e) {
    const { current } = e.currentTarget.dataset
    this.setData({ current })
    wx.showModal({
      title: current.name,
      content: `已收录${current.pager * 10}条: ${current.description}`,
      success: () => {
        this.setData({ current: {_id: 0} })
      }
    })
  }
})