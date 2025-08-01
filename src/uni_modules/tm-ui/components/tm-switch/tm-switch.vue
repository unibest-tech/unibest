<script setup lang="ts">
import { computed, ref, onMounted, watch, PropType } from "vue";
import { arrayNumberValid, getUid, arrayNumberValidByStyleMP, arrayNumberValidByStyleBorderColor, arrayNumberValidByStyleBorderStyle, covetUniNumber, linearValid, getUnit } from "../../libs/tool";
import { useTmConfig } from "../../libs/config";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
/**
* @displayName 开关
* @exportName tm-switch
* @category 表单组件
* @description 开关，用于直观的展示选项表单的选择。
* @constant 平台兼容
*	| H5 | uniAPP | 小程序 | version |
   | --- | --- | --- | --- |
   | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
*/
defineOptions({ name: 'TmSwitch' });
const { config } = useTmConfig()

const props = defineProps({
    /**
     * 激活时的背景色,空值时取全局的值。
     */
    color: {
        type: String,
        default: ""
    },
    /**
     * 未激活时的背景
     */
    bgColor: {
        type: String,
        default: "info"
    },
    /**
     * 未激活时的暗黑背景
     * 空取inputDarkColor
     */
    darkBgColor: {
        type: String,
        default: ""
    },
    /**
     * 按钮的背景色
     */
    btnColor: {
        type: String,
        default: "white"
    },
    /**
     * 尺寸
     */
    size: {
        type: String as PropType<"small" | "normal" | "large">,
        default: "normal"
    },
    /**
     * 间隙，px单位
     */
    space: {
        type: [Number, String],
        default: "2px"
    },
    /**
     * 当前打开的状态，默认为false
     * 等同v-model=""
     */
    modelValue: {
        type: Boolean,
        default: false
    },
    /**
     * 是否禁用
     */
    disabled: {
        type: Boolean,
        default: false
    },
    /**
     * 是否加载中
     */
    loading: {
        type: Boolean,
        default: false
    },
    /**
     * 开关文字数组第一个为开，后一个为关
     */
    label: {
        type: Array as PropType<string[]>,
        default: (): string[] => [],
        validator(val: string[]): boolean {
            if (!Array.isArray(val)) return false;
            if (val.length == 0) return true;
            if (val.length != 2) {
                console.error("x:必须长度为2")
                return false;
            }
            return true
        }
    },
    /**
     * 圆角。空值时取全局值。
     */
    round: {
        type: [String, Number],
        default: ""
    }
});

const emit = defineEmits<{
    /**
     * 状态变换时触发。
     * @param status - 当前的开关状态
     */
    (e: 'change', status: boolean): void;
    /**
     * 组件被点击时触发。
     * @param status - 当前的开关状态，这里的状态是在变更前。
     */
    (e: 'click', status: boolean): void;
    (e: 'update:modelValue', value: boolean): void;
}>();

const id = ref(`tmSwitch${getUid()}`);
const boxwidth = ref(0);
const boxheight = ref(0);
const opened = ref(false);

onMounted(() => {
    opened.value = props.modelValue;
    getNodes();
});

const _round = computed((): string => {
    if (props.round == "") {
        return covetUniNumber(config.switchRadius, config.unit)
    }
    return covetUniNumber(props.round, config.unit)
});

const _bgColor = computed((): string => {
    if (config.mode == 'dark') {
        if (props.darkBgColor != '') return props.darkBgColor
        return config.inputDarkColor;
    }
    return getDefaultColor(props.bgColor)
});

const _activeBgColor = computed((): string => {
    if (props.color == "") {
        return getDefaultColor(config.color)
    }
    return getDefaultColor(props.color)
});

const _btnColor = computed((): string => {
    return getDefaultColor(props.btnColor)
});

const _size = computed((): string => {
    if (props.size == "small") return "44rpx"
    if (props.size == "large") return "76rpx"
    return "60rpx"
});

const _fontSize = computed((): string => {
    if (props.size == "small") return "20rpx"
    if (props.size == "large") return "24rpx"
    return "22rpx"
});

const _sizeWidth = computed((): string => {
    if (props.size == "small") return "88rpx"
    if (props.size == "large") return "152rpx"
    return "120rpx"
});

const _space = computed((): number => {
    let space = covetUniNumber(props.space)
    let spaceUnit = getUnit(space)
    let spacenumber = parseInt(space)
    if (spaceUnit == 'rpx') {
        spacenumber = uni.upx2px(parseInt(space))
    }

    return spacenumber
});

