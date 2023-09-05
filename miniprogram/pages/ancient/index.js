const regeneratorRuntime = require("../../utils/regenerator-runtime/runtime")
const type = {
  100000: '全部',
  100001: '经部',
  100002: '史部',
  100003: '子部',
  100004: '集部'
}
const typeCount = {
  100000: '', // 373
  100001: '21',
  100002: '68',
  100003: '264',
  100004: '20'
}
const subType = {
  100001: {
    100001: '经部',
    10000101: '易类',
    10000102: '书类',
    10000103: '诗类',
    10000104: '礼类',
    10000105: '春秋类',
    10000106: '孝经类',
    10000107: '五经总义类',
    10000108: '四书类',
    10000109: '乐类',
    10000110: '小学类'
  },
  100002: {
    100002: '史部',
    10000201: '正史类',
    10000202: '编年类',
    10000203: '纪事本末类',
    10000204: '杂史类',
    10000205: '别史类',
    10000206: '诏令奏议类',
    10000207: '传记类',
    10000208: '史钞类',
    10000209: '载记类',
    10000210: '时令类',
    10000211: '地理类',
    10000212: '职官类',
    10000213: '政书类',
    10000214: '目录类',
    10000215: '史评类'
  },
  100003: {
    100003: '子部',
    10000301: '儒家类',
    10000302: '兵家类',
    10000303: '法家类',
    10000304: '农家类',
    10000305: '医家类',
    10000306: '天文算法类',
    10000307: '术数类',
    10000308: '艺术类',
    10000309: '谱录类',
    10000310: '杂家类',
    10000311: '类书类',
    10000312: '小说家类',
    10000313: '释家类',
    10000314: '道家类'
  },
  100004: {
    100004: '集部',
    10000401: '楚辞类',
    10000402: '别集类',
    10000403: '总集类',
    10000404: '诗文评类',
    10000405: '词曲类'
  }
}
let count = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 20,
    list: [],
    isMore: true,
    type: type,
    subType: subType,
    typeCount: typeCount,
    itemKey: null,
    activeWord: '',
    activeKey: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this.getCount()
    await this.getList()
  },
  async getCount() {
    const { activeWord, activeKey } = this.data
    const db = wx.cloud.database()
    let searchCount = 0
    if (activeWord) {
      const params = {}
      if (type[activeKey]) {
        params.classStr = activeWord
      } else {
        params.type = activeWord
      }
      searchCount = await db.collection('ancients').where(params).count()
    } else {
      searchCount = await db.collection('ancients').count()
    }
    count = searchCount.total
  },
  async getList() {
    const { page, pageSize, list, activeWord, activeKey } = this.data
    wx.showLoading({ title: '加载中...' })
    const db = wx.cloud.database()
    const limit = pageSize * (page - 1)
    let res = []
    if (activeWord) {
      const params = {}
      if (type[activeKey]) {
        params.classStr = activeWord
      } else {
        params.type = activeWord
      }
      res = await db.collection('ancients').where(params).orderBy('id', 'asc').limit(pageSize).skip(limit).get()
    } else {
      res = await db.collection('ancients').orderBy('id', 'asc').limit(pageSize).skip(limit).get()
    }
    if (res.errMsg && res.errMsg === 'collection.get:ok' && res.data) {
      const clearList = res.data.map(item => {
        item.cont = item.cont.replace(/<[^>]+>/gim, '')
        item.cont = item.cont.replace(/<[^>]+>/gim, '')
        item.coverUrl = this.getBookCover(42, 12)
        return item
      })
      const newList = page === 1 ? clearList : list.concat(clearList)
      this.setData({
        list: newList,
        isMore: count > newList.length
      })
    }
    wx.hideLoading()
  },
  loadMore() {
    if (this.data.isMore) {
      this.setData({
        page: this.data.page + 1
      }, () => {
        this.getList()
      })
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 2000
      })      
    }
  },
  goToSearch() {
    wx.navigateTo({url: '/pages/ancient-search/index'})
  },
  goToCatalogue(e) {
    const { item } = e.currentTarget.dataset
    wx.navigateTo({url: `/pages/ancient-catalogue/index?id=${item.id}&idjm=${item.idjm}`})
  },
  showCategory(e) {
    const { key } = e.currentTarget.dataset
    if (key == 100000) {
      this.setData({
        page: 1,
        itemKey: null,
        activeWord: '',
        activeKey: ''
      }, () => {
        this.getList()
      })
    } else {
      this.setData({ itemKey: key })
    }
  },
  closeCategory() {
    this.setData({ itemKey: null })
  },
  preventCard() {},
  goToSearchPage(e) {
    const { key, value } = e.currentTarget.dataset
    this.closeCategory()
    this.setData({
      page: 1,
      activeWord: value,
      activeKey: key
    }, () => {
      this.getCount()
      this.getList()
    })
  },
  getBookCover(n = 42, m = 12) {
    const num = Math.round(Math.random() * (n - m) + m)
    return 'cloud://prod-5gw53icy2059663b.7072-prod-5gw53icy2059663b-1257623689/bg'+num+'.jpg'
  }
})