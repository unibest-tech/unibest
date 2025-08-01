<script setup lang="ts">
import { computed, nextTick, PropType, provide, ref, watch } from 'vue'
import { useTmConfig } from '../../libs/config'
import { covetUniNumber, getUnit } from '../../libs/tool'
import { getDefaultColor } from '../../libs/colors'

/**
 * @displayName 标签导航
 * @exportName tm-tabs
 * @category 导航组件
 * @description tabs标签导航组件,样式非常丰富可以完成你想要的自定义样式.
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmTabs' });
const { config } = useTmConfig()
const emit = defineEmits([
	/** 变化时触发 */
	"change",
	/** 同步vmodel */
	"update:modelValue"
])
const props = defineProps(
	{
		/**
		 * 圆角
		 */
		round: {
			type: [String, Number],
			default: 0
		},
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
			default: "88"
		},
		/**
		 * 排版模式
		 * around:居中并且均分[数据多时会造成无法滚动]
		 * between:均分在整个宽上(如想相项目宽一样,你可以设置属性width比如你有3个可以设置为33%)[数据多时会造成无法滚动]
		 * start:左对齐[数据多时可滚动]
		 * end:右对齐[数据多时可滚动]
		 * center:中间对齐[数据多时会造成无法滚动]
		 */
		mode: {
			type: String as PropType<"around" | "between" | "start" | "end" | "center">,
			default: "start"
		},
		/**
		 * 背景
		 */
		color: {
			type: String,
			default: "white"
		},
		/**
		 * 暗黑时的背景,如果不填写读取sheetDark
		 */
		darkColor: {
			type: String,
			default: ""
		},
		/**
		 * 文本激活时的颜色 ，空值默认取全局主题色
		 */
		activeTitleColor: {
			type: String,
			default: ""
		},
		/**
		 * 文本默认颜色
		 */
		titleColor: {
			type: String,
			default: "#888888"
		},
		/**
		 * 文本默认的暗黑颜色，如果不填写取白色。
		 */
		darkTitleColor: {
			type: String,
			default: "#cacaca"
		},
		/**
		 * 底部线条激活时的颜色，空值默认取全局主题色
		 */
		lineColor: {
			type: String,
			default: ""
		},
		lineHeight: {
			type: String,
			default: "3px"
		},
		/**
		 * 底部的线条是与项目等宽还是固定默认的小宽度。
		 */
		lineFull: {
			type: Boolean,
			default: false
		},
		/**
		 * 是否显示底部的线条
		 */
		showLine: {
			type: Boolean,
			default: true
		},
		/**
		 * id值，如果数据没有提供id属性，这里的id就是索引
		 * 等同v-model
		 */
		modelValue: {
			type: [String, Number],
			default: 0
		},
		/**
		 * 标题字号
		 */
		fontSize: {
			type: [String, Number],
			default: "30"
		},
		/**
		 * 激活时的标题字号
		 */
		activeFontSize: {
			type: [String, Number],
			default: "32"
		},
		/**
		 * 项目宽度，默认是auto，即自动根据标题内容自动撑开宽度。
		 * 如果你想均分（适合不超过一行），比如你有5个标签，那么你就可以设置为"20%"
		 */
		itemWidth: {
			type: [String, Number],
			default: "auto"
		},
		/**
		 * 标题的padding是左右的间隙。
		 */
		titlePadding: {
			type: [String, Number],
			default: "12px"
		},
		/**
		 * 选中当前项是，移动的差值个数。比如你要让选中的居中，你一屏内
		 * 刚好显示5个，你就设置为2，如果你一屏显示3个，就设置为1，就是你一屏内
		 * 里面要显示的是单数，才好控制选中的始终是在中间位置 。
		 */
		moveCount: {
			type: Number,
			default: 2
		},
		/**
		 * 项目之间的间隙.如果你设定了itemwidth一般会有富余宽,两边自然有间隙,此时你应该设置为0以免造成不居中的假象.
		 */
		gap: {
			type: [String, Number],
			default: 20
		},
		/**
		 * 数据数组,可以混合类型可以是单类型
		 * 数据格式比较灵活.
		 * 如果数据是对象且出现了dot:true该项数组右上角出现角标红点
		 * 如果dot:非boolean比如:dot:32会出现数字角标或者文本角标.如果为false或者空值为隐藏
		 * 如果出现了disabled:可以true禁止项目
		 */
		list: {
			type: [Array<Record<string, any> | string>],
			default: () => [],
			require: true
		},
		/**
		 * 当你的list为对象时可用
		 * 如果数据是string会直接取数据本身
		 */
		rangKey: {
			type: String,
			default: "title"
		},
		/**
		 * id标识,用来vmodel双向绑定选中的值,
		 * 如果你的list中不存在或者没有id标识
		 * 那么取数组循环的索引值
		 * */
		rangId: {
			type: String,
			default: "id"
		},
		/**
		 * 读取角标的标识字段,默认是dot
		 * */
		rangDot: {
			type: String,
			default: "dot"
		},
		/**
		 * 角标的背景,默认是等同激活的标题颜色
		 * 如果填写使用本值,文字颜色始终是白的.
		 */
		dotBgColor: {
			type: String,
			default: ""
		},
		/**
		 * 默认的自定项目的style样式,可以用来完全覆盖默认的样式.
		 */
		customItemStyle: {
			type: String,
			default: ""
		},
		/**
		 * 默认的激活自定项目的style样式,可以用来完全覆盖默认的样式.
		 */
		activeItemStyle: {
			type: String,
			default: ""
		}
	}
)
const _showLine = computed(() => props.showLine)

