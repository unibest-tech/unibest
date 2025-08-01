<template>
	<view v-if="showAlert" @click="onclickbar" class="tmAlert" :style="_styleMap.bgStyle">
		<!-- 
		 @slot 左边图标插槽
		 -->
		<slot name="left">
			<view v-if="attrs.showIcon" class="tmAlertLeft">
				<tm-icon :size="iconSize" :color="(_styleMap.textStyle['color'] as string)"
					:dark-color="(_styleMap.textStyle['color'] as string)" :name="_iconName"></tm-icon>
			</view>
		</slot>
		<view class="tmAlertContent" :style="_styleMap.textStyle">
			<slot></slot>
		</view>
		<view @click="closeAlert" v-if="_showClose" class="tmAlertRight">
			<tm-icon :size="iconSize" :color="(_styleMap.textStyle['color'] as string)"
				:dark-color="(_styleMap.textStyle['color'] as string)" :name="closeIcon"></tm-icon>
		</view>
	</view>
</template>

<script lang="ts" setup>

	import { computed, ref, onMounted } from "vue"
	import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber,arrayNumberValidByStyleBorderColor, linearValid ,getUnit } from "../../libs/tool";
	import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
	import { useTmConfig } from "../../libs/config";
	
	/**
	 * @displayName 警告
	 * @exportName tm-alert
	 * @category 展示组件
	 * @description 样式丰富常用警告提醒
	 * @constant 平台兼容
	 *	| H5 | uniAPP | 小程序 | version |
	    | --- | --- | --- | --- |
	    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
	 */
	defineOptions({ name: 'TmAlert' });
	const { config } = useTmConfig()
	
	type styleMapType = {
		textStyle : Record<string, string>,
		bgStyle : Record<string, string>
	}
	const emits = defineEmits([
		/**
		 * 关闭时触发
		 */
		"close",
		/**
		 * 组件被点击时触发
		 */
		"click"
	])
	const attrs = defineProps({
		/**
		 * 类型
		 * warn:警告
		 * success:成功
		 * error:错误
		 * info:信息
		 * primary:正常主题
		 */
		status: {
			type: String,
			default: "primary"
		},
		/**
		 * 警告图标,不填写取status默认图标
		 * 填写以填写为准
		 */
		icon: {
			type: String,
			default: ""
		},
		/**
		 * 警告图标大小
		 */
		iconSize: {
			type: String,
			default: "28"
		},
		closeIcon:{
			type: String,
			default: "close-line"
		},
		/**
		 * 显示还是隐藏关闭按钮
		 */
		showClose:{
			type:Boolean,
			default:true
		},
		/**
		 * 显示左边按钮
		 */
		showIcon:{
			type:Boolean,
			default:true
		},
		/**
		 * 文字大小
		 */
		fontSize: {
			type: String,
			default: "28"
		},
		/**
		 * 主题色，如果不填写以status为准
		 */
		color: {
			type: String,
			default: ""
		},
		/**
		 * 文字颜色，如果不填写以status为准
		 */
		fontColor: {
			type: String,
			default: ""
		},/**
		 * 暗黑主题颜色，如果不填写自动计算
		 */
		darkColor: {
			type: String,
			default: ""
		},
		/**
		 * 暗黑文字颜色，如果不填写自动计算
		 */
		fontDarkColor: {
			type: String,
			default: ""
		},
		/**
		 * 它是建立在你没有提供color时才有效。
		 * 如果提供了color是以你color为背景最终色。
		 * thin浅色模式，
		 * normal标准背景色
		 */
		skin: {
			type: String,
			default: "thin"
		},
		/**
		 * 圆角
		 * 数组数字时
		 * [全部]
		 * [顶左，顶右，底右，底左]
		 * [顶左，底右]
		 * [顶左，顶右，底右]
		 * 空数组时取全局值
		 */
		"round": {
			type: [String,Number,Array<string|number>],
			default: 16
		},
		/**
		 * 边线
		 * 数组数字时
		 * 数组数字时
		 * [全部]
		 * [左，上，右，下]
		 * [左右，上下]
		 * [左，上，右]
		 * 空数组时取全局值
		 */
		"border": {
			type: [String,Number,Array<string|number>],
			default: () : string[] => []
		},
		/**
		 * 边框颜色
		 * 格式同border边线。
		 * 空数组时取全局值
		 */
		"borderColor": {
			type: [String,Array<string>],
			default: () : string[] => []
		},
		/**
		 * 如果不填写，自动计算
		 */
		darkBorderColor: {
			type: [String,Array<string>],
			default: () : string[] => []
		},
		/**
		 * 边线类型，默认solid,可以为none
		 */
		"borderStyle": {
			type: String,
			default: 'solid'
		},
		/**
		 * 间隙[x]全部,[x,x]左右，上下,[x,x,x]左上右,[x,x,x,x]左上右下
		 * 空数组时取全局值
		 */
		"margin": {
			type:[String,Number,Array<string|number>],
			default: () : string[] => ['24', '0', '24', '24'] as string[]
		},
		/**
		 * 内间隙[x]全部,[x,x]左右，上下,[x,x,x]左上右,[x,x,x,x]左上右下
		 * 空数组时取全局值
		 */
		"padding": {
			type:[String,Number,Array<string|number>],
			default: () : string[] => ['28', '20'] as string[]
		},
		/**
		 * 自定义高度，可以是数字，单位或者百分比,auto
		 */
		"height": {
			type: String,
			default: "auto"
		},
		/**
		 * 宽，单位合法即可数字，字符串带单位，百分比,auto
		 */
		"width": {
			type: String,
			default: "auto"
		},
	})
	
	const showAlert = ref(true)
	const _color = computed(() : string => {
	
		let tcolor = attrs.color;
		if (tcolor == '') {
			tcolor = attrs.status;
		}
		if (config.mode == 'dark' && attrs.darkColor != '') {
			tcolor = attrs.darkColor
		}
		let color = getDefaultColor(tcolor)
	
		return color;
	})
	const _fontColor = computed(() : string => {
		let tcolor = attrs.fontColor;
		if (config.mode == 'dark' && attrs.fontDarkColor != '') {
			tcolor = attrs.fontDarkColor
		}
		return tcolor;
	})
	const _isDark = computed(() : boolean => config.mode == 'dark')
	const _showClose= computed(() : boolean => attrs.showClose)
	const _fontSize = computed(() : string => covetUniNumber(attrs.fontSize))
	const _margin = computed(() : string => arrayNumberValidByStyleMP(attrs.margin).join(' '))
	const _padding = computed(() : string => arrayNumberValidByStyleMP(attrs.padding).join(' '))
	const _round = computed(() : string => arrayNumberValidByStyleMP(attrs.round).join(' '))
	
	const _border = computed(() : string => arrayNumberValidByStyleMP(attrs.border).join(' '))
	const _borderColor = computed(() : string => arrayNumberValidByStyleBorderColor(attrs.borderColor).join(' '))
	
	const _iconName = computed(():string=>{
		const iconsmap = new Map<string, string>([
			['warn','alert-line'],
			['success','check-double-line'],
			['error','close-circle-line'],
			['info','information-line'],
			['primary','notification-line'],
		])
		let dicon = iconsmap.get(attrs.status)
		return attrs.icon==''?(dicon==null?'':dicon!):attrs.icon
	})
	
	const _styleMap = computed(() : styleMapType => {
		let bgStylemap:any = {}
		let textStylemap:any = {}
		let colorObj = getDefaultColorObj(_color.value, _color.value)
	
		if (attrs.skin == 'thin') {
			colorObj = getThinColorObj(_color.value, _color.value, _isDark.value)
		}
		let defaultObj  = colorObj.default
		bgStylemap["backgroundColor"] = defaultObj.background
		bgStylemap["margin"] =  _margin.value
		bgStylemap["padding"] =  _padding.value
		bgStylemap["border-radius"] =  _round.value
		bgStylemap["border-width"] =  _border.value
		bgStylemap["height"] = covetUniNumber(attrs.height)
		bgStylemap["width"] = covetUniNumber(attrs.width)
		bgStylemap["border-style"] =  attrs.borderStyle
		if(attrs.borderColor.length>0){
			bgStylemap["border-color"] =  _borderColor.value
		}else{
			bgStylemap["border-color"] =  getDefaultColor(_color.value)
		}
		
		
		if (_fontColor.value == '') {
			textStylemap["color"] = defaultObj.fontColor
		} else {
			textStylemap["color"] = _fontColor.value
		}
		textStylemap["font-size"] = _fontSize.value
		return {
			bgStyle: bgStylemap,
			textStyle: textStylemap
		} as styleMapType;
	})
	
	const closeAlert = ()=>{
		emits('close')
		showAlert.value = false
	}
	const onclickbar = ()=>{
		emits('click')
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
	.tmAlert {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		line-height: 1.2;
	}
	
	.tmAlertContent {
		flex: 1;
		box-sizing: border-box;
	}
	
	.tmAlertLeft {
		margin-right: 8rpx;
	}
	
	.tmAlertLeft {
		flex-shrink: 0;
		padding-right: 12rpx;
	}
	
	.tmAlertRight {
		flex-shrink: 0;
		padding-left: 32rpx;
	}
</style>