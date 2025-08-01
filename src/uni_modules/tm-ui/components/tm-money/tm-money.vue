<template>
	<view class="tmMoney" :style="{ color: _fontColor }">
		<!--
		@slot 默认插槽
		@binding {string} inter - 整数部分
		@binding {string} digit - 小数部分
		@binding {string} cn - 大写金额
		@binding {string} lineHeight - 行高，在安卓上你要写行高不然被裁剪。
		-->
		<slot :inter="money_str.val" :digit="money_str.xs" :cn="money_rmb" :lineHeight="_maxLineheight">
			<text  v-if="_symbolPosition == 'left' && !_showCn"
				:style="{ fontSize: _preFontSize, color: _fontColor }">
				{{ _symbolText }}
			</text>
			<text :style="{ fontSize: _fontSize, lineHeight: _maxLineheight, color: _fontColor }">{{ _showCn
				? money_rmb : money_str.val }}</text>
			<text v-if="_showCn" :style="{ fontSize: _preFontSize, lineHeight: _maxLineheight }"></text>
			<text  v-if="!_showCn"
				:style="{ fontSize: _preFontSize, lineHeight: _maxLineheight, color: _fontColor }">{{ money_str.xs != ''
					? '.' : '' }}{{ money_str.xs }}</text>
			<text v-if="_symbolPosition == 'right' && !_showCn"
				:style="{ fontSize: _preFontSize, lineHeight: _maxLineheight, color: _fontColor }">{{ _symbolText
				}}</text>
		</slot>
	</view>
</template>

<script lang="ts" setup>
import { PropType, computed, onMounted, ref, shallowRef, watch } from 'vue'
import { covetUniNumber, getUnit } from '../../libs/tool';
import { TMUPLOAD_PHOTO_STATUS } from '../../interface';
import { useTmConfig } from "../../libs/config";
import { getDefaultColor } from '../../libs/colors';

type valuType = {
	val: string,
	zs: string,
	xs: string
}

/**
 * @displayName 金额栅格
 * @exportName tm-money
 * @category 展示组件
 * @description 对金额进行栅格化
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
	| --- | --- | --- | --- |
	| ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmMoney' });
const { config } = useTmConfig()
const props = defineProps({
	/**
	 * 小数点后几位
	 */
	digit: {
		type: Number,
		default: 2
	},
	/**
	 * 开启千分位
	 */
	thousand: {
		type: Boolean,
		default: false
	},
	/**
	 * 千分位的分隔符
	 */
	thousandUnit: {
		type: String,
		default: ","
	},
	/**
	 * 千分位的长度，默认是3位一位，如果为4就是万分位依此类推
	 */
	thousandLen: {
		type: Number,
		default: 3
	},
	/**
	 * 货币符号
	 */
	symbolText: {
		type: String,
		default: '￥'
	},
	/**
	 * 货币符号位置
	 * left:左侧
	 * right:右侧
	 */
	symbolPosition: {
		type: String,
		default: 'left'
	},
	/**
	 * 文字颜色
	 */
	color: {
		type: String,
		default: 'primary'
	},
	/**
	 * 暗黑时的文字颜色
	 */
	darkColor: {
		type: String,
		default: ''
	},
	/**
	 * 文字大小
	 */
	fontSize: {
		type: String,
		default: '32'
	},
	/**
	 * 货币符号及小数字号大小
	 */
	preFontSize: {
		type: String,
		default: '32'
	},
	/**
	 * 是否显示中文金额
	 */
	showCn: {
		type: Boolean,
		default: false
	}
})

// 计算属性和方法
const moneyValue = defineModel({type:Number,default:0})
const _symbolText = computed((): string => props.symbolText)
const _symbolPosition = computed((): string => props.symbolPosition)
const _fontSize = computed((): string => covetUniNumber(props.fontSize, config.unit))
const _preFontSize = computed((): string => covetUniNumber(props.preFontSize, config.unit))

const _maxLineheight = computed((): string => {
	let minfsz = parseInt(_preFontSize.value)
	let maxfsz = parseInt(_fontSize.value)
	let diff = Math.max(minfsz, maxfsz) * 1.5 + 2

	return diff + getUnit(_fontSize.value)
})

