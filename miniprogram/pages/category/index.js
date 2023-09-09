// pages/category/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [
      {
        id: 'chaodai',
        type: '朝代',
        hasMore: true,
        sub: [
          {subId: 'weijin', name: '魏晋'},
          {subId: 'tangdai', name: '唐代'},
          {subId: 'sognchao', name: '宋代'},
          {subId: 'mingdai', name: '明代'},
          {subId: 'qingchao', name: '清代'}
        ]
      }, {
        id: 'cipai',
        type: '词牌',
        hasMore: true,
        sub: [
          {subId: 'huanxisha', name: '浣溪沙'},
          {subId: 'sdgt', name: '水调歌头'},
          {subId: 'dlh', name: '蝶恋花'},
          {subId: 'rml', name: '如梦令'}
        ]
      }, {
        id: 'leixing',
        type: '类型',
        hasMore: true,
        sub: [
          {subId: 'mh', name: '梅花'},
          {subId: 'ag', name: '爱国'},
          {subId: 'hf', name: '豪放'},
          {subId: 'sx', name: '思乡'},
          {subId: 'lb', name: '离别'},
          {subId: 'aq', name: '爱情'},
          {subId: 'ty', name: '田园'},
          {subId: 'xn', name: '写鸟'}
        ]
      }, {
        id: 'zuozhe',
        type: '作者',
        hasMore: true,
        sub: [
          {subId: 'zq', name: '李白'},
          {subId: 'ag', name: '杜甫'},
          {subId: 'hf', name: '苏轼'},
          {subId: 'sx', name: '王维'},
          {subId: 'lb', name: '杜牧'},
          {subId: 'aq', name: '陆游'},
          {subId: 'ty', name: '辛弃疾'},
          {subId: 'xn', name: '李清照'}
        ]
      }
    ],
    pageShowType: app.globalData.pageShowType
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    if (!app.globalData.pageShowType || app.globalData.pageShowType === 'init') {
      await this.getShowType()
    }
    this.setData({ pageShowType: app.globalData.pageShowType })
  },
  async getShowType() {
    const db = wx.cloud.database()
    let res = await db.collection('horn').limit(1).get()
    let pageShowType = 'init'
    if (res && res.errMsg === 'collection.get:ok') {
      pageShowType = res.data && res.data[0] && res.data[0].pageShowType ? res.data[0].pageShowType : 'init'
    }
    this.setData({ pageShowType })
    app.globalData.pageShowType = pageShowType
  },
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  goToMore (e) {
    const { type } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/categoryMore/index?field=${type}` })
  },
  goToSearch (e) {
    const { type, field } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/search/index?type=${type}&field=${field}` })
  }
})