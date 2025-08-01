<template>
    <!-- @vue-ignore -->
    <view @click="onclick" :hover-start-time="_isLinksHover ? 50 : 0" :hover-stay-time="_isLinksHover ? 100 : 0"
        :hover-class="_isLinksHover ? 'cellHover' : ''" class="tmCell "
        :class="[_allAttr.card == true ? 'cellCard' : 'cardInset']" :style="{
            backgroundColor: _color,
            borderRadius: _cardRadius,
            minHeight: _minHeight,
            borderBottom: _allAttr.bottom && !_allAttr.card && !bottomBorderInsert ? `1px solid ${_bottomBorderColor}` : 'none',
            padding: `0px ${_lrPadding}`
        }">

        <view v-if="_icon != ''" class="tmCellAvatar"
            :style="{ width: _leftSize, height: _leftSize, borderRadius: _avatarRound }">
            <!-- 
            @slot 头像图标
            @binding {string} icon 图标名称
            -->
            <slot name="avatar" :icon="_icon">
                <tm-icon :color="_allAttr.iconColor" :size="_iconSize" :name="_icon"></tm-icon>
            </slot>
        </view>

        <view class="tmCellWrap" :style="{
            padding: `${_tbPadding} 0px `,
            borderBottom: _allAttr.bottom && !_allAttr.card && bottomBorderInsert ? `1px solid ${_bottomBorderColor}` : 'none'
        }">
            <view class="center">
                <!-- 
                @slot 默认标题插槽 
                -->
                <slot>
                    <text class="title" :style="{ color: _titleColor, fontSize: _titleSize }">{{ _allAttr.title
                        }}</text>
                </slot>
                <!--
                @slot 简介
                @binding {string} desc 简介
                -->
                <slot name="desc" :desc="_allAttr.desc">
                    <tm-text v-if="_allAttr.desc != ''" size="28" color='#bfbfbf' dark-color='#bfbfbf' class="desc">{{
                        _allAttr.desc }}</tm-text>
                </slot>
            </view>
            <view class="tmCellRight" :style="{maxWidth: _rightWidth}">
                <!--
                @slot 右边文字
                @binding {string} label 标签内容
                -->
                <slot name="label" :label="_allAttr.label">
                    <text v-if="_allAttr.label != ''" :style="{ color: _allAttr.labelColor, fontSize: _rightLableSize }"
                        class="rightLabel">{{ _allAttr.label }}</text>

                </slot>
                <!--
                @slot 右插槽
                -->
                <slot name="right"></slot>
                <tm-icon v-if="_allAttr.url != '' || _allAttr.link" color="#bfbfbf" size="36" :name="attrs.linkIcon"
                    _style="paddingLeft:12rpx"></tm-icon>
            </view>

        </view>

    </view>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, PropType } from "vue"
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
/**
 * @displayName 列表
 * @exportName tm-cell
 * @category 展示组件
 * @description 样式丰富常用警告提醒
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmCell' });
const { config } = useTmConfig()
type tmCellItemType = {
    icon: string,
    title: string,
    desc: string,
    label: string,
    bottom: boolean,
    link: boolean,
    url: string,
    iconColor: string,
    labelColor: string,
    card: boolean
}
const emits = defineEmits(
    [
        /**
         * 项目点击
         */
        "click"
    ]
)
const attrs = defineProps({
    /**
     * 左图标
     */
    icon: {
        type: String,
        default: ""
    },
    /**
     * 左侧图标、头像圆角。默认为8
     */
    avatarRound: {
        type: String,
        default: "8"
    },
    /**
     * 背景的主题色
     */
    color: {
        type: String,
        default: 'white'
    },
    /**
     * 暗黑背景的主题色，空值时取sheetDarkColor
     */
    darkColor: {
        type: String,
        default: ''
    },
    /**
     * 图标色,空值时取全局主题值。
     */
    iconColor: {
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
     * 标题颜色
     */
    titleColor: {
        type: String,
        default: "black"
    },
    /**
     * 暗黑标题颜色，如果不填写取白
     */
    darkTitleColor: {
        type: String,
        default: "white"
    },
    /**
     * 标题大小
     */
    titleSize: {
        type: [String, Number],
        default: "32"
    },
    /**
     * 左边图标大小
     */
    iconSize: {
        type: [String, Number],
        default: "42"
    },
    /**
     * 右边文本
     */
    label: {
        type: String,
        default: ""
    },
    /**
     * 右边文本颜色
     */
    labelColor: {
        type: String,
        default: "#bfbfbf"
    },
    /**
     * 右侧label文字大小
     */
    labelSize: {
        type: [String, Number],
        default: "24"
    },
    /**
     * 标题正文的简介文本
     */
    desc: {
        type: String,
        default: ""
    },
    /**
     * 是否显示下边线
     */
    showBottomBorder: {
        type: Boolean,
        default: true
    },
    /**
     * 是否让下边线显示居右，不贯穿到左边。
     */
    bottomBorderInsert: {
        type: Boolean,
        default: false
    },
    /**
     * 下边线的颜色。如果你设定了的话。
     * 暗黑的边颜色失效，采用你自定的颜色。
     */
    bottomBorderColor: {
        type: String,
        default: ""
    },
    /**
     * 是否显示链接状态，有点按效果。包括出现右边跳转指示。
     * 关闭的话，事件反应和跳转会更快。
     * 如果true右侧箭头图标会显示
     */
    link: {
        type: Boolean,
        default: true
    },
    /**
     * 需要跳转的页面地址。
     * 如果填写了右侧箭头图标会显示
     */
    url: {
        type: String,
        default: ""
    },
    openType: {
        type: String as PropType<"navigate" | "redirect" | "switchTab" | "reLaunch" | "navigateBack" | "exit">,
        default: "navigate"
    },
    /**
     * 是否是卡片模式
     */
    card: {
        type: Boolean,
        default: true
    },
    /**
     * 卡片模式圆角,不填写采用全局的cardRadius属性值.
     */
    round: {
        type: [String, Number],
        default: ""
    },
    /**
     * 左边图标区域宽和高的大小。
     */
    leftSize: {
        type: [String, Number],
        default: '60'
    },
    /**
     * 最小高度，主要是用来统一风格高度不至于让点击范围过小
     * 如果你需要紧凑型可以设置为auto
     */
    minHeight: {
        type: [String, Number],
        default: "88"
    },
    /**
     * 左右的间隙。
     */
    lrPadding: {
        type: [String, Number],
        default: "32"
    },
    linkIcon: {
        type: String,
        default: "arrow-right-s-line"
    },
    /**
     * 上下间隙
     */
    tbPadding: {
        type: [String, Number],
        default: "32"
    },
    /**
     * 右侧最大宽
     */
    rightWidth:{
        type: [String, Number],
        default: "200"
    }
})

const _color = computed(() => {
    if (config.mode === 'dark') {
        if (attrs.darkColor !== '') return getDefaultColor(attrs.darkColor)
        return getDefaultColor(config.sheetDarkColor)
    }
    return getDefaultColor(attrs.color)
})

const _titleColor = computed(() => {
    if (config.mode === 'dark') {
        if (attrs.darkTitleColor !== '') return getDefaultColor(attrs.darkTitleColor)
        return '#ffffff'
    }
    return getDefaultColor(attrs.titleColor)
})

const _leftSize = computed(() => covetUniNumber(attrs.leftSize))
const _lrPadding = computed(() => covetUniNumber(attrs.lrPadding))
const _tbPadding = computed(() => covetUniNumber(attrs.tbPadding))
const _rightWidth = computed(() => covetUniNumber(attrs.rightWidth))

const _avatarRound = computed(() => covetUniNumber(attrs.avatarRound))

const _minHeight = computed(() => covetUniNumber(attrs.minHeight))

const _bottomBorderColor = computed(() => {
    if (attrs.bottomBorderColor !== '') return getDefaultColor(attrs.bottomBorderColor)
    if (config.mode === 'dark') return config.borderDarkColor
    return "#f5f5f5"
})

const icon = ref('')

const _allAttr = computed(() => {
    let iconColor = attrs.iconColor;
    if (iconColor === '') {
        iconColor = config.color;
    }
    let p = {
        icon: icon.value,
        title: attrs.title,
        desc: attrs.desc,
        label: attrs.label,
        bottom: attrs.showBottomBorder,
        link: attrs.link,
        url: attrs.url,
        iconColor: getDefaultColor(iconColor),
        labelColor: getDefaultColor(attrs.labelColor),
        card: attrs.card
    } as tmCellItemType
    return p
})

const _cardRadius = computed(() => {
    if (attrs.round === '') return arrayNumberValidByStyleMP(config.cellRadius)
    return arrayNumberValidByStyleMP(attrs.round, config.unit)
})

const _titleSize = computed(() => {
    let fontSize = covetUniNumber(attrs.titleSize, config.unit);
    if (config.fontSizeScale === 1) return fontSize;
    let sizeNumber = parseInt(fontSize)
    if (isNaN(sizeNumber)) {
        sizeNumber = 16
    }
    return (sizeNumber * config.fontSizeScale).toString() + getUnit(fontSize)
})

const _iconSize = computed(() => {
    let fontSize = covetUniNumber(attrs.iconSize, config.unit);
    if (config.fontSizeScale === 1) return fontSize;
    let sizeNumber = parseInt(fontSize)
    if (isNaN(sizeNumber)) {
        sizeNumber = 17
    }
    return (sizeNumber * config.fontSizeScale).toString() + getUnit(fontSize)
})

const _rightLableSize = computed(() => {
    let fontSize = covetUniNumber(attrs.labelSize, config.unit);

    if (config.fontSizeScale === 1) return fontSize;
    let sizeNumber = parseInt(fontSize)
    if (isNaN(sizeNumber)) {
        sizeNumber = 13
    }
    return (sizeNumber * config.fontSizeScale).toString() + getUnit(fontSize)
})

const _isLinksHover = computed(() => attrs.link)
const _icon = computed(() => attrs.icon)

const onclick = () => {
    /**
     * 整个列表被点击
     */
    emits("click");
    if (attrs.url != "") {
        if (attrs.openType == 'navigate') {
            uni.navigateTo({
                url: attrs.url
            })
        } else if (attrs.openType == 'navigateBack') {
            uni.navigateBack({})
        } else if (attrs.openType == 'reLaunch') {
            uni.reLaunch({
                url: attrs.url
            })
        } else if (attrs.openType == 'redirect') {
            uni.redirectTo({
                url: attrs.url
            })
        } else if (attrs.openType == 'switchTab') {
            uni.switchTab({
                url: attrs.url
            })
        }

    }
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
<style scoped lang="scss">
.cellHover {
    filter: contrast(90%);
}

.tmCell {

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.cardInset {
    // padding: 0 32rpx;
}

.cellCard {
    // padding: 0 32rpx;
    margin-bottom: 12rpx;
    margin-left: 24rpx;
    margin-right: 24rpx;
}

.tmCellWrap {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    // padding: 32rpx 0rpx;
}



.title {
    line-clamp: 2;
    display: -webkit-box;
    text-overflow: ellipsis;
    flex: 1;
    text-wrap: nowrap;
    white-space: nowrap;
}

.desc {
    font-size: 24rpx;
    padding-top: 4rpx;
}

.tmCellAvatar {
    margin-right: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    overflow: hidden;
}

.center {
    flex: 1;
}

.tmCellRight {
    padding-left: 32rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}

.rightLabel {
    line-clamp: 1;
    display: -webkit-box;
    text-overflow: ellipsis;
    font-size: 24rpx;
    text-align: right;
    
}
</style>