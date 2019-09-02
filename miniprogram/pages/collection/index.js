let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
import { formatTime } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnWidth: 150,
    startX: '',
    startY: '',
    delBtnWidth: '',
    leftPos: 0,
    openid: '',
    collections: { list: [] }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = wx.getStorageSync('openid')
    this.setData({ openid })
    this.getRealWidth(this.data.btnWidth)
    this.getCollection(openid)
  },
  onShareAppMessage: function () {},
  // 滑动删除相关
  // rpx 转为px，因为滑动事件获取的x,y单位为px
  getRealWidth: function (w) {
    let real = 0;
    try {
      let res = wx.getSystemInfoSync().windowWidth;
      let scale = (750 / 2) / (w / 2);
      real = Math.floor(res / scale);
      this.setData({ delBtnWidth: real });
    } catch (e) {
      return false;
    }
  },
  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.setData({
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      });
    }
  },
  onTouchMove(e) {
    const { idx } = e.currentTarget.dataset
    let { collections } = this.data
    if (e.touches.length == 1) {
      let moveX = e.touches[0].clientX; // 当前手指移动到的位置
      let disX = this.data.startX - moveX;
      let delBtnWidth = this.data.delBtnWidth;
      let leftPos = '';
      if (disX <= 0) {  // 如果移动距离小于等于0，说明向右滑动，文本层位置不变
        leftPos = 0;
      } else {
        if (disX >= delBtnWidth) {
          leftPos = -delBtnWidth; // 控制手指移动距离最大值为删除按钮的宽度
        } else {
          leftPos = -disX; // 移动距离大于0, 小于按钮宽度，文本层left值等于手指移动距离
        }
      }

      let moveY = e.touches[0].clientY;
      if (Math.abs(moveY - this.data.startY) > 50) {
        leftPos = 0;
      }
      
      collections.list = collections.list.map((item, index) => {
        if(index === idx) {
          item.leftPos = leftPos
        }
        return item
      })
      this.setData({ collections })
    }
  },
  onTouchEnd(e) {
    const { idx } = e.currentTarget.dataset
    let { collections } = this.data
    if (e.changedTouches.length == 1) {
      let endX = e.changedTouches[0].clientX;
      let disX = this.data.startX - endX;
      let delBtnWidth = this.data.delBtnWidth;
      let leftPos = disX > delBtnWidth / 2 ? -delBtnWidth : 0;  // 如果距离小于删除按钮的1/2，不显示删除按钮

      let moveY = e.changedTouches[0].clientY;
      if (Math.abs(moveY - this.data.startY) > 50) {
        leftPos = 0;
      }

      collections.list = collections.list.map((item, index) => {
        if(index === idx) {
          item.leftPos = leftPos
        }
        return item
      })
      this.setData({ collections })
    }
  },
  async getCollection (openid) {
    const db = wx.cloud.database()
    const res = await db.collection('collections').where({_openid: openid}).get()
    let collections = res && res.data && res.data.length ? res.data[0] : {}
    collections.list = collections.list.map(item => {
      item.createAtTxt = formatTime(item.createAt, 2)
      item.leftPos = 0
      return item
    })
    this.setData({ collections })
  },
  goToDetial (e) {
    const { poemId } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/poemDetail/index?id=${poemId}` })
  },
  // 删除操作
  async deleteItem (e) {
    let { collections } = this.data
    const { poemId } = e.currentTarget.dataset
    const db = wx.cloud.database()
    let list = collections.list.filter(item => item.poemId !== poemId)
    const res = await db.collection('collections').doc(collections._id).update({
      data: {
        updateAt: new Date(),
        list: [...list]
      }
    })
    collections.list = [...list]
    this.setData({ collections })
    wx.showToast({
      title: '删除成功',
      icon: 'none',
      duration: 2000
    })
  }
})