<script setup lang="ts">
import { computed, ref, useSlots, onMounted, watch, onBeforeUnmount } from "vue";
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, linearValid, getUnit } from "../../libs/tool";
import { useTmConfig } from "../../libs/config";
import { getDefaultColor, setTextColorLightByDark, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";

interface xPickerSelectedListyType {
    id: any;
    title: string
}

/**
 * @displayName 搜索选择
 * @exportName tm-picker-selected
 * @category 常用组件
 * @description 弹层式大数据列表筛选，搜索。可异步加载数据。可针对本地搜索及异步搜索加载数据，虚拟列表支持。
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmPickerSelected' });

const { config } = useTmConfig()

const props = defineProps({
    /**
     * 当前选中的数据，any数组string[],number[]
     * 否则报错，无法运行。
     */
    modelValue: {
        type: [Array<string | number>],
        default: () => []
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
     * 回显当前选中的文本，只输出
     * 等同v-model:model-str
     */
    modelStr: {
        type: [Array<string[]>],
        default: () => []
    },
    /**
     * 顶部标题
     */
    title: {
        type: String,
        default: "请选择"
    },
    /**
     * 搜索的字段名称
     */
    filterKey: {
        type: String,
        default: "text"
    },
    /**
     * 显示文本的字段
     */
    labelKey: {
        type: String,
        default: "text"
    },
    /**
     * 列表字段的唯一标识
     * 注意它的数据是number类型.
     */
    idKey: {
        type: String,
        default: "id"
    },
    /**
     * 数据列表。
     */
    list: {
        type: [Array<Record<string, any>>],
        default: () => []
    },
    /**
     * 默认采用本地对list的结果集进行筛选搜索。
     * 如果禁用，你可以自行通过search事件来搜索
     * 并赋值给list更新结果。
     */
    localSearch: {
        type: Boolean,
        default: true
    },
    /**
     * 是否允许多选
     */
    multiple: {
        type: Boolean,
        default: true
    },
    /**
     * 是否懒加载内部内容。
     * 当前你的列表内容非常多，且影响打开的动画性能时，请务必
     * 设置此项为true，以获得流畅视觉效果。
     */
    lazyContent: {
        type: Boolean,
        default: false
    },
    /**
     * lazyContent的延迟时间 单位 ms
     * 如果你的 app效果不行，请加大此值
     */
    lazyDuration: {
        type: Number,
        default: 100
    },
	/**
	 * 是否禁用弹层
	 */
	disabled: {
	    type: Boolean,
	    default: false
	},
})

const emit = defineEmits([
    /**
     * 搜索时触发
     * @param {string} keyword - 搜索的关键词
     */
    'search',
    /**
     * 确认选择时触发
     * @param {Array<string|number>} ids - 选中的ids结果集
     * @param {Array<Record<string,any>>} data - 选中的数据结果集
     */
    'confirm',
    /**
     * 取消搜索时触发
     */
    'cancel',
    /**
     * 显示弹层时触发，可以用来在此第一次加载list异步数据。
     */
    'open',
    /**
     * 变量控制打开状态等同v-model:model-show
     */
    'update:modelShow',
    /**
     * 自动回显文本数组，此属性只对外输出。
     */
    'update:modelStr',

    'update:modelValue'
])

const show = ref(false)
const nowValue = ref<xPickerSelectedListyType[]>([])
const searchList = ref<xPickerSelectedListyType[]>([])
const searchKey = ref("")
const duration = ref(60)
const yanchiDuration = ref(false)
const tid = ref<number>(100)

const _lazyContent = computed((): boolean => {
    return props.lazyContent
})
const _disabled = computed(() => props.disabled)
const _renderListData = computed((): xPickerSelectedListyType[] => {
    if (searchList.value.length > 0 && props.localSearch) return searchList.value
    return _list.value
})

const _list = computed((): xPickerSelectedListyType[] => {
    return props.list!.map((el): xPickerSelectedListyType => {
        return {
            id: el[props.idKey],
            title: el[props.labelKey]
        } as xPickerSelectedListyType
    })
})

const _color = computed((): string => {
    return getDefaultColor(config.color)
})

const _isDark = computed((): boolean => {
    return config.mode == 'dark'
})

const _borderColor = computed((): string => {
    if (config.mode == 'dark') return config.borderDarkColor
    return '#f5f5f5'
})

