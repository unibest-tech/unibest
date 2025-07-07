type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]

interface GithubGitee {
  github: string
  gitee: string
}

interface BaseTemplateList {
  /**
   * 模板名称
   */
  title: string
  /**
   * 模板数据
   */
  value: {
    /**
     * 模板类型 不能为custom
     * @property {string} type - 模板类型，用于 `pnpm create unibest xx -t yy` 里面的 `yy`
     *
     */
    type: string
    /**
     * 仓库分支，不填的话为主分支
     * @property {string} branch - 仓库分支
     *
     */
    branch?: string
    /**
     * 模板地址 github和gitee地址至少存在一个
     * @property {string} github - github地址
     * @property {string} gitee - gitee地址
     */
    url: AtLeastOne<GithubGitee>
    /**
     * 模板下载完成后的回调函数
     * @param {string} root - 模板下载的根目录
     */
    callBack?: (root: string) => void
  }
  /**
   * 模板描述
   */
  description?: string
}

export type TemplateList = BaseTemplateList
