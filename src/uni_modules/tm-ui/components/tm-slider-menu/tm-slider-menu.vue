<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, PropType, getCurrentInstance, ComponentInstance, onUpdated, nextTick, VueElement, inject, watchEffect, StyleHTMLAttributes, useSlots } from 'vue';
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit, getUid } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj, isBlackAndWhite, setBgColorLightByDark } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
type SLIDER_TREE_ITEM = {
	id : string | number,
	title : string,
	disabled : boolean,
	selected : Array<string | number>,
	[key:string]:any
}
/**
 * @displayName 侧边菜单
 * @exportName tm-slider-menu
 * @category 导航组件
 * @description 左边菜单选择，右边内容区域
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
		| --- | --- | --- | --- |
		| ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmSliderMenu' });
const { config } = useTmConfig()
const props = defineProps({
	/**
	 * 宽
	 */
	width: {
		type: [String, Number],
		default: "auto"
	},
	/**
	 * 高是必填，不可为auto。
	 */
	height: {
		type: [String, Number],
		default: "100%"
	},
	/**
	 * 是否显示滚动条
	 */
	showScrollbar: {
		type: Boolean,
		default: true
	},
	/**
	 * 侧边选中的文字颜色，空值取全局主题
	 */
	activeTextColor: {
		type: String,
		default: ""
	},
	/**
	 * 侧边未选中时的文字颜色
	 */
	textColor: {
		type: String,
		default: "#888888"
	},
	/**
	 * 侧边菜单文字大小
	 */
	fontSize: {
		type: String,
		default: "30"
	},
	/**
	 * 选项项目未选中的文字颜色
	 */
	itemTextColor: {
		type: String,
		default: "#333333"
	},
	/**
	 * 选项项目选中的文字颜色，空值取全局主题
	 */
	itemActiveColor: {
		type: String,
		default: ""
	},
	/**
	 * 左侧边栏背景颜色
	 */
	sliderBgColor: {
		type: String,
		default: "#f5f5f5"
	},
	/**
	 * 左侧边栏暗黑背景颜色
	 * 如果不提供，自动读取全局的backgroundColorContentDark背景色
	 */
	darkSliderBgColor: {
		type: String,
		default: ""
	},
	/**
	 * 右内容区域背景颜色
	 */
	sliderContentBgColor: {
		type: String,
		default: "white"
	},
	/**
	 * 右内容区域暗黑背景颜色
	 * 如果不提供读取sheet窗口的暗黑背景
	 */
	darkSliderContentBgColor: {
		type: String,
		default: ""
	},
	/**
	 * 侧边栏宽
	 */
	sliderWidth: {
		type: [String, Number],
		default: "190"
	},
	list: {
		type: [Array<Record<string, any>>],
		default: () => [] as Array<Record<string, any>>
	},
	/**
	 * 当前选中项的id
	 */
	modelValue: {
		type: [String, Number],
		default: ""
	},
	/**
	 * 文本显示的字段
	 */
	rangKey: {
		type: String,
		default: 'title'
	},
	/**
	 * 标识id的字段
	 */
	rangId: {
		type: String,
		default: 'id'
	},
	menuSelectedStyle:{
		type: Object as PropType<Partial<CSSStyleDeclaration>>,
		default: ()=>{
			return {}
		}
	}
})

// 定义emit事件
const emit = defineEmits<{
	/**
	 * 手动切换时触发
	 * @param {string} id - 当前选中的菜单id
	 * @param {number} index - 当前选中的菜单索引
	 */
	(e : 'change', id : string | number, index : number) : void
	(e : 'update:modelValue', value : string | number) : void
}>()

const slots = useSlots()
const proxy = getCurrentInstance()?.proxy
const selectedsIds = ref<string | number>("")
const selectedsIdsByscrollids = ref<string | number>("")
const rightboxId = ref("")
const isscrollingActions = ref(false)

const _sliderWidth = computed(() : string => {
	return covetUniNumber(props.sliderWidth, config.unit)
})
const _menuSelectedStyle = computed(():any=>props.menuSelectedStyle)

const _width = computed(() : string => {
	return covetUniNumber(props.width, config.unit)
})

const _height = computed(() : string => {
	return covetUniNumber(props.height, config.unit)
})

const _fontSize = computed(() : string => {
	let fontSize = covetUniNumber(props.fontSize, config.unit)
	if (config.fontSizeScale == 1) return fontSize
	let sizeNumber = parseInt(fontSize)
	if (isNaN(sizeNumber)) {
		sizeNumber = 14
	}
	return (sizeNumber * config.fontSizeScale).toString() + getUnit(fontSize)
})

const _activeTextColor = computed(() : string => {
	return props.activeTextColor != "" ? getDefaultColor(props.activeTextColor) : getDefaultColor(config.color)
})

const _textColor = computed(() : string => {
	return getDefaultColor(props.textColor)
})

const _itemTextColor = computed(() : string => {
	return getDefaultColor(props.itemTextColor)
})

const _itemActiveColor = computed(() : string => {
	return props.itemActiveColor != "" ? getDefaultColor(props.itemActiveColor) : getDefaultColor(config.color)
})

const _sliderBgColor = computed(() : string => {
	if (config.mode == 'dark') {
		if (props.darkSliderBgColor != '') {
			return getDefaultColor(props.darkSliderBgColor)
		} else {
			return getDefaultColor(config.backgroundColorContentDark)
		}
	}
	return getDefaultColor(props.sliderBgColor)
})

const _sliderContentBgColor = computed(() : string => {
	if (config.mode == 'dark') {
		if (props.darkSliderContentBgColor != '') {
			return getDefaultColor(props.darkSliderContentBgColor)
		} else {
			return getDefaultColor(config.backgroundColorContentDark)
		}
	}
	return getDefaultColor(props.sliderContentBgColor)
})


