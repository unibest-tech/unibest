<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, PropType, getCurrentInstance, onUpdated, nextTick } from 'vue';
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit, getUid } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
import {onLoad, onPageScroll,onReady} from '@dcloudio/uni-app';

/**
 * @displayName 抽屉
 * @exportName tm-drawer
 * @category 反馈组件
 * @description 提供四个方向的弹出。
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmDrawer' });
const { config } = useTmConfig()

const props = defineProps({
	/**
	 * 自定义遮罩样式
	 */
	customStyle: {
		type: String,
		default: ""
	},
	/**
	 * 标题
	 */
	title: {
		type: String,
		default: "标题"
	},
	/**
	 * 显示底部操作栏
	 */
	showFooter: {
		type: Boolean,
		default: false
	},
	/**
	 * 是否显示标题
	 */
	showTitle: {
		type: Boolean,
		default: true
	},
	/**
	 * 是否显示底部关闭按钮
	 */
	showClose: {
		type: Boolean,
		default: false
	},
	/**
	 * 遮罩是否允许点击被关闭
	 */
	overlayClick: {
		type: Boolean,
		default: true
	},
	/**
	 * 显示可v-model:show双向绑定
	 */
	show: {
		type: Boolean,
		default: false
	},
	/**
	 * 显示取消按钮
	 */
	showCancel: {
		type: Boolean,
		default: true
	},
	/**
	 * 取消按钮的文本
	 */
	cancelText: {
		type: String,
		default: "取消"
	},
	/**
	 * 确认按钮的文本
	 */
	confirmText: {
		type: String,
		default: "确认"
	},
	/**
	 * 动画时间
	 */
	duration: {
		type: Number,
		default: 300
	},
	/**
	 * 打开方向。
	 */
	position: {
		type: String as PropType<"top" | "bottom" | "left" | "right">,
		default: "bottom"
	},
	/**
	 * 打开方向为上和下时的圆角
	 * 空值时，取全局配置的圆角。
	 */
	round: {
		type: [String, Number],
		default: ""
	},
	/**
	 * 左右时为内容宽，
	 * 上下时为内容高
	 * 百分比，数字字符或者带单位,或者为auto(根据内容自动高度或者宽高)
	 */
	size: {
		type: [String, Number],
		default: "50%"
	},
	/**
	 * 弹层最大的高度值，默认为屏幕的可视高
	 * 提供值时不能为百分比，可以是px,rpx单位数字。如果你不带单位，默认转换为rpx单位。
	 */
	maxHeight: {
		type: String,
		default: ""
	},
	/**
	 * 背景颜色
	 */
	bgColor: {
		type: String,
		default: 'white'
	},
	/**
	 * 暗黑背景颜色，如果不提供默认读取全局的sheet配置
	 */
	darkBgColor: {
		type: String,
		default: ''
	},

	/**
	 * 是否禁用内部的scroll标签
	 * 禁用后内容不会滚动，如果设定了指定高，内容超出指定高，会被裁切
	 * 但如果没有指定高，内容自动的话，高是自动的。
	 */
	disabledScroll: {
		type: Boolean,
		default: false
	},
	/**
	 * 内容区域左右和下的边距。
	 */
	contentMargin: {
		type: String,
		default: '24'
	},
	/**
	 * 宽屏时是否让内容剧中显示
	 * 并限制其它宽为屏幕宽，只展示中间内容以适应宽屏。
	 * 注意只有top,bottom才会生效。
	 */
	widthCoverCenter: {
		type: Boolean,
		default: false
	},
	/**
	 * 距离顶部的偏移量
	 */
	offsetTop: {
		type: [String, Number],
		default: '0'
	},
	/**
	 * 弹层的层级
	 */
	zIndex: {
		type: [String, Number],
		default: 1100
	},
	/**
	 * 懒加载
	 * 为了解决业务布局节点超多时,你可能需要内容延迟加载以免阻塞动画流畅度.
	 * 如果你启用了lazy,每天次打开时,动画执行后才会显示内容.这样动画就流畅,不会因为节点过多造成的卡.
	 */
	lazy: {
		type: Boolean,
		default: false
	},
	/**
	 * 关闭前执行，可以是异步函数，只有当用户点击confirm时才会触发。如果返回false将阻止关闭。true允许关闭。
	 */
	beforeClose: {
		type: [Function,Boolean] as PropType<() => Promise<boolean>>,
		default: true
	},
	/**
	 * 是否禁用弹层
	 */
	disabled: {
	    type: Boolean,
	    default: false
	},
})

