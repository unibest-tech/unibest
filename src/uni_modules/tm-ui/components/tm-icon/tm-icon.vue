<template>
  <text
    @tap="onclick"
    v-if="!isImg"
    :class="['tmIcon', `${prefix}${iconName}`, isSpin?'tmIconSpin':'',_class]"
    :style="[
      {
        fontSize: iconSize,
        color: fontColor,
        fontFamily: fontFamily,
        fontStyle: 'normal',
      },
      rotateDeg ? { transform: `rotate(${rotateDeg})` } : {},
      _style
    ]"
  ></text>
  <image
    v-if="isImg"
    @tap="onclick"
    :src="iconName"
    :class="['tmIcon', isSpin?'tmIconSpin':'',_class]"
    :style="[
      { width: iconSize, height: iconSize },
      rotateDeg ? { transform: `rotate(${rotateDeg})` } : {},
      _style
    ]"
  ></image>
</template>
<script setup lang="ts">
import { computed, PropType } from 'vue'
import { covetUniNumber } from "../../libs/tool";
import { useTmConfig } from "../../libs/config";
import { getDefaultColor } from "../../libs/colors";

/**
 * @displayName 图标
 * @exportName tm-icon
 * @category 常用组件
 * @description 图标,可以是图片地址或者字体名称图标.也可以是你自定义的图标.
 * 如何自定义图标呢:你可以在iconfont网站勾选图标->添加购物车->添加项目->项目设置,勾选woff2,勾选base64->下载本地->解压得到iconfont.css
 * ->复制到你的app.vue全局中即可.然后使用图标时,font-family是你的图标名称比如myicon,prefix是图标前缀比如myicon-
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
	| --- | --- | --- | --- |
	| ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: "TmIcon" });
const { config } = useTmConfig();
const emits = defineEmits([
  /**
   * 点击事件
   */
  "click",
]);
const attrs = defineProps({
  _style:{
    type:[Object,String] as PropType<CSSStyleDeclaration|string>,
    default:""
  },
  _class:{
	type: String,
    default:""
  },
  /**
   * 图标名称,可以是图片地址
   */
  name: {
    type: String,
    default: "",
    required: true,
  },
  /**
   * 图标大小,默认32rpx
   */
  size: {
    type: [Number, String],
    default: "32",
  },
  /**
   * 图标颜色
   */
  color: {
    type: String,
    default: "#333333",
  },
  /**
   * 暗黑时的图标颜色
   */
  darkColor: {
    type: String,
    default: "white",
  },
  /**
   * 图标是否旋转
   */
  spin: {
    type: Boolean,
    default: false,
  },
  /**
   * 旋转角度
   */
  rotate: {
    type: String,
    default: "",
  },
  /**字体图标名称,如果你要显示你自己的名称时,需要改成你自己的图标名称. */
  fontFamily: {
    type: String,
    default: "remixicon",
  },
  /**图标名称前缀,默认为ri-,没有你可以为空 */
  prefix: {
    type: String,
    default: "ri-",
  },
});

const iconName = computed(() => attrs.name);
const iconSize = computed(() => covetUniNumber(attrs.size, "rpx"));
const isImg = computed(() => iconName.value.includes("."));
const isSpin = computed(() => attrs.spin);
const rotateDeg = computed(() => attrs.rotate);
const _style = computed(() => attrs._style);
const _class = computed(() => attrs._class);
const fontColor = computed(() => {
  let color = attrs.color;
  if (config.mode == "dark" && attrs.darkColor) {
    color = attrs.darkColor;
  }
  return getDefaultColor(color);
});
const onclick = () => emits("click");
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
.tmIcon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  transition: transform 0.3s linear;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.tmIconSpin {
  animation: tmIconAniSPin 1s infinite linear;
}

@keyframes tmIconAniSPin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
