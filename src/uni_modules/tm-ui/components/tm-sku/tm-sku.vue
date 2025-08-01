<!--suppress JSDeprecatedSymbols -->
<script lang="ts" setup>
import { computed, nextTick, onMounted, PropType, ref, watch } from 'vue'


/**
 * @displayName 规格选择器
 * @exportName tm-sku
 * @category 表单组件
 * @description 可单列或者多列
 * @constant 平台兼容
 *    | H5 | uniAPP | 小程序 | version |
 | --- | --- | --- | --- |
 | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmSku' });

const props = defineProps({
	/**
	 * 数据
	 */
	data: {
		type: Object as PropType<TM.SKU_DATA>,
		default: (): TM.SKU_DATA => {
			return {
				data: [],
				product: null
			} as TM.SKU_DATA
		}
	},
	/**
	 * 当前选中项的id值
	 */
	modelValue: {
		type: [String, Number],
		default: ''
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
	 * 是否懒加载内部内容。
	 * 当前你的列表内容非常多，且影响打开的动画性能时，请务必
	 * 设置此项为true，以获得流畅视觉效果。如果选择数据较少没有必要打开
	 */
	lazyContent: {
		type: Boolean,
		default: false
	},
	/**
	 * 是否自动选中一个默认值.会从产品列表默认选中第一个产品.
	 */
	autoSelectDefault: {
		type: Boolean,
		default: true
	},
	/**
	 * 显示加购物车按钮
	 */
	showAddStore: {
		type: Boolean,
		default: false
	},
	/**
	 * 按钮及选中的主题色
	 */
	color: {
		type: String,
		default: 'primary'
	}
});

const emit = defineEmits([
	/**
	 * 取消时触发
	 */
	'cancel',
	/**
	 * 确认触发
	 * @param {TM.SKU_PRODUCT} ids 当前选中的产品
	 * @param {Number} buy 购买的数量
	 */
	'confirm',
	/**
	 * 加入购物车
	 * @param {TM.SKU_PRODUCT} ids 当前选中的产品
	 * @param {Number} buy 购买的数量
	 */
	'add',
	/**
	 * 变量控制打开状态
	 * 等同v-model:model-show
	 */
	'update:modelShow',
	'update:modelValue'
]);

const show = ref(false);
const nowValue = ref<string | number>("");
const lazyDuration = ref(false)
const buy = ref(1)
const nowSelectedIds = ref<Array<string | number>>([])
const _data = computed(() => props.data);
const _showAddStore = computed(() => props.showAddStore)

const _nowSelectedItem = computed<TM.SKU_PRODUCT | null>(() => {
	if (nowSelectedIds.value.length == 0 || _data.value.product == null || !_data.value.product) return null
	let dataItems = _data.value.data
	let ids = ''
	for (let i = 0; i < dataItems.length; i++) {
		let item = dataItems[i]
		let children = item?.children ?? []
		if (children.length > 0) {
			let cis = children.map((el) => el.id)
			for (let j = 0; j < cis.length; j++) {
				if (nowSelectedIds.value.includes(cis[j])) {
					ids += cis[j] + '-'
				}
			}
		}
	}
	if (ids == '') return null
	ids = ids.substring(0, ids.length - 1)
	let index = _data.value.product.findIndex((el) => el.id == ids)
	if (index == -1) return null
	return _data.value.product[index]
});
const _lazyContent = computed(() => props.lazyContent);
const _nowImgDefault = computed(() => {
	if (!_data.value || !_data.value.product || _data.value.product?.length == 0) return ''
	return _data.value.product[0].img ?? ''
})
watch(() => props.modelValue, (_: string | number) => {
	onSetDefaultStr()
});

watch(() => props.modelShow, (newValue: boolean) => {
	if (newValue == show.value) return
	show.value = newValue
},);


onMounted(() => {
	nowValue.value = props.modelValue
	lazyDuration.value = !_lazyContent.value
	onSetDefaultStr()
	if (props.modelShow) {
		nextTick(() => {
			show.value = true
		})
	}
});

function openShow() {
	show.value = true
	emit('update:modelShow', true)
}

function onClose() {
	emit('update:modelShow', false)
	if (_lazyContent.value) {
		lazyDuration.value = false
	}

}

function onOpen() {
	lazyDuration.value = true
}

function onCancel() {
	emit('cancel')
	onClose()
}

function onConfirm() {
	if (!_nowSelectedItem.value || disabledBuy.value) return
	let ids = _nowSelectedItem.value.id
	emit('update:modelValue', ids)
	emit('confirm', JSON.parse(JSON.stringify(_nowSelectedItem.value)), buy.value)
	onClose()
}

function onAdd() {
	if (!_nowSelectedItem.value) return
	let ids = _nowSelectedItem.value.id
	emit('add', JSON.parse(JSON.stringify(_nowSelectedItem.value)), buy.value)
}

//设置默认选中的值。
function onSetDefaultStr() {
	if (props.modelValue) {
		let val = String(props.modelValue)
		nowSelectedIds.value = val.split('-')
		nowValue.value = val

	} else if (props.autoSelectDefault) {
		let product = _data.value?.product ?? []
		if (product.length > 0) {
			let defaulter = product[0]
			nowSelectedIds.value = String(defaulter.id).split('-')
			nowValue.value = defaulter.id
		}
	}
	nextTick(() => {
		buy.value = Math.min(maxBuyNumber.value, Math.max(minBuyNumber.value, buy.value))
	})
}

