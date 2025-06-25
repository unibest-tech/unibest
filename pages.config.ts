import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'unibest',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^fg-(.*)': '@/components/fg-$1/fg-$1.vue',
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  /**
   * 2025-06-25 v3.3.0版（重新梳理tabbar配置）
   *
   * 1)原生tabbar，不需要关心 `layouts/fg-tabbar` 文件夹里面的内容。(这是默认配置)
   * 2)自定义tabbar（带缓存），同时保留下面的配置和修改 `/layouts/fg-tabbar/tabbarList.ts` 对应的代码。
   * 3)自定义tabbar（不带缓存），经过调查和合理性判断，认定这是个伪需求，默认不提供。(如果需要，请联系菲鸽，我们battle一下^_^，看是不是真的有需求)
   * 4)无tabbar，直接删除下面的tabBar配置即可。（同样不需要关心`layouts/fg-tabbar`）
   *
   * 温馨提示：这样算下来就只剩2种了，一个是原生tabbar，一个是带缓存的自定义tabbar(简称自定义tabbar)。
   * 温馨提示：本文件的任何代码更改了之后，都需要重新运行，否则 pages.json 还是旧的，导致不是预期效果。
   */
  tabBar: {
    color: '#999999',
    selectedColor: '#018d71',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [{
      iconPath: 'static/tabbar/home.png',
      selectedIconPath: 'static/tabbar/homeHL.png',
      pagePath: 'pages/index/index',
      text: '首页',
    }, {
      iconPath: 'static/tabbar/example.png',
      selectedIconPath: 'static/tabbar/exampleHL.png',
      pagePath: 'pages/about/about',
      text: '关于',
    }],
  },
})
