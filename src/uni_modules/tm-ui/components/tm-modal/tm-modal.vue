<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, PropType, getCurrentInstance, onUpdated, nextTick } from 'vue';
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit, getUid } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
import { onPageScroll,onReady } from '@dcloudio/uni-app';
/**
 * @displayName 对话框
 * @exportName tm-modal
 * @category 反馈组件
 * @description 可全局统一更改风格。使用时注意下：如果height:auto，将失去内容滚动效果。如果要内容滚动height必定是一个值。
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmModal' });
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
        default: true
    },
    /**
     * 是否显示底部关闭按钮
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
     * 显示取消按钮
     */
    showCancel: {
        type: Boolean,
        default: true
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
     * 动画时间
     */
    duration: {
        type: Number,
        default: 250
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
     * 打开方向为上和下时的圆角
     * 空值时，取全局配置的圆角。
     */
    round: {
        type: [String, Number],
        default: ""
    },
    /**
     * 宽，百分比，Px,rpx，auto都支持
     */
    width: {
        type: [String, Number],
        default: "84%"
    },
    /**
     * 宽，百分比，Px,rpx，auto都支持
     */
    height: {
        type: [String, Number],
        default: "350"
    },
    /**
     * 可以是百分比,px,rpx单位数字。如果你不带单位，默认转换为rpx单位。
     */
    maxHeight: {
        type: [String, Number],
        default: "80%"
    },
    /**
     * 是否禁用内部的scroll标签
     * 禁用后内容不会滚动，如果设定了指定高，内容超出指定高，会被裁切
     * 但如果没有指定高，内容自动的话，高是自动的。
     * 有这个属性是因为截止4.03scroll-view里面放input不会上推键盘，及内部的view touchMove会失效。
     */
    disabledScroll: {
        type: Boolean,
        default: false
    },
    /**
     * 容器背景色
     */
    bgColor: {
        type: String,
        default: "white"
    },
    /**
     * 暗黑时的容器背景色，不填写的话取sheetDarkColor
     */
    darkBgColor: {
        type: String,
        default: ""
    },
    zIndex: {
        type: [String, Number],
        default: "1105"
    },
    /**
     * 内容区域的间隙
     */
    contentPadding: {
        type: [String, Number],
        default: "32"
    },
	btnColor:{
		type:String,
		default:""
	}
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
const _width = ref(0)
const _height = ref(0)
const showOverflay = ref(false)
const actinon = ref(false)
const status = ref("")
const id = ref("tmModal" + getUid())
const wrapId = ref("tmModal" + getUid())
const tid = ref(0)
const tid2 = ref(0)
const windtop = ref(0)
const tantiaoTrue = ref(false)
const _customStyle = computed(() => props.customStyle)
const _show = computed(() => props.show)
const _showClose = computed(() => props.showClose)
const _duration = computed(() => props.duration)
const _title = computed(() => props.title)
const _showTitle = computed(() => props.showTitle)
const _round = computed(() => {
    if (props.round == "") {
        return covetUniNumber(config.modalRadius, config.unit)
    }
    return covetUniNumber(props.round, config.unit)
})
const _contentHeight = ref('auto')
const proxy = getCurrentInstance()?.proxy;
const _c_width = computed(() => covetUniNumber(props.width, config.unit))
const _c_height = computed(() => covetUniNumber(props.height, config.unit))
const _showFooter = computed(() => props.showFooter)
const _maxHeight = computed(() => covetUniNumber(props.maxHeight, config.unit))
const _contentPadding = computed(() => covetUniNumber(props.contentPadding, config.unit))
const _showCancel = computed(() => props.showCancel)
const _cancelText = computed(() => props.cancelText)
const _confirmText = computed(() => props.confirmText)
const _animationFun = computed(() => config.animation)
const __height = computed(() => {
    let h = '100%'
    // #ifdef WEB
    h = `calc(100% - ${windtop.value}px)`
    // #endif
    return h
})
const _bgColor = computed(() => {
    if (config.mode == 'dark') {
        if (props.darkBgColor != '') return getDefaultColor(props.darkBgColor)
        return getDefaultColor(config.sheetDarkColor)
    }
    return getDefaultColor(props.bgColor)
})
const _btnColor = computed(()=>{
	if(props.btnColor=='') return getDefaultColor(config.color)
	return getDefaultColor(props.btnColor)
})
const teleportElH5 = ref("#app")

watch(() => props.show, (newVal) => {
    if (newVal) {
        showAlert()
    } else {
        closeAlert()
    }
})

const getPageBounds = ()=>{
	let sys = uni.getWindowInfo()
	// #ifndef APP
	_width.value = sys.windowWidth
	_height.value = sys.windowHeight - sys.windowTop
	windtop.value = sys.windowTop
	// #endif
	// #ifdef APP
	_width.value = sys.windowWidth
	_height.value = sys.windowHeight
	// #endif
}
onMounted(()=>{
	getPageBounds()
	teleportElH5.value = "uni-page"
	uni.$on('onReady',getPageBounds)
	if (_show.value) {
	    showAlert()
	}
})


onBeforeUnmount(() => {
    clearTimeout(tid.value)
    clearTimeout(tid2.value)
	uni.$off('onReady',getPageBounds)
})

const overflayMoveTouch = (evt: TouchEvent) => {
    evt.preventDefault()
}

const cancelEvt = () => {

    /**
     * 取消时触发
     */
    emit('cancel')
    closeAlert()
}

const confirmEvt = () => {
    /**
     * 确认时触发
     */
    emit('confirm')
    closeAlert()
}

const onClickOverflowy = (evt: Event) => {
    evt.stopPropagation()
    /**
     * 点击遮罩事件
     */
    emit("click")
    if (!props.overlayClick){
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
    if (actinon.value) return
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


const openDrawer = () => {
    showAlert()
}

const onEnd = () => {
    actinon.value = false

    if (status.value == 'close') {
        showOverflay.value = false
        /**
         * 关闭时执行
         */
        emit('close')
        /**
         * 等同v-model:show
         */
        emit('update:show', false)
    } else {
        /**
         * 打开执行的事件
         */
        emit('open')
        
    }
}

const maskerMove = (evt: TouchEvent) => {
    evt.stopPropagation()
    evt.preventDefault()
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
			@slot 标签触发显示遮罩，免于使用变量控制
			@binding {Boolean} show - 当前是否已显示
			-->
            <slot name="trigger" :show="show"></slot>
        </view>
        <!-- #ifdef H5 -->
        <teleport :to="teleportElH5">
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <root-portal>
                <!-- #endif -->
                <view @click="onClickOverflowy" @touchmove="maskerMove" ref="tmModalWrap" v-if="showOverflay"
                    :id="id" class="tmModalWrap tmModalWrap_center"
                    :class="[status == 'open' ? 'tmModalWrap_on' : 'tmModalWrap_off']"
                    :style="[{ top: windtop + 'px', zIndex: zIndex, width: '100%', height: __height, 'transition-timing-function': _animationFun }, _customStyle]">

                    <view @click.stop="" ref="tmModalWrapContent" class="tmModalWrapContent "
                        :class="[status == 'open' ? 'tmModalWrapContent_on' : 'tmModalWrapContent_off',tantiaoTrue?'tmModalWrapContent_Tantiao':'']" :id="wrapId"
                        :style="{
                            width: _c_width,
                            height: _c_height,
                            maxWidth: '750px',
                            borderRadius: _round,
                            maxHeight: _maxHeight != '' ? _maxHeight : '100%',
                            backgroundColor: _bgColor,
                            transitionDuration: _duration + 'ms',
                            'transition-timing-function': _animationFun
                        }">
                        <view ref="tmModalWrapBox" class="tmModalWrapBox" :style="{ borderRadius: _round }">
                            <view class="tmModalXclose">
                                <tm-icon v-if="_showClose" @click="closeAlert" color="#dcdcdc" size="52"
                                    name="close-circle-fill"></tm-icon>
                            </view>

                            <view>
                                <view v-if="_showTitle" class="tmModalTitleBox">
                                    <!-- 
                                    @slot 标题插槽
                                    @binding {Boolean} show - 当前是否已显示
                                    -->
                                    <slot name="title" :show="show">
                                        <tm-text font-size="34" class="tmModaltitleBoxTitle">{{ _title }}</tm-text>
                                    </slot>
                                </view>
                            </view>

                            <view v-if="!disabledScroll&&_c_height!='auto'" style="flex: 1;" class="tmModalWrapBoxContent" >
                                <scroll-view  style="height:100%;position:absolute;width:100%" :scroll-y="true"
                                    :rebound="false">
                                    <view :style="{ padding: `0px ${_contentPadding}  0px ${_contentPadding}` }">
                                        <!--
                                        @slot 默认插槽
                                        -->
                                        <slot></slot>
                                    </view>
                                </scroll-view>
                            </view>
                            <view v-else :style="{ height: '100%', padding: _contentPadding }">
                                <!--
                                @slot 默认插槽
                                -->
                                <slot></slot>
                            </view>
                            <view v-if="showFooter" class="tmModalFooter" :style="{ backgroundColor: _bgColor }">
                                <!--
                                @slot 底部操作栏
                                -->
                                <slot name="footer">
                                    <tm-button :color="_btnColor" @click="cancelEvt" v-if="_showCancel" skin="thin"
                                        style="margin-right: 16px;flex:1">{{ _cancelText }}</tm-button>
                                    <tm-button :color="_btnColor" @click="confirmEvt" style="flex:1">{{ _confirmText }}</tm-button>
                                </slot>
                            </view>
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
.tmModalWrapBox {
    display: flex;
    flex-direction: column;
    /* background-color: white; */
    height: 100%;
    width: 100%;

}

.tmModalFooter {
    display: flex;
    width: 100%;
    /* background-color: white; */
    padding: 24rpx;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
}

.tmModalXclose {
    position: absolute;
    right: 24rpx;
    top: 18rpx;
    z-index: 100;
}

.tmModaltitleBoxTitle {
    font-size: 32rpx;
}

.tmModalTitleBox {
    height: 100rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.tmModaltitleBox {
    max-width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
}

.tmModalWrap_center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}


.tmModalWrapContent {
    transition-property: transform, opacity;
    display: flex;
    flex-direction: column;
    overflow: hidden;

}

.tmModalWrapContent_on {
    transform: scale(1);
    opacity: 1;

}

.tmModalWrapContent_off {
    transform: scale(0.54);
    opacity: 0;
}
.tmModalWrapBoxContent{
    position: relative;
}

.tmModalWrap {
    opacity: 1;
	position: fixed;
	left: 0;
	top: 0px;
	transition-duration: 350ms;
	transition-property: background-color;
}

.tmModalWrap_on {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
}

.tmModalWrap_off {
    background-color: rgba(0, 0, 0, 0);
}
@keyframes tantiao {
    0%{
        transform: scale(1);
    }
    60%{
        transform: scale(1.05);
    }
    75%{
        transform: scale(0.95);
    }
    85%{
        transform: scale(1.05);
    }
    100%{
        transform: scale(1);
    }
}
.tmModalWrapContent_Tantiao{
    animation: tantiao 0.15s linear;
}
</style>