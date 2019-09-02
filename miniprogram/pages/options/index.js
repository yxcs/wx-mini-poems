let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({ userInfo })
  },
  async bindFormSubmit (e) {
    const { userInfo } = this.data
    const { options } = e.detail.value
    if (options === '' || options === null || options === undefined) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    const params = {
      content: escape(options),
      createAt: new Date(),
      updateAt: new Date(),
      status: 0, // 0未处理，1已处理
      feedback: '',
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName
    }
    const db = wx.cloud.database()
    const res = await db.collection('suggests').add({
      data: {...params}
    })
    wx.showToast({
      title: '反馈成功，感谢您的支持',
      icon: 'none',
      duration: 2000
    })
    let timmer = setTimeout(() => {
      clearTimeout(timmer)
      timmer = null
      wx.navigateBack({ delta: 1 })
    }, 2000)
  }
})