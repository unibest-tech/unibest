// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
  _before() {
    // 通用预处理器
  },
  /**
   * method1方法描述
   * @param {string} param1 参数1描述
   * @returns {object} 返回值描述
   */
  testFn(param1) {
    // 业务逻辑

    // 返回结果
    return `from ob,${param1}`
  },
}
