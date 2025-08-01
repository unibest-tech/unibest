<script setup lang="ts">
import { ref, computed, onMounted, watch, PropType } from 'vue'
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
/**
 * @displayName 角标
 * @exportName tm-badge
 * @category 展示组件
 * @description 角标,位置丰富。
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmBadge' });
const { config } = useTmConfig()

const attrs = defineProps({
    fontSize: {
        type: [String, Number],
        default: "20"
    },
    bgColor: {
        type: String,
        default: "error"
    },
    fontColor: {
        type: String,
        default: "white"
    },
    maxCount: {
        type: [String, Number],
        default: 99
    },
    /**
     * 如果是boolean就显示角标小红点
     * 如果是string显示文本标签
     * 如果是数字显示数字并启用maxCount
     */
    label: {
        type: [String, Number,Boolean],
        default: ""
    },
    position: {
        type: String as PropType<"right" | "left" | "bottomLeft" | "bottomRight" | 'top' | 'bottom'>,
        default: "right"
    },
    offset: {
        type: Array as PropType<number[]>,
        default: (): number[] => [0, 0] as number[],
        validator(val: number[]): boolean {
            if (val.length == 0 || val.length == 2) return true
            console.error("x:必须是长度为2的数字数组参数或者空数组")
            return false
        }
    }
})


const _offset = computed(() => attrs.offset)
const _isDot = computed(() => {
    if(typeof attrs.label === 'boolean') return attrs.label
    return false;
})

const _cStyles = computed(() => {
    let trs = ''
    if (attrs.position == 'right') {
        trs = 'translate(50%, -50%)'
    } else if (attrs.position == 'left') {
        trs = 'translate(-50%, -50%)'
    } else if (attrs.position == 'bottomLeft') {
        trs = 'translate(-50%, 50%)'
    } else if (attrs.position == 'bottomRight') {
        trs = 'translate(50%, 50%)'
    } else if (attrs.position == 'top') {
        trs = 'translate(0%, -50%)'
    } else if (attrs.position == 'bottom') {
        trs = 'translate(0%, 50%)'
    }

    let top = ''
    let bottom = ''
    let left = ''
    let right = ''

    if (attrs.position == 'top') {
        top = '0px'
        left = 'auto'
        right = 'auto'
    } else if (attrs.position == 'bottom') {
        bottom = '0px'
        left = 'auto'
        right = 'auto'
    } else if (attrs.position == 'right') {
        top = _offset.value[1].toString() + 'px'
        right = _offset.value[0].toString() + 'px'
    } else if (attrs.position == 'left') {
        top = '0px'
        left = '0px'
    } else if (attrs.position == 'bottomLeft') {
        bottom = '0px'
        left = '0px'
    } else if (attrs.position == 'bottomRight') {
        bottom = '0px'
        right = '0px'
    }

    let dotMapCs:{[key:string]:any} = {}
    dotMapCs['background'] = getDefaultColor(attrs.bgColor)
    dotMapCs['left'] = left
    dotMapCs['right'] = right
    dotMapCs['top'] = top
    dotMapCs['bottom'] = bottom
    dotMapCs['transform'] = trs

    let labelMapCs:{[key:string]:any} = {}
    labelMapCs['background'] = getDefaultColor(attrs.bgColor)
    labelMapCs['left'] = left
    labelMapCs['right'] = right
    labelMapCs['top'] = top
    labelMapCs['bottom'] = bottom
    labelMapCs['transform'] = trs
    labelMapCs['visibility'] = _label.value == "" ? "hidden" : "visible"

    return [dotMapCs, labelMapCs]

})

const _fontColor = computed(() => getDefaultColor(attrs.fontColor))
const _fontSize = computed(() => covetUniNumber(attrs.fontSize, config.unit))
const _label = computed((): string => {
    if(typeof attrs.label === 'boolean') return ''
    if(typeof attrs.label === 'string') return attrs.label
    let count = attrs.label
    let maxCount = typeof attrs.maxCount == "number" ? attrs.maxCount : parseInt(attrs.maxCount)
    if (count > 0 && count <= maxCount) return count.toString();
    if (count <= 0) return ""
    return maxCount.toString() + "+"
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
    <view class="tmBadge">
        <view class="tmBadgeWrap">
            <text :style='_cStyles[0]' class="tmBadge-dot" :class="[_isDot ? 'noneShow' : 'nonex']"></text>
            <view id="tmBadge-countAndLabel" class="tmBadge-countAndLabel" :class="[_isDot ? 'nonex' : 'noneShow']"
                :style='_cStyles[1]'>
                <text class="tmBadge-countAndLabelText" :style='{ color: _fontColor, fontSize: _fontSize }'>{{ _label}}</text>
            </view>
            <!-- 
            @slot 默认内容插槽
             -->
            <slot></slot>
        </view>
    </view>
</template>

<style>
.tmBadge {
    overflow: visible;
    display: inline-flex;
    position: relative;

}

.tmBadge-countAndLabel {
    position: absolute;
    z-index: 3;
    border-radius: 100px;
    min-width: 0px;
    padding: 0rpx 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.tmBadge-countAndLabelText {
    line-height: 1.5;
    text-align: center;
}

.tmBadge-dot {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 18px;
    z-index: 3;
    opacity: 0;
}

.noneShow {
    opacity: 1;
}

.nonex {
    opacity: 0;
}

.tmBadgeWrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: visible;
}
</style>