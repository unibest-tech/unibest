<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, PropType, provide, ref, watch } from 'vue'
import { arrayNumber, getUid } from '../../libs/tool'
import { useTmConfig } from '../../libs/config'

/**
 * @displayName 单选框组
 * @exportName tm-radio-group
 * @page tm-radio
 * @category 表单组件
 * @description 可单单独使用,也可多选组合使用
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmRadioGroup' });
const { config } = useTmConfig()

const props = defineProps({
    modelValue: {
        type: [String, Number, Boolean],
        default: "",
    },
    direction: {
        type: String as PropType<"row" | "column">,
        default: "row",
    },
    align: {
        type: String as PropType<"flex-start" | "center" | "flex-end">,
        default: "left"
    },
    /**
     * 排列时之间的间隙，如果是数组第一项是列间隙，第二项是行间隙
     */
    gap: {
        type: [Number, String, Array<string | number>],
        default: 20,
    }
});

const emits = defineEmits(['change', 'update:modelValue']);

const checkvaluelist = ref<string | number | boolean>("");
const isDestroy = ref(false);
const id = "tmRadioGroup-" + getUid();

const _max = 1
const _gap = computed(() => arrayNumber(props.gap).join(" "))
watch(() => props.modelValue, (newValue) => {
    checkvaluelist.value = newValue;

});

onBeforeUnmount(() => {
    isDestroy.value = true;
});

onMounted(() => {
    checkvaluelist.value = props.modelValue;
    isDestroy.value = false;
});

function addItem(item: string | number | boolean, ischange: boolean) {
    checkvaluelist.value = item
    if (ischange) {
        emits("update:modelValue", checkvaluelist.value);
        emits("change", checkvaluelist.value);
    }
}

function removeItem(item: string | number | boolean) {
    if (checkvaluelist.value !== item) {
        checkvaluelist.value = item;
        emits("update:modelValue", checkvaluelist.value);
        emits("change", checkvaluelist.value);
    }

}

provide("tmRadioGroupValue", computed(() => checkvaluelist.value))

defineExpose({ addItem, removeItem })
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
    <view class="tmCheckboxGroup"
        :style="{ 'flex-direction': direction, 'align-items': direction == 'row' ? 'flex-start' : undefined, 'justify-content': align, gap: _gap }">
        <slot></slot>
    </view>
</template>

<style>
.tmCheckboxGroup {
    display: flex;
    flex-wrap: wrap;
}
</style>
