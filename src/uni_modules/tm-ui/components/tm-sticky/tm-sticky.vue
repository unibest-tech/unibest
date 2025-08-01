<script setup lang="ts">
import { computed, ref, onMounted, watch, PropType } from "vue";
import { arrayNumberValid, getUid, arrayNumberValidByStyleMP, arrayNumberValidByStyleBorderColor, arrayNumberValidByStyleBorderStyle, covetUniNumber, linearValid, getUnit } from "../../libs/tool";
import { useTmConfig } from "../../libs/config";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
/**
* @displayName 粘性布局
* @exportName tm-sticky
* @category 导航组件
* @description 对于需要多个头定位的页面，可以使用粘性布局，将页面分为多个区域，每个区域可以单独设置粘性。
* @constant 平台兼容
*	| H5 | uniAPP | 小程序 | version |
   | --- | --- | --- | --- |
   | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
*/
defineOptions({ name: 'TmStikcy' });
const { config } = useTmConfig()

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
.tmSticky{
    position: relative;
}
</style>
<template>
<view class="tmSticky">
    <!-- 
    @slot 正常布局内容,如果想粘性头,tm-sticky-header组件必须是直接子节点组件
    -->
    <slot></slot>
</view>
</template>