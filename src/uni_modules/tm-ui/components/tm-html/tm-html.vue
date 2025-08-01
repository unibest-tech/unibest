<template>
	<view id="_root" :class="(selectable?'_select ':'')+'_root'">
		<slot v-if="!nodes[0]" />
		<mp-node :imgList="imgList" v-else :childs="nodes" :opts="[lazyLoad,loadingImg,errorImg,showImgMenu,selectable,previewImg]" name="span"></mp-node>
	</view>
</template>

<script lang="ts" setup>
	import { computed, ref, onMounted, PropType, onBeforeUnmount, getCurrentInstance, watch, nextTick } from "vue"
	import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit } from "../../libs/tool";
	import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
	import { useTmConfig } from "../../libs/config";
	import Parser from "./pare";
	import mpNode from "./mp-node.vue"

	/**
	 * @displayName HTML
	 * @exportName tm-html
	 * @category 展示组件
	 * @description html渲染组件,这是精简后的不是所有插件都带上容易让组件变大，如果想要全部的，可以去用作者的,它是引用第三方实现见：https://github.com/jin-yufeng/mp-html
	 * @constant 平台兼容
	 *	| H5 | uniAPP | 小程序 | version |
		| --- | --- | --- | --- |
		| ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
	 */
	defineOptions({ name: 'TmHtml' });
	const { config } = useTmConfig()
	const emits = defineEmits(['load', 'ready', 'imgtap', 'linktap', 'play', 'error'])
	const props = defineProps({
		/**
		 * 窗口宽
		 */
		width: {
			type: String,
			default: 'auto'
		},
		/**
		 * 窗口高
		 */
		height: {
			type: String,
			default: 'auto'
		},
		/**
		 * 需要渲染的markdow或者html内容。
		 */
		value: {
			type: String,
			default: ""
		},
		/**
		 * 需要渲染的markdow或者html内容。
		 */
		selectable: {
			type: [Boolean, String],
			default: false
		},
		/**
		 * 需要渲染的markdow或者html内容。
		 */
		lazyLoad: {
			type: [Boolean, String],
			default: false
		},
		/**
		 * 需要渲染的markdow或者html内容。
		 */
		loadingImg: {
			type: [Boolean, String],
			default: true
		},
		errorImg: {
			type: String,
			default: ''
		},
		showImgMenu: {
			type: [Boolean, String],
			default: true
		},
		
		previewImg: {
			type:  [Boolean, Number],
			default: ''
		},
	})

	const _width = computed(() => covetUniNumber(props.width, config.unit))
	const _height = computed(() => covetUniNumber(props.height, config.unit))
	const nodes = ref([])
	const _videos = ref([])
	const imgList = ref([])
	const _in = ref<Record<string, any>>({})
	const proxy = getCurrentInstance()?.proxy

	const inthis = (page, selector, scrollTop) => {
		if (page && selector && scrollTop) {
			_in.value = {
				page,
				selector,
				scrollTop
			}
		}
	}


	const navigateTo = (id, offset) => {
		return new Promise((resolve, reject) => {
			
			offset = offset ||  0
			let deep = ' '

			// #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO
			deep = '>>>'
			// #endif

			const selector = uni.createSelectorQuery()
				// #ifndef MP-ALIPAY
				.in(_in.value ? _in.value.page : proxy)
				// #endif
				.select((_in.value ? _in.value.selector : '._root') + (id ? `${deep}#${id}` : '')).boundingClientRect()
			if (_in.value) {
				selector.select(_in.value.selector).scrollOffset()
					.select(_in.value.selector).boundingClientRect()
			} else {
				// 获取 scroll-view 的位置和滚动距离
				selector.selectViewport().scrollOffset() // 获取窗口的滚动距离
			}
			selector.exec(res => {
				if (!res[0]) {
					reject(Error('Label not found'))
					return
				}
				const scrollTop = res[1].scrollTop + res[0].top - (res[2] ? res[2].top : 0) + offset
				if (_in.value) {
					// scroll-view 跳转
					_in.value.page[_in.value.scrollTop] = scrollTop
				} else {
					// 页面跳转
					uni.pageScrollTo({
						scrollTop,
						duration: 300
					})
				}
				resolve()
			})

		})
	}


	const getText = (nodesa) => {
		let text = '';
		(function traversal(nodesa) {
			for (let i = 0; i < nodesa.length; i++) {
				const node = nodesa[i]
				if (node.type === 'text') {
					text += node.text.replace(/&amp;/g, '&')
				} else if (node.name === 'br') {
					text += '\n'
				} else {
					// 块级标签前后加换行
					const isBlock = node.name === 'p' || node.name === 'div' || node.name === 'tr' || node.name === 'li' || (node.name[0] === 'h' && node.name[1] > '0' && node.name[1] < '7')
					if (isBlock && text && text[text.length - 1] !== '\n') {
						text += '\n'
					}
					// 递归获取子节点的文本
					if (node.children) {
						traversal(node.children)
					}
					if (isBlock && text[text.length - 1] !== '\n') {
						text += '\n'
					} else if (node.name === 'td' || node.name === 'th') {
						text += '\t'
					}
				}
			}
		})(nodesa || nodes.value)
		return text
	}


	const getRect = () => {
		return new Promise((resolve, reject) => {
			uni.createSelectorQuery()
				// #ifndef MP-ALIPAY
				.in(proxy)
				// #endif
				.select('#_root').boundingClientRect().exec(res => res[0] ? resolve(res[0]) : reject(Error('Root label not found')))
		})
	}

	const pauseMedia = () => {
		for (let i = (_videos.value || []).length; i--;) {
			_videos.value[i].pause()
		}
	}


	const setPlaybackRate = (rate) => {
		for (let i = (_videos.value || []).length; i--;) {
			_videos.value[i].playbackRate(rate)
		}
	}

	const setContent = (content, append = false) => {
		if (!append || !imgList.value) {
			imgList.value = []
		}
		const par = new Parser({
			nodes:nodes.value,
			containerStyle:'',
			domain:'',
			useAnchor:0,
			lazyLoad:props.lazyLoad,
			pauseVideo:false,
			setTitle:false,
			scrollTable:false,
			selectable:props.selectable,
			previewImg:props.previewImg
		})
		const nodesas  = par.parse(content)
		imgList.value = par.imgList
		

		nodes.value = append ? (nodes.value || []).concat(nodesas) : nodesas
		_videos.value = []
		nextTick(() => {
			emits('load')
		})

		if (props.lazyLoad || imgList.value._unloadimgs < imgList.value.length / 2) {
			// 设置懒加载，每 350ms 获取高度，不变则认为加载完毕
			let height = 0
			const callback = rect => {
				if (!rect || !rect.height) rect = {}
				// 350ms 总高度无变化就触发 ready 事件
				if (rect.height === height) {
					emits('ready', rect)
				} else {
					height = rect.height
					setTimeout(() => {
						getRect().then(callback).catch(callback)
					}, 350)
				}
			}
			getRect().then(callback).catch(callback)
		} else {
			// 未设置懒加载，等待所有图片加载完毕
			if (!imgList.value._unloadimgs) {
				getRect().then(rect => {
					emits('ready', rect)
				}).catch(() => {
					emits('ready', {})
				})
			}
		}
	
	}





	watch(() => props.value, () => {
		setContent(props.value)
	})
	onMounted(() => {
		if (props.value && !nodes.value.length) {
			setContent(props.value)
		}
	})
	onBeforeUnmount(() => {
		
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
<style scoped>
	._root {
		padding: 1px 0;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
	}

	/* 长按复制 */
	._select {
		user-select: text;
	}
</style>