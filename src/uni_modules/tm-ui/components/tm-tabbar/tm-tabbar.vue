<!--
  - Copyright (c) 2025. tmzdy by @https://tmui.design
  -->
<script lang="ts" setup>/**
import NodeInfo = UniNamespace.NodeInfo

/**
 * @displayName 底部导航
 * @exportName tm-tabbar
 * @category 导航组件
 * @description 可定义凸起按钮。通过全局状态设置选中项，放于任何页面可自动选中。
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmTabbar' })

import {
	computed,
	getCurrentInstance,
	nextTick,
	onBeforeMount,
	onBeforeUnmount,
	onMounted,
	PropType,
	ref,
	watch
} from 'vue'

import { useTmConfig } from '../../libs/config'
import { covetUniNumber } from '../../libs/tool'
import { getDefaultColor } from '../../libs/colors'

import xTabbarCanvas from './xTabbarCanvas'
import { onShow } from '@dcloudio/uni-app'

const { config } = useTmConfig()
const proxy = getCurrentInstance()?.proxy
const canvasIds = ref<HTMLCanvasElement | null>(null)
const canvasIdsEle = ref<HTMLDivElement | null>(null)


const baseBarHeight = ref(60)
const safeHeight = ref(0)
const tuqiHeight = ref(0)
const tuqiWeight = ref(0)
const tid = ref(0)
const keyid = ref(123)
const _list = ref<TM.TABBAR_ITEM[]>([])
const xcanvas = ref<xTabbarCanvas | null>(null)
const resizeId = ref(0)
const tidresizeId = ref(3211)
const yanchiId = ref(11)
const domWidth = ref(0)
const domHeight = ref(0)
const domOffsetWidth = ref(0)
const domOffsetHeight = ref(0)
const isShowInpage = ref(false)
const contentIsChange = ref(false)
const canvasUid = ref('canvasid' + Math.random().toString(10).substring(2, 15))
const isFirst = ref(true)
const slots = defineSlots<{
	item: {
		isactive: boolean,
		children: TM.TABBAR_ITEM,
		activeindex: number,
		selfindex: number
	}
}>()

const emits = defineEmits<{
	/**
	 * 切换项目时触发。
	 * @param {number} index - 当前选中的索引
	 */
	(e: 'change', index: number): void,
	/**
	 * 同步组件高给外部使用，请使用v-model:autoTabbarHeight
	 * 组件高度 = 安全栏高度 + 导航栏高度,外部最好computed使用，因为是异步的
	 * @param {number} height - 当前组件高度
	 */
	(e: 'update:autoTabbarHeight', height: number): void,
}>()