const _contentWidth = computed((): number => {
    return boxwidth.value - _space.value * 2
});

const _contentHeight = computed((): number => {
    return boxheight.value - _space.value * 2
});

const _maxLeftPos = computed((): number => {
    return _contentWidth.value - _contentHeight.value
});

const _label = computed((): string[] => {
    return props.label;
});

const _loading = computed((): boolean => {
    return props.loading;
});

const _disabled = computed((): boolean => {
    return props.disabled;
});

const _animationFun = computed((): string => {
    return config.animation
});

watch(() => props.modelValue, (newvalue: boolean) => {
    if (newvalue != opened.value) {
        opened.value = newvalue;
    }
});

function onClick() {
    /**
     * 组件被点击时触发。
     * @param status {boolean} 当前的开关状态，这里的状态是在变更前。
     */
    emit("click", opened.value)
    if (_loading.value || _disabled.value) return;
    opened.value = !opened.value
    /**
     * 状态变换时触发。
     * @param status {boolean} 当前的开关状态
     */
    emit("change", opened.value)
    /**
     * 等同v-model=""
     */
    emit("update:modelValue", opened.value)
}

function getNodes() {
    let width = covetUniNumber(_sizeWidth.value)
    let height = covetUniNumber(_size.value)
    let widthUnit = getUnit(width)
    let heightUnit = getUnit(height)
    if (widthUnit == 'rpx') {
        width = uni.upx2px(parseInt(width)) + ''
    }
    if (heightUnit == 'rpx') {
        height = uni.upx2px(parseInt(height)) + ''
    }
    boxwidth.value = parseInt(width);
    boxheight.value = parseInt(height);

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
    <view @click="onClick" :id="id" class="tmSwitch" ref="tmSwitch" :style="{
        height: boxheight+'px',
        width: boxwidth+'px',
        backgroundColor: _bgColor,
        borderRadius: _round
    }">
        <view :class="[_disabled ? 'tmSwitchDisabled' : '', opened ? 'tmSwitchBgOn' : 'tmSwitchOff']" class="tmSwitchBg"
            :style="{ backgroundColor: _activeBgColor, borderRadius: _round, 'transition-timing-function': _animationFun }">
        </view>
        <view :class="[_disabled ? 'tmSwitchDisabled' : '']" class="tmSwitchWrap" :style="{
            left: _space + 'px',
            top: _space + 'px',
            width: _contentWidth + 'px',
            height: _contentHeight + 'px',
            borderRadius: _round
        }">
            <view v-if="_label.length == 2" class="tmSwitchText">
                <text class="tmSwitchTextLeft" :style="{ fontSize: _fontSize }">{{ !opened ? '' : _label[0] }}</text>
                <text class="tmSwitchTextRight" :style="{ fontSize: _fontSize }">{{ opened ? '' : _label[1] }}</text>
            </view>
            <view class="tmSwitchBtn" :style="{
                width: _contentHeight + 'px',
                height: _contentHeight + 'px',
                transform: `translateX(${opened ? _maxLeftPos : 0}px)`,
                backgroundColor: _btnColor,
                borderRadius: _round,
                'transition-timing-function': _animationFun
            }">
                <tm-icon v-if="_loading" :spin="true" size="24" name="loader-line" :color="_activeBgColor"></tm-icon>
            </view>
        </view>
    </view>
</template>

<style scoped>
.tmSwitchDisabled {
    opacity: 0.7;
    cursor: no-drop !important;
    overflow: hidden;
}

.tmSwitchTextLeft {
    color: white;
}

.tmSwitchTextRight {
    color: #acacac;
}

.tmSwitch {
    height: 64rpx;
    cursor: pointer;
    display: inline-flex;
    position: relative;
    box-sizing: border-box;
}

.tmSwitchBg {
    width: 100%;
    height: 100%;
    transition-duration: 350ms;
    transition-property: opacity, transform;
    box-sizing: border-box;

}

.tmSwitchBgOn {
    opacity: 1;
    transform: scale(1);
}

.tmSwitchOff {
    opacity: 0;
    transform: scale(0.9);
}

.tmSwitchWrap {
    position: absolute;
}

.tmSwitchText {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 12%;
    box-sizing: border-box;
}

.tmSwitchBtn {
    position: absolute;
    transition-duration: 350ms;
    left: 0px;
    transition-property: transform;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    top: 0px;
}
</style>