<template>
    <view class="tmButton" :class="[_attrs.loading || _attrs.disabled ? 'tmButtonLoading' : '']"
        @touchstart="touchStart" @touchcancel="touchEnd" @touchend="touchEnd" @mousedown="touchStart"
        @mouseup="touchEnd" @mouseleave="touchEnd" :style="[
            {
                minWidth: _width,
                width: _attrs.block ? '100%' : 'auto',
                height: _attrs.btnIcon ? _width : _height,
                fontSize: _fontSize,
            },
            buttonStyle,
        ]">
        <tm-icon v-if="_attrs.loading" name="loader-line" spin :color="buttonStyle.color"></tm-icon>
        <!-- 
        @slot icon图标
        -->
        <slot name="icon">
            <tm-icon v-if="!_attrs.loading && _attrs.icon" :name="_attrs.icon" :size="_attrs.iconSize || _fontSize"
                :color="buttonStyle.color"></tm-icon>
        </slot>
        <!--
        @slot 默认插槽
        -->
        <slot>
            <text v-if="!_attrs.btnIcon"></text>
        </slot>
        <button @getphonenumber="getphonenumber" @getuserinfo="getuserinfo" @error="error" @opensetting="opensetting"
            @launchapp="launchapp" @contact="contact" @chooseavatar="chooseavatar"
            @agreeprivacyauthorization="agreeprivacyauthorization" @addgroupapp="addgroupapp"
            @chooseaddress="chooseaddress" @chooseinvoicetitle="chooseinvoicetitle" @subscribe="subscribe"
            @login="login" @im="im" :appParameter="_attrs.appParameter" :lang="_attrs.lang"
            :sessionFrom="_attrs.sessionFrom" :sendMessageTitle="_attrs.sendMessageTitle"
            :sendMessagePath="_attrs.sendMessagePath" :sendMessageImg="_attrs.sendMessageImg"
            :showMessageCard="_attrs.showMessageCard" :groupId="_attrs.groupId" :guildId="_attrs.groupId"
            :publicId="_attrs.publicId" :dataImId="_attrs.dataImId" :dataImType="_attrs.dataImType"
            :dataGoodsId="_attrs.dataGoodsId" :dataOrderId="_attrs.dataOrderId" :dataBizLine="_attrs.dataBizLine"
            @click="onClick" :open-type="_attrs.openType" class="tmButtonBlock"></button>
    </view>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, PropType, ref } from 'vue'
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, linearValid } from '../../libs/tool'
import { useTmConfig } from '../../libs/config'
import {
	getDefaultColor,
	getDefaultColorObj,
	getOutlineColorObj,
	getTextColorObj,
	getThinColorObj
} from '../../libs/colors'
import TmForm from '../tm-form/tm-form.vue'

