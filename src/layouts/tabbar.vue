<script lang="ts" setup>
import FgTabbar from '@/tabbar/index.vue'

const testUniLayoutExposedData = ref('testUniLayoutExposedData')
defineExpose({
  testUniLayoutExposedData,
})
</script>

<template>
  <view>
    <slot />
    <FgTabbar />
  </view>
</template>
