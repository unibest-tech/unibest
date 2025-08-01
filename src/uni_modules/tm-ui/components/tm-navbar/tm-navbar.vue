<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, PropType, getCurrentInstance, ComponentInstance, onUpdated, nextTick, VueElement, inject, watchEffect } from 'vue';
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit, getUid } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj, isBlackAndWhite, setBgColorLightByDark } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
import { onPageScroll,onReady } from '@dcloudio/uni-app';

/**
 * @displayName 标题导航
 * @exportName tm-navbar
 * @category 导航组件
 * @description 标题导航,用途页面头部标题。可以默认透明，滚动实现背景可变的标题导航。
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmNavbar' });
const { config } = useTmConfig()

const emits = defineEmits([
    /**
     * 当滚动页面时，导航栏位置
     * 与滚动之间的距离差比（0~1）
     * 0表示在顶部，1表示已经超过了导航高
     * 主要是用来类型滚动时设置导航顶部的一些布局变化。
     */
    'fiexdChange',
    /**
     * 初始化完成向下发送一个事件用于告知本组件实际的高
     * @param {number} height -单位px,组件高。
     */
    'init'
])

const props = defineProps({
    /**
     * 是否底部占位内容，如果为false底部悬空。你的页面内容将自动压在导航栏的底部。
     */
    isPlace: {
        type: Boolean,
        default: true
    },
    /**
     * 背景颜色，注意这是静态时的背景色。
     */
    bgColor: {
        type: String,
        default: 'white'
    },
    /**
     * 暗黑的背景颜色。
     */
    darkBgColor: {
        type: String,
        default: "#000000"
    },
    /**
     * 背景颜色，这是滑动时超过指定本状态栏高度时自动渐变到此颜色
     * 如果为空时，不会有动态背景
     * 如果提供的是白或者黑，暗黑时自动取反。
     */
    activeBgColor: {
        type: String,
        default: ''
    },
    /**
     * 返回按钮的颜色.默认是取titleColor，如果你单独定义了
     * 以你定义的为准
     */
    backColor: {
        type: String,
        default: ''
    },
    /**
     * 标题
     */
    title: {
        type: String,
        default: '标题'
    },
    /**
     * 默认标题颜色，暗黑是取白，如果有其它需求建议插槽。
     */
    titleColor: {
        type: String,
        default: '#333333'
    },
    /**
     * 动态悬浮时标题颜色,如果为暗黑时，你提供的颜色为白或者黑会反色
     * 如果提供的是彩色自动加深或者提亮
     */
    titleActiveColor: {
        type: String,
        default: '#333333'
    },
    /**
     * 标题文字大小
     */
    titleFontSize: {
        type: String,
        default: '34',
    },
    /**
     * 右边的宽度。
     */
    lrWidth: {
        type: String,
        default: '100',
    },
    /**
     * 左边的宽度。
     */
    llWidth: {
        type: String,
        default: '100',
    },
    /**
     * 层级。
     */
    zIndex: {
        type: Number,
        default: 90,
    },
    /**
     * 左边按钮默认点击返回上页。
     * 但如果上页返回失败（通常见于直接程序启动本面，无法进行上页返回时）
     * 失败后返回的页面。默认是首页。
     */
    backErrorPath: {
        type: String,
        default: '/pages/index/index'
    },
    /**
     * 是否显示返回按钮。
     */
    showNavBack: {
        type: Boolean,
        default: true
    },
    /**
     * 渐变背景，如果提供，上面的BgColor背景和暗黑背景将失效。
     * 例：['to right','#ff667f','#ff5416']
     */
    linearGradient: {
        type: Array as PropType<string[]>,
        default: (): string[] => [] as string[]
    },
    /**
     * 动态悬浮时的渐变背景，
     * 提供后上面的 activeBgColor的背景和暗黑背景将失效。
     * 例：['to right','#ff667f','#ff5416']
     */
    linearActiveGradient: {
        type: Array as PropType<string[]>,
        default: (): string[] => [] as string[]
    },
    /**
     * 静态在顶部时是否透明背景
     */
    staticTransparent: {
        type: Boolean,
        default: false
    },
    /**
     * 如果需要悬浮滚动请在外部页面中监听onPageScroll事件，并把值传到这里。
     * 3.2.05开始已经废弃，存在只为兼容之前的版本
     * 但已经没有作用了，现在改为内部实现，不需要外部提供。
     */
    scrollTop:{
        type:Number,
        default:0
    }
})

const statusBarHeight = ref(44)
const navbarHeight = 44
const isFiexd = ref(false)
const fiexRatio = ref(1)
const _stop = ref(0)
let nowpage = "";
const _linearGradient = computed((): string => {
    if (props.linearGradient.length < 3) return '';
    let str = props.linearGradient.join(",");
    return `linear-gradient(${str})`
})

const _linearActiveGradient = computed((): string => {
    if (props.linearActiveGradient.length < 3) return '';
    let str = props.linearActiveGradient.join(",");
    return `linear-gradient(${str})`
})

const _lrWidth = computed((): string => covetUniNumber(props.lrWidth, config.unit))
const _llWidth = computed((): string => covetUniNumber(props.llWidth, config.unit))
const _titleFontSize = computed((): string => covetUniNumber(props.titleFontSize, config.unit))

const _bgColor = computed((): string => {
    let bgcolor = props.bgColor
    if (config.mode == 'dark') {
        bgcolor = props.darkBgColor == "" ? "#000000" : props.darkBgColor
    }
    return getDefaultColor(bgcolor)
})

