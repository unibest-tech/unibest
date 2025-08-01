<script lang="ts" setup>
import { PropType, ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import {
    arrayNumberValid,
    arrayNumberValidByStyleMP,
    covetUniNumber,
    arrayNumber,
    arrayNumberValidByStyleBorderColor,
    linearValid,
    getUnit,
    getUid,
} from "../../libs/tool";
import {
    getDefaultColor,
    getDefaultColorObj,
    getOutlineColorObj,
    getTextColorObj,
    getThinColorObj,
} from "../../libs/colors";
import { useTmConfig } from "../../libs/config";

/**
 * @displayName 验证码输入框
 * @exportName tm-code-input
 * @category 其它组件
 * @description 验证码输入框
 * @constant 平台兼容
 *    | H5 | uniAPP | 小程序 | version |
 | --- | --- | --- | --- |
 | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: "tmCodeInput" });
const xConfig = useTmConfig().config;
const props = defineProps({
    /**
     * 进入时自动获取焦点，并弹出系统自带的键盘(需要useSysKeyborad=true)。
     */
    autoFocus: {
        type: Boolean,
        default: false,
    },
    /**
     * 是否使用系统自带的键盘。，如果为false你需要自行配置输入键盘
     * 比如使用我的keyborad键盘组件。
     */
    useSysKeyborad: {
        type: Boolean,
        default: true,
    },
    /**
     * 当前输入的值
     */
    modelValue: {
        type: String,
        default: "",
    },
    /**
     * 最大长度
     */
    maxlength: {
        type: Number,
        default: 4,
    },
    /**
     * 间距
     */
    gutter: {
        type: String,
        default: "16",
    },
    /**
     * 验证码框的宽
     */
    width: {
        type: [String,Number],
        default: "100",
    },
    /**
     * 验证码框的高
     */
    height: {
        type: [String,Number],
        default: "100",
    },
    /**
     * 当前输入项激活时的文字颜色同时也是高亮时的背景色。
     * 默认取全局主题
     */
    fontColor: {
        type: String,
        default: "",
    },
    /**
     * 暗黑时的主题色，不填写等同fontColor
     */
    darkFontColor: {
        type: String,
        default: "",
    },
    /**
     * 文字大小
     */
    fontSize: {
        type: String,
        default: "42",
    },
    /**
     * 圆角
     */
    round: {
        type: String,
        default: "16",
    },
    /**
     * skin = fill时的背景
     */
    bgColor: {
        type: String,
        default: "#f0f0f0",
    },
    /**
     * skin = fill时的暗黑背景
     */
    darkBgColor: {
        type: String,
        default: "#272727",
    },
    /**
     * skin = outline时的边线颜色
     */
    borderColor: {
        type: String,
        default: "",
    },
    /**
     * skin = outline时的暗黑边线颜色
     */
    darkBorderColor: {
        type: String,
        default: "",
    },
    /**
     * skin = outline时的边线颜色[非激活时]
     */
    unBorderColor: {
        type: String,
        default: "#e3e3e3",
    },
    /**
     * skin = outline时的暗黑边线颜色[非激活时]
     */
    unDarkBorderColor: {
        type: String,
        default: "#2c2b2c",
    },
    skin: {
        type: String as PropType<"fill" | "outline">,
        default: "outline",
    },
    /**
     * 待输入时的占位形状
     * line线型
     * round圆形
     * 空值表示不需要占位符号
     */
    placeShape: {
        type: String as PropType<"line" | "round">,
        default: "round",
    },
});

const _autoFocus = ref(props.autoFocus);
const inputValue = ref("");
const tid = ref(0);
const isFocus = ref(props.autoFocus)

const emits = defineEmits([
    /**
     * 输入框点击时触发
     */
    "click",
    /**
     * 自带键盘上确认或者达到指定长度位数时触发，可能会多次触发
     * @param {String} value - 值
     */
    "confirm",
    /**
     * 输入时触发
     * @param {String} value - 值
     */
    "change",
    /**
     * 等同vmodel，可与我的keyborad键盘配合使用。
     */
    "update:modelValue",
]);

watch(
  () => props.modelValue,
  (newval: string) => {
      if (newval == inputValue.value) return;
      inputValue.value = newval;
      let len = newval.split("").length;
      if (len == _maxLength.value) {
          /**
           * 输入长度等于指定长度时触发
           */
          emits("confirm", inputValue.value);
      }
  }
);

const _fontColor = computed((): string => {
    let fontcolor = props.fontColor == "" ? xConfig.color : props.fontColor;
    let darkFontcolor = props.darkFontColor == "" ? fontcolor : props.darkFontColor;
    if (xConfig.mode === "dark") {
        return getDefaultColor(darkFontcolor);
    }
    return getDefaultColor(fontcolor);
});

const _borderColor = computed((): string => {
    let outLineColor = props.borderColor == "" ? xConfig.color : props.borderColor;
    let darkOutlineColor =
      props.darkBorderColor == "" ? _fontColor.value : props.darkBorderColor;

    if (xConfig.mode === "dark") {
        return getDefaultColor(darkOutlineColor);
    }
    return getDefaultColor(outLineColor);
});

const _unborderColor = computed((): string => {
    let unBorderColor = props.unBorderColor == "" ? _fontColor.value : props.unBorderColor;
    let unDarkBorderColor =
      props.unDarkBorderColor == "" ? _fontColor.value : props.unDarkBorderColor;

    if (xConfig.mode === "dark") {
        return getDefaultColor(unDarkBorderColor);
    }
    return getDefaultColor(unBorderColor);
});

