<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch,PropType } from 'vue'
import { covetUniNumber, getUnit } from '../../libs/tool'
import { getDefaultColor } from '../../libs/colors'
import { useTmConfig } from '../../libs/config'

/**
 * @displayName 步进器
 * @exportName tm-stepper
 * @category 表单组件
 * @description 可整数，小数
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmNavbar' });
const { config } = useTmConfig()
const props = defineProps({
    /**
     * 当前值，可v-model
     */
    modelValue: {
        type: Number,
        default: 0
    },
    /**
     * 最大值
     */
    max: {
        type: Number,
        default: 100
    },
    /**
     * 组件宽
     */
    width: {
        type: String,
        default: "auto"
    },
    /**
     * 最小值
     */
    min: {
        type: Number,
        default: 0
    },
    /**
     * 是否禁用
     */
    disabled: {
        type: Boolean,
        default: false
    },
    /**
     * 开启后自动隐藏限制的按钮
     * 最小时隐藏减号按钮
     */
    autoHideBtn: {
        type: Boolean,
        default: false
    },
    /**
     * 步进值
     */
    step: {
        type: Number,
        default: 1
    },
    /**
     * 如果进步值是小数位需要设置此值
     */
    decimalLen: {
        type: Number,
        default: 0
    },
    /**
     * 按钮的颜色
     */
    btnColor: {
        type: String,
        default: "info"
    },
    /**
     * 按钮的暗黑颜色
     * 空值读取全局的Input暗黑背景色
     */
    darkBtnColor: {
        type: String,
        default: ""
    },
    /**
     * 输入框的背景色
     */
    bgColor: {
        type: String,
        default: "info"
    },
    /**
     * 输入框的暗黑背景色
     * 空值读取全局的Input暗黑背景色
     */
    darkBgColor: {
        type: String,
        default: ""
    },
    /**
     * 按钮的宽
     */
    btnWidth: {
        type: String,
        default: "64"
    },
    /**
     * 输入框及按钮的高
     */
    height: {
        type: String,
        default: "64"
    },
    /**
     * 按钮的圆角。
     */
    round: {
        type: String,
        default: "8"
    },
    /**
     * 是否按钮与输入框独立开来
     * 不和输入框粘一起。
     */
    splitBtn: {
        type: Boolean,
        default: false
    },
    /**
     * 按钮文本颜色，暗黑时取白色
     */
    btnFontColor: {
        type: String,
        default: "#333333"
    },
    /**
     * 文本颜色,暗黑时取白色
     */
    fontColor: {
        type: String,
        default: "#333333"
    },
    /**
     * 输入框的自定样式
     * 可以写背景字体等样式
     */
    inputStyle:{
        type: [String, Object] as PropType<Partial<CSSStyleDeclaration>|string>,
        default: ''
    },
    /**
     * 文本文字大小
     */
    fontSize: {
    type: String,
    default: "28"
}
})
// FieldKeys<typeof CSSStyleDeclaration>
const emit = defineEmits([
    /**
     * 输入值或者点击按钮时触发
     * @param {number} str - 当前的值。
     */
    'change',
    /**
     * 等同vmodel
     */
    'update:modelValue'
])

const _value = ref(0)
const _input_value = ref("")
const addDomDisabeld = ref(false)
const surDomDisabeld = ref(false)

const _round = computed((): string => {
    return covetUniNumber(props.round, config.unit)
})

const _width = computed((): string => covetUniNumber(props.width, config.unit))

const _fontSize = computed((): string => {
    let fontSize = covetUniNumber(props.fontSize, config.unit);
    if (config.fontSizeScale == 1) return fontSize;
    let sizeNumber = parseInt(fontSize)
    if (isNaN(sizeNumber)) {
        sizeNumber = 14
    }
    return (sizeNumber * config.fontSizeScale).toString() + getUnit(fontSize)
})

const _unFontSize = computed((): string => props.fontSize)
const _inputStyle = computed((): any => props.inputStyle)

const _btnFontColor = computed((): string => getDefaultColor(props.btnFontColor))

const _fontColor = computed((): string => {
    if (config.mode == 'dark') return '#ffffff'
    return getDefaultColor(props.fontColor)
})

const _height = computed((): string => covetUniNumber(props.height, config.unit))

const _btnWidth = computed((): string => covetUniNumber(props.btnWidth, config.unit))

const _splitBtn = computed((): boolean => props.splitBtn)

const _btnColor = computed((): string => {
    let color = getDefaultColor(props.btnColor)
    if (config.mode == 'dark') {
        if (props.darkBtnColor == "") {
            color = config.inputDarkColor
        } else {
            color = getDefaultColor(props.darkBtnColor)
        }
    }
    return color
})