const props = defineProps({
	/**
	 * 未选中时的颜色
	 */
	color: {
		type: String,
		default: '#b9b9b9'
	},
	/**
	 * 选中时的颜色，空值取全局主题
	 */
	selectedColor: {
		type: String,
		default: ''
	},
	/**
	 * 背景,如果你为空，会读取全局的亮色tabbar背景
	 */
	bgColor: {
		type: String,
		default: 'white'
	},
	/**
	 * 暗黑时的背景，如果为空，取全局的底部导航背景色。
	 */
	darkBgColor: {
		type: String,
		default: ''
	},
	/**
	 * 显示顶部边线，暗黑时取全局的borderDarkColor
	 */
	showTopBorder: {
		type: Boolean,
		default: true
	},
	/**
	 * 边线颜色
	 */
	borderColor: {
		type: String,
		default: '#f0f0f0'
	},
	/**
	 * 文字大小
	 */
	fontSize: {
		type: String,
		default: '11px'
	},
	/**
	 * 图标大小
	 */
	iconSize: {
		type: String,
		default: '28px'
	},
	/**
	 * 导航的整体高度，请使用v-model:autoTabbarHeight="x"
	 * 来获取当前的高度。外部要去变更值。这个只是对外输出，
	 * 给您 外部放在底部占位用，省得你们要一屏时计算高。外部最好computed使用，因为是异步的
	 */
	autoTabbarHeight: {
		type: Number,
		default: 0
	},
	/**
	 * 需要向外凸起的项目索引。
	 * -1表示不凸起
	 */
	outIndex: {
		type: Number,
		default: 2
	},
	/**
	 * 凸起的背景色
	 */
	outBgColor: {
		type: String,
		default: 'primary'
	},
	/**
	 * 凸起的图标颜色
	 */
	outIconColor: {
		type: String,
		default: 'white'
	},
	/**
	 * 是否开启凸起背景镂空，截止sdk 4.31 ios有bug官方已经知晓在修复
	 */
	isOutSpace: {
		type: Boolean,
		default: true
	},
	/**
	 * 是否反向凸起就是不镂空，但在凸起的底层会被绘制背景。false是镂空，true表示反向包住。
	 * 截止sdk 4.31 ios有bug官方已经知晓在修复
	 */
	outReserve: {
		type: Boolean,
		default: false
	},
	/**
	 * 是否悬浮在底部,不可动态修改
	 * fixed悬浮，relative静态布局。
	 */
	position: {
		type: String,
		default: 'fixed'
	},
	/**
	 * 渐变背景，如果提供，上面的背景和暗黑背景将失效。
	 * 仅支持:to bottom,to right,to left,to top
	 * 例：['to right','#ff667f','#ff5416']
	 */
	linearGradient: {
		type: Array as PropType<string[]>,
		default: () => []
	},
	/**
	 * 如果你提供了本地的list数据，那么全局的list将不会被采用，你需要自己管理激活引，
	 * 跨页面时需要你自己设置当前页面的索引，因为变量索引是无法跨页面的。
	 */
	list: {
		type: Array as PropType<TM.TABBAR_ITEM_INFO[]>,
		default: (): TM.TABBAR_ITEM_INFO[] => []
	},
	/**
	 * 当前激活的索引,如果你提供了本地索引，那全局的索引将失效。
	 * 跨页面时需要你自己设置当前页面的索引，因为变量索引是无法跨页面的。
	 * 仅当月list不为空时有效。
	 */
	activeIndex: {
		type: Number,
		default: -1
	},
	/**
	 * 层级
	 */
	zIndex: {
		type: Number,
		default: 20
	},

	/**
	 * 是否开启canvas渲染引擎，开启后，可以得到
	 * 两种渲染版本请自行选择使用。
	 */
	isCanvasRender: {
		type: Boolean,
		default: true
	},
	/**
	 * 由于微信无法动态理性canvas宽，因此
	 * 如果你开启isCanvasRender,你就要提供这个，rpx单位
	 * 全屏是750rpx
	 */
	containerWidth:{
		type: Number, //容器宽度
		default: 750
	}
})


const _outBgColor = computed((): string => {
	return getDefaultColor(props.outBgColor)
})
const _outIconColor = computed((): string => {
	return getDefaultColor(props.outIconColor)
})

const _outIndex = computed((): number => {
	if (props.outIndex == -1) return -1
	if (props.outIndex > _list.value.length - 1) return -1
	return props.outIndex
})
const _nowOutItem = computed((): TM.TABBAR_ITEM => {

	return _list.value[_outIndex.value]
})
const _fontSize = computed((): string => {
	return covetUniNumber(props.fontSize, config.unit)
})
const _iconSize = computed((): string => {
	return covetUniNumber(props.iconSize, config.unit)
})

const _selectedColor = computed((): string => {
	return props.selectedColor == '' ? getDefaultColor(config.color) : getDefaultColor(props.selectedColor)
})
const _color = computed((): string => {
	return getDefaultColor(props.color)
})

const _bgColor = computed((): string => {
	if (config.mode == 'dark') {
		return getDefaultColor(props.darkBgColor)
	} else {
		return props.bgColor
	}
	return getDefaultColor(props.bgColor)
})
const _borderColor = computed((): string => {
	if (config.mode == 'dark') {
		return '#666'
	}
	return getDefaultColor(props.borderColor)
})
const _showTopBorder = computed((): boolean => {
	return props.showTopBorder
})

const _linearGradientByar = computed((): string[] => {
	if (props.linearGradient.length < 3) return [] as string[]
	let startcolor = getDefaultColor(props.linearGradient[1])
	let endcolor = getDefaultColor(props.linearGradient[2])
	let str = [props.linearGradient[0], startcolor, endcolor] as string[]
	return str
})

