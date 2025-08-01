<script setup lang="ts">
import { ref, computed, onMounted, watch, PropType } from 'vue';
import { useTmConfig } from "../../libs/config";
import { tmDate, type tmDateTypeTime, createDate } from '../../libs/tmDate';
import { getDefaultColor} from "../../libs/colors";

type PICKER_ITEM_INFO = Record<string, any>

/**
 * @displayName 时间区间选择
 * @exportName tm-between-time
 * @category 表单组件
 * @description 快速的时间区间选择器，方便时间选择自动判断前后时间大小并校正。
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmBetweenTime' });
const { config } = useTmConfig()

type coverValue = {
    value: string[],
    str: string
}
type ModelType = "year" | "month" | "day" | "hour" | "minute" | "second";

const props = defineProps({
    /**
     * 当前时间,与modelStr不同，此提供的值必须是正常的时间格式
     * 否则报错，无法运行。
     */
    modelValue: {
        type: [Array<string>],
        default: (): string[] => [] as string[]
    },
    /**
     * 当前时间经过format格式化后输出的值。
     * 此值不会处理输入，只输出显示。
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
        default: "请选择时间"
    },
    /**
     * 开始时间，请提供正确的时间格式
     */
    start: {
        type: String,
        default: ""
    },
    /**
     * 结束时间，请提供正确的时间格式
     */
    end: {
        type: String,
        default: ""
    },
    /**
     * 精确到的级别,这里只是展示，具体的返回值还是完整的值。
     * year:年
     * month:年月
     * day:年月日
     * hour:年月日小时
     * minute:年月日小时分钟
     * second:年月日小时分钟秒
     */
    type: {
        type: String as PropType<ModelType>,
        default: "day"
    },
    /**
     * 输出时间格式，只对v-model:modelStr及输入框展示有效
     * 因此它可能不是一个标准时间，比如YY SS ,所以不能作为modelValue使用
     * 有效格式：
     * YYYY年
     * MM月
     * DD日
     * hh小时
     * mm分钟
     * ss秒
     */
    format: {
        type: String,
        default: "YYYY-MM-DD"
    },
    /**
     * 是否将format格式化的v-model:modelStr同步到v-model:modelValue
     * 默认false,注意：如果开启了同步，你要确保format的值是正常的时间值
     * 正常兼容以下时间格式：
     * YYYY,YYYY-MM,YYYY-MM-DD,YYYY-MM-DD HH,YYYY-MM-DD HH:mm,YYYY-MM-DD HH:mm:ss
     */
    formatSyncValue:{
        type:Boolean,
        default:false
    },
    /**
     * 上方的单位名称
     */
    cellUnits: {
        type: Array as PropType<string[]>,
        default: (): string[] => ['年', '月', '日', '时', '分', '秒'] as string[]
    },
    /**
     * 快速时间区间选择，如果直接填写数字字符，会以你提供的数字最近多少来天来算。
     * d:本日
     * w:本周
     * m:本月
     * y:本年
     * q:本季度
     * 7:最近7天，后面的依此类推，数字的就是最近xx天。
     */
    quickDate: {
        type: [Array<string>],
        default: (): string[] => ['d', 'w', 'm', 'y', 'q'] as string[]
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
     * 如果你的快捷选择较多可能会让高度不足，需要自行设置下高。
     */
    drawerSize: {
        type: String,
        default: '1020'
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
     * 取消时触发
     */
    'cancel',
    /**
     * 确认触发
     * @param {string} date 当前选中时间
     */
    'confirm',
    /**
     * 滑动变换时触发
     * @param {string} date - 当前选中时间
     */
    'change',
    /**
     * 变量控制打开状态
     * 等同v-model:model-show
     */
    'update:modelShow',
    /**
     * 经格式化后的值。等同v-model:model-str
     */
    'update:modelStr',
    'update:modelValue'
]);

let startValue = new tmDate()
let endValue = new tmDate()
startValue.subtraction(1, 'y')

