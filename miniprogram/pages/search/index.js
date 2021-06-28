let regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchType: '',
    searchWord: '',
    list: [],
    listType: '',
    count: 0,
    keyWord: '',
    page: 1,
    pageSize: 20,
    isNoMore: false,
    tagType: '',
    tagKey: 0,
    field: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type = '', field = '' } = options
    let searchType = ''
    let tagType = ''
    let tagKey = 0
    let searchWord = ''
    if (!type) {
      searchType = 'search'
    } else if (type === 'sanbai') {
      searchType = type
      tagType = '唐诗三百首'
      tagKey = 11
    } else if (type === 'bixue') {
      searchType = type
      tagType = '小学古诗'
      tagKey = 21
    } else if (type === 'dongtian') {
      searchType = type
      tagType = '冬天'
    } else if (type === 'yueliang') {
      searchType = type
      tagType = '月亮'
    } else if (type === 'zhanzheng') {
      searchType = type
      tagType = '战争'
    } else if (type === 'daowang') {
      searchType = type
      tagType = '悼亡'
    } else {
      searchType = type
      tagType = type
      searchWord = type
    }
    this.setData({ searchType, tagType, tagKey, field, searchWord })
    if (field) {
      this.onAccurateSearch(field, searchWord)
    } else if (tagType) {
      this.onTypeSearch({target:{dataset:{type:tagType, key: tagKey}}}) // 模拟事件返回
    }
  },
  onReachBottom: function () {
    if (this.data.isNoMore) {
      wx.showToast({ title: '没有更多了', icon: 'none', duration: 2000 })
    } else {
      this.getListByPage()
    }
  },
  onShareAppMessage: function () {},
  onSeachInput (e) {
    const { value } = e.detail
    this.setData({ searchWord: value })
  },
  async blurSearch () {
    let { searchWord, pageSize, count } = this.data
    const db = wx.cloud.database()
    if (searchWord === null || searchWord === '') {
      wx.showToast({ title: '请输入查询条件', icon: 'none', duration: 2000 })
      return false;
    }
    wx.showLoading({ title: '加载中...' })
    let searchCount = await db.collection('poems').where({ author: searchWord }).count()
    count = searchCount.total
    if (count) {
      let res = await db.collection('poems').where({ author: searchWord }).get()
      this.setData({ list: res.data, count, listType: 'author' })
    } else {
      searchCount = await db.collection('poems').where({ name: { $regex: `.*${searchWord}` , $options: 'i' } }).count()
      count = searchCount.total
      if (count) {
        let res = await db.collection('poems').where({ name: { $regex: `.*${searchWord}` , $options: 'i' } }).get()
        this.setData({ list: res.data, count, listType: 'name' })
      } else {
        let res = await db.collection('poems').where({ content: { $regex: `.*${searchWord}` , $options: 'i' } }).get()
        this.setData({ list: res.data, count, listType: 'name' })
      }
    }
    this.setData({ isNoMore: count < pageSize, page: 1 })
    wx.hideLoading()
  },
  async getListByPage () {
    let { listType, searchWord, page, pageSize, count, isNoMore, list, field } = this.data
    const db = wx.cloud.database()
    const _ = db.command
    if (searchWord === null || searchWord === '') {
      wx.showToast({ title: '请输入查询条件', icon: 'none', duration: 2000 })
      return false;
    }
    wx.showLoading({ title: '加载中...' })
    const total = Math.ceil(count / pageSize)
    if (page < total) {
      page ++
    } else {
      isNoMore = true
    }
    const skip = (page - 1) * pageSize
    if (listType === 'author') {
      let res = await db.collection('poems').where({ author: searchWord }).skip(skip).limit(pageSize).get()
      list = list.concat(res.data)
      this.setData({ list })
    } else if (listType === 'name') {
      let res = await db.collection('poems').where({ name: { $regex: `.*${searchWord}` , $options: 'i' } }).skip(skip).limit(pageSize).get()
      list = list.concat(res.data)
      this.setData({ list })
    } else if (listType === 'tag') {
      let res = await db.collection('poems').where({ tags: _.in([searchWord]) }).skip(skip).limit(pageSize).get()
      list = list.concat(res.data)
      this.setData({ list })
    } else {
      if (field === 'chaodai') {
        let res = await db.collection('poems').where({ dynasty: searchWord }).skip(skip).limit(pageSize).get()
        list = list.concat(res.data)
        this.setData({ list })
      } else if (field === 'cipai') {
        let res = await db.collection('poems').where({ name: { $regex: `.*${searchWord}` , $options: 'i' } }).skip(skip).limit(pageSize).get()
        list = list.concat(res.data)
        this.setData({ list })
      } else if (field === 'leixing') {
        let res = await db.collection('poems').where({ tags: _.in([searchWord]) }).skip(skip).limit(pageSize).get()
        list = list.concat(res.data)
        this.setData({ list })
      } else if (field === 'zuozhe') {
        let res = await db.collection('poems').where({ author: searchWord }).skip(skip).limit(pageSize).get()
        list = list.concat(res.data)
        this.setData({ list })
      }
    }
    this.setData({ page, isNoMore })
    wx.hideLoading()
  },
  goToDetail (e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/poemDetail/index?id=${id}` })
  },
  async onTypeSearch (e) {
    const { type, key } = e.target.dataset
    wx.showLoading({ title: '加载中...' })
    this.setData({
      tagType: type,
      page: 1,
      listType: 'tag',
      tagKey: +key,
      searchWord: type
    })
    const db = wx.cloud.database()
    const _ = db.command
    let count = await db.collection('poems').where({ tags: _.in([type]) }).count()
    let isNoMore = count.total <= this.data.pageSize
    let res =  await db.collection('poems').where({ tags: _.in([type]) }).get()
    console.log(res)
    this.setData({ list: res.data, count: count.total, isNoMore })
    wx.hideLoading()
  },
  async onAccurateSearch (field, searchWord) {
    const db = wx.cloud.database()
    const _ = db.command
    let count = 0
    if (field === 'chaodai') {
      let searchCount = await db.collection('poems').where({ dynasty: searchWord }).count()
      count = searchCount.total
      if (count) {
        let res = await db.collection('poems').where({ dynasty: searchWord }).get()
        this.setData({ list: res.data, count })
      }
    } else if (field === 'cipai') {
      let searchCount = await db.collection('poems').where({ name: { $regex: `.*${searchWord}` , $options: 'i' } }).count()
      count = searchCount.total
      if (count) {
        let res = await db.collection('poems').where({ name: { $regex: `.*${searchWord}` , $options: 'i' } }).get()
        this.setData({ list: res.data, count })
      }
    } else if (field === 'leixing') {
      let searchCount = await db.collection('poems').where({ tags: _.in([searchWord]) }).count()
      count = searchCount.total
      if (count) {
        let res = await db.collection('poems').where({ tags: _.in([searchWord]) }).get()
        this.setData({ list: res.data, count })
      }
    } else if (field === 'zuozhe') {
      let searchCount = await db.collection('poems').where({ author: searchWord }).count()
      count = searchCount.total
      if (count) {
        let res = await db.collection('poems').where({ author: searchWord }).get()
        this.setData({ list: res.data, count })
      }
    }
    let isNoMore = count <= this.data.pageSize
    this.setData({ isNoMore })
  }
})