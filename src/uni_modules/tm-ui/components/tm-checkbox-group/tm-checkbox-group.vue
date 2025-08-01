<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, PropType, getCurrentInstance, ComponentInstance, onUpdated, nextTick, provide } from 'vue';
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit, getUid } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
import { onPageScroll } from '@dcloudio/uni-app';
import tmCheckbox from '../tm-checkbox/tm-checkbox.vue';

/**
 * @displayName 多选框组
 * @exportName tm-checkbox-group
 * @page tm-checkbox
 * @category 表单组件
 * @description 可单单独使用,也可多选组合使用
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmCheckboxGroup' });
const { config } = useTmConfig()

const props = defineProps({
    modelValue: {
        type: [Array<string | number | boolean>],
        default: () => [] as string[],
    },
    direction: {
        type: String as PropType<"row" | "column">,
        default: "row",
    },
    align: {
        type: String as PropType<"flex-start" | "center" | "flex-end">,
        default: "left"
    },
    max: {
        type: Number,
        default: -1,
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

const checkvaluelist = ref<Array<string | number | boolean>>([]);
const isDestroy = ref(false);
const id = "tmCheckboxGroup-" + getUid();

const _max = computed(() => props.max);
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
    let index = checkvaluelist.value.findIndex((el) => el === item);
    if (index == -1) {
        if (checkvaluelist.value.length >= _max.value && _max.value > -1 && ischange && checkvaluelist.value.length > 0) {
            // uni.showToast({ title: "已是最大选择数量", icon: 'none', mask: true });
            checkvaluelist.value.splice(checkvaluelist.value.length - 1, 1);
        }
        checkvaluelist.value.push(item)
    } else {
        checkvaluelist.value.splice(index, 1);
    }

    if (ischange) {
        emits("update:modelValue", checkvaluelist.value.slice(0));
        emits("change", checkvaluelist.value.slice(0));
    }
}

function removeItem(item: string | number | boolean) {
    let index = checkvaluelist.value.findIndex((el) => el === item);
    if (index > -1) {
        checkvaluelist.value.splice(index, 1);
        emits("update:modelValue", checkvaluelist.value.slice(0));
        emits("change", checkvaluelist.value.slice(0));
    }

}

provide("tmCheckboxGroupValue", computed(() => checkvaluelist.value.slice(0)))

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
