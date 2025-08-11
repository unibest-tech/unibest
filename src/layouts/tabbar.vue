<script lang="ts" setup>
import FgTabbar from '@/tabbar/index.vue'

const testUniLayoutExposedData = ref('testUniLayoutExposedData')
defineExpose({
  testUniLayoutExposedData,
})
</script>

<template>
  <div>
    <slot />
    <FgTabbar />
  </div>
</template>
