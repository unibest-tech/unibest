<script setup lang="ts">
import {computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, PropType, ref, watch} from 'vue';
import {useTmConfig} from "../../libs/config";
import TmForm from '../tm-form/tm-form.vue';
import {covetUniNumber} from '../../libs/tool';
import {getDefaultColor} from '../../libs/colors';

/**
 * @displayName 表单子组件
 * @exportName tm-form-item
 * @category 表单组件
 * @page tm-form
 * @description 表单组件的校验规则现在统一放到了form组件上，form-item上不再配置校验，主要是方便统一管理校验模块，并且校验函数作了升级处理。
 * @constant 平台兼容
 *    | H5 | uniAPP | 小程序 | version |
 | --- | --- | --- | --- |
 | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({name: "TmFormItem"});
const {config} = useTmConfig();

const props = defineProps({
    /**
     * 表单字段唯一标识。
     */
    name: {
        type: String,
        default: '',
        required: true
    },
    /**
     * 必款时的符号，如果为false，或者空则不显示
     */
    required: {
        type: [String, Boolean],
        default: "*"
    },
    /**
     * 表单标题
     */
    label: {
        type: [String],
        default: ""
    },
    /**
     * 方向，这里会覆盖form父上的方向值。
     */
    direction: {
        type: String as PropType<"horizontal" | "vertical">,
        default: ""
    },
    /**
     * 方向,里会覆盖form父上的值。
     */
    labelWidth: {
        type: [String, Number],
        default: ""
    },
    showLabel: {
        type: Boolean,
        default: true
    },
    showBottom: {
        type: Boolean,
        default: true
    },
    /**
     * 标题字号大小，会覆盖父form值
     */
    labelFontSize: {
        type: [String, Number],
        default: ""
    },
    /**
     * 标题颜色，会覆盖父form值
     */
    labelFontColor: {
        type: [String],
        default: ""
    },
    /**
     * 标题颜色，会覆盖父form值
     */
    bottomGap: {
        type: [String, Number],
        default: ""
    },

})
const proxy = getCurrentInstance()?.proxy
let tid = 0;
const isPass = ref<boolean | null>(null)
const errorMessage = ref<string | null>(null)

const tmFormModelValue = inject("tmFormModelValue", computed((): Record<string, any> => {
    return {}
}))
const tmFormVaildType = inject("tmFormVaildType", computed(() => ''))
const tmFormDirection = inject("tmFormDirection", computed(() => ''))
const tmFormLabelwidth = inject("tmFormLabelwidth", computed(() => ''))
const tmFormGap = inject("tmFormGap", computed(() => '0'))
const tmFormLabelFontSize = inject("tmFormLabelFontSize", computed(() => '30'))
const tmFormLabelFontColor = inject("tmFormLabelFontColor", computed(() => '#333333'))
const _tmFormGap = computed(() => props.bottomGap == '' ? covetUniNumber(tmFormGap.value) : covetUniNumber(props.bottomGap))
const _tmFormDirection = computed(() => {
    if (props.direction) return props.direction
    if (tmFormDirection.value) return tmFormDirection.value
    return "horizontal"
})
const _labelWidth = computed(() => {
    if (props.labelWidth) return covetUniNumber(props.labelWidth)
    if (tmFormLabelwidth.value) return covetUniNumber(tmFormLabelwidth.value)
    return "190rpx"
})
const _tmFormLabelFontSize = computed(() => {
    if (props.labelFontSize) return covetUniNumber(props.labelFontSize)
    if (tmFormLabelFontSize.value) return covetUniNumber(tmFormLabelFontSize.value)
    return "30rpx"
})
const _tmFormLabelFontColor = computed(() => {
    if (props.labelFontColor) return getDefaultColor(props.labelFontColor)
    if (tmFormLabelFontColor.value) return getDefaultColor(tmFormLabelFontColor.value)
    return "#333333"
})

