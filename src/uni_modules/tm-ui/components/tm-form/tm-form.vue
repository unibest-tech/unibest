<script setup lang="ts">
import { PropType, computed, nextTick, provide, ref } from 'vue';
import { defaultValidator } from "./validator"
import { useTmConfig } from "../../libs/config";
import { deepClone } from '../../libs/tool';

/**
 * @displayName 表单
 * @exportName tm-form
 * @category 表单组件
 * @description 表单组件的校验规则现在统一放到了form组件上，form-item上不再配置校验，主要是方便统一管理校验模块，并且校验函数作了升级处理。
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: "TmForm" });
const { config } = useTmConfig();
const emit = defineEmits([
    /**
     * 提交表单时触发.
     * @param {TM.FORM_SUBMIT_RESULT} result 校验结果
     */
    "submit",
    /**
     * 表单数据时一定要vmodel绑定,当重置时会触发此事件。
     */
    "update:modelValue"
])
const props = defineProps({
    // 表单数据
    modelValue: {
        type: Object as PropType<Record<string, any>>,
        default: () => {
            return {}
        }
    },
    /**
     * 表单校验规则
     * 经过验证后，觉得把form-item的rules属性去掉,直接使用form上统一到一起rules属性,这样就可以不用写form-item了.
     */
    rules: {
        type: Object as PropType<Record<string, Array<TM.FORM_RULE> | TM.FORM_RULE>>,
        default: (): Record<string, Array<TM.FORM_RULE>> => {
            return {}
        }
    },
    /**
     * 方向,子组件的方向会覆盖此处。
     */
    direction: {
        type: String as PropType<"horizontal" | "vertical">,
        default: "horizontal"
    },
    /**
     * 方向,子组件的覆盖此处。
     */
    labelWidth: {
        type: [String, Number],
        default: "160"
    },
    /**
     * 标题字号大小
     */
    labelFontSize: {
        type: [String, Number],
        default: "30"
    },
    /**
     * 标题颜色
     */
    labelFontColor: {
        type: [String],
        default: "#333333"
    },
    /**
     * 间隙，项目之间的间距。
     */
    gap: {
        type: [String, Number],
        default: "10"
    }
})
const ruleCover = (rule: TM.FORM_RULE): TM.FORM_RULE_TYPE => {
    return {
        required: rule?.required ?? false,
        message: rule?.message ?? "请正确认选择/填写",
        validator: rule?.validator ?? null,
        min: rule?.min ?? 1,
        max: rule?.max ?? -1,
        type: rule?.type ?? 'auto',
        rule: rule?.rule ?? null
    }
}
const _rules = computed((): Record<string, Array<TM.FORM_RULE_TYPE>> => {
    let rules: Record<string, Array<TM.FORM_RULE_TYPE>> = {};
    let keys = Object.keys(props.modelValue)
    for (let key in props.rules) {
        if (keys.includes(key)) {
            let item = props.rules[key];
            if (Array.isArray(item)) {
                rules[key] = item.map(item => ruleCover(item))
            } else if (typeof props.rules[key] == 'object' && !Array.isArray(props.rules[key])) {
                rules[key] = [ruleCover(item)]
            }
        }
    }
    return rules
})
const vaildTypeStr = ref('valid')
provide("tmFormModelValue", computed(() => props.modelValue))
provide("tmFormVaildType", computed(() => vaildTypeStr.value))
provide("tmFormDirection", computed(() => props.direction))
provide("tmFormLabelwidth", computed(() => props.labelWidth))
provide("tmFormGap", computed(() => props.gap))
provide("tmFormLabelFontSize", computed(() => props.labelFontSize))
provide("tmFormLabelFontColor", computed(() => props.labelFontColor))
const oldbackValue = deepClone(props.modelValue)
// 被标记的字段
const markedKeys:string[] = []
/**
 * 提交表单
 */
const submit = () => {
    vaildTypeStr.value = ''
    nextTick(() => {
        vaildTypeStr.value = 'valid'
    })
    emit("submit", validate())
}
/**
 * 获取校验结果,不会校验页面.
 * 如果想触发submit事件,并校验页面提示,请使用ref函数submit()而不是此函数方法.
 */
const validate = (): TM.FORM_SUBMIT_RESULT => {
    let result: TM.FORM_SUBMIT_RESULT = {
        //整体是否校验通过
        isPass: true,
        //第一个校验不通过的字段
        firstValid: null,
        //校验结果
        result: []
    }
   
    for (let key of markedKeys) {
        let rules = _rules.value[key]
        if (!rules) continue
        for (let rule of rules) {
            if (!defaultValidator(props.modelValue[key], rule)) {
                result.isPass = false;
                if (result.firstValid == null) {
                    result.firstValid = { key, isPass: false, message: rule.message, data: props.modelValue[key] }
                }
                result.result.push({ key, isPass: false, message: rule.message, data: props.modelValue[key] })
            } else {
                result.result.push({ key, isPass: true, message: '校验通过', data: props.modelValue[key] })
            }
        }
    }
    return result
}
/**
 * 重置表单,数据恢复至最开始的数据.
 */
const reset = () => {
    vaildTypeStr.value = 'reset'
    emit('update:modelValue', deepClone(oldbackValue))
}
/**
 * 单个校验,子组件用。(外部请不要使用.)
 */
const _validate = (name: string, value: any): { validate: boolean, message: string } | boolean => {
    let rules = _rules.value[name]
    if (!rules) return true
    for (let rule of rules) {
        if (!defaultValidator(value, rule)) {
            return { validate: false, message: rule.message }
        }
    }
    return true
}

const _setMarker = (name:string,isvisibl:boolean)=>{
	let index = markedKeys.findIndex((el)=>el==name);
    
	if(isvisibl){
		if(index==-1){
			markedKeys.push(name)
		}
	}else{
		if(index>-1){
			markedKeys.splice(index,1)
		}
	}
}

defineExpose({
    submit,
    validate,
    reset,
    _validate,
	_setMarker
})

</script>
<template>
    <view class="tmForm">
        <!-- 
        @slot 表单默认插槽,可以不是直接form-item直接子节点,可以根据自己需要随意布局,只要form-item在里面即可.
         -->
        <slot></slot>
    </view>
</template>
<style scoped>

</style>