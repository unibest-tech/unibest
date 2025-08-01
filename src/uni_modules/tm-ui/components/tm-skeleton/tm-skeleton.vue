<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, onActivated } from 'vue'
import {
	arrayNumberValid,
	arrayNumberValidByStyleMP,
	covetUniNumber,
	arrayNumber,
	arrayNumberValidByStyleBorderColor,
	linearValid,
	getUnit,
	getUid,
} from "../../libs/tool";
import {
	getDefaultColor,
	getDefaultColorObj,
	getOutlineColorObj,
	getTextColorObj,
	getThinColorObj,
} from "../../libs/colors";
import { useTmConfig } from "../../libs/config";

/**
 * @displayName 骨架屏
 * @exportName tm-skeleton
 * @category 展示组件
 * @description 样式灵活多变。
 * @constant 平台兼容
 *    | H5 | uniAPP | 小程序 | version |
 | --- | --- | --- | --- |
 | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: "tmSkeleton" });
const {config} = useTmConfig();
const props = defineProps({
	/**
	 * 高，单位允许%，auto,'数字',rpx,px
	 */
	height: {
		type: String,
		default: '12'
	},
	/**
	 * 宽，单位允许%，auto,'数字',rpx,px
	 */
	width: {
		type: String,
		default: "auto"
	},
	/**
	 * 背景颜色
	 */
	color: {
		type: String,
		default: '#e4e4e4'
	},
	/**
	 * 暗黑背景颜色
	 */
	darkColor: {
		type: String,
		default: '#323232'
	},
	/**
	 * 圆角
	 */
	round: {
		type: String,
		default: "3"
	},
	/**
	 * 动画间隔
	 */
	duration: {
		type: String,
		default: '900ms'
	}
})

const myopacity = ref(1)
const tid = ref(0)

const _width = computed((): string => {
	return covetUniNumber(props.width, config.unit)
})

const _height = computed((): string => {
	return covetUniNumber(props.height, config.unit)
})

const _round = computed((): string => {
	return covetUniNumber(props.round, config.unit)
})

const _color = computed((): string => {
	if (config.mode == 'dark') {
		return getDefaultColor(props.darkColor)
	}
	return getDefaultColor(props.color)
})

onMounted(() => {
	tid.value = setTimeout(() => {
		myopacity.value = 0
	}, 300)
})

onBeforeUnmount(() => {
	clearTimeout(tid.value)
})

onActivated(() => {
    myopacity.value = 0
})

const animationEnd = () => {
	myopacity.value = myopacity.value == 1 ? 0 : 1
}
</script>

<template>
	<view ref="xSkeleton" class="xSkeleton" @transitionend="animationEnd" :style="{
		backgroundColor: _color,
		width: _width,
		height: _height,
		borderRadius: _round,
		opacity: myopacity,
		transitionDuration: duration
	}"></view>
</template>

<style scoped>
.xSkeleton {
	transition-timing-function: linear;
	/* transition-duration: 900ms; */
	transition-property: opacity;
}
</style>