const _bgColor = computed((): string => {
    let color = getDefaultColor(props.bgColor)
    if (config.mode == 'dark') {
        if (props.darkBgColor == "") {
            color = config.inputDarkColor
        } else {
            color = getDefaultColor(props.darkBgColor)
        }
    }
    return color
})

const _max = computed((): number => props.max)
const _min = computed((): number => props.min)
const _step = computed((): number => props.step)
const _disabled = computed((): boolean => props.disabled)
const _autoHideBtn = computed((): boolean => props.autoHideBtn)

watch(() => props.modelValue, (newval: number) => {
    if (newval == _value.value) return;
    setValue(newval, false)
})

onMounted(() => {
    nextTick(() => {
        setValue(props.modelValue, false)
    })
})

const isInRange = (value: number): boolean => {
    return value >= _min.value && value <= _max.value;
}

const clampValue = (value: number): number => {
    return Math.min(Math.max(value, _min.value), _max.value);
}

const getDecimalPlaces = (): number => {
    return props.decimalLen;
}

/**
 * 加
 */
const handleIncrement = () => {
    if (_disabled.value) return
    const newValue = Math.min(_value.value + _step.value, props.max);
    let val = clampValue(parseFloat(newValue.toFixed(props.decimalLen)));
    setValue(val, true)
}

/**减 */
const handleDecrement = () => {
    if (_disabled.value) return
    const newValue = Math.max(_value.value - _step.value, props.min);
    let val = clampValue(parseFloat(newValue.toFixed(props.decimalLen)));
    setValue(val, true)
}

const handleInputChange = (event: any) => {
    _input_value.value = event.detail.value
}

const inputBlur = () => {
    const inputValue = parseFloat(_input_value.value);
    if (!isNaN(inputValue)) {
        let val = clampValue(inputValue);
        setValue(val, true)
    } else {
        setValue(parseFloat(_min.value.toFixed(props.decimalLen)), true)
    }
}

const setValue = (value: number, isEmit: boolean) => {
    const clampedValue = clampValue(value);
    _value.value = clampedValue;
    _input_value.value = _value.value.toString();
    addDomDisabeld.value = _value.value >= props.max
    surDomDisabeld.value = _value.value <= props.min

    if (isEmit) {
        /**
         * 等同v-model
         */
        emit("update:modelValue", clampedValue)
        /**
         * 输入值或者点击按钮时触发
         * @param {number} 当前的值。
         */
        emit("change", clampedValue)
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
<template>
    <view class="xStepper" :style="{ width: _width, borderRadius: _round }">
        <view v-if="(!surDomDisabeld && _autoHideBtn) || !_autoHideBtn" :hover-start-time="20" :hover-stay-time="150"
            :hover-class="surDomDisabeld || _disabled ? '' : 'xStepperHoverbtn'" @click="handleDecrement"
            class="xStepperBtn"
            :style="{ backgroundColor: _btnColor, height: _height, width: _btnWidth, opacity: surDomDisabeld || _disabled ? 0.6 : 1, borderRadius: _splitBtn ? '50px' : '0rpx' }">
            <tm-icon _style="pointer-events: none" :color="_btnFontColor" :size="_unFontSize"
                name="subtract-line"></tm-icon>
        </view>

        <input v-if="(!surDomDisabeld && _autoHideBtn) || !_autoHideBtn" :disabled="_disabled" @blur="inputBlur"
            @input="handleInputChange" :value="_input_value" class="xStepperInput" :style="[
                { backgroundColor: _splitBtn ? 'transparent' : _btnColor, height: _height, color: _fontColor, fontSize: _fontSize },
                typeof _inputStyle === 'string' ? _inputStyle : {..._inputStyle}
            ]" :type="decimalLen > 0 ? 'digit' : 'number'" />
        <view :hover-class="addDomDisabeld || _disabled ? '' : 'xStepperHoverbtn'" :hover-start-time="20"
            :hover-stay-time="150" @click="handleIncrement" class="xStepperBtn"
            :style="{ backgroundColor: _btnColor, height: _height, width: _btnWidth, opacity: addDomDisabeld || _disabled ? 0.6 : 1, borderRadius: _splitBtn ? '50px' : '0rpx' }">
            <tm-icon :color="_btnFontColor" _style="pointer-events: none" :size="_unFontSize" name="add-line"></tm-icon>
        </view>

    </view>
</template>
<style scoped>
.xStepperBtnBtn {
    pointer-events: none;
    flex-shrink: 0;
}

.xStepperHoverbtn {
    opacity: 0.8;
}

.xStepper {
    display: flex;
    flex-direction: row;
    overflow: hidden;
}

.xStepperInput {
    flex: 1;
    margin: 0 1px;
    padding: 0 5px;
    text-align: center;
    flex-shrink: 0;
    min-width: 20px;
}

.xStepperBtn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>