const _required = computed(() => props.required)
const _label = computed(() => props.label)
const _showLabel = computed(() => props.showLabel)
const _showBottom = computed(() => props.showBottom)
const isFirstVaild = ref(true)
watch(() => tmFormModelValue.value?.[props.name], (val: any, oldVal: any) => {
    if (tmFormVaildType.value != 'valid') return
    if (isFirstVaild.value) {
        isFirstVaild.value = false;
        return
    }
    // 判断是不是本值变动了。
    let new_val = val
    let old_val = oldVal
    if (Array.isArray(new_val) && Array.isArray(old_val)) {
        if (new_val.length == old_val.length) return
    } else if (old_val !== undefined && new_val !== undefined && new_val !== null && old_val !== null) {
        if (new_val === old_val) return
    }
    clearTimeout(tid)
    tid = setTimeout(() => {
        _validFun(val)
    }, 200);
}, {deep: true})

watch(tmFormVaildType, (val: string) => {
    if (val == 'reset' || val == '') {
        isPass.value = null;
        errorMessage.value = null;
    }
    if (val == 'valid') {
        let value = tmFormModelValue.value[props.name]
        if (typeof value !== 'undefined') {
            _validFun(value)
        }
        isFirstVaild.value = false;

    }
})

const _validFun = (val: any) => {
    if (!proxy) return;
    let parent = findParent(proxy)
    if (!parent) return;
    let ele = parent! as InstanceType<typeof TmForm>
    let valid = ele._validate(props.name, val)
    if (typeof valid == 'boolean') {
        if (valid) {
            isPass.value = true;
            errorMessage.value = null;
        }
        return;
    }
    if (!valid.validate) {
        isPass.value = false;
        errorMessage.value = valid.message;
    } else {
        isPass.value = true;
        errorMessage.value = null;
    }
}

const setVisibled = (isvisible = true) => {
    if (!proxy) return;
    let parent = findParent(proxy)
    if (!parent) return;
    let ele = parent! as InstanceType<typeof TmForm>

    ele._setMarker(props.name, isvisible)
}

function findParent(parent: any): any {
    if (parent == null) return null;
    if (parent.$parent?.$options?.name == "TmForm") return parent.$parent;
    let parents = findParent(parent.$parent);
    if (parents?.$options?.name == "TmForm") return parents;
    return null;
}

onMounted(() => {
    setVisibled(true)
})
onBeforeUnmount(() => {
    clearTimeout(tid)
    setVisibled(false)
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
    <view class="tmFormItem" :style="{ marginBottom: _tmFormGap }">
        <view :class="[_tmFormDirection == 'horizontal' ? 'tmFormItemWrapRow' : 'tmFormItemWrapCol']"
              class="tmFormItemWrap">

            <view v-if="_showLabel" class="tmFormItemLabel"
                  :style="{ width: _tmFormDirection == 'horizontal' ? _labelWidth : 'auto', fontSize: _tmFormLabelFontSize, color: _tmFormLabelFontColor }">
                <text class="tmFormRequired" v-if="_required">{{ _required }}</text>
                <slot name="label">
                    {{ _label }}
                </slot>
            </view>
            <view class="tmFormItemWrapContent">
                <!-- 
                @slot 表单默认插槽,可以不是直接form-item直接子节点,可以根据自己需要随意布局,只要form-item在里面即可.
                -->
                <slot></slot>
            </view>
        </view>
        <view class="tmFormError" v-if="errorMessage && !isPass">
            {{ errorMessage }}
        </view>
        <view v-if="_showBottom" :style="{ marginTop: _tmFormGap, height: '1px', backgroundColor: '#f5f5f5' }"></view>
    </view>
</template>
<style scoped>
.tmFormItemWrapRow {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
}

.tmFormItemLabel {
    flex-shrink: 0;

}


.tmFormItemWrapContent {
    flex: 1;
}

.tmFormRequired {
    color: red;
    font-size: 12px;
    margin-right: 5px;
}

.tmFormError {
    color: red;
    font-size: 12px;
    margin-top: 4px;
}
</style>