/**
 * 2025-06-25 v3.3.0版（重新梳理tabbar配置）
 *
 * 1)原生tabbar，不需要关心 本文件夹里面的内容。(这是默认配置)
 * 2)自定义tabbar（带缓存），保留 `pages.config.ts 的 tabBar配置`，修改本文件对应的代码。
 * 3)自定义tabbar（不带缓存），虽然我认为这是个伪需求，但是问卷调查中确实有人使用这个。要删除 `pages.config.ts 的 tabBar配置`。
 * 4)无tabbar，直接删除下面的tabBar配置即可。（同样不需要关心`layouts/fg-tabbar`）
 *
 * 温馨提示：这样算下来就只剩2种了，一个是原生tabbar，一个是带缓存的自定义tabbar(简称自定义tabbar)。
 */

// TODO：是否开启自定义tabbar，默认不开启(不开启表示使用原生tabbar，开启表示使用自定义tabbar)
export const CUSTOM_TABBAR_ENABLE = false
// TODO: 是否开启自定义tabbar的无缓存模式，默认不开启（开启表示使用自定义tabbar的无缓存模式，并且需要把 `pages.config.ts` 里面的 tabBar 配置删除）
export const CUSTOM_TABBAR_NO_CACHE = false

/**
 * 根据您选择的UI框架，配置相应的字段信息
 * pagePath 需要与 pages.config.ts 里面的 tabBar.list 里面的 pagePath 保持一致，这样才有缓存效果。
 * iconType: uiLib, unocss, local, iconfont。
 */
export const tabbarList = [
  {
    pagePath: 'pages/index/index',
    text: '首页',
    icon: 'home',
    // 选用 UI  框架自带的 icon时，iconType 为 uiLib
    iconType: 'uiLib',
  },
  {
    pagePath: 'pages/about/about',
    text: '关于',
    icon: 'i-carbon-code',
    // 注意 unocss 的图标需要在 页面上引入一下，或者配置到 unocss.config.ts 的 safelist 中
    iconType: 'unocss',
  },
  // {
  //   pagePath: 'pages/my/index',
  //   text: '我的',
  //   icon: '/static/logo.svg',
  //   iconType: 'local',
  // },
  // {
  //   pagePath: 'pages/mine/index',
  //   text: '我的',
  //   icon: 'iconfont icon-my',
  //   iconType: 'iconfont',
  // },
]
