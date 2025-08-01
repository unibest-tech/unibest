<script setup lang="ts">
import { tabbarStore } from './tabbar'
// 'i-carbon-code',
import { tabbarList as _tabBarList, cacheTabbarEnable, selectedTabbarStrategy, TABBAR_MAP } from './tabbarList'

const customTabbarEnable
= selectedTabbarStrategy === TABBAR_MAP.CUSTOM_TABBAR_WITH_CACHE
  || selectedTabbarStrategy === TABBAR_MAP.CUSTOM_TABBAR_WITHOUT_CACHE

/** tabbarList 里面的 path 从 pages.config.ts 得到 */
const tabbarList = _tabBarList.map(item => ({ ...item, path: `/${item.pagePath}` }))
function selectTabBar(index: number) {
  const url = tabbarList[index].path
  tabbarStore.setCurIdx(index)
  if (cacheTabbarEnable) {
    uni.switchTab({ url })
  }
  else {
    uni.navigateTo({ url })
  }
}
onLoad(() => {
  // 解决原生 tabBar 未隐藏导致有2个 tabBar 的问题
  const hideRedundantTabbarEnable = selectedTabbarStrategy === TABBAR_MAP.CUSTOM_TABBAR_WITH_CACHE
  hideRedundantTabbarEnable
  && uni.hideTabBar({
    fail(err) {
      console.log('hideTabBar fail: ', err)
    },
    success(res) {
      console.log('hideTabBar success: ', res)
    },
  })
})

// const list: TM.TABBAR_ITEM_INFO[] = [
//   { title: '首页', icon: 'home-smile-2-line', selectedIcon: 'home-smile-2-fill', dotType: 'dot' },
//   { title: '分类', icon: 'drive-line', selectedIcon: 'drive-fill' },
//   { title: '购物车', icon: 'shopping-basket-line', selectedIcon: 'shopping-basket-fill' },
//   { title: '统计', icon: 'bar-chart-2-line', selectedIcon: 'bar-chart-2-fill', dotLabel: '99+' },
//   { title: '我的', icon: 'group-line', selectedIcon: 'group-fill' },
// ]
const list = computed(() => {
  return tabbarList.map(item => ({
    ...item,
    title: item.text,
  }))
})
</script>

<template>
  <tm-tabbar
    v-if="customTabbarEnable"
    :list="list"
    :out-index="tabbarStore.curIdx"
    color="rgba(0,0,0,0.64)"
    out-bg-color="#ffffff"
    out-icon-color="#16ee9c"
    position="fixed"
    selected-color="#000000"
    @change="selectTabBar"
  />
</template>