const _inputBgColor = computed((): string => {
    if (config.mode == 'dark') return config.inputDarkColor
    return '#f5f5f5'
})

const _inputColor = computed((): string => {
    if (config.mode == 'dark') return "#fff"
    return "#333"
})

const updateModelStr = () => {
    let strs = nowValue.value.map((el): string => el.title)
    emit('update:modelStr', strs)
}

const onclik = (item: xPickerSelectedListyType) => {
    if (!props.multiple) {
        let index = nowValue.value.findIndex((el): boolean => el.id == item.id)
        nowValue.value = index > -1 ? [] : [item]
    } else {
        let index = nowValue.value.findIndex((el): boolean => el.id == item.id)
        if (index > -1) {
            nowValue.value.splice(index, 1)
        } else {
            nowValue.value.push(item)
        }
    }
}

const isSelected = (item: xPickerSelectedListyType): boolean => {
    let index = nowValue.value.findIndex((el): boolean => el.id == item.id)
    return index > -1
}

const inpuEvent = (evt: InputEvent) => {
    // @ts-ignore
    searchKey.value = evt.detail.value
    if (searchKey.value.trim() == '') {
        inputConfirm()
    }
}

const clearSearchKey = () => {
    searchKey.value = ""
    inputConfirm()
}

const inputConfirm = () => {
    if (props.localSearch) {
        searchList.value = []
        let templist = _list.value.filter((el): boolean => {
            return el.title.indexOf(searchKey.value.trim()) > -1
        })
        searchList.value = templist.slice(0)
        if (searchList.value.length == 0) {
            uni.showToast({ title: '没有结果', icon: 'none' })
        }
        return
    }
    emit('search', searchKey.value.trim())
}

const openShow = () => {
	if(_disabled.value) return;
    show.value = true
    emit('update:modelShow', true)
    emit('open')
}

const onClose = () => {
    emit('update:modelShow', false)
    if (_lazyContent.value) {
        yanchiDuration.value = false
    }
}

const onOpen = () => {
    // @ts-ignore
    tid.value = setTimeout(function () {
        yanchiDuration.value = true
    }, props.lazyDuration)

}

const onCancel = () => {
    emit('cancel')
    nowValue.value = idsToxPickerSelectedListyTypeAr(props.modelValue)
    updateModelStr()
}

const idsToxPickerSelectedListyTypeAr = (ids: any[]): xPickerSelectedListyType[] => {
    let fts = props.list!.filter((el): boolean => {
        return ids.includes(el[props.idKey])
    })
    let templist = fts!.map((el): xPickerSelectedListyType => {
        return {
            id: el[props.idKey],
            title: el[props.labelKey]
        } as xPickerSelectedListyType
    })
    return templist.slice(0)
}

const onConfirm = () => {
    let ids = nowValue.value.map((el): any => el.id)
    let fts = nowValue.value!.filter((el: xPickerSelectedListyType): boolean => {
        return ids.includes(el.id)
    })
    let strs = fts.map((el: xPickerSelectedListyType): string => el.title)
    emit('confirm', ids, strs)
    emit('update:modelValue', ids)
    updateModelStr()
}

const clearAll = () => {
    nowValue.value = []
}

const selectedAll = () => {
    let temp = _list.value.slice(0)
    if (_list.value.length > 0) {
        if (props.multiple) {
            nowValue.value = temp
        } else {
            nowValue.value = [temp[0]]
        }
    }
}


watch(() => props.modelValue, (newvalue: any[]) => {
    if (newvalue.join("") == nowValue.value.join("")) return
    nowValue.value = idsToxPickerSelectedListyTypeAr(props.modelValue)
    updateModelStr()
})

watch(() => _list.value, () => {
    nowValue.value = idsToxPickerSelectedListyTypeAr(props.modelValue)
    updateModelStr()
})

watch(() => props.modelShow, (newValue: boolean) => {
    if (newValue == show.value) return
    show.value = newValue
})


onMounted(() => {
    nowValue.value = idsToxPickerSelectedListyTypeAr(props.modelValue)
    updateModelStr()
    yanchiDuration.value = _lazyContent.value ? false : true
})