const _linearGradient = computed((): string => {
	if (props.linearGradient.length < 3) return ''
	let startcolor = getDefaultColor(props.linearGradient[1])
	let endcolor = getDefaultColor(props.linearGradient[2])
	let str = [props.linearGradient[0], startcolor, endcolor] as string[]
	return `linear-gradient(${str.join(',')})`
})
const _styleMap = computed((): Map<string, string> => {
	let maps = new Map<string, string>()
	if (_linearGradient.value != '') {
		maps.set('background-image', _linearGradient.value)
	} else {
		maps.set('background-color', _bgColor.value)
	}
	if (_showTopBorder.value) {
		maps.set('border-top', `1px solid ${_borderColor.value}`)
	}
	return maps
})


const _isDark = computed((): boolean => {

	return config.mode == 'dark'
})
const _tabbarheigh = computed((): string => {

	let safetop = _outIndex.value > -1 ? 25 : 0
	let total = safeHeight.value + baseBarHeight.value + safetop
	return total.toString() + 'px'
})
const getNodeInfo = (call:((rect:NodeInfo)=>void)|null=null) => {
	uni.createSelectorQuery().in(proxy)
		.select('.xTabbar')
		.boundingClientRect().exec((ret) => {
		let nodeinfo = ret[0] as NodeInfo
		domOffsetWidth.value = nodeinfo.width

		if(call){
			call(nodeinfo)
		}
		/**
		 * 同步组件高给外部使用，请使用v-model:autoTabbarHeight
		 * 组件高度 = 安全栏高度 + 导航栏高度,外部最好computed使用，因为是异步的
		 */
		emits('update:autoTabbarHeight', nodeinfo.height!)
	})


}

const getQuqi = () => {

	uni.createSelectorQuery().in(proxy)
		.selectAll('.xTabbarItem')
		.boundingClientRect().exec((ret) => {
		let nodeinfo = ret[0] as NodeInfo[]
		if (nodeinfo.length == 0) return
		let nowx = nodeinfo[Math.max(_outIndex.value, 0)]
		tuqiHeight.value = nowx.height!
		tuqiWeight.value = nowx.width!

	})
}

const designCanvas = () => {

	function drawerCanvas(ele: HTMLCanvasElement, ctx: CanvasRenderingContext2D, mpContext: any) {

		const dpr = uni.getWindowInfo().pixelRatio ?? 1
		let width = 0
		let height = 0
		let offsetWidth = 0
		let offsetHeight = 0
		// #ifdef MP-WEIXIN
		width = mpContext.width
		height = mpContext.height
		offsetWidth = mpContext.offsetWidth
		offsetHeight = mpContext.offsetHeight
		// mpContext.width = width
		// mpContext.height = height
		// #endif
		// #ifdef H5
		width = ele.offsetWidth * dpr
		height = ele.offsetHeight * dpr
		offsetWidth = ele.offsetWidth
		offsetHeight = ele.offsetHeight
		ele.width = width
		ele.height = height
		ctx.scale(dpr, dpr)
		// #endif



		xcanvas.value = new xTabbarCanvas(ele, ctx, 0, width, height, offsetWidth, offsetHeight, mpContext,domOffsetWidth.value)

		function drawer() {
			if (_linearGradientByar.value.length > 0) {
				if (props.outReserve) {
					if (_outIndex.value > 0 && props.isOutSpace) {
						xcanvas.value!.setTuQiTop(_linearGradientByar.value, _list.value.length, _outIndex.value)
						xcanvas.value!.fillBgLigren(_linearGradientByar.value, _outIndex.value)
					} else {
						xcanvas.value!.fillBgLigren(_linearGradientByar.value, _outIndex.value)
					}
				} else {
					xcanvas.value!.fillBgLigren(_linearGradientByar.value, _outIndex.value)
					if (_outIndex.value > 0 && props.isOutSpace) {
						xcanvas.value!.setTuQi(_list.value.length, _outIndex.value)
					}
				}

			} else {
				xcanvas.value!.fillBgColor(_bgColor.value, _outIndex.value)
				if (_outIndex.value > 0 && props.isOutSpace) {
					// #ifdef MP-WEIXIN
					let img = mpContext.createImage()
					xcanvas.value!.setTuQi(_list.value.length, _outIndex.value, img)
					// #endif
					// #ifdef H5
					xcanvas.value!.setTuQi(_list.value.length, _outIndex.value)
					// #endif
				}
			}
		}

		drawer()

		let safetop = _outIndex.value > -1 ? 25 : 0
		let total = safeHeight.value + baseBarHeight.value + safetop

	}

	uni.createSelectorQuery()
		.in(proxy)
		.select(`#${canvasUid.value}`)
		.fields({ node: true, id: true, context: true, size: true, rect: true }, () => {
		})
		.exec((ret) => {
			let node = ret[0] as NodeInfo
			// @ts-ignore
			let canvas = node.node
			let canvasContext = canvas.getContext('2d')

			// #ifdef MP-WEIXIN
			const dpr = uni.getWindowInfo().pixelRatio ?? 1
			canvas.width = canvas.width * dpr
			canvas.height = canvas.height * dpr
			canvas.offsetWidth = canvas.width
			canvas.offsetHeight = canvas.height
			canvasContext.scale(dpr, dpr)
			drawerCanvas(node.context, canvasContext, canvas)

			// #endif
			// #ifdef H5
			drawerCanvas(canvas, canvasContext, null)
			// #endif
		})


}


