<template>

	<view class="tmAvatarGroup" ref="tmAvatarGroup" :class="[_flat?'tmAvatarGroupWrap':'tmAvatarGroupNoWrap']">
		<template v-for="(item,index) in _list" :key="index">
			
			<image @click="itemClick(item,index)" v-if="item.isImg" :style="{
				width:_size,
				height:_size,
				borderRadius:_round,
				marginRight:((index+1) == column&&_showCount) ?'0px':_gutter,
				marginBottom:Math.ceil((index+1)/column)==row?'0px':_gutter
				
			}" class="tmAvatarGroupImage" 
			:class="[!_flat?'tmAvatarGroupImageFLat':'']"
			:src="item.name" :mode="props.model"></image>
			<view @click="itemClick(item,index)" v-else :style="{
			width:_size,
			height:_size,
			borderRadius:_round,
			marginRight:((index+1) == column&&_showCount) ?'0px':_gutter,
			marginBottom:Math.ceil((index+1)/column)==row?'0px':_gutter,
			backgroundColor:item.bgColor
			}" class="tmAvatarGroupImage tmAvatarGroupImageBytext"
			:class="[!_flat?'tmAvatarGroupImageFLat':'']"
			>
				<tm-text v-if="item.name!=''" :font-size="props.fontSize"
					:color="(_randomBgColor?'white':props.fontColor)" :dark-color="props.darkFontColor">
					{{item.name}}
				</tm-text>
				<tm-icon v-if="item.name==''" :size="props.fontSize"
					:color="(_randomBgColor?'white':props.fontColor)" :dark-color="props.darkFontColor"
					:name="props.placeIcon"></tm-icon>
			</view>
		</template>
		<!--
		 @slot more更多插槽，如果使用了这个插槽moreClick事件会丢失，请自己写在自己的布局上。
		 -->
		<slot name="more">
			<view @click="moreClick" class="tmAvatarGroupImageMore" :style="{
				width:_size,
				height:_size,
				borderRadius:_round,
				backgroundColor:_BgColor
			}" v-if="_showCount">
				<tm-text :font-size="props.fontSize" :color="props.fontColor"
					:dark-color="props.darkFontColor">{{_count==0?(_list.length>99?99:_list.length)+'+':(_count>99?99:_count)+'+'}}</tm-text>
			</view>
		</slot>
	</view>
</template>