/**
 * @displayName 按钮
 * @exportName tm-button
 * @category 常用组件
 * @description 圆角，主题可通过配置统一设置或者动态全局设置，使设计风格统一并保持一致性。让你的风格独一无二。
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmButton' });
const { config } = useTmConfig()
const proxy = getCurrentInstance()?.proxy;
const emits = defineEmits([
    /**
     * 点击事件
     * @property {object} evt 事件参数
     */
    'click',
    'getphonenumber',
    'getuserinfo',
    'error',
    'opensetting',
    'launchapp',
    'contact',
    'chooseavatar',
    'agreeprivacyauthorization',
    'addgroupapp',
    'chooseaddress',
    'chooseinvoicetitle',
    'subscribe',
    'login',
    'im'
])
const attrs = defineProps({
    /** 
     * 尺寸大小,可选值：s/m/n/g/xs
     */
    size: {
        type: String as PropType<"s" | "g" | "xs" | "m" | "n">,
        default: "n"
    },
    /**
     * 样式
     * 可选值：thin/outlined/text/normal/dashed
     */
    skin: {
        type: String as PropType<"thin" | "outlined" | "text" | "normal" | "dashed">,
        default: "normal"
    },
    /**
     * 遵循规则：
     * string或者[x]：全部边线
     * [x,x]左右边线，上下边线
     * [x,x,x] 左，上，右
     * [x,x,x,x] 左，上，右,下
     */
    borderWidth: {
        type: [String, Number, Array<string | number>],
        default: 1
    },

    /**
     * 圆角半径
     * 左上，右上，右下，左下
     */
    round: {
        type: [String, Number, Array<string | number>],
        default: ''
    },
    /**
     * 50%圆角
     */
    rounded: {
        type: Boolean,
        default: false
    },
    /**宽度 */
    width: {
        type: [String, Number],
        default: ""
    },
    /**高度 */
    height: {
        type: [String, Number],
        default: ""
    },
    /**开放能力 */
    openType: {
        type: String,
        default: ""
    },
    /**是否占据一行 */
    block: {
        type: Boolean,
        default: false
    },
    /**是否禁用 */
    disabled: {
        type: Boolean,
        default: false
    },
    /**图标名称 */
    icon: {
        type: String,
        default: ""
    },
    /**图标大小 */
    iconSize: {
        type: String,
        default: ""
    },
    /**
     * 是否开启仅图标按钮模式,宽和高相等
     */
    btnIcon: {
        type: Boolean,
        default: false
    },
    /**是否加载中 */
    loading: {
        type: Boolean,
        default: false
    },
    fontSize: {
        type: String,
        default: ""
    },
    /** 自定义主题颜色 */
    color: {
        type: String,
        default: ""
    },
    /** 自定义背景 */
    bgColor: {
        type: String,
        default: ""
    },
    /**自定义暗黑背景 */
    darkBgColor: {
        type: String,
        default: ""
    },
    /**自定义字体颜色 */
    fontColor: {
        type: String,
        default: ""
    },
    /**自定义暗黑字体颜色 */
    darkFontColorColor: {
        type: String,
        default: ""
    },
    /** 渐变，前面的color,bgColor,darkBgColor失效 */
    linear: {
        type: Array as PropType<string[]>,
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
    formType: {
        type: String as PropType<"submit" | "reset" | "form">,
        default: ""
    },
    /**
     * 禁止hover效果，点按没有hover效果，有时可能不需要。
     */
    disableHover:{
        type:Boolean,
        default:false
    },
    /**
     * 跳转的地址链接，出现时点击click会跳转以/pages开头。
     */
    url: {
        type: String,
        default: ""
    },
	/** url跳转模式 */
    navigatorMode: {
        type: String as PropType<"navigateTo"|"reLaunch"|"redirectTo"|"switchTab"|"navigateBack">,
        default: "navigateTo"
    },
    appParameter: {
        type: String,
        default: ""
    },
    lang: {
        type: String,
        default: "en"
    },
    sessionFrom: {
        type: String,
        default: ""
    },
    sendMessageTitle: {
        type: String,
        default: ""
    },
    sendMessagePath: {
        type: String,
        default: ""
    },
    sendMessageImg: {
        type: String,
        default: ""
    },
    showMessageCard: {
        type: Boolean,
        default: false
    },
    groupId: {
        type: String,
        default: ""
    },
    guildId: {
        type: String,
        default: ""
    },
    publicId: {
        type: String,
        default: ""
    },
    dataImId: {
        type: String,
        default: ""
    },
    dataImType: {
        type: String,
        default: ""
    },
    dataGoodsId: {
        type: String,
        default: ""
    },
    dataOrderId: {
        type: String,
        default: ""
    },
    dataBizLine: {
        type: String,
        default: ""
    }
})
type PropsKeyType = keyof typeof attrs;

const covetButtonSize = (ops: PropsKeyType, s: TM.BUTTON_SIZE, size?: string | number) => {
    const widths = new Map<TM.BUTTON_SIZE, string>([
        ['xs', '88'],
        ['s', '96'],
        ['m', '120'],
        ['n', '220'],
        ['g', '300']

    ])
    const heights = new Map<TM.BUTTON_SIZE, string>([
        ['xs', '44'],
        ['s', '60'],
        ['m', '72'],
        ['n', '90'],
        ['g', '100']

    ])
    const fontSizes = new Map<TM.BUTTON_SIZE, string>([
        ['xs', '22'],
        ['s', '24'],
        ['m', '28'],
        ['n', '32'],
        ['g', '34']
    ])
    const rounds = new Map<TM.BUTTON_SIZE, string>([
        ['xs', '8'],
        ['s', '10'],
        ['m', '12'],
        ['n', '16'],
        ['g', '20']
    ])
    if (ops === 'width') {
        return covetUniNumber(widths.get(s)!)
    }
    if (ops === 'height') {
        return covetUniNumber(heights.get(s)!)
    }
    if (ops === 'round') {
        if (size && s == 'n') {
            return covetUniNumber(size!)
        }
        return covetUniNumber(rounds.get(s)!)
    }
    return covetUniNumber(fontSizes.get(s)!);
}
const _attrs = computed(() => attrs);
const _width = computed(() => {
    if (attrs.block) {
        return 'auto'
    }
    return attrs.width === '' ? covetButtonSize('width', attrs.size) : covetUniNumber(attrs.width)
})
const _height = computed(() => attrs.height === '' ? covetButtonSize('height', attrs.size) : covetUniNumber(attrs.height))
const _fontSize = computed(() => attrs.fontSize === '' ? covetButtonSize('fontSize', attrs.size) : covetUniNumber(attrs.fontSize))

const isHover = ref(false);

const touchStart = () => {
    isHover.value = true;
}
const touchEnd = () => {
    isHover.value = false;
}
const buttonStyle = computed(() => {
    if(attrs.disableHover){
        isHover.value = false;
    }
    let style = {
        borderColor: ``,
        borderWidth: ``,
        borderStyle: ``,
        background: ``,
        color: ``,
        borderRadius: ``,
        boxShadow: `none`
    }
    let isDark = config.mode == 'dark';
    let color = attrs.color || config.color;
    let round = attrs.round === '' ? covetButtonSize('round', attrs.size, config.buttonRadius) : attrs.round;
    let linear = linearValid(attrs.linear)
    let background = linear || (attrs.bgColor ? getDefaultColor(attrs.bgColor) : '')

    let fontColor = attrs.fontColor ? getDefaultColor(attrs.fontColor) : ''
    let borderStyle = attrs.skin == 'dashed' ? 'dashed' : 'solid';

    if (isDark) {
        if (attrs.darkBgColor) {
            background = getDefaultColor(attrs.darkBgColor)
        }
        if (attrs.darkFontColorColor) {
            fontColor = getDefaultColor(attrs.darkFontColorColor)
        }
    }

    let obj = getDefaultColorObj(color, color)
    if (attrs.skin == 'text') {
        obj = getTextColorObj(color, color, isDark)

    } else if (attrs.skin == 'thin') {
        obj = getThinColorObj(color, color, isDark)

    } else if (attrs.skin == 'outlined' || attrs.skin == 'dashed') {
        obj = getOutlineColorObj(color, color)
    }

    if (obj) {
        if (isHover.value && !attrs.disabled && !attrs.loading) {
            style.color = linear ? '#ffffff' : fontColor || obj.active.fontColor;
            style.background = background || obj.active.background;
            style.borderStyle = borderStyle;
            style.borderColor = background || obj.active.borderColor;
            style.borderWidth = linear ? '0px' : arrayNumberValidByStyleMP(attrs.borderWidth, '0px').join(" ")
            style.borderRadius = attrs.rounded ? '50%' : arrayNumberValid(round, '0px').join(" ")
        } else {
            style.color = linear ? '#ffffff' : fontColor || obj.default.fontColor;
            style.background = background || obj.default.background;
            style.borderStyle = borderStyle;
            style.borderColor = background || obj.default.borderColor;
            style.borderWidth = linear ? '0px' : arrayNumberValidByStyleMP(attrs.borderWidth, '0px').join(" ")
            style.borderRadius = attrs.rounded ? '50%' : arrayNumberValid(round, '0px').join(" ")
            let shadow = 'none'
            if (Array.isArray(attrs.shadow)) {
                shadow = attrs.shadow.join(' ')
            } else if (attrs.shadow !== '' && attrs.shadow != 'none') {
                shadow = `0 2px ${covetUniNumber(attrs.shadow)} ${obj.default.shadow}`
            } else if (attrs.shadow === '') {
                if (Array.isArray(config.buttonShadow)) {
                    shadow = config.buttonShadow.join(' ')
                } else if (config.buttonShadow && config.buttonShadow != 'none') {
                    shadow = `0 2px ${covetUniNumber(config.buttonShadow)} ${obj.default.shadow}`
                }
            }

            style.boxShadow = shadow
        }
    }

    return style;
});

const onClick = (evt: any) => {
	if(_attrs.value.disabled||_attrs.value.loading) return;
	emits('click', evt)
    if (_attrs.value.url) {
        // @ts-expect-error
        uni[_attrs.value.navigatorMode]({
            url: _attrs.value.url,
            // @ts-expect-error
            fail(error) {
                console.error(error)
            }
        })
        return;
    }
    if (attrs.formType == 'submit' || attrs.formType == 'reset') {
        let parent = findParent(proxy)
        if (parent != null) {
            let ele = parent! as InstanceType<typeof TmForm>
            if (attrs.formType == 'submit') {
                ele.submit()
            } else if (attrs.formType == 'reset') {
                ele.reset()
            }
        }
    }

}
const getphonenumber = (evt: any) => emits('getphonenumber', evt)
const getuserinfo = (evt: any) => emits('getuserinfo', evt)
const error = (evt: any) => emits('error', evt)
const opensetting = (evt: any) => emits('opensetting', evt)
const launchapp = (evt: any) => emits('launchapp', evt)
const contact = (evt: any) => emits('contact', evt)
const chooseavatar = (evt: any) => emits('chooseavatar', evt)
const agreeprivacyauthorization = (evt: any) => emits('agreeprivacyauthorization', evt)
const addgroupapp = (evt: any) => emits('addgroupapp', evt)
const chooseaddress = (evt: any) => emits('chooseaddress', evt)
const chooseinvoicetitle = (evt: any) => emits('chooseinvoicetitle', evt)
const subscribe = (evt: any) => emits('subscribe', evt)
const login = (evt: any) => emits('login', evt)
const im = (evt: any) => emits('im', evt)


function findParent(parent: any): any {
    if (parent == null) return null;
    if (parent.$parent?.$options?.name == "TmForm") return parent.$parent;
    let parents = findParent(parent.$parent);
    if (parents?.$options?.name == "TmForm") return parents;
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

<style lang="scss" scoped>
.tmButton {
    position: relative;
    display: inline-flex;
    line-height: 1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;

    &.tmButtonLoading {
        opacity: 0.5;

        .tmButtonBlock,
        & {
            cursor: no-drop;
        }
    }

    .tmButtonBlock {
        opacity: 0;
        display: flex;
        border: 0px solid transparent;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        padding: 0px;
        margin: 0px;

        &::after {
            background-color: transparent;
            outline: none;
            border: none;
        }
    }
}
</style>
