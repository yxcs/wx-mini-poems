// miniprogram/pages/test/index.js.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.startCloud()
  },

  // test `test` cloud function
  startCloud () {
    wx.cloud.callFunction({
      name: 'test',
      data: {
        a: 1,
        b: 2
      }
    }).then(console.log)

    // wx.chooseImage({
    //   count: 1,
    //   sourceType: 'album',
    //   success (res) {
    //     console.log(res)
    //     wx.cloud.uploadFile({
    //       cloudPath: 'recommend/r3.png', // 上传至云端的路径
    //       filePath: res.tempFilePaths[0], // 小程序临时文件路径
    //       success: res => {
    //         // 返回文件 ID
    //         console.log(res.fileID)
    //       },
    //       fail: console.error
    //     })
    //   },
    //   fail (err) {
    //     console.log(err)
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})