const _list = computed(() : SLIDER_TREE_ITEM[] => {
	let list = props.list
	let ps = [] as SLIDER_TREE_ITEM[]

	function addOptionalFieldsToTree(tree : Record<string, any>[]) : void {
		for (let i = 0; i < tree.length; i++) {
			const node = tree[i]
			node.disabled = node.disabled == null ? false : node.disabled! as boolean
			node.selected = node.selected == null ? [] : node.selected! as string[]
			ps.push({
				id: node[props.rangId],
				title: node[props.rangKey],
				disabled: node?.disabled ?? false,
				selected: [],
				...node
			} as SLIDER_TREE_ITEM)
		}
	}

	addOptionalFieldsToTree(list)
	return ps
})

// 方法
const sliderItemClick = (item : SLIDER_TREE_ITEM, index : number) => {
	isscrollingActions.value = false;
	if (item.disabled) return
	selectedsIds.value = item.id
	selectedsIdsByscrollids.value = item.id
	emit('update:modelValue', item.id)
	emit('change', item.id, index)
}

// 监听器
watch(() => props.modelValue, (newValue : string | number) => {
	if (selectedsIds.value === newValue) return
	selectedsIds.value = newValue
})
const getAllIds = (scrollTop:number)=>{

	uni.createSelectorQuery()
		.in(proxy)
		.selectAll('.tmSliderTreeBoxRrightScroll,.tmSliderMenuIds')
		.boundingClientRect()
		.exec(res=>{
			if(res.length==0) return;
			let nodes =  res[0]
			let parentNode = nodes[0]
			let eleNodes = nodes.slice(1)
			let top = eleNodes[1].top - parentNode.top
			let allheight = 0
			for(let i=0;i<eleNodes.length;i++){
				let node = eleNodes[i]
				let top = node.top - parentNode.top
				allheight +=node.height
				if(allheight>=scrollTop){
					selectedsIds.value =node.id.split('-')[1];
					rightboxId.value = 'left'+node.id;

					break;
				}
			}
		})
}
const onRightbodyScrolling = (evt : any) => {
	if (!isscrollingActions.value) return;
	getAllIds(evt.detail.scrollTop)
}

// 生命周期钩子
onMounted(() => {
	selectedsIds.value = props.modelValue
	setTimeout(function () {
		selectedsIdsByscrollids.value = selectedsIds.value
	}, 300);
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
<template>

	<view ref="tmSliderTree" class="tmSliderTree" :style="{width:_width,height:_height}">
		<view class="tmSliderTreeBox" :style="{width:_sliderWidth,height:'100%'}">
			<scroll-view
				class="tmSliderTreeBoxScroll"
				:scroll-into-view="rightboxId"
				v-if="_list.length>0"
				:scroll-y="true" :show-scrollbar="showScrollbar"
				:style="{width:'100%',height:'100%',backgroundColor:_sliderBgColor}"
			>

				<view
					@touchstart="isscrollingActions = false"
					@click="sliderItemClick(item,index)"
					:id="'lefttmmenu-'+item.id"
					v-for="(item,index) in _list" :key="index"
					class="tmSliderTreeItemLeft" :style="[{
					backgroundColor:selectedsIds == item.id?_sliderContentBgColor:'transparent',
					opacity:item.disabled?'0.5':1,
					'border-left': `2px solid ${selectedsIds == item.id?_activeTextColor:'transparent'}`,
					fontSize:_fontSize,color:selectedsIds == item.id? _activeTextColor : _textColor
					},
					selectedsIds == item.id?_menuSelectedStyle:undefined]
				 ">
					<!--
					 @slot 动态循环菜单项目插槽
					 @binding {Record<string,any} item - 当前展开状态
					 -->
					<slot name="menu" :item="item">
						<text class="tmSliderTreeItemLeftText">{{item.title}}</text>
					</slot>
				</view>
			</scroll-view>
		</view>
		<view  class="tmSliderTreeRightBox"
			   ref="tmSliderTreeRightBox"
			   :style="{backgroundColor:_sliderContentBgColor,flex:1,height:'100%'}">
			<scroll-view
				:scroll-with-animation="true"
				@mousewheel="isscrollingActions = true"
				@touchstart="isscrollingActions = true"
				@mousedown="isscrollingActions = true"
				:scroll-into-view="'tmmenu-'+selectedsIdsByscrollids"
				class="tmSliderTreeBoxRrightScroll hideScrollbar"
				:show-scrollbar="showScrollbar" :scroll-y="true" @scroll="onRightbodyScrolling">
				<view v-for="(item,index) in _list"
					  :key="item.id"
					  :class="['tmSliderMenuIds']"
					  :id="'tmmenu-'+item.id"
					  class="tmSliderTreeBoxRrightScrollBox"
				>
					<!--
					 @slot 动态循环list插槽
					 @binding {Record<string,any} item - 当前展开状态
					 -->
					<slot  :item="item as SLIDER_TREE_ITEM">
					</slot>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<style scoped lang="scss">

.tmSliderTreeBoxRrightScrollBox{
	position: relative;
}
.tmSliderTree {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	justify-content: space-between;
}

.tmSliderTreeBox {
	position: relative;
}

.tmSliderTreeRightBox {
	position: relative;
}

.tmSliderTreeBoxScroll {
	position: absolute;
	left: 0;
	top: 0;
}

.tmSliderTreeBoxRrightScroll {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}

.tmSliderTreeItemLeft {
	width: 100%;
	padding:24rpx 0rpx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.tmSliderTreeItemLeftText {
	text-align: center;
}
</style>