const show = ref(false)
const nowValue = ref<string[]>(['', ''])
const nowModelValue = ref<string[]>(['', ''])
const startDate = ref(startValue)
const endDate = ref(endValue)
const changeIndex = ref(0)
const yanchiDuration = ref(false)
const quicklist = ref<coverValue[]>([])

const _lazyContent = computed(() => props.lazyContent)

const _start_date = computed(() => props.start === "" ? startDate.value : new tmDate(props.start))
const _end_date = computed(() => props.end === "" ? endDate.value : new tmDate(props.end))
const _start_date_str = computed(() => _start_date.value.format())
const _end_date_str = computed(() => _end_date.value.format())
const _start_date_str_format = computed(() => nowValue.value[0] === '' ? '开始时间' : (new tmDate(nowValue.value[0])).format(props.format))
const _end_date_str_format = computed(() => nowValue.value[1] === '' ? '结束时间' : (new tmDate(nowValue.value[1])).format(props.format))

const _backgroundColor = computed(() => config.mode === 'dark' ? getDefaultColor(config.inputDarkColor) : getDefaultColor('#f5f5f5'))
const _borderColor = computed(() => config.mode === 'dark' ? getDefaultColor(config.borderDarkColor) : getDefaultColor('#eaeaea'))
const _activeBorderColor = computed(() => getDefaultColor(config.color))
const _placeStyle = computed(() => config.mode === 'dark' ? "color:#c7c7c7;" : "color:#838383;")
const _fontColor = computed(() => config.mode === 'dark' ? "#efefef" : "#333")
const _isDark = computed(() => config.mode === 'dark')
const _disabled = computed(() => props.disabled)


let tid = 34
watch(() => props.modelValue, (newvalue: string[]) => {
    let sortvalue = sorDateVaild(validTimeDate(newvalue))
    let newvaluestr = sortvalue.join('')
    if (newvaluestr === nowModelValue.value.join('')) return
    nowValue.value = sortvalue
    nowModelValue.value = sortvalue
    tongbuModelStr()
})

watch(() => props.modelShow, (newValue: boolean) => {
    if (newValue === show.value) return
    show.value = newValue
})

watch(() => props.quickDate, (newvalue: string[]) => {
    quicklist.value = getQuickDateType()
})

onMounted(() => {
    yanchiDuration.value = _lazyContent.value ? false : true

    let str = validTimeDate(props.modelValue)
    nowValue.value = str
    nowModelValue.value = str
    quicklist.value = getQuickDateType()
    tongbuModelStr()
})

function clearDate() {
    let dst = ['', ''] as string[]
    nowValue.value = dst
}

function tongbuModelStr() {
    let str = coverStrVal()
    /**
     * 经格式化后的值。等同v-model:model-str
     */
    emit('update:modelStr', str === '~' ? '' : str)
}

function dateChangeView(datestr: string) {
	clearTimeout(tid)
	
    tid = setTimeout(function() {
    	let nowvalu = nowValue.value.slice(0)
    	nowvalu[changeIndex.value] = datestr
    	let strStart = nowvalu[0]
    	let strEnd = nowvalu[1]
    	let types = getTypes()
    	if (strEnd !== '' && strStart !== '') {
    	    if (changeIndex.value === 0) {
    	        if (new tmDate(strStart).isBetweenOf(new tmDate(strEnd), '>', types)) {
    	            strEnd = strStart
    	        }
    	    } else if (changeIndex.value === 1) {
    	        if (new tmDate(strEnd).isBetweenOf(new tmDate(strStart), '<', types)) {
    	            strStart = strEnd
    	        }
    	    }
    	}
    	
    	nowValue.value = [strStart, strEnd]
    }, 50);
}

function tagsClick(item: coverValue) {
    nowValue.value = item.value
}

function inputClick(index: number) {
    changeIndex.value = index

    let nowvalu = nowValue.value.slice(0)
    let strStart = nowvalu[0]
    let strEnd = nowvalu[1]

    if (changeIndex.value === 0) {
        if (strStart === '') {
            strStart = strEnd !== '' ? strEnd : (endDate.value.format())
            nowValue.value = [strStart, strEnd]
        }
    } else if (changeIndex.value === 1) {
        if (strEnd === '') {
            strEnd = strStart !== '' ? strStart : (endDate.value.format())
            nowValue.value = [strStart, strEnd]
        }
    }
}

