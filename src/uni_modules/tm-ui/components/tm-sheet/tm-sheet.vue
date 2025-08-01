<template>
  <view
    @click="OnClick"
    class="tmSheet"
    @touchstart="touchStart"
    @touchcancel="touchEnd"
    @touchend="touchEnd"
    @mousedown="touchStart"
    @mouseup="touchEnd"
    @mouseleave="touchEnd"
    :style="[
      {
        width: _width,
        height: _height,
      },
      buttonStyle,
    ]"
  >
    <!-- @slot 默认插槽 -->
    <slot></slot>
    <view
      v-if="_attrs.loading"
      class="tmSheetLoading"
      :style="{ borderRadius: buttonStyle.borderRadius }"
    >
      <tm-icon name="loader-line" :size="_attrs.loadIconSize" spin color="primary"></tm-icon>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { arrayNumberValid, arrayNumberValidByStyleMP, arrayNumberValidByStyleBorderColor, arrayNumberValidByStyleBorderStyle, covetUniNumber, linearValid } from "../../libs/tool";
import { useTmConfig } from "../../libs/config";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";

/**
 * @displayName 容器
 * @exportName tm-sheet
 * @category 常用组件
 * @description 像一张纸张一样，用于包裹内容区域,可塑性高,可以快速用来布局.
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmSheet' });

const { config } = useTmConfig()
const emits = defineEmits([
    /**
     * 点击事件
     * @property {MouseEvent} evt 事件参数
     *  */
    'click',
])
type PropsKeyType = keyof typeof attrs;
const attrs = defineProps({
    /**
     * 遵循规则：
     * string或者[x]：全部边线
     * [x,x]左右边线，上下边线
     * [x,x,x] 左，上，右
     * [x,x,x,x] 左，上，右,下
     */
    borderColor: {
        type: [String, Array<string>],
        default: ""
    },
    darkBorderColor: {
        type: [String, Array<string>],
        default: "transparent"
    },
    /** 规则同borderColor */
    borderWidth: {
        type: [String, Number, Array<string | number>],
        default: 0
    },
    /** 规则同borderColor */
    borderStyle: {
        type: [String, Array<string>],
        default: "solid"
    },
    /** 规则同borderColor
     * 左上，右上，右下，左下
     */
    round: {
        type: [String, Number, Array<string | number>],
        default: ''
    },
    /**
     * 遵循规则：填写0关闭,填写空值取全局
     * string,number,或者[x]：全部
     * [x,x]左右，上下
     * [x,x,x] 左，上，右
     * [x,x,x,x] 左，上，右,下
     */
    margin: {
        type: [String, Number, Array<string | number>],
        default: ''
    },
    /**
    * 遵循规则：填写0关闭,填写空值取全局
    * string,number,或者[x]：全部
    * [x,x]左右，上下
    * [x,x,x] 左，上，右
    * [x,x,x,x] 左，上，右,下
    */
    padding: {
        type: [String, Number, Array<string | number>],
        default: ''
    },
    width: {
        type: [String, Number],
        default: ""
    },
    height: {
        type: [String, Number],
        default: ""
    },

    loading: {
        type: Boolean,
        default: false
    },
    /**
     * 是否跟随主题背景色
     * 下方的color失效
     */
    flowTheme: {
        type: Boolean,
        default: false
    },
    /**
     * 背景主题
     */
    color: {
        type: String,
        default: "white"
    },
    /**
     * 自定义暗黑背景
     * 空值时取全局配置
     */
    darkBgColor: {
        type: String,
        default: ""
    },
    /** 渐变，前面的color,bgColor,darkBgColor失效 */
    linear: {
        type: [Array<string>],
        default: () => [],
        validator: (val: string[]) => {
            if (val.length == 0) return true;
            let pass = val.length == 3;
            if (!pass) {
                console.error("tmui提醒:linear 参数格式错误，请检查,必须长度为3");
            }
            return pass
        }
    },
    /**
     * 数字或者字符串时自动计算投影,它会投影大小
     * 数组时(必须为4),第一个x,第二为y,第三个为大小 ,第四个为投影颜色
     * 空字符串时,取全局配置,如果不想投影设置为none即可.
     */
    shadow: {
        type: [String, Number, Array<string>],
        default: '',
        validator: (val: string | number | string[]) => {
            if (Array.isArray(val)) {
                if (val.length != 4) {
                    console.error("tmui提醒:shadow 第一个x,第二为y,第三个为大小 ,第四个为投影颜色");
                    return false;
                }
            }
            return true;
        }
    },
    loadIconSize:{
        type: [String, Number],
        default:"50"
    }
})
const _attrs = computed(() => attrs);
const OnClick = (evt: MouseEvent) => {
    if (_attrs.value.loading) return;
    emits('click', evt)
}
const _width = computed(() => {
    return covetUniNumber(attrs.width || 'auto')
})
const _height = computed(() => covetUniNumber(attrs.height || 'auto'))

