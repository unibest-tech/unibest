<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, PropType, getCurrentInstance, ComponentInstance, onUpdated, nextTick, VueElement, inject } from 'vue';
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit, getUid } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
import { onPageScroll } from '@dcloudio/uni-app';
import tmRadioGroup from '../tm-radio-group/tm-radio-group.vue';
import tmRadio from './tm-radio.vue';
const proxy = getCurrentInstance()?.proxy as InstanceType<typeof tmRadio> | null;

/**
 * @displayName 单选框
 * @exportName tm-radio
 * @category 表单组件
 * @description 可单单独使用,也可多选组合使用
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmRadio' });
const { config } = useTmConfig()

const emit = defineEmits([
    /**
     * 用户交互切换，选中变换时触发。
     * @param {Boolean} check - 当前是否选中
     * @param {Number} value - 当前选中的值
     */
    'change',
    /**
     * 点击事件
     */
    'click',
    'update:modelValue'
]);

const props = defineProps({
    /**
     * 当前主题色，空值时取全局
     */
    color: {
        type: String,
        default: ""
    },

    /**
     * 当前未选中时主题色，空值时取全局
     */
    unCheckColor: {
        type: String,
        default: ""
    },
    /**
     * 当前未选中时的暗黑主题色
     */
    darkUnCheckColor: {
        type: String,
        default: ""
    },
    /**
     * 双向绑定值
     */
    modelValue: {
        type: [String, Number, Boolean],
        default: ''
    },
    /**
     * 选中的值，
     */
    value: {
        type: [String, Number, Boolean],
        default: true
    },
    /**
     * 未选中的值
     */
    unCheckValue: {
        type: [String, Number, Boolean],
        default: ''
    },
    /**
     * 是否禁用
     */
    disabled: {
        type: [Boolean,String],
        default: false
    },
    /**
     * 选中的图标名称。
     */
    icon: {
        type: String,
        default: "check-line"
    },
    /**
     * 右侧文字。
     */
    label: {
        type: String,
        default: ""
    },
    /**
     * 是否隐藏选中框。然后利用默认插槽自定义选中所有样式和状态。
     */
    hiddenCheckbox: {
        type: Boolean,
        default: false
    },
    /**
     * 尺寸
     */
    size: {
        type: [String, Number],
        default: "42"
    },
    /**
     * 中间小图标大小
     */
    iconSize: {
        type: [String, Number],
        default: "40"
    },
    /**
     * 文字大小
     */
    labelFontSize: {
        type: [String, Number],
        default: "30"
    },
    /**
     * 选中的框在文本左边还是在右边
     */
    labelDirection: {
        type:String as PropType<"left"|"right">,
        default:"left"
    },
    /**
     * 如果不要显示label时设置为false可以隐藏label并把label间隙删除，
     */
    showLabel:{
        type:Boolean,
        default:true
    }
});

const nowValue = ref<string | number | boolean>('');
const boxId = ref("tmCheckbox-" + getUid());
const tid = ref(0);
const isDestroy = ref(false);
const parentVal = inject("tmRadioGroupValue", computed((): string | number | boolean => ""))
const _color = computed(() => {
    if (props.color == "") return getDefaultColor(config.color);
    return getDefaultColor(props.color);
});
const _showLabel = computed(()=>props.showLabel)
const _unCheckColor = computed(() => {
    if (config.mode == 'dark' && props.darkUnCheckColor != '') {
        return getDefaultColor(props.darkUnCheckColor);
    }
    if (props.unCheckColor == "") return getDefaultColor(config.unRadioAndCheckBoxColor);
    return getDefaultColor(props.unCheckColor);
});

const _isCheck = computed(() => {
    return nowValue.value === props.value;
});

const _disabled = computed(() => {
    return props.disabled;
});

const _label = computed(() => {
    return props.label;
});



const _size = computed(() => {
    let size = covetUniNumber(props.size, config.unit);
    if (config.fontSizeScale == 1) return size;
    let sizeNumber = parseInt(size);
    if (isNaN(sizeNumber)) {
        sizeNumber = 24;
    }
    return (sizeNumber * config.fontSizeScale).toString() + getUnit(size);
});

watch(() => props.modelValue, (newValue) => {
    if (newValue === nowValue.value) return;
    nowValue.value = newValue;
});

