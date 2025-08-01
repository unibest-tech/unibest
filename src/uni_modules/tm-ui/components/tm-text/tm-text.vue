<template>
	<view @click="OnClick" :style="[__style,_customStyle]" class="xTextLines">
		<!--
		@slot 默认文本插槽，如果使用插槽，那么相关特性功能将会失效。
		因此不建议使用插槽，还不如自己用text标签。
		-->
		<slot>
			<text v-if="_label.length == 0" :user-select="selectable" :selectable="selectable">{{ _attrs.label }}</text>
		</slot>
		<text @click="itemClick(item.text)" :selectable="selectable" :style="[
			{
				color: item.color,
				lineHeight: lineHeight,
				fontSize: _fontSize,
			},
			item.isHeightLight ? heightLightStyle : '',
		]" v-for="(item, index) in _label" :key="index">
			{{ item.text }}
		</text>
	</view>
</template>
<script setup lang="ts">
import { computed, PropType, ref, useSlots } from "vue";
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, linearValid, getUnit } from "../../libs/tool";
import { useTmConfig } from "../../libs/config";
import { getDefaultColor, setTextColorLightByDark, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";


/**
 * @displayName 文本
 * @exportName tm-text
 * @category 常用组件
 * @description 允许正则高亮或者,词高亮.
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
	| --- | --- | --- | --- |
	| ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmText' });

const { config } = useTmConfig()
const slots = useSlots()
type ITEMINFO = {
	text: string,
	color: string,
	isHeightLight: boolean
}
const emits = defineEmits([
	/**
	 *文本点击
	 * @property {String} word 点击的文本内容
	 * */
	'click',
	/**
	 *正则的文本被点击
	 * @property {String} word 点击的文本内容
	 * */
	'itemClick'
])
// 使用defineProps定义组件的props
const attrs = defineProps({
	/**
     * 文本自定样式
     */
    _style:{
        type: [String, Object] as PropType<Partial<CSSStyleDeclaration>|string>,
        default: ''
    },
	/**
	 * 文本内容
	 * 这个prop用于接收显示在组件中的文本或数字
	 */
	label: {
		type: [String, Number],
		default: ''
	},
	/**
		 * 需要特别高亮的词
		 */
	heightLight: {
		type: [Array<string>],
		default: (): string[] => [] as string[]
	},
	/**
	 * 高亮正则
	 * 用于定义文本中哪些部分应该被高亮显示的正则表达式数组
	 */
	heightLightReg: {
		type: [Array<string>],
		default: () => []
	},
	/**
	 * 高亮文本的自定义样式
	 */
	heightLightStyle: {
		type: String,
		default: ""
	},
	/**
	 * 行数
	 * 控制文本显示时应该占用的行数（如果组件支持此功能）
	 */
	lines: {
		type: [Number, String],
		default: 0
	},
	/**
	 * 是否可选
	 * 指示文本是否可以被用户选择（如通过长按选择）
	 */
	selectable: {
		type: Boolean,
		default: false
	},
	/**
	 * 文本颜色
	 * 定义文本的主要颜色
	 */
	color: {
		type: String,
		default: "#333"
	},
	/**
	 * 暗色模式颜色
	 * 在暗色模式下文本的颜色（如果组件支持暗色模式）
	 */
	darkColor: {
		type: String,
		default: ""
	},
	/**
	 * 高亮颜色
	 * 文本中应该被高亮显示的部分的颜色
	 */
	heightLightColor: {
		type: String,
		default: "primary"
	},
	/**
	 * 行高
	 * 文本的行高设置
	 */
	lineHeight: {
		type: [String, Number],
		default: "1.5"
	},
	/**
	 * 字体大小
	 * 文本的字体大小设置
	 */
	fontSize: {
		type: [String, Number],
		default: ""
	},
})
const _attrs = computed(() => attrs)
const _customStyle = computed((): any => attrs._style)

/**
 * 点击事件处理函数
 * @returns 无返回值
 */
const OnClick = () => {
	emits('click', attrs.label)

}
/**
 * 正则的文本被点击
 * @param text 被点击的文本内容
 */
const itemClick = (text: string) => {
	emits('itemClick', text)
}

const _color = computed((): string => {

	let color = attrs.color;
	if (config.mode == 'dark') {
		if (attrs.darkColor != "") {
			color = attrs.darkColor!
			return getDefaultColor(color)
		}
		return setTextColorLightByDark(color)
	}
	return getDefaultColor(attrs.color)
})

const _label = computed((): ITEMINFO[] => {
	let slotsdefault = slots.default;
	if (typeof slotsdefault == 'function') {
		if (slotsdefault().length > 0) return [] as ITEMINFO[];
	} else if (typeof slotsdefault == 'boolean') {
		if (slotsdefault) return [] as ITEMINFO[];
	}

	let keywords = attrs.heightLight
	let albel = typeof attrs.label == 'number' ? attrs.label.toString() : attrs.label;

	if ((keywords.length == 0 && attrs.heightLightReg.length == 0) || albel.length == 0) {
		return [{ text: albel, color: _color.value, isHeightLight: false } as ITEMINFO]
	}
	let regexxAr = [] as string[];

	attrs.heightLightReg.forEach(function (reg: string) {
		let regex = new RegExp(reg, 'gi');
		let rulst = regex.exec(albel)
		while (rulst != null && Array.isArray(rulst)) {
			if (Array.isArray(rulst)) {
				let str = rulst[0]! as string;
				if (!regexxAr.includes(str)) {
					regexxAr.push(str)
				}

			}
			rulst = regex.exec(albel)
		}

	});

	keywords = keywords.concat(regexxAr)

	// 遍历关键词数组
	keywords.forEach(function (keyword: string) {
		// 创建一个正则表达式，使用'i'标志表示不区分大小写
		let regex = new RegExp(keyword, 'gi');
		// 使用replace方法将匹配到的关键词用带有高亮样式的span标签包裹起来
		albel = albel.replace(regex, `~-<span>${keyword}</span>~-`);
	});

	let ps = albel.split('~-')
	let ar = [] as ITEMINFO[]
	ps.forEach((el: string) => {
		if (el.length > 0) {
			let start = el.indexOf('<span>')
			if (start > -1) {
				let end = el.lastIndexOf('</span>')
				ar.push({
					text: el.substring(start + 6, end),
					color: _heightLightColor.value,
					isHeightLight: true
				} as ITEMINFO)
			} else {
				ar.push({
					text: el,
					color: _color.value,
					isHeightLight: false
				} as ITEMINFO)
			}
		}
	})
	return ar;
})
const _heightLightColor = computed((): string => {
	return getDefaultColor(attrs.heightLightColor)
})
const _fontSize = computed((): string => {
	let fontSize = attrs.fontSize || config.fontSizeBase
	fontSize = covetUniNumber(fontSize, config.unit);
	if (config.fontSizeScale == 1) return fontSize;
	let sizeNumber = parseInt(fontSize)
	if (isNaN(sizeNumber)) {
		sizeNumber = 28
	}
	return (sizeNumber * config.fontSizeScale).toString() + getUnit(fontSize)
})
const __style = computed((): { [key: string]: any } => {
	let obj: { [key: string]: any } = {}
	obj["-webkit-line-clamp"] = attrs.lines.toString()
	obj["lineHeight"] = attrs.lineHeight
	obj["fontSize"] = _fontSize.value
	obj["color"] = _color.value
	return obj
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
<style lang="scss" scoped></style>