function getQuickDateType(): coverValue[] {
    let typelist: coverValue[] = []
    if (props.quickDate.length === 0) return typelist
    let list = props.quickDate
    for (let i = 0; i < list.length; i++) {
        let item: string = list[i]
        if (!isNaN(parseInt(item))) {
            let dshi = parseInt(item)! as number
            let date = new tmDate()
            let start = date.format()
            date.subtraction(dshi, 'd')
            let end = date.format()

            typelist.push({ value: [end, start], str: '最近' + item + '天' } as coverValue)
        } else {
            let date = new tmDate()
            let startFDate = "YYYY/MM/DD 00:00:00"
            let endFDate = "YYYY/MM/DD 23:59:59"
            let start = date.format(startFDate)
            let end = date.format(endFDate)
            let desc = "本日"
            if (item === 'w') {
                start = date.getDateStartOf('w').format(startFDate)
                end = date.getDateEndOf('w').format(endFDate)
                desc = "本周"
            } else if (item === 'm') {
                start = date.getDateStartOf('m').format(startFDate)
                end = date.getDateEndOf('m').format(endFDate)
                desc = "本月"
            } else if (item === 'y') {
                start = date.getDateStartOf('y').format(startFDate)
                end = date.getDateEndOf('y').format(endFDate)
                desc = "本年"
            } else if (item === 'q') {
                let nowq = date.getQuarter('')
                let itemqatar = nowq[0]
                start = itemqatar.start
                end = itemqatar.end
                desc = "本季度"
            }

            typelist.push({ value: [start, end], str: desc } as coverValue)
        }
    }
    return typelist
}

// 获取精确单位
function getTypes(): tmDateTypeTime {
    if (props.type === 'year') {
        return 'y' as tmDateTypeTime
    } else if (props.type === 'month') {
        return 'm' as tmDateTypeTime
    } else if (props.type === 'day') {
        return 'd' as tmDateTypeTime
    } else if (props.type === 'hour') {
        return 'h' as tmDateTypeTime
    } else if (props.type === 'minute') {
        return 'M' as tmDateTypeTime
    } else if (props.type === 'second') {
        return 's' as tmDateTypeTime
    }
    return 's' as tmDateTypeTime
}

//验证提供的值是否合法，并纠正为合法值。
function validTimeDate(val: string[]): string[] {
    let str = ['', '']
    if (val.length >= 1) {
        str[0] = val[0]!
    }
    if (val.length >= 2) {
        str[1] = val[1]!
    }

    return sorDateVaild(str)
}

function sorDateVaild(str: string[]): string[] {
    let types = getTypes()
    str.sort((a: string, b: string): number => {
        return new tmDate(a).getTime(types) - new tmDate(b).getTime(types)
    })
    return str
}

function openShow() {
	if(_disabled.value) return;
    show.value = true
    /**
     * 变量控制打开状态
     * 等同v-model:model-show
     */
    emit('update:modelShow', true)
}

function onClose() {
    /**
     * 变量控制打开状态
     * 等同v-model:model-show
     */
    emit('update:modelShow', false)
    cancelResetDataCol()
    if (_lazyContent.value) {
        yanchiDuration.value = false
    }
}

function onOpen() {
    yanchiDuration.value = true
}

function onCancel() {
    emit('cancel')
    cancelResetDataCol()
}

function cancelResetDataCol() {
    nowValue.value = nowModelValue.value.slice(0)
}

function coverStrVal(): string {
    let estrt = nowValue.value[0]
    let eend = nowValue.value[1]
    let start = estrt === '' ? '' : (new tmDate(estrt)).format(props.format)
    let ebd = eend === '' ? '' : (new tmDate(eend)).format(props.format)
    return start + '~' + ebd
}

