<script setup lang="ts">
import { ref, watch, provide, getCurrentInstance, PropType, computed, inject, onMounted } from 'vue'
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, linearValid, getUnit, getUid } from "../../libs/tool";
import { useTmConfig } from "../../libs/config";
import { getDefaultColor, setTextColorLightByDark, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
import tmCollapse from '../tm-collapse/tm-collapse.vue';
const proxy = getCurrentInstance()?.proxy;

/**
 * @displayName 折叠面板子组件
 * @exportName tm-collapse-item
 * @page tm-collapse
 * @category 展示组件
 * @description 可单，可多开,可放置在tm-collapse内
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmCollapse' });

const { config } = useTmConfig()
const props = defineProps({
    /**
     * 唯一标识
     */
    name: {
        type: [String, Number],
        default: "",
        required: true
    },
    /**
     * 是否显示底部边线
     */
    showBottomLine: {
        type: Boolean,
        default: true
    },
    /**
     * 是否禁用
     */
    disabled: {
        type: Boolean,
        default: false
    },
    /**
     * 标题大小
     */
    titleFontSize: {
        type: [String, Number],
        default: '30'
    },
    /**
     * 标题颜色
     */
    titleColor: {
        type: String,
        default: '#333333'
    },
    /**
     * 拒绝礼佛标题颜色，如果不填写取白
     */
    darkTitleColor: {
        type: String,
        default: ''
    },
    /**
     * 激活时的颜色，空值读取全局值。
     */
    activeColor: {
        type: String,
        default: ''
    },
    /**
     * 背景
     */
    color: {
        type: String,
        default: 'white'
    },
    /**
     * 暗黑时的背景，如果不填写默认取sheetDarkColor
     */
    darkColor: {
        type: String,
        default: ''
    },
    /**
     * 左边图标
     */
    leftIcon: {
        type: String,
        default: ''
    },
    /**
     * 标题
     */
    title: {
        type: String,
        default: ''
    },
    /**
     * 标题高度
     */
    titleHeight: {
        type: String,
        default: '100'
    },
    /**
     * 标题最多显示几行出现省略号
     */
    titleLines: {
        type: Number,
        default: 1
    },
    /**
     * 下边线颜色.默认等同全局边线颜色.
     */
    bottomColor: {
        type: String,
        default: '#f5f5f5'
    }
})

const emit = defineEmits(['click'])

const tmCollapseDefaultName = inject('tmCollapseDefaultName', computed((): Array<string | number> => []))
const _disabled = computed(() => props.disabled)
const _titleFontSize = computed(() => {
    let fontSize = covetUniNumber(props.titleFontSize, config.unit)
    if (config.fontSizeScale == 1) return fontSize
    let sizeNumber = parseInt(fontSize)
    if (isNaN(sizeNumber)) {
        sizeNumber = 16
    }
    return (sizeNumber * config.fontSizeScale).toString() + getUnit(fontSize)
})
const _titleHeight = computed(() => covetUniNumber(props.titleHeight, config.unit))
const _titleColor = computed(() => {
    if (config.mode == 'dark') {
        if (props.darkTitleColor != '') return getDefaultColor(props.darkTitleColor)
        return '#ffffff'
    }
    return getDefaultColor(props.titleColor)
})
const _activeColor = computed(() => {
    if (props.activeColor == "") return getDefaultColor(config.color)
    return getDefaultColor(props.activeColor)
})
const _color = computed(() => {
    if (config.mode == 'dark') {
        if (props.darkColor != '') return getDefaultColor(props.darkColor)
        return config.sheetDarkColor
    }
    return getDefaultColor(props.color)
})
const _bottomColor = computed(()=>{
    if(props.bottomColor != '') return getDefaultColor(props.bottomColor)
    if(config.mode == 'dark'){
        return getDefaultColor(config.borderDarkColor)
    }
    return getDefaultColor('#f5f5f5')
})
const _leftIcon = computed(() => props.leftIcon)
const _title = computed(() => props.title)
const _isActive = computed(() => tmCollapseDefaultName.value.includes(props.name))
const _textMap = computed(() => {
    let styleMap = {} as Record<string, string>
    styleMap["fontSize"] = _titleFontSize.value
    styleMap["color"] = _isActive.value ? _activeColor.value : _titleColor.value
    styleMap["line-clamp"] = props.titleLines.toString()
    return styleMap
})

