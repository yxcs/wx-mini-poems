// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = (event, context) => {
  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const res = cloud.getWXContext()
  let openid = 'oyqgG0c5u21wRnAiOPVgrZuL_3'
  let appid = null
  let unionid = null
  if (res && res.OPENID) {
    openid = res.OPENID
    appid = res.APPID
    unionid = res.UNIONID
  } else if (res && res.openid) {
    openid = res.openid
    appid = res.appid
    unionid = res.unionid
  } else if (res && res.result && res.result.openid) {
    openid = res.result.openid
    appid = res.result.appid
    unionid = res.result.unionid
  } else if (res && res.result && res.result.OPENID) {
    openid = res.result.OPENID
    appid = res.result.APPID
    unionid = res.result.UNIONID
  }

  return {
    event,
    openid: openid,
    appid: appid,
    unionid: unionid,
  }
}