const isHover = ref(false);
const touchStart = () => {
    isHover.value = true;
}
const touchEnd = () => {
    isHover.value = false;
}

const buttonStyle = computed(() => {
    let style = {
        borderColor: ``,
        borderWidth: ``,
        borderStyle: ``,
        background: ``,
        color: ``,
        borderRadius: ``,
        boxShadow: `none`,
        margin: '0px',
        padding: '0px'
    }
    let isDark = config.mode == 'dark';

    let background = attrs.color
    let borderColor = arrayNumberValidByStyleBorderColor(attrs.borderColor)
    let borderWidth = arrayNumberValidByStyleMP(attrs.borderWidth)
    let borderStyle = arrayNumberValidByStyleBorderStyle(attrs.borderStyle)
    let borderRadius = arrayNumberValidByStyleMP(attrs.round || config.sheetRadius)
    let margin = arrayNumberValidByStyleMP(attrs.margin === '' ? config.sheetMargin : attrs.margin)
    let padding = arrayNumberValidByStyleMP(attrs.padding === '' ? config.sheetPadding : attrs.padding)
    let linear = linearValid(attrs.linear)

    if (attrs.flowTheme) {
        background = config.color
    }
    if (isDark) {
        background = attrs.darkBgColor || config.sheetDarkColor
    }

    let shadow = 'none'
    if (Array.isArray(attrs.shadow)) {
        shadow = attrs.shadow.join(' ')
    } else if (attrs.shadow !== '' && attrs.shadow != 'none') {
        let obj = getDefaultColorObj(attrs.color, attrs.color)
        shadow = `0px 0px ${covetUniNumber(attrs.shadow)} ${obj.default.shadow}`
    } else if (attrs.shadow === '') {
        if (Array.isArray(config.sheetShadow)) {
            shadow = config.sheetShadow.join(' ')
        } else if (config.sheetShadow && config.sheetShadow != 'none') {
            let obj = getDefaultColorObj(attrs.color, attrs.color)
            shadow = `0 4px ${covetUniNumber(config.sheetShadow)} ${obj.default.shadow}`
        }
    }


    style.background = linear || getDefaultColor(background)
    style.borderColor = borderColor.join(' ')
    style.borderWidth = borderWidth.join(' ')
    style.borderStyle = borderStyle.join(' ')
    style.borderRadius = borderRadius.join(' ')
    style.margin = margin.join(' ')
    style.padding = padding.join(' ')
    style.boxShadow = shadow
    return style;
});
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

<style lang="scss" scoped>
.tmSheet {
  position: relative;

  .tmSheetLoading {
    display: flex;
    border: 0px solid transparent;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    padding: 0px;
    margin: 0px;
    backdrop-filter: blur(1px);
    background-color: rgba(125, 125, 125, 0.2);
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }
}
</style>
