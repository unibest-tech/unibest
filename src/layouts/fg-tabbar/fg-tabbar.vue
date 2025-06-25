<script setup lang="ts">
import { tabbarStore } from './tabbar'
// 'i-carbon-code',
import { tabbarList as _tabBarList, cacheTabbarEnable, selectedTabbarStrategy, TABBAR_MAP } from './tabbarList'

// @ts-expect-error 预知的判断
const customTabbarEnable
= selectedTabbarStrategy === TABBAR_MAP.CUSTOM_TABBAR_WITH_CACHE
  || selectedTabbarStrategy === TABBAR_MAP.CUSTOM_TABBAR_WITHOUT_CACHE

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
</script>

<template>
  <uv-tabbar
    v-if="customTabbarEnable"
    :value="tabbarStore.curIdx"
    active-color="#d81e06"
    inactive-color="#7d7e80"
    bordered
    safeareainsetbottom
    placeholder
    fixed
    @change="selectTabBar"
  >
    <block v-for="(item, idx) in tabbarList" :key="item.path">
      <uv-tabbar-item
        v-if="item.iconType === 'uiLib'"
        :text="item.text"
        :icon="item.icon"
        :name="idx"
      />

      <uv-tabbar-item
        v-else-if="item.iconType === 'unocss' || item.iconType === 'iconfont'"
        :text="item.text"
        :name="idx"
      >
        <template #active-icon>
          <view
            h-40rpx
            w-40rpx
            class="text-[#d81e06]"
            :class="[item.icon, idx === tabbarStore.curIdx ? 'is-active' : 'is-inactive']"
          />
        </template>
        <template #inactive-icon>
          <view
            h-40rpx
            w-40rpx
            class="text-[#7d7e80]"
            :class="[item.icon, idx === tabbarStore.curIdx ? 'is-active' : 'is-inactive']"
          />
        </template>
      </uv-tabbar-item>
      <uv-tabbar-item v-else-if="item.iconType === 'local'" :text="item.text" :name="idx">
        <template #icon>
          <image :src="item.icon" h-40rpx w-40rpx />
        </template>
      </uv-tabbar-item>
    </block>
  </uv-tabbar>
</template>