const _lineFull = computed(() => props.lineFull)
const _customItemStyle = computed(() => props.customItemStyle)
const _activeItemStyle = computed(() => props.activeItemStyle)
const tabsleft = ref(0)
const _fontSize = computed(() => {
	let fontSize = covetUniNumber(props.fontSize, config.unit);
	if (config.fontSizeScale == 1) return fontSize;
	let sizeNumber = parseInt(fontSize)
	if (isNaN(sizeNumber)) {
		sizeNumber = 30
	}
	return (sizeNumber * config.fontSizeScale).toString() + getUnit(fontSize)
})

const _itemWidth = computed(() => covetUniNumber(props.itemWidth, config.unit))

const _round = computed(() => covetUniNumber(props.round, config.unit))

const _activeFontSize = computed(() => {
	// covetUniNumber(props.activeFontSize, config.unit)
	let fontSize = covetUniNumber(props.activeFontSize, config.unit);
	if (config.fontSizeScale == 1) return fontSize;
	let sizeNumber = parseInt(fontSize)
	if (isNaN(sizeNumber)) {
		sizeNumber = 32
	}
	return (sizeNumber * config.fontSizeScale).toString() + getUnit(fontSize)
})

const _lineHeight = computed(() => covetUniNumber(props.lineHeight, config.unit))
const _gap = computed(() => covetUniNumber(props.gap, config.unit))
const _height = computed(() => covetUniNumber(props.height, config.unit))

const _width = computed(() => covetUniNumber(props.width, config.unit))

const _color = computed(() => {
	if (config.mode == 'dark') {
		if (props.darkColor != '') {
			return getDefaultColor(props.darkColor)
		} else {
			return getDefaultColor(config.sheetDarkColor)
		}
	}
	return getDefaultColor(props.color)
})

const _activeTitleColor = computed(() => {
	if (props.activeTitleColor == "") return getDefaultColor(config.color);
	return getDefaultColor(props.activeTitleColor)
})
const _dotBgColor = computed(() => {
	if (props.dotBgColor == "") return _activeTitleColor.value
	return props.dotBgColor
})

const _titleColor = computed(() => {
	if (config.mode == 'dark') {
		if (props.darkTitleColor != '') {
			return getDefaultColor(props.darkTitleColor)
		} else {
			return "#ffffff"
		}
	}
	return getDefaultColor(props.titleColor)
})

const _lineColor = computed(() => {
	if (props.lineColor == "") return _activeTitleColor.value;
	return getDefaultColor(props.lineColor)
})

const activeName = ref(props.modelValue)
const moveName = ref(props.modelValue)
const _list = computed(() => props.list)
const _listIds = computed(() => {
	let ids: Array<string | number> = _list.value.map((item, index) => {
		if (typeof item === 'string') return index
		let id = typeof item[props.rangId] == 'undefined' ? index : item[props.rangId]
		return id;
	})
	return ids;
})
const _mode = computed(() => {
	if (props.mode == 'around') return "space-around"
	if (props.mode == 'between') return "space-between"
	if (props.mode == 'center') return "center"
	if (props.mode == 'end') return "flex-end"
	return 'flex-start'
})
provide('tmTabsActiveName', computed((): string | number => activeName.value))

