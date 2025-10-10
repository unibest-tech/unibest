'use strict'
exports.main = async (event, context) => {
  // event为客户端上传的参数
  console.log('event : ', event)

  // 返回数据给客户端
  return `${event.data},from unicloud function`
}