const _bgcolor = computed((): string => {
    if (xConfig.mode === "dark") {
        return getDefaultColor(props.darkBgColor);
    }
    return getDefaultColor(props.bgColor);
});

const _fontSize = computed((): string => {
    let fontSize = covetUniNumber(props.fontSize, xConfig.unit);
    if (xConfig.fontSizeScale == 1) return fontSize;
    let sizeNumber = parseInt(fontSize);
    if (isNaN(sizeNumber)) {
        sizeNumber = 42;
    }
    return (sizeNumber * xConfig.fontSizeScale).toString() + getUnit(fontSize);
});

const _maxLength = computed((): number => props.maxlength);

const _round = computed((): string => covetUniNumber(props.round, xConfig.unit));

const _gutter = computed((): string => covetUniNumber(props.gutter, xConfig.unit));

const _width = computed((): string => covetUniNumber(props.width, xConfig.unit));

const _height = computed((): string => covetUniNumber(props.height, xConfig.unit));



onBeforeUnmount(() => {
    clearTimeout(tid.value);
});

const inputEvent = (evt: Event): string => {
    // @ts-ignore
    let value = evt.detail.value;
    let len = value.split("").length;
    if (len > _maxLength.value) {
        inputValue.value = value;
        clearTimeout(tid.value);
        tid.value = setTimeout(() => {
            inputValue.value = value.substring(0, _maxLength.value);
        }, 100);
        return inputValue.value;
    }
    inputValue.value = value;

    emits("update:modelValue", inputValue.value);
    if (len == _maxLength.value) {
        nextTick(() => {
            /**
             * 输入长度等于指定长度时触发
             */
            emits("confirm", inputValue.value);
            _autoFocus.value = false;
        });
    }

    /**
     * 变动时触发
     */
    emits("change", inputValue.value);
    return inputValue.value;
};

const onClick = () => {
    /**
     * 点击框时触发
     */
    emits("click", inputValue.value);
    _autoFocus.value = true;
};

const getValue = (index: number): string => {
    if (index > inputValue.value.length - 1) return "";
    return inputValue.value.split("")[index];
};

const onconfirm = () => {
    emits("update:modelValue", inputValue.value);
    nextTick(() => {
        /**
         * 输入长度等于指定长度时触发
         */
        emits("confirm", inputValue.value);
    });
    _autoFocus.value = false;
};

const borderColorAc = (index: number): string => {
    let isActive = inputValue.value.split("").length >= index;
    if (!isActive) {
        if (props.skin == "fill") return "transparent";
    }
    return isActive ? _borderColor.value : _unborderColor.value;
};

const blur = () => {
    _autoFocus.value = false;
    isFocus.value = false;
};

const onFocus = () => {
    let len = inputValue.value.split("").length;
    isFocus.value = true;
    if (len > _maxLength.value) {
        inputValue.value = inputValue.value.substring(0, _maxLength.value);
    }


};
</script>
<template>
    <view @click="onClick" class="xCodeInput">
        <input @focus="onFocus" v-if="useSysKeyborad" :focus="_autoFocus" :style="{
    width: '100%',
    height: _height,
  }" @confirm="onconfirm" @input="inputEvent" v-model="inputValue" @blur="blur" :auto-focus="_autoFocus"
               class="xCodeInputInput" type="number" />

        <view class="xCodeInputItem" :style="{
    borderRadius: _round,
    border: `2px solid ${borderColorAc(index)}`,
    backgroundColor: skin == 'fill' ? _bgcolor : 'transparent',
    width: _width,
    height: _height,
    marginRight: index == _maxLength - 1 ? '0px' : _gutter,
  }" v-for="(_, index) in _maxLength" :key="index">
            <text :class="[
    index <= inputValue.length ? 'xCodeInputItemTextOn' : 'xCodeInputItemTextOff',
  ]" class="xCodeInputItemText" :style="{
    fontWeight: 'bold',
    color: _fontColor,
    fontSize: _fontSize,
  }">
                {{ getValue(index) }}
            </text>
            <tm-skeleton v-if="index <= inputValue.length && getValue(index) == '' && placeShape == 'round' && isFocus
    " height="5px" width="5px" :color="_borderColor" :dark-color="_borderColor"></tm-skeleton>
            <tm-skeleton v-if="index <= inputValue.length && getValue(index) == '' && placeShape == 'line' && isFocus" height="2px"
                         width="33%" :color="_borderColor" :dark-color="_borderColor"></tm-skeleton>
        </view>
    </view>
</template>

<style scoped>
.xCodeInputItemText {
    transition-property: transform, opacity;
    transition-duration: 250ms;
    transition-timing-function: linear;
    transition-delay: 50ms;
}

.xCodeInputItemTextOn {
    transform: scale(1);
    opacity: 1;
}

.xCodeInputItemTextOff {
    transform: scale(0);
    opacity: 0;
}

.xCodeInputItem {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    transition-property: background-color, border-color;
    transition-duration: 250ms;
    transition-timing-function: linear;
}

.xCodeInput {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.xCodeInputInput {
    /* pointer-events: none;*/
    opacity: 0;
    /* transform: translateX(-1000%); */
    position: absolute;
    left: -1000px;
    top: -1000px;
    z-index: -1;
}
</style>
