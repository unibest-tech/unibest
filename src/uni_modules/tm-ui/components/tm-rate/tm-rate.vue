<script setup lang="ts">
	import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
	import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, arrayNumberValidByStyleBorderStyle, linearValid, getUnit } from "../../libs/tool";
	import { useTmConfig } from "../../libs/config";
	import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";

	/**
	 * @displayName 评分
	 * @exportName tm-rate
	 * @category 表单组件
	 * @description 评分组件，只读和禁用等属性
	 * @constant 平台兼容
	 *	| H5 | uniAPP | 小程序 | version |
		| --- | --- | --- | --- |
		| ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
	 */
	defineOptions({ name: 'TmRate' });
	
	const { config } = useTmConfig()
	const props = defineProps({
		/**
		 * 当前分值，等同v-model
		 */
		modelValue: {
			type: Number,
			default: 0
		},
		/**
		 * 最大评分数量
		 */
		count: {
			type: Number,
			default: 5
		},
		/**
		 * 选中的颜色，默认空值取全局值
		 */
		color: {
			type: String,
			default: ""
		},
		/**
		 * 未选中的颜色
		 */
		unColor: {
			type: String,
			default: "#cacaca"
		},
		/**
		 * 未选中的暗黑背景颜色
		 * 空时取InputDark表单颜色
		 */
		darkUnColor: {
			type: String,
			default: "#8b8b8b"
		},
		/**
		 * 尺寸
		 */
		size: {
			type: String,
			default: "42"
		},
		/**
		 * 间隙
		 */
		space: {
			type: [String,Number],
			default: "8"
		},
		/**
		 * 选中的图标
		 */
		icon: {
			type: String,
			default: "star-fill"
		},
		/**
		 * 未选中的图标
		 */
		unicon: {
			type: String,
			default: "star-line"
		},
		/**
		 * 是否只读状态
		 */
		readonly: {
			type: Boolean,
			default: false
		},
		/**
		 * 是否禁用状态
		 */
		disabled: {
			type: Boolean,
			default: false
		},
		/**
		 * 是否显示右侧评分值
		 */
		showScore: {
			type: Boolean,
			default: false
		},
		/**
		 * 右侧文本分值文本的字号
		 */
		fontSize: {
			type: String,
			default: "28"
		},
		/**
		 * 是否开启半星
		 * 开启半星后，自定的unicon和icon失效。
		 */
		half: {
			type: Boolean,
			default: false
		}
	})

	const emit = defineEmits(['change', 'update:modelValue'])

	const score = ref(0)
	const clickStartIndex = ref(-1)
	const clickStartStatus = ref(0)

	watch(() => props.modelValue, (newValue) => {
		if (newValue == score.value) return
		score.value = newValue
		if (props.half) {
			setDefaultHalfStatus()
		}
	})

	const _disabled = computed(() => props.disabled)
	const _readonly = computed(() => props.readonly)
	const _count = computed(() => props.count)
	const _size = computed(() => props.size)
	const _fontSize = computed(() => {
		let fontSize = covetUniNumber(props.fontSize, config.unit)
		if (config.fontSizeScale == 1) return fontSize
		let sizeNumber = parseInt(fontSize)
		if (isNaN(sizeNumber)) {
			sizeNumber = 14
		}
		return (sizeNumber * config.fontSizeScale).toString() + getUnit(fontSize)
	})
	const _space = computed(() => covetUniNumber(props.space, config.unit))
	const _color = computed(() => props.color == "" ? getDefaultColor(config.color) : getDefaultColor(props.color))
	const _unColor = computed(() => {
		if (config.mode == 'dark') {
			if (props.darkUnColor == '') {
				return getDefaultColor(config.inputDarkColor)
			} else {
				return getDefaultColor(props.darkUnColor)
			}
		}
		return getDefaultColor(props.unColor)
	})
	const _showScore = computed(() => props.showScore)

	onMounted(() => {
		score.value = props.modelValue
		if (props.half) {
			setDefaultHalfStatus()
		}
	})

	onBeforeUnmount(() => {
		
	})

	function setDefaultHalfStatus() {
		if (score.value == 0) return
		clickStartIndex.value = score.value
		let fillCount = Math.ceil(score.value)
		clickStartStatus.value = score.value == (fillCount - 0.5) ? 1 : 2
	}

	function isSelected(index : number) : boolean {
		if (props.half) {
			return score.value >= index - 0.5
		}
		return score.value >= index
	}

	function isSelectedHalf(index : number) : string {
		if (score.value > index) {
			return 'star-fill'
		}
		if (score.value < index - 0.5) {
			return 'star-line'
		}

		if (clickStartStatus.value == 1) {
			return 'star-half-fill'
		}
		if (clickStartStatus.value == 2) {
			return 'star-fill'
		}
		return 'star-line'
	}

	function onClickHalf(index : number, type : number) {
		if (_readonly.value || _disabled.value) return

		score.value = type == 1 ? index - 0.5 : index

		clickStartStatus.value = type
		setUpdate(index)
	}

	function onClick(index : number) {
		if (_readonly.value || _disabled.value) return
		score.value = index
		setUpdate(index)
		clickStartIndex.value = index
	}

	function setUpdate(index : number) {
		/**
		 * 同步当前分值，等同v-model 
		 * @param {number} score 评分
		 */
		emit('update:modelValue', score.value)
		/**
		 * 评分变换时触发
		 * @param {number} score 评分
		 */
		emit('change', score.value)

	
	}
</script>
<template>
	<view class="tmRate" :style="{opacity:_disabled?0.7:1}">
		<template v-if="!half">
			<view :ref="'rate-'+index" v-for="index in _count" :key="index">
				<tm-icon @click=" onClick(index)" :_style="`margin-right:${index==_count?'0rpx' : _space}`" :size="_size"
					:color="isSelected(index)?_color:_unColor" :dark-color="isSelected(index)?_color:_unColor"
					:name="isSelected(index)?icon:unicon"></tm-icon>
			</view>
		</template>

		<!-- 开启半星 -->
		<template v-if="half">
			<view :ref="'rate-'+index" v-for="index in _count" :key="index" style='position:relative'>
				<tm-icon :_style="`marginRight:${index==_count?'0rpx' : _space};margin-left:${index==0?'0rpx' : _space}`"
					:size="_size" :color="isSelected(index)?_color:_unColor"
					:dark-color="isSelected(index)?_color:_unColor" :name="isSelectedHalf(index)"></tm-icon>
				<view @click="onClickHalf(index,1)" class="tmRateLeft"></view>
				<view @click="onClickHalf(index,2)" class="tmRateRight"></view>
			</view>
		</template>
		<!-- 
		@slot 文本分值的右侧插槽
		@binding {number} score - 当前分值
		 -->
		<slot name="score" :score="score">
			<text class="tmRateText" v-if="_showScore" :style="{color:_color,fontSize:_fontSize}">
				{{score.toFixed(1)}}
			</text>
		</slot>
	</view>
</template>
<style scoped>
	.tmRateText {
		margin-left: 20rpx;
	}

	.tmRateLeft {
		position: absolute;
		width: 50%;
		height: 100%;
		top: 0px;
		left: 0px
	}

	.tmRateRight {
		position: absolute;
		width: 50%;
		height: 100%;
		top: 0px;
		right: 0px
	}

	.tmRate {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
</style>