const resizeinit = () => {

	if (props.isCanvasRender) {
		nextTick(() => {

			getQuqi()
			getNodeInfo(()=>{
				nextTick(()=>{
					designCanvas()
				})
			})
		})
	}
}
const getList = () => {
	let list = [] as TM.TABBAR_ITEM[]

	let localList = props.list
	localList.forEach((el: TM.TABBAR_ITEM_INFO) => {
		list.push({
			title: el.title == null ? '' : el.title! as string,
			icon: el.icon == null ? '' : el.icon as string,
			selectedIcon: el.selectedIcon == null ? '' : el.selectedIcon as string,
			color: el.color == null ? _color.value : getDefaultColor(el.color! as string),
			selectedColor: el.selectedColor == null ? _selectedColor.value : getDefaultColor(el.selectedColor! as string),
			openType: el.openType == null ? '' : el.openType! as TM.NAVIGATE_TYPE,
			url: el.url == null ? '' : el.url! as string,
			disabled: el.disabled == null ? false : el.disabled! as boolean,
			dotType: el.dotType == null ? '' : el.dotType! as string,
			dotLabel: el.dotLabel == null ? '' : el.dotLabel! as string
		} as TM.TABBAR_ITEM)
	})
	_list.value = [...list] as TM.TABBAR_ITEM[]
	nextTick(() => {
		getQuqi()
	})
}


const itemClick = (index: number) => {
	/**
	 * 切换项目时触发。
	 * @param index 当前选中的索引
	 */
	emits('change', index)
	let item = _list.value[index]
	if (item.url != null && item.url != '' && !item.disabled) {
		switch (item.openType) {
			case 'navigateBack':
				uni.navigateBack({})
				break
			case 'navigate':
				uni.navigateTo({
					url: item.url
				})
				break
			case 'reLaunch':
				uni.reLaunch({
					url: item.url
				})
				break
			case 'redirect':
				uni.redirectTo({
					url: item.url
				})
				break
			case 'switchTab':
				uni.switchTab({
					url: item.url
				})
				break
			default: {
				uni.navigateTo({
					url: item.url
				} as UniNamespace.NavigateToOptions)
				break
			}
		}

	}
}


const _activeIndex = computed((): number => {
	nextTick(() => {
		getQuqi()
	})
	return props.activeIndex
})

watch((): number => props.outIndex, () => {
	contentIsChange.value = true
	resizeinit()
})
watch(_isDark, () => {
	contentIsChange.value = true
	resizeinit()
})
onBeforeMount(() => {
	let sys = uni.getWindowInfo()
	safeHeight.value = sys.safeAreaInsets.bottom
})
onMounted(() => {
	getList()
	resizeinit()
	uni.$on('onResize', resizeinit)
})
onBeforeUnmount(() => {
	clearTimeout(tid.value)
	clearTimeout(tidresizeId.value)
	clearTimeout(yanchiId.value)
	uni.$off('onResize', resizeinit)
	xcanvas.value?.destory()
	xcanvas.value = null
})