function onConfirm() {
    let str = coverStrVal()
    let tmdate: string[] = []
    if (nowValue.value[0] !== '' && nowValue.value[1] !== '') {
        tmdate = nowValue.value.slice(0)
        nowModelValue.value = tmdate
    }
    let tmdateByFormat = tmdate.map((item) => {
        return new tmDate(item).format(props.format)
    })

    /**
     * 点击确认时同步。等同v-model
     */
    emit('update:modelValue', props.formatSyncValue?tmdateByFormat:tmdate)

    /**
     * 经格式化后的值。等同v-model:model-str
     */
    emit('update:modelStr', str === '~' ? '' : str)

    emit('confirm', props.formatSyncValue?tmdateByFormat:tmdate)
}
</script>
<template>
    <view @click="openShow">
        <!--
		@slot 插槽,默认触发打开选择器。你的默认布局可以放置在这里。
		-->
        <slot></slot>
    </view>
    <tm-drawer @open="onOpen" :widthCoverCenter="true" :disabledScroll="true" @close="onClose" @confirm="onConfirm"
        @cancel="onCancel" :showFooter="true" v-model:show="show" :size="drawerSize" :showClose="false">
        <template v-slot:title>
            <view
                style="padding: 0 20px;flex:1;display: flex;flex-direction: row;justify-content: space-between;align-items: center;height: 100%;">
                <tm-text>{{ title }}</tm-text>
                <tm-text @click="clearDate" style="opacity: 0.5;">清空</tm-text>
            </view>
        </template>
        <view v-if="yanchiDuration" class="tmPickerDateWrap">
            <view v-if="quicklist.length > 0" class="tmPickerDateWrapQuickTags">
                <tm-tag font-size="26" :font-color="(_isDark ? 'white' : '')" @click="tagsClick(item)" skin='thin'
                    size="m" style="margin-right:10px;margin-bottom: 5px;" v-for="(item, index) in quicklist"
                    :key="index">{{
                        item.str }}</tm-tag>
            </view>
            <view v-if="quicklist.length > 0" style="height: 8px;"></view>
            <view class="tmPickerDateWrapQuickInput">
                <view @click="inputClick(0)" style="flex:1;height: 40px;">
                    <input :placeholder-style="_placeStyle"
                        :style="{ color: changeIndex == 0 ? _activeBorderColor : _fontColor, border: `2px solid ${changeIndex == 0 ? _activeBorderColor : _borderColor}`, backgroundColor: _backgroundColor }"
                        class="tmPickerInput" :disabled="true" :value="_start_date_str_format" />
                </view>
                <tm-text style="width: 64px;text-align: center;">至</tm-text>
                <view @click="inputClick(1)" style="flex:1;height: 40px;">
                    <input :placeholder-style="_placeStyle"
                        :style="{ color: changeIndex == 1 ? _activeBorderColor : _fontColor, border: `2px solid ${changeIndex == 1 ? _activeBorderColor : _borderColor}`, backgroundColor: _backgroundColor }"
                        class="tmPickerInput" :disabled="true" :value="_end_date_str_format" />
                </view>
            </view>
            <tm-date-view v-if="show" @change="dateChangeView" 
            :format="format" :type="type" :cell-units="cellUnits"
                :start="_start_date_str" :end="_end_date_str" :model-value='nowValue[changeIndex]'></tm-date-view>
        </view>
        <tm-icon v-if="!yanchiDuration" size="42" spin name="loader-line"></tm-icon>
    </tm-drawer>
</template>
<style scoped>
.tmPickerDateText {
    text-align: left;
    transition-duration: 350ms;
    transition-timing-function: linear;
    transition-property: transform, opacity;
    transform: translateY(100%) scale(0);
    opacity: 0;

}

.tmPickerDateWrapQuickInputPlackeTips {
    flex: 1;
    display: flex;
    flex-direction: row;
    pointer-events: none;
}

.tmPickerInput {
    border-radius: 80rpx;
    height: 80rpx;

    padding: 0 20rpx;
    font-size: 30rpx;
    flex: 1;
    pointer-events: none;
    text-align: center;
}

.tmPickerDateWrapQuickInput {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
}

.tmPickerDateWrapQuickTags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 16rpx;
}
</style>