const emit = defineEmits([
	/**
	 * 点击遮罩事件
	 */
	'click',
	/**
	 * 关闭是触发
	 */
	'close',
	/**
	 * 打开时触发
	 */
	'open',
	/**
	 * 打开前执行
	 */
	'beforeOpen',
	/**
	 * 关闭前执行
	 */
	'beforeClose',
	/**
	 * 等同v-model:show
	 */
	'update:show',
	/**
	 * 取消时触发
	 */
	'cancel',
	/**
	 * 确认时触发
	 */
	'confirm'
])

const isLoading = ref(false)
const _width = ref(0)
const _height = ref(0)
const showOverflay = ref(false)
const actinon = ref(false)
const status = ref("")
const id = ref("tmDrawer" + getUid())
const wrapId = ref("tmDrawerWrap" + getUid())
const first = ref(true)
const tid = ref(10)
const tid2 = ref(0)
const windtop = ref(0)
const windtopReal = ref(0)
const tantiaoTrue = ref(false)
const safeFooterHeight = ref(0)
const lezyShowModal = ref(props.lazy ? false : true)
const _disabled = computed(() => props.disabled)
const teleportElH5 = ref("#app")
watch(() => props.show, (newVal) => {
	if (newVal) {
		showAlert()
	} else {
		closeAlert()
	}
})

const _lazy = computed(() => props.lazy)
const _customStyle = computed(() => props.customStyle)
const _show = computed(() => props.show)
const _widthCoverCenter = computed(() => props.widthCoverCenter)
const _showClose = computed(() => props.showClose)
const _duration = computed(() => props.duration)
const _position = computed(() => props.position)
const _title = computed(() => props.title)
const _showTitle = computed(() => props.showTitle)
const _round = computed(() => {
	let round = props.round
	if (round == "") {
		round = config.drawerRadius
	}
	let radius = covetUniNumber(round, config.unit)

	let _r = "none"
	if (props.position == 'top') {
		_r = `0px 0px ${radius} ${radius}`
	}
	if (props.position == 'bottom') {
		_r = `${radius} ${radius} 0px 0px`
	}
	return _r
})
const _offset = computed(() => {
	let offset = covetUniNumber(props.offsetTop, config.unit)
	let x = parseFloat(offset)
	let unit = getUnit(offset)
	if (unit == 'rpx') {
		x = uni.upx2px(x)
	}
	return x
})
const _size = computed(() => covetUniNumber(props.size, config.unit))
const _contentMargin = computed(() => covetUniNumber(props.contentMargin, config.unit))
const _showFooter = computed(() => props.showFooter)
const _maxHeight = computed(() => {
	if (props.maxHeight == "") return ""
	if (props.position == 'left' || props.position == 'right') return ""

	return covetUniNumber(props.maxHeight, config.unit)
})
const _showCancel = computed(() => props.showCancel)
const _cancelText = computed(() => props.cancelText)
const _confirmText = computed(() => props.confirmText)
const _animationFun = computed(() => config.animation)
const _bgColor = computed(() => {
	let bgcolor = props.bgColor
	if (config.mode == 'dark') {
		if (props.darkBgColor != '') {
			bgcolor = props.darkBgColor
		} else {
			bgcolor = config.sheetDarkColor
		}
	}
	return getDefaultColor(bgcolor)
})
const __height = computed(() => {
	let h = '100%'
	// #ifdef WEB
	h = `calc(100% - ${windtopReal.value}px)`
	// #endif
	// #ifdef APP
	if (_offset.value > 0) {
		h = _height.value + 'px'
	}
	// #endif
	return h
})
const _titleFontSize = computed(() => (config.fontSizeScale * 16).toString() + 'px')
const _isDark = computed(() => config.mode == 'dark')
const setDomHeight = ()=>{
    let sys = uni.getWindowInfo()
    // #ifdef WEB
    _width.value = sys.windowWidth
    _height.value = sys.windowHeight

    windtop.value = sys.windowTop + (_position.value=='bottom'?0:_offset.value)
    windtopReal.value = _position.value=='bottom'?(sys.windowTop +_offset.value):sys.windowTop
    // #endif
    // #ifdef APP
    _width.value = sys.windowWidth
    _height.value = sys.windowHeight
    windtop.value = _offset.value
    // #endif
    safeFooterHeight.value = (sys.safeAreaInsets?.bottom??0) == 0 ? 16 : sys.safeAreaInsets.bottom
}


onMounted(()=>{
	setDomHeight()
	uni.$on('onReady',setDomHeight)
	lezyShowModal.value = props.lazy ? false : true
	teleportElH5.value = "uni-page"
	if (props.show) {
		showAlert()
	}
})

onBeforeUnmount(() => {
	clearTimeout(tid.value)
	clearTimeout(tid2.value)
	uni.$off('onReady',setDomHeight)
})