watch(() => props.modelValue, (newValue: string | number) => {
	if (newValue == activeName.value) return;
	toggleActivate(newValue)
})
const getValue = (item: Record<string, any> | string): string => {
	if (typeof item === 'string') return item;
	let value = item[props.rangKey] || ""
	return value;
}
const getDot = (item: Record<string, any> | string): boolean | string | number => {
	if (typeof item === 'string') return false;
	let value = typeof item[props.rangDot] == 'undefined' ? false : item[props.rangDot]
	return value;
}
/**
 * 切换选中
 */
const toggleActivate = (name: string | number, isEmits = false) => {
	activeName.value = name
	if (isEmits) {
		emit('update:modelValue', name)
		emit('change', name)
	}
	changMovename(name)
}
const changMovename = (name: string | number) => {
	let index = _listIds.value.findIndex(el => el == name)
	if (index == -1) return;
	index = index - props.moveCount
	index = Math.max(0, index)
	moveName.value = ''

	nextTick(() => {
		moveName.value = _listIds.value[index];
	})
}
const tabsOnclick = (item: string | Record<string, any>, index: number) => {
	if(isDisabled(item)) return;
	let name = _listIds.value[index];
	if (name === activeName.value) return;
	toggleActivate(name, true)
}
const isDisabled = (item: string | Record<string, any>):boolean=>{
	if(typeof  item == 'object'){
		if(item?.disabled == true) {
			return true;
		}
	}
	return  false;
}

defineExpose({ toggleActivate })

</script>
<script lang="ts">
export default {
	options: {
		styleIsolation: "apply-shared",
		virtualHost: true,
		addGlobalClass: true,
		multipleSlots: true
	}
}
</script>
<template>
	<view class="tmTabs" :style="{
        backgroundColor: _color,
        'border-radius': _round,
        height: _height,
        width: _width
    }
        ">
		<scroll-view
			:scroll-into-view="'tabs_' + moveName"
			:scroll-left="tabsleft"
			:scroll-x="true"
			:show-scrollbar="false"
			class="tmTabsWrapBox"
			enable-flex
		>
			<view class="tmTabsWrap" :style="{ justifyContent: _mode }">
				<view @click="tabsOnclick(item, index)"
					  class="tmTabsItem"
					  :id="'tabs_' + _listIds[index]"
					  :class="[isDisabled(item)?'tmTabsDisabled':'']"
					  v-for="(item, index) in _list" :key="index"
					  :style="[
                        {
                            color: activeName == _listIds[index] ? _activeTitleColor : _titleColor,
                            fontSize: activeName == _listIds[index] ? _activeFontSize : _fontSize,
                            fontWeight: activeName == _listIds[index] ? 'bold' : 'normal',
                            width: _itemWidth,
                            padding: `0px ${_gap}`
                        },
                        activeName == _listIds[index] ? _activeItemStyle : _customItemStyle
                    ]">
					<tm-badge :bg-color="_dotBgColor" :label="getDot(item)">
						{{ getValue(item) }}
					</tm-badge>
					<view v-if="_showLine" class="tmTabsItemLiner" :style="{
                        width: activeName == _listIds[index] ? (_lineFull ? '100%' : '36%') : '0%',
                        height: _lineHeight,
                        maxWidth: !_lineFull ? '36px' : 'auto',
                        backgroundColor: activeName == _listIds[index] ? _lineColor : 'transparent'
                    }"></view>
				</view>
			</view>
		</scroll-view>
	</view>

</template>
<style lang="css">
.tmTabsItem {
	/* padding: 0 20rpx; */
	height: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	flex-shrink: 0;
	box-sizing: border-box;
}
.tmTabsDisabled{
	opacity: 0.4;
	cursor: no-drop;
}

.tmTabsItemLiner {
	/* height: 2px; */
	position: absolute;
	z-index: 1;
	bottom: 0px;
	transition: all 0.3s ease-in-out;

}

.tmTabs {
	position: relative;
	box-sizing: border-box;
}

.tmTabsWrapBox {
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
}

.tmTabsWrap {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	min-width: 100%;
	/* justify-content: flex-start; */
	align-items: center;
	/* width: auto; */
	height: 100%;
	box-sizing: border-box;
}
</style>