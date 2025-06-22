<script setup lang="ts">
import { tabbarStore } from './tabbar'
// 'i-carbon-code',
import { tabbarList as _tabBarList, cacheTabbarEnable, selectedTabbarStrategy } from './tabbarList'

// @ts-expect-error 预知的判断
const customTabbarEnable = selectedTabbarStrategy === 1 || selectedTabbarStrategy === 2
/** tabbarList 里面的 path 从 pages.config.ts 得到 */
const tabbarList = _tabBarList.map(item => ({ ...item, path: `/${item.pagePath}` }))
function selectTabBar(name: number) {
  const url = tabbarList[name].path
  tabbarStore.setCurIdx(name)
  if (cacheTabbarEnable) {
    uni.switchTab({ url })
  }
  else {
    uni.navigateTo({ url })
  }
}
onLoad(() => {
  // 解决原生 tabBar 未隐藏导致有2个 tabBar 的问题
  // @ts-expect-error 预知的判断
  const hideRedundantTabbarEnable = selectedTabbarStrategy === 1
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
</script>

<template>
  <up-tabbar
    v-if="customTabbarEnable"
    v-model:current="tabbarStore.curIdx"
    bordered
    safeareainsetbottom
    placeholder
    fixed
    @change="selectTabBar"
  >
    <block v-for="(item, idx) in tabbarList" :key="item.path">
      <up-tabbar-item
        v-if="item.iconType === 'uiLib'"
        :text="item.text"
        :icon="item.icon"
        :name="idx"
      />

      <up-tabbar-item
        v-else-if="item.iconType === 'unocss' || item.iconType === 'iconfont'"
        :text="item.text"
        :name="idx"
      >
        <template #icon>
          <view
            h-40rpx
            w-40rpx
            :class="[item.icon, idx === tabbarStore.curIdx ? 'is-active' : 'is-inactive']"
          />
        </template>
      </up-tabbar-item>
      <up-tabbar-item v-else-if="item.iconType === 'local'" :text="item.text" :name="idx">
        <template #icon>
          <image :src="item.icon" h-40rpx w-40rpx />
        </template>
      </up-tabbar-item>
    </block>
  </up-tabbar>
</template>