function itemClick() {
    /**
     * 项目被点击时触发。
     * @param name {string} 当前name值
     */
    emit('click', props.name)
    if(_disabled.value) return;
    let parent: InstanceType<typeof tmCollapse> | null = findParent(proxy)
    if (parent == null) return
    parent.toggleActivate(props.name, true)
}

function findParent(parent: any): any {
    if (parent == null) return null;
    if (parent.$parent?.$options?.name == "TmCollapse") return parent.$parent;
    let parents = findParent(parent.$parent);
    if (parents?.$options?.name == "TmCollapse") return parents;
    return null;
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
    <view class="tmCollapseItemBox" :style="{ background: _color }">
        <view @click="itemClick" class="tmCollapseItem" :style="{ opacity: _disabled ? 0.5 : 1 }">
            <view class="tmCollapseItemBoxLeft">
                <tm-icon :size="_titleFontSize" v-if="_leftIcon" :name="_leftIcon"
                    :color="_isActive ? _activeColor : _titleColor" _style="margin-right: 20rpx;"></tm-icon>
                <!--
				 @slot 左边插槽
				 @binding {boolean} status - 当前展开状态
				 -->
                <slot name="left" :status="_isActive"></slot>

                <view class="tmCollapseItemBoxTextBox" :style="{ height: _titleHeight }">
                    <view style="flex:1">
                        <!--
						 @slot 标题插槽，如果你要完全自定标题样式请在此插槽内布局
						 @binding {boolean} status - 当前展开状态
						 -->
                        <slot name="title" :status="_isActive">
                            <text class="tmCollapseItemBoxText" :style="_textMap">
                                {{ _title }}
                            </text>
                        </slot>
                    </view>
                </view>

            </view>
            <view class="tmCollapseItemBoxRight">
                <!--
				 @slot 右边插槽
				 @binding {boolean} status - 当前展开状态
				 -->
                <slot name="right" :status="_isActive"></slot>
                <tm-icon :color="_isActive ? _activeColor : '#bfbfbf'" _style="margin-left: 20rpx;"
                    :name="_isActive ? 'arrow-down-s-line' : 'arrow-right-s-line'"></tm-icon>
            </view>
        </view>
        <view class="tmCollapseItemWrap" :class="[!_isActive ? 'tmCollapseItemWrapOff' : 'tmCollapseItemWrapOn']">
            <view class="tmCollapseItemContent">
                <!-- 
                @slot 默认内容插槽。 
                -->
                <slot></slot>
            </view>
        </view>
        <view :style="{height:_isActive?'20rpx':'0px'}"></view>
        <view v-if="showBottomLine" :style="{height:'1px',background:_bottomColor}"></view>
    </view>
</template>
<style scoped>
.tmCollapseItemBoxTextBox {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.tmCollapseItemBoxText {
    text-overflow: ellipsis;
    /* #ifndef APP */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    /* #endif */
}

.tmCollapseItemContent {
    /* padding: 12px 0rpx; */
    box-sizing: border-box;
    min-height: 0px;
    overflow: hidden;
}

.tmCollapseItemBoxLeft {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
}

.tmCollapseItemBoxRight {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}

.tmCollapseItemBox {
    /* background-color: white; */
    padding: 0px 12px;
}

.tmCollapseItem {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

}

.tmCollapseItemWrap {
    /* display: flex;
    flex-direction: column; */
    transition-property: all;
    transition-duration: 350ms;
    transition-timing-function: cubic-bezier(.18, .89, .32, 1);
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;

    box-sizing: border-box;

}

.tmCollapseItemWrapOff {
    grid-template-rows: 0fr;

}

.tmCollapseItemWrapOn {
    grid-template-rows: 1fr;


}
</style>