onShow(() => {
	if (contentIsChange.value) {
		resizeinit()
		contentIsChange.value = false
	}
})


</script>
<template>
	<view :style="{position: position,zIndex:zIndex}" class="xTabbar">
		<!-- 凸起占位 -->
		<view v-if="_outIndex!=-1" :style="{top:outReserve?'-18px':'-22px',height:(100)+'px',zIndex:(zIndex+1).toString(),width:(100/_list.length)+'%',left:(100/_list.length*_outIndex)+'%'}"
			  class="xTabbarTuqi">
			<!--
			凸起图标插槽。
			@prop {boolean} active - 当前是否选中
			@prop {number} size - 凸起图标大小,单位px
			 -->
			<slot :active="_outIndex==_activeIndex" :size="tuqiHeight" name="out">
				<view :style="{height:tuqiHeight+'px',width:tuqiHeight+'px',backgroundColor:_outBgColor}" class="xTabbarTuqiItem"
					  @click="itemClick(outIndex)">
					<tm-icon :color="_outIconColor" :name="_activeIndex==_outIndex?_nowOutItem.selectedIcon:_nowOutItem.icon"
							 :size="iconSize"></tm-icon>
				</view>
			</slot>
		</view>

		<view v-if="!props.isCanvasRender" :key="resizeId"
			  :style="{width:'100%',height:_tabbarheigh,pointerEvents: 'none'}">
			<view v-if="_outIndex>-1" style="height:25px"></view>
			<view v-if="_outIndex>-1" ref="canvasIdsEle" :style="[{height:(safeHeight+baseBarHeight)+'px'},_styleMap]"></view>
		</view>
		<view :style="{position:'absolute','background-color': 'transparent',zIndex:zIndex}" class="xTabbarBox">
			<view class="xTabbarWrap">
				<view v-for="(item,index) in _list" :key="index" :style="{height:baseBarHeight+'px'}" class="xTabbarItem"
					  @click="itemClick(index)">
					<!--
					子项目插槽，以便完全自定义化样式。
					 @param {number} activeindex - 当前激活的项
					 @param {boolean} isactive - 当前是否被激活
					 @param {number} selfindex - 索引
					 -->
					<slot :activeindex="_activeIndex" :children="item" :isactive="_activeIndex==index" :selfindex="index"
						  name="item">
						<tm-badge :dot="item.dotType=='dot'" :label="item.dotLabel" :offset="[0,5]">
							<view style="height: 30px;padding: 0px 4px;">
								<tm-icon v-if="_outIndex!=index"
										 :color="_activeIndex==index?item.selectedColor:item.color"
										 :dark-color="_activeIndex==index?item.selectedColor:item.color" :name="_activeIndex==index?item.selectedIcon:item.icon"
										 :size="iconSize"></tm-icon>
							</view>
							<text
								:style="{fontSize:_fontSize,color:_activeIndex==index?item.selectedColor:item.color,paddingTop:'4px'}">
								{{ item.title }}
							</text>
						</tm-badge>
					</slot>
				</view>

			</view>
			<view :style="{height:safeHeight+'px'}"></view>
		</view>

		<canvas v-if="props.isCanvasRender" :id="canvasUid" ref="canvasIds" :canvas-id="canvasUid" :style="{width:'100%',height:_tabbarheigh,pointerEvents: 'none'}" hidpi
		type="2d"></canvas>


	</view>
</template>
<style scoped>
.xTabbarBox {
	left: 0;
	bottom: 0;
	width: 100%;
	/* z-index: 20; */
}

.xTabbarTuqi {
	position: absolute;
	width: 100%;
	pointer-events: none;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	/* z-index: 21; */
	/* #ifdef WEB */
	cursor: pointer;
	/* #endif */
}

.xTabbarTuqiItem {
	pointer-events: auto;
}

.xTabbarPlace {
	pointer-events: none;

}

.xTabbarTuqiItem {
	border-radius: 300px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.xTabbar {
	/* position: fixed; */
	/* z-index: 20; */
	bottom: 0;
	left: 0;
	width: 100%;

}

.xTabbarWrap {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: flex-start;

}

.xTabbarItem {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
	/* #ifdef WEB */
	cursor: pointer;
	/* #endif */
}
</style>