const _activeBgColor = computed((): string => {
    let color = _bgColor.value
    if (props.activeBgColor != "") {
        color = getDefaultColor(props.activeBgColor)
    }
    let isba = isBlackAndWhite(props.titleActiveColor)
    if (isba) {
        if (config.mode == 'dark') {
            color = setBgColorLightByDark(color)
        }
    }
    return color
})

const _titleColor = computed((): string => {
    if (config.mode == 'dark') return "#ffffff"
    return getDefaultColor(props.titleColor)
})

const _backColor = computed((): string => {
    if (props.backColor != '') return getDefaultColor(props.backColor)
    return _titleColor.value
})

const _titleActiveColor = computed((): string => {
    let isba = isBlackAndWhite(props.titleActiveColor)
    if (isba) {
        if (config.mode == 'dark') return "#ffffff"
    }
    return getDefaultColor(props.titleActiveColor)
})

const _title = computed((): string => props.title)
function getNowPageRoute(){
    if(nowpage) return nowpage;
    const pages = getCurrentPages();
    let page = undefined
    if(pages.length>0){
        page = pages[pages.length - 1]?.route||undefined
    }
    nowpage = page
}
const _styleMap = computed(() => {
    let maps: Record<string, string | number> = {};
    if (props.staticTransparent) {
        maps['opacity'] = fiexRatio.value
    } else {
        maps['opacity'] = '1'

    }
    maps['height'] = (statusBarHeight.value + navbarHeight) + 'px'

    if (isFiexd.value) {
        if (_linearActiveGradient.value != '') {
            maps['background-image'] = _linearActiveGradient.value

        } else if (_activeBgColor.value != '') {
            maps['background-color'] = _activeBgColor.value

        } else {
            maps['background-color'] = _bgColor.value

        }
    } else {
        if (_linearGradient.value != '') {
            maps['background-image'] = _linearGradient.value
        } else {
            maps['background-color'] = _bgColor.value

        }
    }

    return maps
})
const onReadyEvent = ()=>{
    let sys = uni.getWindowInfo();
    statusBarHeight.value = sys?.statusBarHeight ?? 0
    emits('init', statusBarHeight.value + navbarHeight)
    if (props.staticTransparent) {
        fiexRatio.value = 0
    }
}
const getPageScroll = (details:{scrollTop:number,page:string|undefined})=>{
    if(nowpage == details.page){
        _stop.value = details.scrollTop
    }
}
onMounted(() => {
    getNowPageRoute()
    onReadyEvent()
   uni.$on('onReady',onReadyEvent)
   uni.$on('onPageScroll',getPageScroll)
})
onBeforeUnmount(() => {
    uni.$off('onReady',onReadyEvent)
    uni.$off('onPageScroll',getPageScroll)
})


watchEffect(() => {
    let barheight = statusBarHeight.value + navbarHeight;
    isFiexd.value = _stop.value > 0
    if (props.staticTransparent) {
        fiexRatio.value = Math.max(Math.min(_stop.value / barheight, 1), 0)
    }
    emits("fiexdChange", fiexRatio.value)
})

const backGo = () => {
    // #ifdef WEB
    window.history.back()
    // #endif
    // #ifndef WEB
    uni.navigateBack({
        fail() {
            uni.reLaunch({
                url: '/pages/index/index'
            })
        }
    })
    // #endif
}
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
    <view>
        <view class="tmNavbar" :style="{ zIndex: zIndex }">

            <view :key="_linearActiveGradient" :style="_styleMap" class="tmNavbarBg"></view>
            <view class="tmNavbarContentBox">
                <view :style="{ height: (statusBarHeight) + 'px' }"></view>
                <view class="tmNavbarContent" :style="{ height: (navbarHeight) + 'px' }">
                    <view class="tmNavbarLeft" :style="{ width: _llWidth }">
                        <view v-if="showNavBack" @click="backGo" class="tmNavbarBack" style="padding-left: 8px;">
                            <tm-icon size="52" name="arrow-left-s-line"
                                :color="isFiexd ? _titleActiveColor : _backColor"></tm-icon>
                        </view>
                        <!-- 
						 @slot 左边插槽
						 @binding {boolean} isFiexd - 当前是处于悬浮状态还是静态顶部
						 -->
                        <slot name="left" :isFiexd="isFiexd"></slot>
                    </view>
                    <view class="tmNavbarTtitle">
                        <!-- 
						 @slot 标题插槽
						 @binding {boolean} isFiexd - 当前是处于悬浮状态还是静态顶部
						 -->
                        <slot name="title">
                            <text class="xNvbarTtitleOverls"
                                :style="{ fontSize: _titleFontSize,lineHeight:'1', fontWeight: 'bold', color: isFiexd ? _titleActiveColor : _titleColor }">{{
                                    _title }}</text>
                        </slot>
                    </view>
                    <view class="tmNavbarRight" :style="{ width: _lrWidth }">
                        <!-- 
						 @slot 右边插槽
						 @binding {boolean} isFiexd - 当前是处于悬浮状态还是静态顶部
						 -->
                        <slot name="right" :isFiexd="isFiexd"></slot>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="isPlace" :style="{ height: (statusBarHeight + navbarHeight) + 'px' }"></view>
    </view>
</template>
<style scoped>
.xNvbarTtitleOverls {

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    width: 100%;
    text-align: center;
}

.tmNavbarContentBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.tmNavbarBack {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.tmNavbar {
    position: fixed;
    width: 100%;
}

.tmNavbarContent {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.tmNavbarLeft {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.tmNavbarRight {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}

.tmNavbarTtitle {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>