const _maxLineheightCover = computed((): string => {
	let minfsz = parseInt(_preFontSize.value)
	let maxfsz = parseInt(_fontSize.value)
	let diff = Math.max(minfsz, maxfsz)
	return diff + getUnit(_fontSize.value)
})

const _fontColor = computed((): string => {
	if (config.mode === 'dark' && props.darkColor !== '') {

		return getDefaultColor(props.darkColor)
	}
	return getDefaultColor(props.color)
})

const _showCn = computed((): boolean => props.showCn)

/**
 * 精度处理函数
 */
function toFixed(value: number, digits: number) {
	if (typeof digits !== 'number' || digits < 0 || typeof value !== 'number') {
		return { val: '', zs: '', xs: '' }
	}
	const zs = Math.floor(value).toString()
	let integerPart = zs
	const valueStr = value.toString()
	let digIndex = valueStr.lastIndexOf('.')
	const decimalPart = digIndex > -1 ? valueStr.substring(digIndex + 1) : ''
	let decimalString = decimalPart

	if (digits > 0) {
		if (decimalString.length > digits) {
			decimalString = decimalString.substring(0, digits)
		} else {
			while (decimalString.length < digits) {
				decimalString += '0'
			}
		}
	}


	if (digits === 0) {
		return { val: integerPart, zs: integerPart, xs: '' }
	}
	if (props.thousand) {
		let regx = new RegExp(`(\\d)(?=(\\d{${props.thousandLen}})+(?!\\d))`, 'g')
		integerPart = integerPart.replace(regx, `$1${props.thousandUnit}`)
	}
	return { val: integerPart, zs, xs: decimalString }
}

/**
 * 将金额转换为中文
 */
function convertCurrency(money: number, zs: string, xs: string): string {
	var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖")
	var cnIntRadice = new Array<string>("", "拾", "佰", "仟")
	var cnIntUnits = new Array<string>("", "万", "亿", "兆")
	var cnDecUnits = new Array<string>("角", "分", "毫", "厘")
	var cnInteger = "整"
	var cnIntLast = "元"
	var maxNum = 999999999999999.9999
	var integerNum = parseInt(zs)
	var decimalNum = xs
	var chineseStr = ""

	if (money >= maxNum) {
		return ""
	}

	if (money === 0) {
		chineseStr = cnNums[0] + cnIntLast + cnInteger
		return chineseStr
	}

	if (integerNum > 0) {
		var zeroCount = 0
		let IntStr = integerNum.toString()
		var IntLen = IntStr.length
		for (var i = 0; i < IntLen; i++) {
			var n = IntStr.substring(i, i + 1)
			var p = IntLen - i - 1
			var q = p / 4
			var m = p % 4
			if (n === "0") {
				zeroCount++
			} else {
				if (zeroCount > 0) {
					chineseStr += cnNums[0]
				}
				zeroCount = 0
				chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
			}
			if (m === 0 && zeroCount < 4) {
				chineseStr += cnIntUnits[q]
			}
		}
		chineseStr += cnIntLast
	}

	if (decimalNum !== "") {
		var decLen = decimalNum.length
		for (var i = 0; i < decLen; i++) {
			var n = decimalNum.substring(i, i + 1)
			if (n !== "0") {
				chineseStr += cnNums[parseInt(n)] + cnDecUnits[i]
			}
		}
	}

	if (chineseStr === "") {
		chineseStr += cnNums[0] + cnIntLast + cnInteger
	} else if (decimalNum === "") {
		chineseStr += cnInteger
	}

	return chineseStr
}

const money_str = computed((): valuType => toFixed(moneyValue.value, props.digit))
const money_rmb = computed((): string => {
	let obj = toFixed(moneyValue.value, props.digit)
	return convertCurrency(moneyValue.value, obj.zs, obj.xs)
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
<style>
.tmMoney {
	display: inline-block;
	vertical-align: bottom;
	line-height: 1;
}
</style>