onBeforeUnmount(() => {
    clearTimeout(tid.value)
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
    <view @click="openShow">
        <!--
		 插槽,默认触发打开选择器。你的默认布局可以放置在这里。
		 @prop {boolean} show - 控制打开关闭状态
		 -->
        <slot></slot>
    </view>
    <tm-drawer @open="onOpen" :widthCoverCenter="true" :watiDuration='duration' contentMargin="0px"
        :disabledScroll="true" :title="title" @close="onClose" @confirm="onConfirm" @cancel="onCancel"
        :showFooter="true" v-model:show="show" :show-close="true" size="80%">
        <view style="height: 100%;display:flex;flex-direction: column">
            <view class="tmPickerSlectedIwrap">
                <view class="tmPickerSlectedInputBox" :style="{ backgroundColor: _inputBgColor }">
                    <!-- @vue-ignore -->
                    <input placeholder="请输入关键词" :style="{ color: _inputColor }" @input="inpuEvent"
                        @confirm="inputConfirm" :value="searchKey" class="tmPickerSlectedInput" />
                    <view v-if="searchKey.length > 0" @click="clearSearchKey" class="clearClick">
                        <tm-icon size="48" name="close-circle-fill" color="#d1d1d1"></tm-icon>
                    </view>
                </view>
                <tm-button width="160" @click="inputConfirm" :color="_color" height="88" round="0">搜索</tm-button>
            </view>
            <view class="tmPickerSlectedWrap" style="position: relative;">

                <tm-icon v-if="!yanchiDuration" size="48" spin name="loader-line" color="primary"></tm-icon>
                <scroll-view v-if="_list.length > 0 && yanchiDuration" scroll-y
                    style="position:absolute;left:0px;top:0px;height:100%; ">
                    <view @click="onclik(item)" v-for="(item, index) in _renderListData" :key="index"
                        class="tmPickerSlectedItem" :class="[isSelected(item) ? 'tmPickerSlectedWrapOn' : '']">
                        <view class="tmPickerSlectedItemWrap"
                            :style="{ 'border-bottom': `1px solid ${_borderColor}`, margin: '0 16px' }">
                            <view class="tmPickerSlectedItemText">
                                <tm-text :color="isSelected(item) ? _color : (_isDark ? 'white' : '#888')"
                                    font-size="32" line-height="1" :lines="2">
                                    {{ item.title }}
                                </tm-text>
                            </view>
                            <tm-icon :color="isSelected(item) ? _color : '#e6e6e6'" size="56"
                                :name="isSelected(item) ? 'checkbox-circle-fill' : 'checkbox-blank-circle-line'"></tm-icon>
                        </view>
                    </view>
                </scroll-view>
                <view v-if="_list.length == 0" class=" text-align-center "
                    style="display: flex ;flex-direction: row;justify-content: center;">
                    <tm-text class="py-n8">没有数据</tm-text>
                </view>
            </view>
            <view v-if="_list.length > 0 && yanchiDuration" class="tmPickerSlectedFooter">
                <tm-text class="tmPickerSlectedFooterBtnText" style="text-align: center;" :color="_color"
                    font-size="28">
                    已选择{{ nowValue.length }}项
                </tm-text>
                <view class="tmPickerSlectedFooterBtn">
                    <tm-text class="tmPickerSlectedFooterBtnText" @click="clearAll" color="#666" font-size="28">
                        清空选择
                    </tm-text>
                    <tm-text style="margin-left: 24rpx;" v-if="multiple" class="tmPickerSlectedFooterBtnText"
                        @click="selectedAll" :color="_color" font-size="28">
                        选择所有
                    </tm-text>
                </view>
            </view>
        </view>
    </tm-drawer>
</template>
<style scoped>
.tmPickerSlectedFooterBtn {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.tmPickerSlectedFooter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 24rpx 32rpx;
}

.tmPickerSlectedInputBox {
    height: 100%;
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.clearClick {

    padding: 0 32rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
}

.tmPickerSlectedIwrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 88rpx;
    border-radius: 88rpx;
    margin: 0 32rpx 32rpx 32rpx;
    overflow: hidden;
}

.tmPickerSlectedInput {
    height: 100%;
    flex: 1;
    padding: 0 32rpx;
}

.tmPickerSlectedItem {
    height: 100rpx;
}

.tmPickerSlectedFooterBtnText {
    cursor: pointer;
}

.tmPickerSlectedItemWrap {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
}

.tmPickerSlectedItemText {
    flex: 1;
    cursor: pointer;
}

.tmPickerSlectedWrap {
    display: flex;
    flex-direction: column;
    flex: 1;
}
</style>