onBeforeUnmount(() => {
    isDestroy.value = true;
});

onMounted(() => {
    let t = this;
    isDestroy.value = false;
    
    nextTick(() => {
        let parent = findParent(proxy)
        if(!parent){
            nowValue.value = props.modelValue;
        }
        // if (nowValue.value !== props.unCheckValue) {
        //     pushDataToParent(false);
        // }
    });
});

function boxClick() {
    let pelement = findParent(proxy!);
    /**
     * 点击事件
     */
    emit('click');
    if (_disabled.value) return;
    if (parentVal.value === props.value && pelement != null) return;
    if (_isCheck.value) {
        nowValue.value = props.unCheckValue;
    } else {
        nowValue.value = props.value;
    }

    /**
     * 当前选中的值，等同v-model
     */
    emit('update:modelValue', nowValue.value);
    /**
     * 用户交互切换，选中变换时触发。
     * @param check {boolean} 当前是否选中
     * @param value {number} 当前选中的值
     */
    emit('change', _isCheck.value, nowValue.value);
    if (_isCheck.value) {
        pushDataToParent(true);
    } else {
        removeValue();
    }
}


function setSelected(val: string | number | boolean) {
    if (props.value === val) {
        nowValue.value = props.value;
        
    } else {
        nowValue.value = props.unCheckValue;
    }
}

function pushDataToParent(isChange: boolean) {
    let pelement = findParent(proxy!);
    if (pelement == null) return;
    let parent: InstanceType<typeof tmRadioGroup> = pelement!;
    if (typeof parent?.addItem != 'function') return;
    parent.addItem(nowValue.value, isChange);
}
function removeValue() {
    let pelement = findParent(proxy!);
    if (pelement != null) return;
    let parent: InstanceType<typeof tmRadioGroup> = pelement!;
    if (typeof parent?.removeItem != 'function') return;
    parent.removeItem(props.value);
}
function findParent(parent: any): any {
    if (parent == null) return null;
    if (parent.$parent?.$options?.name == "TmRadioGroup") return parent.$parent;
    let parents = findParent(parent.$parent);
    if (parents?.$options?.name == "TmRadioGroup") return parents;
    return null;
}

watch(parentVal, (newvalue: string | number | boolean) => {
    setSelected(newvalue)
}, { deep: true })

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
    <view :class="[_disabled ? 'checkboxDisabled' : '']" class="checkbox" @click="boxClick">
        <view class="checkboxBox" v-if="!hiddenCheckbox" :style="{
            backgroundColor: _isCheck ? _color : 'transparent',
            border: `1px solid ${_isCheck ? _color : _unCheckColor}`,
            width: _size,
            height: _size
        }">
            <view :class="['checkboxBoxIcon', 'checkboxBoxIcon_' + (_isCheck ? 'on' : 'off')]">
                <tm-icon color="white" :name="icon" :size="iconSize"></tm-icon>
            </view>

        </view>
        <view v-if="_showLabel" class="checkboxLabelBox" :class="[!hiddenCheckbox ? 'checkboxLabelBoxLeftSpace' : '']">
            <!-- 
			 默认文本插槽
			 @binding {boolean} checked - 是否选中
			 -->
            <slot name="label" :checked="_isCheck">
                <tm-text :font-size="labelFontSize" class="checkboxLabel">{{ _label }}</tm-text>
            </slot>
        </view>
    </view>
</template>
<style scoped>
.checkbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    transition-duration: 350ms;
    transition-timing-function: cubic-bezier(.18, .89, .32, 1);
    transition-property: background-color;
}

.checkboxLabelBox {
    flex: 1;
}

.checkboxDisabled {
    opacity: 0.7;
}

.checkboxBoxIcon {
    transition-duration: 350ms;
    transition-timing-function: cubic-bezier(.18, .89, .32, 1);
    transition-property: opacity, transform;
    opacity: 0;
    transform: scale(0);
}

.checkboxBoxIcon_on {
    opacity: 1;
    transform: scale(0.9);
}

.checkboxBoxIcon_off {
    opacity: 0;
    transform: scale(0);
}

.checkboxBox {
    border-radius: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.checkboxLabelBoxLeftSpace {
    padding-left: 20rpx;
}

.checkboxLabel {
    font-size: 28rpx;

}
</style>