function selectedItem(parent: TM.SKU_DATA_ITEM, parentIndex: number, item: TM.SKU_DATA_ITEM) {
	let listids = new Array(_data.value.data.length).fill('')
	for (let i = 0; i < nowSelectedIds.value.length; i++) {
		listids[i] = nowSelectedIds.value[i]
	}
	if (nowSelectedIds.value.includes(item.id)) {
		listids[parentIndex] = ''
	} else {
		listids[parentIndex] = item.id
	}
	nowSelectedIds.value = listids.slice(0)
	nextTick(() => {
		if (_nowSelectedItem.value) {
			buy.value = Math.min(Math.max(_nowSelectedItem.value.min_buy_quantity, Math.min(_nowSelectedItem.value.max_buy_quantity, buy.value)), _nowSelectedItem.value.inventory_quantity)
		}
	})
}

const disabledBuy = computed(() => {
	if (_nowSelectedItem.value == null) return true
	if (_nowSelectedItem.value.max_buy_quantity == 0 || _nowSelectedItem.value.inventory_quantity == 0) return true

	return buy.value > maxBuyNumber.value || buy.value < minBuyNumber.value
})
const isSelectedTags = computed(() => {
	return (id: string | number): boolean => {
		return nowSelectedIds.value.includes(id)
	}
})
const maxBuyNumber = computed(() => {
	if (_nowSelectedItem.value == null) return 0
	return Math.min(_nowSelectedItem.value.inventory_quantity, _nowSelectedItem.value.max_buy_quantity)
})
const minBuyNumber = computed(() => {
	if (_nowSelectedItem.value == null) return 0
	return Math.min(_nowSelectedItem.value.inventory_quantity, _nowSelectedItem.value.min_buy_quantity)

})
const buyBtnText = computed(() => {
	if (_nowSelectedItem.value == null) return '未选择商品'
	if (disabledBuy.value) return '缺货中'
	return '立即购买'
})


</script>
<script lang="ts">
export default {
	options: {
		styleIsolation: 'apply-shared',
		virtualHost: true,
		addGlobalClass: true,
		multipleSlots: true
	}
};
</script>
<template>

	<tm-drawer
		z-index="50"
		v-model:show="show"
		:disabledScroll="false"
		:show-close="true"
		:show-title="false" :showFooter="true"
		:widthCoverCenter="true"
		max-height="80%"
		size="950"
		@cancel="onCancel"
		@close="onClose"
		@confirm="onConfirm"
		@open="onOpen"
	>
		<view class="skuHeader">
			<tm-image :preview="true" :src="(_nowSelectedItem?.img??_nowImgDefault)" height="160" round="12"
					  width="160"></tm-image>
			<view style="margin-left: 20rpx">
				<view v-if="_nowSelectedItem">
					<text :style="{color:'red',fontSize:'36rpx'}">￥{{ _nowSelectedItem.price }}</text>
					<text v-if="_nowSelectedItem.original_price>0"
						  :style="{color:'red',fontSize:'24rpx',paddingLeft:'10rpx'}"
						  class="skuOrPrice">
						原价{{ _nowSelectedItem.original_price }}
					</text>
				</view>
				<view v-if="!_nowSelectedItem">
					<text :style="{color:'red',fontSize:'36rpx'}">未选择</text>
				</view>
				<view class="skuSelectedText" style="margin-top: 10rpx">
					<text>已选择：{{ _nowSelectedItem ? _nowSelectedItem.title : '未选择' }}，数量：{{ buy }}</text>
				</view>
				<view style="margin-top: 10rpx">
					<tm-stepper v-model="buy" :max="maxBuyNumber" :min="minBuyNumber" height="56"
								width="220"></tm-stepper>
				</view>
			</view>
		</view>
		<view class="skuWrap">
			<view v-for="(item,index) in _data.data" :key="index" style="margin-top: 24rpx">
				<view>
					<text :style="{fontSize:'32rpx'}">{{ item.title }}</text>
				</view>
				<view style="margin-top: 24rpx">
					<tm-badge
						v-for="(item2) in (item.children??[])"
						:label="(item2?.inventory_quantity??1)==0?'缺货':''"
						:offset="[22,0]"
					>
						<tm-tag
							:color="isSelectedTags(item2.id)?props.color:'info'"
							:style="{margin:`0 12rpx 12rpx 0`,opacity:(item2?.inventory_quantity??1)==0?0.5:1}"
							@click="selectedItem(item,index,item2)">
							{{ item2.title }}
						</tm-tag>
					</tm-badge>
				</view>
			</view>

		</view>

		<template v-slot:footer>
			<view style="display: flex;flex-direction: row;justify-content: space-between">
				<view v-if="_showAddStore" style="flex: 1;margin-right: 20rpx" @click="onAdd">
					<!--
					 @slot 添加购物车按钮
					 -->
					<slot name="add">
						<tm-button :color="props.color" :skin="'thin'" block round="64">加入购物车</tm-button>
					</slot>
				</view>
				<view style="flex: 1;" @click="onConfirm">
					<!--
					 @slot 支持按钮
					 -->
					<slot name="buy">
						<tm-button :color="props.color" :disabled="disabledBuy" block round="64">
							{{ buyBtnText }}
						</tm-button>
					</slot>
				</view>

			</view>
		</template>

	</tm-drawer>
</template>
<style scoped>
.skuOrPrice {
	text-decoration: line-through;
}

.skuSelectedText {
	font-size: 24rpx;

}

.skuWrap {
	padding-top: 32rpx;
}
.skuHeader {
	display: flex;
	flex-direction: row;
	padding-top: 20rpx;
}
</style>