<template>
    <!-- @vue-ignore -->
    <view @click="onClick" class="tmRow" :style="[
        {
            'flex-wrap': _attrs.wrap ? 'wrap' : 'nowrap',
            'justify-content': _attrs.justify,
            'align-items': _attrs.align,
            'gap': _gap
        }
    ]">
        <!-- @slot 默认插槽,请允许放置tmCol组件 -->
        <slot></slot>
    </view>
</template>
<script setup lang="ts">
import { computed, PropType, provide } from 'vue';
import {
    arrayNumber
} from "../../libs/tool";
/**
 * @displayName 布局Row
 * @exportName tm-row
 * @category 常用组件
 * @description 快速排版布局利器,内只能放置tmCol组件,默认是5列栅格,可以自行更改
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({
    name: "TmRow", options: {
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
     * 默认列数,请不要动态修改此值。
     */
    column: {
        type: [Number, String],
        default: 5
    },
    /**
     * 子元素左右对齐排列
     */
    justify: {
        type: String as PropType<"flex-start" | "flex-end" | "center" | "space-between" | "space-around">,
        default: "start"
    },
    /**
     * 子元素上下对齐排列
     * 是align-items：值
     */
    align: {
        type: String as PropType<"center" | "flex-start" | "flex-end" | "stretch" | "baseline">,
        default: "flex-start"
    },
    /**
     * 是否自动断行.
     */
    wrap: {
        type: Boolean,
        default: true
    },
    /**
     * 上下左右间隙.
     * [row,col]:x表示纵向间隙,y表示横向间隙
     * col,[col]:表示横向和纵向之间的间隙.
     */
    gutter: {
        type: [String, Number, Array<string | number>],
        default: '0'
    }
})
const _attrs = computed(() => attrs);
const tmRowColWidth = computed((): number => {
    let col = typeof attrs.column == 'string' ? parseInt(attrs.column) : attrs.column
    return col
})
const _gutter = computed(() => arrayNumber(_attrs.value.gutter))
const _gap = computed(() => {

    return _gutter.value.join(' ')
})
const onClick = ()=>{
    emits('click');
}

provide("tmRowColWidth", tmRowColWidth)
provide("tmRowColGutter", _gutter)
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
.tmRow {
    display: flex;
}
</style>