const cancelEvt = () => {
	emit('cancel')
	closeAlert()
}

const confirmEvt = async () => {
	emit('confirm')
	let isPass = true;
	if (typeof props.beforeClose == 'function') {
		isLoading.value = true;
		// @ts-ignore
		isPass = await props.beforeClose();
	}
	isLoading.value = false;
	if (!isPass) {
		return;
	}
	closeAlert()
}


const onClickOverflowy = (evt: Event) => {
	evt.stopPropagation()
	/**
	 * 点击遮罩事件
	 */
	emit("click")
	if (isLoading.value) return
	if (!props.overlayClick) {
		clearTimeout(tid2.value)
		tantiaoTrue.value = true
		tid2.value = setTimeout(() => {
			tantiaoTrue.value = false
		}, 200);
		return;
	}
	closeAlert()

}

const closeAlert = () => {
	if (actinon.value || isLoading.value) return
	if (status.value == 'close') return
	actinon.value = true
	status.value = 'close'
	/**
	 * 关闭前执行
	 */
	emit('beforeClose')

	clearTimeout(tid.value)
	tid.value = setTimeout(() => {
		onEnd()
	}, _duration.value)
}

const showAlert = () => {
	if (actinon.value) return
	if (status.value == 'open') return
	showOverflay.value = true
	actinon.value = true

	/**
	 * 打开前执行
	 */
	emit('beforeOpen')
	clearTimeout(tid.value)
	tid.value = setTimeout(() => {
		status.value = 'open'
		tid.value = setTimeout(() => {
			onEnd()
		}, _duration.value)
	}, 50)
}

function openDrawer() {
	if(_disabled.value) return;
	showAlert();
}

function onEnd() {
	actinon.value = false;

	if (status.value === 'close') {
		showOverflay.value = false;
		emit('close');
		emit('update:show', false);
		if (_lazy.value) {
			lezyShowModal.value = false;
		}
	} else {
		emit('open');
		if (_lazy.value) {
			lezyShowModal.value = true;
		}
	}
}



function maskerMove(evt: TouchEvent) {
	evt.preventDefault();
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
<template>
	<view>
		<view @click="openDrawer">
			<!--
			标签触发显示遮罩，免于使用变量控制
			@slot {Boolean} show - 当前是否已显示
			-->
			<slot name="trigger" :show="show"></slot>
		</view>
		<!-- #ifdef H5 -->
		<teleport :to="teleportElH5">
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<root-portal>
				<!-- #endif -->
				<view @click="onClickOverflowy" @touchmove="maskerMove" v-if="showOverflay" :id="id" ref="tmDrawerWrap"
					class="tmDrawerWrap" :class="[
						status == 'open' ? 'tmModalWrap_on' : 'tmModalWrap_off',
						(_position == 'top' || _position == 'bottom') && _widthCoverCenter ? 'tmDrawerWrapContentMinwidthWrapDir' : '',
						'tmDrawerWrap_' + _position
					]" :style="[{
						width: '100%',
						top: (windtop + 'px'),
						height: __height,
						zIndex: zIndex,
						'transition-timing-function': _animationFun
					}, _customStyle]">

					<view @click.stop="" ref="tmDrawerWrapContent" class="tmDrawerWrapContent" :class="[
						(_position == 'top' || _position == 'bottom') && _widthCoverCenter ? 'tmDrawerWrapContentMinwidth' : '',
						'tmDrawerWrapContent_' + _position + (status == 'open' ? '_on' : ''),
						tantiaoTrue ? 'tmModalWrapContent_Tantiao' : ''
					]" :id="wrapId" :style="{
						width: _position == 'left' || _position == 'right' ? _size : '100%',
						height: _position == 'left' || _position == 'right' ? '100%' : _size,
						borderRadius: _round,
						maxHeight: _maxHeight != '' ? _maxHeight : '100%',
						minHeight:_size == 'auto'?'350rpx':'0px',
						'transition-timing-function': _animationFun,
						backgroundColor: _bgColor
					}">

						<view v-if="_showClose" class="tmDrawerXclose">
							<tm-icon  @click="closeAlert" color="#dcdcdc" size="52"
								name="close-circle-fill"></tm-icon>
						</view>
						<view>
							<view v-if="_showTitle" class="tmDrawerTitleBox">
								<!-- 
								标题插槽
								@slot {Boolean} show - 当前是否已显示
								-->
								<slot name="title" :show="show">
									<text
										:style="{ fontSize: _titleFontSize, color: _isDark ? 'white' : 'black', opacity: '0.64' }"
										class="tmDrawertitleBox">{{ _title }}</text>
								</slot>
							</view>
						</view>

						<view v-if="!disabledScroll && _size != 'auto'" style="flex: 1;" class="tmModalWrapBoxContent">
							<scroll-view style="height:100%;position:absolute;width:100%;" :scroll-y="true"
								:rebound="false">
								<view :style="{ padding: `0px ${_contentMargin}  0px ${_contentMargin}` }">
									<!--
									@slot 默认插槽
									-->
									<slot></slot>
								</view>
							</scroll-view>
						</view>
						<view v-else
							:style="{ height: '100%', padding: `0px ${_contentMargin}  0px ${_contentMargin}` }">
							<!--
							@slot 默认插槽
							-->
							<slot></slot>
						</view>


						<view v-if="showFooter && lezyShowModal" class="tmDrawerFooter"
							:style="{ backgroundColor: _bgColor }">
							<view :style="{ height: _contentMargin }"></view>

							<!--
							@slot 底部操作栏
							-->
							<slot name="footer">
								<view
									style="flex-direction: row;align-items: center;justify-content: center;display:flex;">
									<tm-button :loading="isLoading" width="0px" @click="cancelEvt" v-if="_showCancel"
										skin="thin" style="margin-right: 16px;flex:1">{{ _cancelText }}</tm-button>
									<tm-button :loading="isLoading" width="0px" @click="confirmEvt" style="flex:1">{{
										_confirmText
										}}</tm-button>
								</view>
							</slot>
							<view :style="{ height: (safeFooterHeight||20) + 'px' }"></view>
						</view>
					</view>

				</view>
				<!-- #ifdef MP-WEIXIN -->
			</root-portal>
			<!-- #endif -->

			<!-- #ifdef H5 -->
		</teleport>
		<!-- #endif -->
	</view>
