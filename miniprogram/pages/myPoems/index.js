let orderIdx = 1008
let imgName = 4

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgURL: '',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  selectPic () {
    wx.chooseImage({
      count: 1,
      sourceType: 'album',
      success: (res) => {
        this.setData({
          imgURL: res.tempFilePaths[0]
        })
      },
      fail (err) {
        console.log(err)
      }
    })
  },

  savePic () {
    const body = {
      "content": [],
      "dynasty": '',
      "poemsId": '',
      "title": '',
      "updateAt": +new Date(),
      "author": '',
      "order": ++orderIdx,
      "createAt": +new Date(),
      "type": "img",
      "bgType": "color",
      "imgUrl": '',
      "bgColor": "#f00",
      "bgUrl": "cloud://prod-5gw53icy2059663b.7072-prod-5gw53icy2059663b-1257623689/bg10.jpg",
      "isShow": true
    }
    let name = this.data.imgURL
    name = name.split('.')
    name = name[name.length - 1]
    name = 'recommend/r' + (++imgName) + '.' + name
    this.setData({
      loading: true
    })
    wx.cloud.uploadFile({
      cloudPath: name, // 上传至云端的路径
      filePath: this.data.imgURL, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        body.imgUrl = res.fileID
        const db = wx.cloud.database()
        db.collection('recommend').add({
          data: body,
          success: (addRes) => {
            if (addRes._id) {
              this.setData({
                imgURL: '',
                loading: false
              })
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1500
              })
            }
          }
        })
      },
      fail: console.error
    })
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