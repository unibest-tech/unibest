<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, PropType, getCurrentInstance, ComponentInstance, onUpdated, nextTick, VueElement, inject } from 'vue';
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit, getUid } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
import pickerItem from './picker-item.vue';
type TM_PICKER_X_ITEM = Record<string, any>
type TM_PICKER_ITEM_INFO = Record<string, any>
const proxy = getCurrentInstance()?.proxy ?? null;

/**
 * @displayName 选择器容器
 * @exportName tm-picker-view
 * @category 表单组件
 * @description 可单列或者多列
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmPickerView' });
const { config } = useTmConfig()
const nowValue = ref<Array<string | number>>([])
const _modelValueIndex = ref<Array<number>>([])
const tid = ref(0)
const emits = defineEmits([
    /**
     * 选项变化时触发
     * @param {string[]} ids - 当前选中项的id
     */
    'change',
    /**
     * 等同v-model:model-str
     * 只对外输出当前回选区的选中项的文本，不要外部改变此值。
     */
    'update:modelStr',

    'update:modelValue'

])


const props = defineProps({

    /**
     * 数据项
     * 格式类型为：PICKER_ITEM_INFO
     */
    list: {
        type: Array as PropType<TM_PICKER_ITEM_INFO[]>,
        default: (): TM_PICKER_ITEM_INFO[] => [] as TM_PICKER_ITEM_INFO[]
    },
    /**
     * 当前选中项的id值
     */
    modelValue: {
        type: Array<string|number>,
        default: (): string[] => [] as string[]
    },
    /**
     * 当前选中项的标题文本组
     */
    modelStr: {
        type: String,
        default: ""
    },
    /**
     * 显示在顶部的单位名称
     */
    cellUnits: {
        type: Array as PropType<string[]>,
        default: (): string[] => [] as string[]
    },
    /**
     * 项目的字体号大小
     */
    fontSize: {
        type: String,
        default: "32"
    },
    /**
     * 自定义标识id
     */
    rangKey: {
        type: String,
        default: "id"
    },
    /**
     * 自定义标识文本字段名
     */
    rangText: {
        type: String,
        default: "title"
    }
})

const _cellUnits = computed(() => props.cellUnits)
const _list = computed(() => props.list)
const _nowShowList = ref<Record<string,any>[][]>([])
const _maxDeep = computed(() => {
    if (_list.value.length == 0) return 0;
    function getdiepWidth(list: TM_PICKER_X_ITEM[]): number {
        let deepIndex = 1;
        const node = list[0];
        if (node?.children?.length > 0) {
            deepIndex += getdiepWidth(node.children);
        }
        return deepIndex;
    }
    return getdiepWidth(_list.value.slice(0));
})


const oninitFun = () => {
    nowValue.value = props.modelValue.slice(0)
    let currneinexs = getIndexsByids(nowValue.value).indexs;
    _modelValueIndex.value =  nowValue.value.length==0||currneinexs.length==0?new Array(_maxDeep.value).fill(0):currneinexs;
    const {data,strs,ids} = getIdsByindexs(_modelValueIndex.value)
    _nowShowList.value = data.slice(0)
    if(nowValue.value.length==0){
        nowValue.value  = ids.slice(0)
       nextTick(()=>{
        emits('update:modelStr', strs.join(","))
        emits('update:modelValue', ids.slice(0))
      
       })

    }
   
    
}
const change = (ixs: number[]) => {
    
    const {ids,data,strs} = getIdsByindexs(ixs)
    _modelValueIndex.value = getIndexsByids(ids).indexs;
    _nowShowList.value = data.slice(0)
    nowValue.value = ids;
    
    /**
     * 等同v-model
     */
    emits('update:modelValue', ids.slice(0))
    emits('update:modelStr', strs.join(","))

    if (strs.join('') == props.modelValue.join('')) return;
    emits('change', ids.slice(0))
}


// 根据id返回索引
const getIndexsByids = (ids:Array<string|number>):{indexs:Array<number>,data:TM_PICKER_X_ITEM[][],strs:string[]}=> {
    let index = 0;
    let val = ids.slice(0)
    let indexs = [] as number[]
    let data = [] as TM_PICKER_X_ITEM[][]
    let strs = [] as string[]

    if(_list.value.length==0||ids.length==0) return {indexs:[],data:[],strs:[]}

    function getIndex(nodes: TM_PICKER_X_ITEM[]) {
        if (val.length <= index || val.length == 0) return;
        let id = val[index]
        let sindex = 0
        for (let i = 0; i < nodes.length; i++) {
            let item = nodes[i]
            if (item[props.rangKey] == id) {
                sindex = i;
                indexs.push(sindex)
                data.push(nodes)
                strs.push(item[props.rangText])
                if (item?.children?.length > 0) {
                    index += 1
                    getIndex(item.children)
                }
            }
        }
    }
    getIndex(_list.value)
    return {indexs,data,strs}
}
//根据索引返回ids
const getIdsByindexs = (indexs:number[]):{ids:Array<string|number>,data:TM_PICKER_X_ITEM[][],strs:string[]} => {
    let ids = [] as string[]
    let data = [] as TM_PICKER_X_ITEM[][]
    let index = 0;
    let val = indexs.slice(0)
    let strs = [] as string[]
    
    if(_list.value.length==0||indexs.length==0) return {ids:[],data:[],strs:[]}
    function getIds(nodes: TM_PICKER_X_ITEM[]) {
        if (val.length <= index || val.length == 0) return;
        let currentsIndex = val[index]
        let id = ''
        let str = ''
        let children = [];
        if(nodes.length-1 >= currentsIndex){
            id = nodes[currentsIndex][props.rangKey]
            str = nodes[currentsIndex][props.rangText]
            children = nodes[currentsIndex]?.children??[]
        }else{
            id = nodes[0][props.rangKey]
            str = nodes[0][props.rangText]
            children = nodes[0]?.children??[]
        }
        ids.push(id)
        data.push(nodes)
        strs.push(str)

        if(children.length>0){
            index += 1
            getIds(children)
        }
    }
    getIds(_list.value)
    return {ids,data,strs};
}

const getNowCurrent = ()=>{
    return  getIdsByindexs(_modelValueIndex.value)
}
// 获取相关数据。



onMounted(() => {
    oninitFun();
    uni.$on('onResize', oninitFun)
})
onBeforeUnmount(() => {
    clearTimeout(tid.value);
    uni.$off('onResize', oninitFun)
})
watch(() => props.modelValue, (newValue: Array<string | number>) => {
    if (newValue.join('') == nowValue.value.join('')) return;
    nowValue.value = newValue.slice(0);
    
    let defauleindexs =  nowValue.value.length==0?new Array(_maxDeep.value).fill(0):getIndexsByids(nowValue.value).indexs;
    _modelValueIndex.value = defauleindexs;

    const {data,strs} = getIdsByindexs(_modelValueIndex.value)
    _nowShowList.value = data.slice(0)
    emits('update:modelStr', strs.join(","))


}, { deep: true })

watch(() => props.list, (newValue) => {
    oninitFun()
}, { deep: true })

defineExpose({getIndexsByids,getIdsByindexs,getNowCurrent,onInit:oninitFun})

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
    <view class="tmPickerView">
        <picker-item :rangKey="props.rangKey" :rangText="props.rangText" 
            :font-size="props.fontSize" :cellUnits="_cellUnits" @changeDeep="change"
            :selectedIndex="_modelValueIndex" :list="_nowShowList"
            class="tmPickerViewItem"></picker-item>
    </view>
</template>
<style scoped>
.tmPickerView {
    
}
</style>