</template>
<style lang="scss" scoped>
.tmDrawerFooter {
	width: 100%;
	padding: 0 24rpx 0px 24rpx;
	box-sizing: border-box;
}

.tmDrawerXclose {
	position: absolute;
	right: 24rpx;
	top: 18rpx;
	z-index: 100;
}

.tmDrawerTitleBox {
	height: 50px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
    font-weight: bold;
}

.tmDrawertitleBox {
	max-width: 175px;
	overflow: hidden;
	line-clamp: 1;
	display: -webkit-box;
	text-overflow: ellipsis;

}

.tmDrawerWrap_bottom {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.tmDrawerWrap_top {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.tmDrawerWrap_left {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
}

.tmDrawerWrap_right {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.tmDrawerWrapContent {
	transition-duration: 350ms;
	transition-property: transform;
	display: flex;
	flex-direction: column;
	position: relative;
}

.tmDrawerWrapContentMinwidth {
	max-width: 500px;
}

.tmDrawerWrapContentMinwidthWrapDir {
	align-items: center;
}

.tmDrawerWrapContent_bottom {
	transform: translate(0%, 100%);
}

@keyframes bottomAnimate3d {

	0% {
		transform: translate(0%, 100%) translate3d(0%, 20px, 0px) rotateX(45deg)
	}

	100% {
		transform: translate(0%, 0%) translate3d(0, 0, 0px) rotateX(0deg)
	}
}

.tmDrawerWrapContent_bottom_on {
	transform: translate(0%, 0%);
}

.tmDrawerWrapContent_top {
	transform: translate(0%, -100%);
}

.tmDrawerWrapContent_top_on {
	transform: translate(0%, 0%);
}

.tmDrawerWrapContent_left {
	transform: translate(-100%, 0%);
}

.tmDrawerWrapContent_left_on {
	transform: translate(0%, 0%);
}

.tmDrawerWrapContent_right {
	transform: translate(100%, 0%);
}

.tmDrawerWrapContent_right_on {
	transform: translate(0%, 0%);
}

.tmDrawerWrap {
	opacity: 1;
	position: fixed;
	left: 0;
	top: 0px;
	transition-duration: 350ms;
	transition-property: background-color;
	perspective: 1000px;
	transform-style: preserve-3d;
}

.tmModalWrap_on {
	background-color: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(3px);
}

.tmModalWrap_off {
	background-color: rgba(0, 0, 0, 0);
}

.tmModalWrapBoxContent {
	position: relative;
}

@keyframes tantiao {
	0% {
		transform: scale(1);
		opacity: 1;
	}

	60% {
		transform: scale(1.01);
	}

	75% {
		transform: scale(0.97);
		opacity: 0.9;

	}

	85% {
		transform: scale(1.01);
	}

	100% {
		transform: scale(1);
		opacity: 1;

	}
}

.tmModalWrapContent_Tantiao {
	animation: tantiao 0.15s linear;
}
</style>