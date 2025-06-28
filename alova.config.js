// alova.config.js
module.exports = {
  // api生成设置数组，每项代表一个自动生成的规则，包含生成的输入输出目录、规范文件地址等等
  generator: [
    // 服务器1
    {
      // input参数1：openapi的json文件url地址
      input: 'http://localhost:3001/api-docs-json',

      // input参数2：以当前项目为相对目录的本地地址
      // input: 'openapi/api.json'

      // input参数3：没有直接指向openapi文件时，是一个文档地址，必须配合platform参数指定文档类型
      // input: 'http://192.168.5.123:8080'

      // （可选）platform为支持openapi的平台，目前只支持swagger，默认为空
      // 当指定了此参数后，input字段只需要指定文档的地址而不需要指定到openapi文件
      platform: 'swagger',

      // 接口文件和类型文件的输出路径，多个generator不能重复的地址，否则生成的代码会相互覆盖
      output: 'src/api',

      // （可选）指定生成的响应数据的mediaType，以此数据类型来生成2xx状态码的响应ts格式，默认application/json
      responseMediaType: 'application/json',

      // （可选）指定生成的请求体数据的bodyMediaType，以此数据类型来生成请求体的ts格式，默认application/json
      bodyMediaType: 'application/json',

      // （可选）指定生成的api版本，默认为auto，会通过当前项目安装的alova版本判断当前项目的版本，如果生成不正确你也可以自定义指定版本
      version: 'auto',

      /**
       * （可选）生成代码的类型，可选值为auto/ts/typescript/module/commonjs，默认为auto，会通过一定规则判断当前项目的类型，如果生成不正确你也可以自定义指定类型：
       * ts/typescript：意思相同，表示生成ts类型文件
       * module：生成esModule规范文件
       * commonjs：表示生成commonjs规范文件
       */
      type: 'auto',

      /**
       * 全局导出的api名称，可通过此名称全局范围访问自动生成的api，默认为`Apis`，配置了多个generator时为必填，且不可以重复
       */
      global: 'Apis',

      /**
       * 全局api对象挂载的宿主对象，默认为 `globalThis`，在浏览器中代表 `window`，在nodejs中代表 `global`
       */
      globalHost: 'globalThis',

      /**
       * （可选）过滤或转换生成的api接口函数，返回一个新的apiDescriptor来生成api调用函数，未指定此函数时则不转换apiDescripor对象
       *
       * `apiDescriptor` 的类型和 openapi 文件的 api 项相同。
       * @see https://spec.openapis.org/oas/v3.1.0.html#operation-object
       */
      // handleApi: (apiDescriptor) => {
      //   // 返回falsy值表示过滤此api
      //   if (!apiDescriptor.path.startsWith('/user')) {
      //     return
      //   }

      //   apiDescriptor.parameters = (apiDescriptor.parameters || []).filter(
      //     param => param.in === 'header' && param.name === 'token',
      //   )
      //   delete apiDescriptor.requestBody.id
      //   apiDescriptor.url = apiDescriptor.url.replace('/user', '')
      //   return apiDescriptor
      // },
    },

    // 服务器2
    {
      // ...
    },
  ],

  // （可选）是否自动更新接口，默认开启，每5分钟检查一次，false时关闭
  autoUpdate: true,

  /* 也可以配置更详细的参数
  autoUpdate: {
    // 编辑器开启时更新，默认false
    launchEditor: true,
    // 自动更新间隔，单位毫秒
    interval: 5 * 60 * 1000
  }
  */
}
