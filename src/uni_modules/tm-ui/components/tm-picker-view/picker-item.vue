<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, PropType, getCurrentInstance, ComponentInstance, onUpdated, nextTick, VueElement, inject } from 'vue';
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit, getUid } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
import pickerItem from './picker-item.vue';

const { config } = useTmConfig()
type TM_PICKER_X_ITEM = Record<string, any>


const boxHeight = ref(0)
const id = ('tmPickerItem-' + getUid())
const nowCurrentIndex = ref([0])
let tid = 0
let tid2 = 1

const emits = defineEmits(['changeDeep'])
const props = defineProps({

	list: {
		type: Array as PropType<TM_PICKER_X_ITEM[][]>,
		default: (): TM_PICKER_X_ITEM[] => [] as TM_PICKER_X_ITEM[]
	},


	selectedIndex: {
		type: Array as PropType<number[]>,
		default: (): number[] => [] as number[]
	},
	cellUnits: {
		type: Array as PropType<string[]>,
		default: (): string[] => [] as string[]
	},
	fontSize: {
		type: String,
		default: "30"
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
})
const _fontSize = computed((): string => {
	let fontSize = covetUniNumber(props.fontSize, config.unit)

	if (config.fontSizeScale == 1) return fontSize
	let sizeNumber = parseInt(fontSize)
	if (isNaN(sizeNumber)) {
		sizeNumber = 16
	}
	return (sizeNumber * config.fontSizeScale).toString() + getUnit(props.fontSize)
})



const refreshKey = ref(12)

const _cellUnits = computed((): string[] => props.cellUnits as string[])

const _list = computed((): TM_PICKER_X_ITEM[][] => props.list.slice(0))


const _isDark = computed((): boolean => config.mode == 'dark')

const _maskStyle = computed((): string => {
	if (_isDark.value) {
		return 'background-image:linear-gradient(180deg,rgba(0, 0, 0, 0),rgba(0, 0, 0, 0)),linear-gradient(0deg, rgba(0, 0, 0, 0),rgba(0, 0, 0, 0))'
	}
	return 'background-image:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0)),linear-gradient(0deg, rgba(255,255,255,0),rgba(255,255,255,0))'
})
const _selectedMaskStyle = computed((): string => {
	return _isDark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
})



const onChange = (event: any) => {
	
	if (event.detail.value.length == 0 || _list.value.length == 0) return;
	let indexs = event.detail.value!;
	if (indexs.join('') == nowCurrentIndex.value.join('')) return;
	nowCurrentIndex.value = indexs
	emits("changeDeep", indexs)
}

onMounted(() => {
	nowCurrentIndex.value = props.selectedIndex.slice(0)
})
onBeforeUnmount(() => {
	clearTimeout(tid)
	clearTimeout(tid2)
})

watch(() => props.selectedIndex, (newvalue:number[]) => {
	if (newvalue.join('') == nowCurrentIndex.value.join('')) return;
	nowCurrentIndex.value = newvalue.slice(0)
}, { deep: true })
watch(_list, (newvalue) => {
    refreshKey.value +=1;
	
}, { deep: true })




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
	<view>
		<view class="tmPickerViewUnit" v-if="_cellUnits.length>0">
			<view v-for="(item, index) in _cellUnits" :key="index"  style="flex: 1;text-align: center;">
				<tm-text  font-size="24" class="tmPickerViewUnitText">{{ item }}</tm-text>
			</view>
		</view>
		<picker-view indicator-class="indicatorClass" :key="refreshKey" :immediate-change="true" :value="nowCurrentIndex" @change="onChange"
			:style="{ height: '250px', width: '100%' }" :mask-style="`${_maskStyle}`"
			:indicator-style="`height:50px;border:none;border-radius:10px`">
			<picker-view-column v-for="(item2, index2) in _list" :key="index2">
				<view :style="{ background: nowCurrentIndex[index2] == index ? _selectedMaskStyle : 'none',margin:'0 4px' }"
					v-for="(item, index) in item2" :key="index" class="tmPickerViewWrapCoumn">
					<text class="tmPickerViewWrapCoumnText" :style="{
						fontSize: _fontSize,
						lineHeight: 1,
						fontWeight: nowCurrentIndex[index2] == index ? 'bold' : 'inherit',
						opacity: item.disabled ? 0.4 : (nowCurrentIndex[index2] == index ? 1 : 0.6),
						color: _isDark ? 'rgba(255,255,255,0.8)' : '#000000'
					}">
						{{ item[rangText]||"" }}
					</text>
				</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>
<style>
.indicatorClass:after,
.indicatorClass:before {
	content:'';
	height: 0px;
	width: 100%;
	border-color: transparent;
}

.tmPickerViewUnit {
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding: 8px;
}

.tmPickerViewUnitText {
	font-size: 12px;
	color: #888;
	font-weight: bold;
}

.tmPickerViewWrapCoumnText {
	margin: 0 6px;
	width: 100%;
	text-align: center;

	display: -webkit-box;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;

}

.tmPickerView {
	display: flex;
	flex-direction: row;
}

.tmPickerViewWrap {
	position: relative;
}

.tmPickerContent {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	z-index: 5;
}

.tmPickerMasker {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	height: 100%;
	width: 100%;
	top: 0px;
	left: 0px;
	position: absolute;
}

.xPickErBar {
	background-color: #f5f5f5;
	border-radius: 10px;
	margin: 0 3px;
	flex: 1;

}

.tmPickerContent {
	transition-duration: 350ms;
	transition-property: left, right, top, bottom;
	transition-timing-function: cubic-bezier(0, 0.55, 0.45, 1);
}

.tmPickerViewWrapCoumn {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 50px;
	border-radius: 10px;
	/* background-color: #f5f5f5; */
}
</style>