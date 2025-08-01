<script lang="ts" setup>
import { ref, computed, onMounted, watch, PropType, nextTick } from 'vue';
import tmPickerView from '../tm-picker-view/tm-picker-view.vue';
type TM_PICKER_X_ITEM = Record<string, any>
type TM_PICKER_ITEM_INFO = Record<string, any>
const pickerView = ref<InstanceType<typeof tmPickerView> | null>(null)
/**
 * @displayName 选择器
 * @exportName tm-picker
 * @category 表单组件
 * @description 可单列或者多列
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmPicker' });

const props = defineProps({
    /**
     * 数据
     */
    list: {
        type: Array as PropType<TM_PICKER_ITEM_INFO[]>,
        default: (): TM_PICKER_ITEM_INFO[] => [] as TM_PICKER_ITEM_INFO[]
    },
    /**
     * 当前选中项的id值
     */
    modelValue: {
        type: [Array<string | number>],
        default: (): string[] => [] as string[]
    },
    /**
     * 当前选中项的回显文本等同v-model:model-str
     * 请不要更改此值，此值只对外输出显示。
     * 如果空值，将内部首次递归渲染回显文本。如果你后台返回，就不会计算。
     * 因此如果对性能有要求的请务必让后台在首次显示时先回显文本，
     * 这样内部在第一次时不会递归计算回显文本，提高性能。
     */
    modelStr: {
        type: String,
        default: ""
    },
    /**
     * 当前打开的状态。
     * 等同v-model:model-show
     */
    modelShow: {
        type: Boolean,
        default: false
    },
    /**
     * 顶部标题
     */
    title: {
        type: String,
        default: "请选择"
    },
    /**
     * 是否懒加载内部内容。
     * 当前你的列表内容非常多，且影响打开的动画性能时，请务必
     * 设置此项为true，以获得流畅视觉效果。如果选择数据较少没有必要打开
     */
    lazyContent: {
        type: Boolean,
        default: false
    },
    /**
     * 显示在顶部的单位名称
     */
    cellUnits: {
        type: Array as PropType<string[]>,
        default: (): string[] => [] as string[]
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
    },
	showClose:{
		type:Boolean,
		default:false
	},
	/**
	 * 是否禁用弹层
	 */
	disabled: {
	    type: Boolean,
	    default: false
	},
});

const emit = defineEmits([
    /**
     * 取消时触发
     */
    'cancel',
    /**
     * 确认触发
     * @param {string[]} ids 当前选中项的id值
     */
    'confirm',
    /**
     * 滑动变换时触发
     * @param {string[]} ids 当前选中项的id值
     */
    'change',
    /**
     * 变量控制打开状态
     * 等同v-model:model-show
     */
    'update:modelShow',
    /**
     * 等同v-model:model-str
     * 只对外输出当前回选区的选中项的文本，不要外部改变此值。
     */
    'update:modelStr',
    'update:modelValue'
]);

const show = ref(false);
const nowValue = ref<Array<string | number>>([]);
const modelStrValue = ref("");
const yanchiDuration = ref(false);
const _disabled = computed(() => props.disabled)
const _list = computed(() => props.list.slice(0));
const _lazyContent = computed(() => props.lazyContent);
const _cellUnits = computed(() => props.cellUnits);
watch(() => props.modelValue, (newvalue: Array<string | number>) => {
    if (newvalue.join('') == nowValue.value.join('')) return;
    nowValue.value = newvalue.slice(0);

    if (newvalue.length > 0 && _list.value.length > 0) {
        const { strs } = getIndexsByids(props.modelValue);
        emit('update:modelStr', strs.join(','));
        modelStrValue.value = strs.join(',');
       
    }
});

watch(() => props.modelShow, (newValue: boolean) => {
    if (newValue == show.value) return;
    show.value = newValue;
});

watch(_list, () => {
    if (show.value) {
        return;
    }
    if (_list.value.length == 0) {
        emit('update:modelStr', '');
        modelStrValue.value = '';
        return;
    }
    if (_list.value.length > 0) {
        onSetDefaultStr();
    }
});

onMounted(() => {
    nowValue.value = props.modelValue.slice(0);
    yanchiDuration.value = _lazyContent.value ? false : true;
    onSetDefaultStr();
});

function onSetDefaultStr() {
    
    if (props.modelStr == "" && _list.value.length > 0 ) {
        const { strs } = getIndexsByids(props.modelValue);
        
        emit('update:modelStr', strs.join(','));
        modelStrValue.value = strs.join(',');
        
    }
}

function openShow() {
	if(_disabled.value) return;
    show.value = true;
    emit('update:modelShow', true);
}

function onClose() {
    emit('update:modelShow', false);
    nowValue.value = props.modelValue.slice(0);
    if (_lazyContent.value) {
        yanchiDuration.value = false;
    }
}

function strChange(str: string) {
    modelStrValue.value = str;
    
}

function onOpen() {
    yanchiDuration.value = true;
   
}

function mchange(ids: string[]) {
    emit('change', ids.slice(0));
}

function onCancel() {
    emit('cancel');
    nowValue.value = props.modelValue.slice(0);
}

function onConfirm() {
    let ids = nowValue.value.slice(0);
    let str = [] as string[]
   if(ids.length==0){
    const temp = getNowCurrent();
    ids = temp.ids
    str = temp.strs
   }else{
    const temp = getIndexsByids(ids)
    str = temp.strs

   }

    nowValue.value = ids;
    modelStrValue.value = str.join(',');
    emit('update:modelValue', ids);
    emit('update:modelStr', modelStrValue.value);
    emit('confirm', ids);
}

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
const getNowCurrent = ()=>{
    nowValue.value = props.modelValue.slice(0)
    let currneinexs = getIndexsByids(nowValue.value).indexs;
    let dinexs =  nowValue.value.length==0||currneinexs.length==0?new Array(_maxDeep.value).fill(0):currneinexs;
    return  getIdsByindexs(dinexs)
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
<template>
    <view @click="openShow">
        <!-- 
		 @slot 插槽,默认触发打开选择器。你的默认布局可以放置在这里。
		 @binding {boolean} show - 控制打开关闭状态
		 -->
        <slot></slot>
    </view>
    <tm-drawer :show-close="showClose" @open="onOpen" :widthCoverCenter="true" :disabledScroll="true" max-height="80%" size="850" :title="title"
        @close="onClose" @confirm="onConfirm" @cancel="onCancel" :showFooter="true" v-model:show="show"
        >
        <tm-picker-view v-if="show" ref="pickerView" :rangKey="rangKey" :rangText="rangText" :cell-units="_cellUnits"
            @update:modelStr="strChange" @change="mchange" v-model="nowValue" :list="_list"></tm-picker-view>
    </tm-drawer>
</template>
<style scoped></style>