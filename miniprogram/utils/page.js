const app = getApp()

class InitPage {
  constructor(config = {}) {
    this.opts = config
  }
  page = (config = {}) => {
    const opts = {
      ...this.opts,
      ...config
    }
    const {
      data,
      onLoad
    } = opts
    opts.data = {
      system: app.globalData.system,
      ...data
    }
    opts.onLoad = function onload(options) {
      if (onLoad) {
        onLoad.call(this, options)
      }
    }
    Page(opts)
  }
}

const MyPage = new InitPage()

module.exports = MyPage.page