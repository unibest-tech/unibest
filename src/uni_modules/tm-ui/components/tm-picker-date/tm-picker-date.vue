<script lang="ts" setup>
import { ref, computed, onMounted, watch, PropType } from 'vue';
import { useTmConfig } from "../../libs/config";
import { tmDate, type tmDateTypeTime, createDate } from '../../libs/tmDate';
import pickerItem from './../tm-picker-view/picker-item.vue';

type PICKER_ITEM_INFO = Record<string, any>

/**
 * @displayName 日期选择器
 * @exportName tm-picker-date
 * @category 表单组件
 * @description 可以设置为年月日,并设置精确到秒。默认的开始时间为当前时间的上一年，结束时间为默认当前时间
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
	| --- | --- | --- | --- |
	| ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmPickerDate' });
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
		type: String,
		default: ""
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
	 * 精确到的级别
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
	 * 输出时间格式，只对v-model:modelStr有效
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
	 * 上方的单位名称
	 */
	cellUnits: {
		type: Array as PropType<string[]>,
		default: (): string[] => ['年', '月', '日', '时', '分', '秒']
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
	 * @param {string} date 当前选中时间id值
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

const show = ref(false);
const nowValue = ref<string[]>([]);
const _modelValueIndex = ref<number[]>([])
const nowValueStr = ref('');
const startDate = ref(new tmDate().subtraction(1, 'y'));
const endDate = ref(new tmDate());
const dateList = ref<PICKER_ITEM_INFO[][]>([]);
const yanchiDuration = ref(false);
const _lazyContent = computed(() => props.lazyContent);
const _start_date = computed(() => props.start ? new tmDate(props.start) : startDate.value);
const _end_date = computed(() => props.end ? new tmDate(props.end) : endDate.value);
const _getDateType = computed((): tmDateTypeTime => {
	let isType: tmDateTypeTime = 's';
	if (props.type == 'year') isType = 'y';
	if (props.type == 'month') isType = 'm';
	if (props.type == 'day') isType = 'd';
	if (props.type == 'hour') isType = 'h';
	if (props.type == 'minute') isType = 'M';
	return isType;
});
const _disabled = computed(() => props.disabled)


const defaultModelvalue = (newvalue: string, showStr: boolean) => {
	let isType = _getDateType.value;
	let selfnowValue = new tmDate(newvalue);
	if (selfnowValue.isBetweenOf(_start_date.value, '<=', isType)) {
		selfnowValue = _start_date.value;
	}
	if (selfnowValue.isBetweenOf(_end_date.value, '>=', isType)) {

		selfnowValue = _end_date.value;
	}

	let stp = getRangByDateTime(selfnowValue);
	nowValue.value = stp.value;
	nowValueStr.value = stp.str;
	dateList.value = getTimeTreeByStartAndEnd(_start_date.value, _end_date.value);
	_modelValueIndex.value = getIndexsByids(stp.value)

	if (showStr) {
		/**
		 * 经格式化后的值。等同v-model:model-str
		 */
		emit('update:modelStr', formatTimeDate());
	}
}


const getIndexsByids = (ids: string[]) => {
	let indexs = [] as number[];
	for (let i = 0; i < dateList.value.length; i++) {
		let item = dateList.value[i]
		let index = item.findIndex(el => parseInt(el.id) == parseInt(ids[i]))
		indexs.push(Math.max(0, index))
	}
	return indexs
}


const getTimeTreeByStartAndEnd = (start: tmDate, end: tmDate): PICKER_ITEM_INFO[][] => {
	let startCopy = start.getClone();
	let nowDate = new tmDate(nowValueStr.value)
	let endCopy = end.getClone();
	let years = [] as PICKER_ITEM_INFO[];
	let months = [] as PICKER_ITEM_INFO[];
	let days = [] as PICKER_ITEM_INFO[];
	let hours = [] as PICKER_ITEM_INFO[];
	let minutes = [] as PICKER_ITEM_INFO[];
	let seconds = [] as PICKER_ITEM_INFO[];

	for (let i = startCopy.getYear(); i <= endCopy.getYear(); i++) {
		years.push({
			id: i.toString(),
			title: indexToHex(i)
		} as PICKER_ITEM_INFO)
	}

	function getD(type: string, s: number, n: number) {
		if (type == 'm') {

			for (let i = s; i <= n; i++) {
				months.push({
					id: i.toString(),
					title: indexToHex(i + 1)
				} as PICKER_ITEM_INFO)
			}
		} else if (type == 'd') {
			for (let i = s; i <= n; i++) {
				days.push({
					id: i.toString(),
					title: indexToHex(i)
				} as PICKER_ITEM_INFO)
			}
		} else if (type == 'h') {
			for (let i = s; i <= n; i++) {
				hours.push({
					id: i.toString(),
					title: indexToHex(i)
				} as PICKER_ITEM_INFO)
			}
		} else if (type == 'M') {
			for (let i = s; i <= n; i++) {
				minutes.push({
					id: i.toString(),
					title: indexToHex(i)
				} as PICKER_ITEM_INFO)
			}
		} else if (type == 's') {
			for (let i = s; i <= n; i++) {
				seconds.push({
					id: i.toString(),
					title: indexToHex(i)
				} as PICKER_ITEM_INFO)
			}
		}
	}
	function getDnumber(type: tmDateTypeTime, target: tmDateTypeTime): number[] {
		let st = 0;
		let et = 0

		// 不包含起始, 开始和结束内。
		if (nowDate.isBetween(startCopy, endCopy, type, '()')) {
			if (target == 'm') {
				st = 0
				et = 11
			} else if (target == 'd') {
				st = 1
				et = nowDate.getMonthCountDay()
			} else if (target == 'h') {
				st = 0
				et = 23
			} else if (target == 'M' || target == 's') {
				st = 0
				et = 59
			}
		} else {
			// 开始和结束相等
			if (startCopy.isBetweenOf(endCopy, '=', type)) {

				if (target == 'm') {
					st = startCopy.getMonth()
					et = endCopy.getMonth()
				} else if (target == 'd') {
					st = startCopy.getDate()
					et = endCopy.getDate()
				} else if (target == 'h') {
					st = startCopy.getHours()
					et = endCopy.getHours()
				} else if (target == 'M') {
					st = startCopy.getMinutes()
					et = endCopy.getMinutes()
				} else if (target == 's') {
					st = startCopy.getSeconds()
					et = endCopy.getSeconds()
				}

			} else if (nowDate.isBetweenOf(startCopy, '<=', type)) {

				if (target == 'm') {
					st = startCopy.getMonth()
					et = 11
				} else if (target == 'd') {
					st = startCopy.getDate()
					et = startCopy.getMonthCountDay()
				} else if (target == 'h') {
					st = startCopy.getHours()
					et = 23
				} else if (target == 'M') {
					st = startCopy.getMinutes()
					et = 59
				} else if (target == 's') {
					st = startCopy.getSeconds()
					et = 59
				}
			} else if (nowDate.isBetweenOf(endCopy, '>=', type)) {

				if (target == 'm') {
					st = 0
					et = endCopy.getMonth()
				} else if (target == 'd') {
					st = 1
					et = endCopy.getDate()
				} else if (target == 'h') {
					st = 0
					et = endCopy.getHours()
				} else if (target == 'M') {
					st = 0
					et = endCopy.getMinutes()
				} else if (target == 's') {
					st = 0
					et = endCopy.getSeconds()
				}
			}
		}
		return [st, et] as number[]
	}
	let maxlen = getNowTypeLenIndex();

	if (maxlen > 1) {
		let sdate = getDnumber('y', 'm')

		getD('m', sdate[0]!, sdate[1]!)
	}
	if (maxlen > 2) {
		let sdate = getDnumber('m', 'd')
		getD('d', sdate[0]!, sdate[1]!)
	}
	if (maxlen > 3) {
		let sdate = getDnumber('d', 'h')
		getD('h', sdate[0]!, sdate[1]!)
	}
	if (maxlen > 4) {
		let sdate = getDnumber('h', 'M')
		getD('M', sdate[0]!, sdate[1]!)
	}
	if (maxlen > 5) {
		let sdate = getDnumber('m', 's')
		getD('s', sdate[0]!, sdate[1]!)
	}


	return [years, months, days, hours, minutes, seconds].slice(0, getNowTypeLenIndex()) as PICKER_ITEM_INFO[][];
}
const indexToHex = (i: number) => {
	let n = i.toString()
	if (n.length == 1) return '0' + n;
	return n;
}
const getRangByDateTime = (d: tmDate) => {
	let nowRange = [
		d.getYear().toString(),
		(d.getMonth()).toString(),
		d.getDate().toString(),
		d.getHours().toString(),
		d.getMinutes().toString(),
		d.getSeconds().toString(),
	] as string[];
	let nowRangeStr = d.getYear().toString() + "-" + (d.getMonth() + 1).toString()
		+ "-" + d.getDate().toString()
		+ " " + d.getHours().toString() + ":"
		+ d.getMinutes().toString() + ":"
		+ d.getSeconds().toString();
	return {
		value: nowRange as string[],
		str: nowRangeStr
	} as coverValue;
}
const getNowTypeLenIndex = () => {
	let index = 6
	if (props.type == 'year') {
		index = 1;
	} else if (props.type == 'month') {
		index = 2;
	} else if (props.type == 'day') {
		index = 3;
	} else if (props.type == 'hour') {
		index = 4;
	} else if (props.type == 'minute') {
		index = 5;
	}
	return index;
}

const openShow = () => {
	if(_disabled.value) return;
	show.value = true;
	/**
	 * 变量控制打开状态
	 * 等同v-model:model-show
	 */
	emit('update:modelShow', true);
}

const onClose = () => {
	/**
	 * 变量控制打开状态
	 * 等同v-model:model-show
	 */
	emit('update:modelShow', false);
	cancelResetDataCol();
	if (_lazyContent.value) {
		yanchiDuration.value = false;
	}
}
const cancelResetDataCol = () => {
	defaultModelvalue(new tmDate(props.modelValue).format('YYYY/MM/DD HH:mm:ss'), false)
}
const onOpen = () => {
	yanchiDuration.value = true;
}
const fillNumber = (n: string) => {
	if (parseInt(n) > 9) return n;
	return "0" + n
}
const stringArValuCoverToString = () => {
	if (nowValue.value.length != 6) return "";

	let newsday = new tmDate(nowValue.value[0] + "-" + (parseInt(nowValue.value[1]) + 1).toString() + "-1")
	let days = parseInt(nowValue.value[2])
	days = days >= newsday.getMonthCountDay() ? newsday.getMonthCountDay() : days
	nowValue.value.splice(2, 1, days.toString())

	return fillNumber(nowValue.value[0]) + "-" + fillNumber((parseInt(nowValue.value[1]) + 1).toString())
		+ "-" + fillNumber(nowValue.value[2])
		+ " " + fillNumber(nowValue.value[3]) + ":"
		+ fillNumber(nowValue.value[4]) + ":"
		+ fillNumber(nowValue.value[5])
}
const change = (ixs: number[]) => {
	let nowvalstrs = new Array(6).fill('00')
	for (let i = 0; i < ixs.length; i++) {
		let item = dateList.value[i]
		nowvalstrs[i] = item[ixs[i]].title
	}
	
	// 判断下当前月分下的天数和选中的天数区别。
	let nowMonth = nowvalstrs[0]+"/"+nowvalstrs[1]+'/1'
	let selectedDay = Number(nowvalstrs[2])
	let nowDay = new tmDate(nowMonth).getMonthCountDay();
	if(nowDay<selectedDay){
		nowvalstrs[2] = nowDay
	}

	let value_first = nowvalstrs.slice(0, 3).join('/');
	let value_last = nowvalstrs.slice(3).join(':');
	let val = value_first+" "+value_last
	let stp = getRangByDateTime(new tmDate(val));

	defaultModelvalue(stp.str, false)

}

const onCancel = () => {
	emit('cancel');
	cancelResetDataCol();
}
const formatTimeDate = () => {
	if (nowValue.value.length != 6) return "";
	let sp = props.format;
	sp = sp.replace(/YYYY/g, fillNumber(nowValue.value[0]))
	sp = sp.replace(/MM/g, fillNumber((parseInt(nowValue.value[1]) + 1).toString()))
	sp = sp.replace(/DD/g, fillNumber(nowValue.value[2]))
	sp = sp.replace(/hh/g, fillNumber(nowValue.value[3]))
	sp = sp.replace(/mm/g, fillNumber(nowValue.value[4]))
	sp = sp.replace(/ss/g, fillNumber(nowValue.value[5]))
	return sp;
}
const onConfirm = () => {
	nowValueStr.value = stringArValuCoverToString();
	/**
	 * 点击确认时同步。等同v-model
	 */
	emit('update:modelValue', props.formatSyncValue?formatTimeDate():nowValueStr.value);

	/**
	 * 经格式化后的值。等同v-model:model-str
	 */
	emit('update:modelStr', formatTimeDate());

	emit('confirm', props.formatSyncValue?formatTimeDate():nowValueStr.value);
}


watch(() => props.modelValue, (newvalue: string) => {
	if (newvalue == '') return;
	let isType = _getDateType.value;
	if (new tmDate(newvalue).isBetweenOf(new tmDate(nowValueStr.value), '=', isType)) return;

	defaultModelvalue(new tmDate(newvalue).format('YYYY/MM/DD HH:mm:ss'), true);
});

watch(() => props.modelShow, (newValue: boolean) => {
	if (newValue == show.value) return;
	show.value = newValue;
});

onMounted(() => {
	yanchiDuration.value = _lazyContent.value ? false : true;
	let nowValue = new tmDate(props.modelValue);

	defaultModelvalue(nowValue.format('YYYY/MM/DD HH:mm:ss'), props.modelValue != '');
});
</script>
<template>
	<view @click="openShow">
		<!--
		 @slot 插槽,默认触发打开选择器。你的默认布局可以放置在这里。
		 @binding {boolean} show - 控制打开关闭状态
		 -->
		<slot></slot>
	</view>
	<tm-drawer @open="onOpen" :widthCoverCenter="true" :disabledScroll="true" :title="title" @close="onClose"
		@confirm="onConfirm" @cancel="onCancel" :showFooter="true" v-model:show="show" :show-close="showClose" size="850">
		<view v-if="yanchiDuration&&show" class="tmPickerDateWrap">
			<picker-item @change-deep="change" :selected-index="_modelValueIndex" :list="dateList"
				:cell-units="cellUnits.slice(0, dateList.length)"></picker-item>
		</view>
		<tm-icon v-if="!yanchiDuration" size="42" color="error" spin name="loader-line"></tm-icon>
	</tm-drawer>
</template>
<style scoped>
.tmPickerDateWrap {
	/* display: flex;
	flex-direction: row; */
}
</style>