<script setup lang="ts">
import { ref, watch, provide, onBeforeMount, PropType, computed } from 'vue'
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, linearValid, getUnit, getUid } from "../../libs/tool";
import { useTmConfig } from "../../libs/config";
import { getDefaultColor, setTextColorLightByDark, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";

/**
 * @displayName 折叠面板
 * @exportName tm-collapse
 * @category 展示组件
 * @description 可单，可多开,内部可放置tm-collapse-item子节点组件,动画采用了新css,兼容性请看这里:[点我](https://caniuse.com/?search=grid-template-rows)
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmCollapse' });

const { config } = useTmConfig()


const props = defineProps({
    /**
     * 当前子项值。可v-model,类型兼容性高,因此不管你提供的是不是数组,最终同步时会被设置成数组
     */
    modelValue: {
        type: [Array<string | number>, String, Number],
        default: (): string[] => [] as string[]
    },
    /**
     * 是否允许打开多个。
     */
    multiple: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits([
    /**
     * 变换时触发
     * @param {String[]} value - 当前打开的值
     */
    'change',
    'update:modelValue'
])


const activeName = ref<Array<string | number>>([])

onBeforeMount(() => {
    toggleActivate(props.modelValue)
})

provide('tmCollapseDefaultName', computed((): Array<string | number> => activeName.value))

watch(() => props.modelValue, (newValue: Array<string | number> | string | number) => {
    if(newValue == activeName.value.join('')) return;
    if(Array.isArray(newValue)){
        if(newValue.join('') == activeName.value.join('')) return;
    }
    toggleActivate(newValue)
})
/**
 * 切换选中
 */
const toggleActivate = (name: Array<string | number> | string | number, isEmits = false) => {
    let ar = [] as Array<string | number>
    if (Array.isArray(name)) {
        ar = name
    } else if(name !==''&&name!=undefined&&name!=null) {
        ar = [name]
    }
    
    if (ar.length == 0) {
        activeName.value = []
    } else {
        if (props.multiple) {
            let diff = activeName.value.filter((item: string | number) => {
                return ar.indexOf(item) == -1
            })
            let diffname = ar.filter((item: string | number) => {
                return activeName.value.indexOf(item) == -1
            })
            activeName.value = [...diff, ...diffname].slice(0)
        } else {
            if (activeName.value.indexOf(ar[0]) != -1) {
                activeName.value = []
            } else {
                activeName.value = [ar[0]]
            }
        }
    }
    
    if (isEmits) {
        let covervalue:string|number|Array<string|number> = activeName.value.slice(0)
        emit('update:modelValue', covervalue)
        emit('change', covervalue)
    }
}

defineExpose({ toggleActivate })

</script>
<template>
    <view>
        <!-- 
		@slot 默认插槽，可放置tm-collapse-item子节点 
		 -->
        <slot></slot>
    </view>
</template>
<style scoped></style>