<script setup lang="ts">

	import { ref, computed, onMounted, watch, PropType,onUnmounted,getCurrentInstance  } from 'vue'
	import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit } from "../../libs/tool";
	import { getDefaultColor,hslaToCss, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
	import { useTmConfig } from "../../libs/config";
	const proxy = getCurrentInstance()?.proxy??null;
	type tmAvatarGROUPITEMTYPE = {
		name : string,
		isImg : boolean,
		bgColor : string
	}
	
	/**
	 * @displayName 头像组
	 * @exportName tm-avatar-group
	 * @category 展示组件
	 * @description 平铺和堆叠方式。
	 * @constant 平台兼容
	 *	| H5 | uniAPP | 小程序 | version |
	    | --- | --- | --- | --- |
	    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
	 */
	defineOptions({ name: 'TmAvatarGroup' });
	const { config } = useTmConfig()

	const emits = defineEmits([
		/**
		 * 头像被点击时
		 * @param {number} index 当前索引 
		 * @param {string} src 当前图片地址 
		 */
		"click",
		/**
		 * 最后一个数字头像more被点击时
		 */
		"moreClick"
	])
	const props = defineProps({
		/**
		 * 头像列表,也可以是文本数组，也可以是空字符串数组
		 */
		list: {
			type: Array as PropType<string[]>,
			default: () : string[] => [] as string[]
		},
		/**
		 * 不允许使用auto,%只能数字或者带单位的数字2px,2rpx这种
		 */
		size: {
			type: String,
			default: '64'
		},
		/**
		 * 最多显示几个头像。
		 */
		maxCount: {
			type: Number,
			default: 5
		},
		/**
		 * 圆角
		 */
		round: {
			type: String,
			default: '32'
		},
		/**
		 * 平铺或者堆叠时的间隙或者前推差值。
		 * 不允许使用auto,%只能数字或者带单位的数字2px,2rpx这种
		 */
		gutter: {
			type: String,
			default: '16'
		},
		/**
		 * 显示类型见：
		 * https://doc.dcloud.net.cn/uni-app-x/component/image.html#%E5%B1%9E%E6%80%A7
		 */
		model: {
			type: String,
			default: "scaleToFill"
		},
		/**
		 * 显示在最后一个时，显示的数字。如果为0取list的长度
		 */
		count: {
			type: Number,
			default: 0
		},
		/**
		 * 是否显示最后一个数字头像
		 */
		showCount: {
			type: Boolean,
			default: true
		},
		/**
		 * 是否平铺，如果否就是堆叠。是就是正常排列。
		 */
		flat: {
			type: Boolean,
			default: false
		},
		/**
		 * 如果为文本头像时的背景
		 */
		bgColor: {
			type: String,
			default: "#f5f5f5"
		},
		/**
		 * 如果为文本头像时的暗黑背景
		 * 空时默认取inputDarkBgcolor
		 */
		darkBgColor: {
			type: String,
			default: ""
		},
		/**
		 * 如果为文本头像时的文字颜色
		 */
		fontColor: {
			type: String,
			default: "#a6a6a6"
		},
		/**
		 * 如果为文本头像时的暗黑背景
		 * 空时默认取inputDarkBgcolor
		 */
		darkFontColor: {
			type: String,
			default: "#ffffff"
		},
		/**
		 * 字号
		 */
		fontSize: {
			type: String,
			default: "28"
		},
		/**
		 * 文本头像时，是否随机背景色
		 */
		randomBgColor: {
			type: Boolean,
			default: false
		},
		/**
		 * 如果当图片或者文本为空时的图片占位符
		 * 可以是图片地址或者图标名称
		 */
		placeIcon: {
			type: String,
			default: 'user-3-fill'
		}
	})
	const _isFileImg = (name : string) : boolean => {
		if (name.lastIndexOf(".") > -1 ||
			name.indexOf("ftp:") > -1 ||
			name.indexOf("https:") > -1 ||
			name.indexOf("http:") > -1 ||
			name.indexOf("data:image") > -1
		) {
			return true;
		}
		return false;
	}
	const _randomBgColor = computed(() : boolean => {
		return props.randomBgColor
	})
	
	const _BgColor = computed(() : string => {
		let bgcolor = props.bgColor;
		if (config.mode == 'dark') {
			bgcolor = props.darkBgColor;
			if (bgcolor == '') {
				bgcolor = config.inputDarkColor
			}
		}
		return getDefaultColor(bgcolor)
	})

	const UpperEn = new Map<string, string>([
		['a', 'A'],
		['b', 'B'],
		['c', 'C'],
		['d', 'D'],
		['e', 'E'],
		['f', 'F'],
		['g', 'G'],
		['h', 'H'],
		['i', 'I'],
		['j', 'J'],
		['k', 'K'],
		['l', 'L'],
		['m', 'M'],
		['n', 'N'],
		['o', 'O'],
		['p', 'P'],
		['q', 'Q'],
		['r', 'R'],
		['s', 'S'],
		['t', 'T'],
		['u', 'U'],
		['v', 'V'],
		['w', 'W'],
		['x', 'X'],
		['y', 'Y'],
		['z', 'Z']
	]);
	const _list = computed(() : tmAvatarGROUPITEMTYPE[] => {
		let nowlist = props.list.slice(0)
		if (props.maxCount > 0) {
			nowlist = nowlist.slice(0, props.maxCount)
		}
		let compeltedList = [] as tmAvatarGROUPITEMTYPE[];
		for (let i = 0; i < nowlist.length; i++) {
			let name = nowlist[i]
			let isImg = _isFileImg(name);
			let bgColor = ''
			if (!isImg) {
				name = name.slice(0, 1)
				if (UpperEn.get(name) != null) {
					name = UpperEn.get(name)!
				}
				let h = Math.random() * 360
				let s = 78
				let l = 62

				bgColor = hslaToCss({ h: parseInt(h.toFixed(0)), s, l, a: 1 })
			}

			compeltedList.push({
				name,
				isImg,
				bgColor: props.randomBgColor ? bgColor : _BgColor.value
			} as tmAvatarGROUPITEMTYPE)
		}
		return compeltedList;
	})


	const _size = computed(() : string => covetUniNumber(props.size, config.unit))
	const _sizeBypx = computed(() : number => {
		let rpx = covetUniNumber(props.size, config.unit);
		let unit = getUnit(rpx)
		let zhi = parseFloat(rpx)
		if (unit == 'rpx') {
			zhi = uni.upx2px(parseFloat(rpx))
		}
		return zhi
	})

	const _showCount = computed(() : boolean => props.showCount)
	const _round = computed(() : string => covetUniNumber(props.round, config.unit))
	const _flat = computed(() : boolean => props.flat)
	const _gutter = computed(() : string => {
		if (props.flat) {
			return covetUniNumber(props.gutter, config.unit)
		}
		return '-' + covetUniNumber(props.gutter, config.unit)
	})
	const _gutterBypx = computed(() : number => {
		let rpx = covetUniNumber(props.gutter, config.unit);
		let unit = getUnit(rpx)
		let zhi = parseFloat(rpx)
		if (unit == 'rpx') {
			zhi = uni.upx2px(parseFloat(rpx))
		}
		return zhi
	})
	const _count = computed(() : number => props.count)
	const totalWidth = ref(0)
	const column = ref(1)
	const row = ref(0)
	let tid = 0

	const calcColumn = (width : number) => {
		totalWidth.value = width;
		if (_sizeBypx.value > 0) {
			column.value = Math.floor((totalWidth.value + _gutterBypx.value) / (_sizeBypx.value + _gutterBypx.value * (props.flat ? 1 : -1)));
		}
		if (column.value > 0 && _list.value.length > 0) {
			row.value = Math.ceil(props.list.length / column.value)
		}
	}
	const getNodeinfo = () => {
		uni.createSelectorQuery()
			.in(proxy)
			.select(".tmAvatarGroup")
			.boundingClientRect((res : any) => {
				calcColumn(res.width!)
			})
			.exec()
	}



	const itemClick = (item : tmAvatarGROUPITEMTYPE, index : number) => {
		emits('click', item.name, index)
	}
	const moreClick = () => {
		emits('moreClick')
	}
	onMounted(() => {
		getNodeinfo()
	})
	onUnmounted(() => {
		clearTimeout(tid)
	})
</script>

<style>
	.tmAvatarGroup {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;

	}

	.tmAvatarGroupImage {
		position: relative;
	}
	.tmAvatarGroupImageFLat{
		box-shadow: -4px 0 4px rgba(0, 0, 0, 0.05);
	}

	.tmAvatarGroupImageMore {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		z-index: 5;
	}
	.tmAvatarGroupImageBytext {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.tmAvatarGroupWrap {
		flex-wrap: wrap;
	}
	.tmAvatarGroupNoWrap {
		flex-wrap: nowrap;
	}
</style>