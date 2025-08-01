<template>
    <view @click="onClick" class="tmCol" :style="{ width: _span }">
        <!-- @slot 默认插槽 -->
        <slot></slot>
    </view>
</template>
<script setup lang="ts">
import { computed, ComputedRef, inject } from 'vue';
/**
 * @displayName 布局Col
 * @exportName tm-col
 * @page tm-row
 * @category 常用组件
 * @description 快速排版布局利器,内只能放置在父组件tmRow中
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({
    name: "TmCol", options: {
        styleIsolation: "apply-shared",
        virtualHost: true,
        addGlobalClass: true,
        multipleSlots: true,
    }
});
const emits = defineEmits([
    /**
     * 点击事件
     */
    'click',

])
const attrs = defineProps({
    /**
     * 列宽，它是根据row定义的总列宽计算具体的宽度值。
     */
    span: {
        type: [Number, String],
        default: 1
    },
})
const tmRowColWidth = inject<ComputedRef<number>>('tmRowColWidth', computed((): number => 5));
const tmRowColGutter = inject<ComputedRef<string[]>>('tmRowColGutter', computed((): string[] => ['0px', '0px']));
const _span = computed(() => {
    let col = typeof attrs.span == 'string' ? parseInt(attrs.span) : attrs.span
    let gutter = tmRowColGutter.value[1];
    if (gutter == '0rpx') {
        gutter = '0px'
    }
    if (col == tmRowColWidth.value) {
        return `100%`
    }
    return `calc(${col / tmRowColWidth.value * 100}% - ${gutter} + ${gutter} / ${tmRowColWidth.value})`;
})
const onClick = ()=>{
    emits('click');
}
</script>
<script lang="ts">
export default {
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
    addGlobalClass: true,
    multipleSlots: true,
  },
};
</script>
<style lang="scss" scoped>
.tmCol {
    flex-shrink: 0;
    box-sizing: border-box;
}
</style>