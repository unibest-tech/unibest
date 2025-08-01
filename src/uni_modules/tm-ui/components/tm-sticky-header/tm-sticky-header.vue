<script setup lang="ts">
import { computed, ref, onMounted, watch, PropType } from "vue";
import { arrayNumberValid, getUid, arrayNumberValidByStyleMP, arrayNumberValidByStyleBorderColor, arrayNumberValidByStyleBorderStyle, covetUniNumber, linearValid, getUnit } from "../../libs/tool";
import { useTmConfig } from "../../libs/config";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
/**
* @displayName 粘性布局头
* @exportName tm-sticky-header
* @category 导航组件
* @page tm-sticky
* @description 只能是tm-sticky直接子节点,可以在节点内自由布局.可以多个放到tm-sticky中形成多个头置顶,当滚动到此位置时自动置顶.
* @constant 平台兼容
*	| H5 | uniAPP | 小程序 | version |
   | --- | --- | --- | --- |
   | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
*/
defineOptions({ name: 'tmStickyHeader' });
const { config } = useTmConfig()

const props = defineProps({
    /** 顶部偏移距离,必须是px单位. */
    top: {
        type: [Number, String],
        default: 0
    },
    /** 顶部距离 */
    zIndex: {
        type: [Number, String],
        default: 2
    },
})
const windowTop = ref('0rpx')
const _top = computed(() => covetUniNumber(props.top, 'px'))
const _zIndex = computed(() => props.zIndex)

onMounted(() => {
    windowTop.value = uni.getWindowInfo().windowTop+ 'px'
})
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
<style lang="css" scoped>
.tmStickyHeader {
    position: sticky;
    left: 0px;
}
</style>
<template>
    <view class="tmStickyHeader" :style="{ top: `calc(${_top} + ${windowTop})`, zIndex: _zIndex }">
        <!-- 
    @slot 头部内容
     -->
        <slot></slot>
    </view>
</template>