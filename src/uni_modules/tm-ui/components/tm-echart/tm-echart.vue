<script setup lang="ts">
	// @ts-nocheck
	import { computed, ref, onMounted, watch, PropType, getCurrentInstance, nextTick } from "vue";
	import { arrayNumberValid, getUid, arrayNumberValidByStyleMP, arrayNumberValidByStyleBorderColor, arrayNumberValidByStyleBorderStyle, covetUniNumber, linearValid, getUnit } from "../../libs/tool";
	import { useTmConfig } from "../../libs/config";
	import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
	import WxCanvas from './canvasinit';
	// @ts-ignore
	import * as echarts from "./simple.js";
	import { ECharts } from "echarts";
	const proxy = getCurrentInstance()?.proxy
	let canvasId = ref("canvasId")
	// #ifdef H5 || APP-PLUS || APP-VUE
	canvasId.value = "tm" + new Date().getTime().toString();
	// #endif

	/**
	* @displayName 百度图表
	* @exportName tm-echart
	* @category 展示组件
	* @description 可以通过onInt或者ref函数getChart取得ECharts对象自行处理和设置数据,这个组件使用会超过530kb+大小,请小心你的包大小限制,超过大小哦.
	* 使用时请注意找到图表目录：node_modules/echarts/lib/core/echarts.js,
	  把原来的：
	  defaultRenderer = root.__ECHARTS__DEFAULT__RENDERER__ || defaultRenderer;
	  defaultCoarsePointer = retrieve2(root.__ECHARTS__DEFAULT__COARSE_POINTER, defaultCoarsePointer);
	  var devUseDirtyRect = root.__ECHARTS__DEFAULT__USE_DIRTY_RECT__;
	  改成如下：
	  defaultRenderer = root?.__ECHARTS__DEFAULT__RENDERER__ ?? defaultRenderer;
	  defaultCoarsePointer = retrieve2(root?.__ECHARTS__DEFAULT__COARSE_POINTER, defaultCoarsePointer);
	  var devUseDirtyRect = root?.__ECHARTS__DEFAULT__USE_DIRTY_RECT__??null;
	* @constant 平台兼容
	*	| H5 | uniAPP | 小程序 | version |
	   | --- | --- | --- | --- |
	   | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
	*/
	defineOptions({ name: 'TmF2' });
	const { config } = useTmConfig()
	const emits = defineEmits([
		/**
		 * 初始成功触发
		 * @param {Cart} chart对象
		 */
		'onInit',
		/**
		 * 图表元素被点击时触发
		 * @param {Object} chart的事件对象参数
		 */
		'click'
	])
	const props = defineProps({
		/**
		 * 宽度css合法值,不要用auto
		 */
		width: {
			type: [String, Number],
			default: '100%'
		},
		/**
		 * 高度，css合法值,不要用auto，需要一个值,单位随意，不带单位默认是rpx
		 */
		height: {
			type: [String, Number],
			default: '300px'
		}
	})

	const _width = computed(() => covetUniNumber(props.width, config.unit))
	const _height = computed(() => covetUniNumber(props.height, config.unit))
	let ctx : UniApp.CanvasContext;
	let ctxNode : any;
	let chart : echarts.ECharts | null = null
	const pixelRatio = uni.getWindowInfo().pixelRatio
	const is2d = ref(false)
	// #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ
	is2d.value = true
	// #endif
	const isPc = ref(false)
	isPc.value = uni.getSystemInfoSync().model == 'PC' ? true : false;
	let tid = 0
	onMounted(() => {
		nextTick(() => {
			if (is2d.value) {
				setTimeout(() => MpWeix_init(), 100)
			} else {
				setTimeout(() => appvueH5Other(), 50)
			}
		})

	})
	//appvue,h5,和其它平台。
	async function appvueH5Other(fun : Function) {

		const { width, height } = await getDomSize()
		echarts.registerPreprocessor((option : any) => {
			if (option && option.series) {
				if (option.series.length > 0) {
					option.series.forEach((series : echarts.SeriesOption) => {
						series.progressive = 0;
					});
				} else if (typeof option.series === 'object') {
					option.series.progressive = 0;
				}
			}
		});
		ctx = uni.createCanvasContext(canvasId.value, proxy);

		if (!isPc.value) {
			const canvas : any = new WxCanvas(ctx, canvasId.value, false, false)

			echarts.setPlatformAPI({ createCanvas: () => canvas });

			try {
				chart = echarts.init(canvas, "", {
					width: width,
					height: height,
				});
			} catch (e) {
				console.log(e)
			}

			chart.on('click', (e) => {
				emits('click', e)
			})

			canvas.setChart(chart);
		} else {
				console.log(isPc.value)
			const canvasNode : HTMLCanvasElement | undefined = document.querySelector('#' + canvasId.value)?.getElementsByTagName("canvas")[0];
			const canvaseNodeHtml = document.querySelector('#' + canvasId.value) as HTMLDivElement

	
			ctx = canvasNode?.getContext("2d")
			tid = setTimeout(() => {
				let divRemoveMasker = canvaseNodeHtml?.getElementsByTagName("div")
				if (canvaseNodeHtml && divRemoveMasker && divRemoveMasker?.length > 0) {
					try {
						canvaseNodeHtml?.removeChild(divRemoveMasker[0])
					} catch (e) {
					}

				}

			}, 300)
			if (canvasNode?.offsetWidth ?? null) {
				canvasNode.width = canvasNode.offsetWidth * pixelRatio
				canvasNode.height = canvasNode.offsetHeight * pixelRatio
			}

			tid = setTimeout(() => {
				if (canvasNode?.offsetWidth ?? null) {
					canvasNode.width = canvasNode.offsetWidth * pixelRatio
					canvasNode.height = canvasNode.offsetHeight * pixelRatio
				}
			}, 50);

			chart = echarts.init(canvasNode);
			chart.on('click', (e) => {
				emits('click', e)
			})
		}

		emits("onInit", chart)
		if (typeof fun === 'function') {
			fun(chart)
		}
	}
	//支付宝和微信，QQ 支持2d渲染。
	async function MpWeix_init(fun : Function) {
		const { width, height } = await getDomSize()

		echarts.registerPreprocessor((option : any) => {
			if (option && option.series) {
				if (option.series.length > 0) {
					option.series.forEach((series : echarts.SeriesOption) => {
						series.progressive = 0;
					});
				} else if (typeof option.series === 'object') {
					option.series.progressive = 0;
				}
			}
		});

		const query = uni.createSelectorQuery().in(proxy)
		// #ifdef MP-ALIPAY
		query.select('#canvasId').node().exec((res2) => {
			const canvasNode = res2[0].node;

			let ctxvb : UniApp.CanvasContext = canvas.getContext('2d');
			canvasNode.width = res[0].width * pixelRatio
			canvasNode.height = res[0].height * pixelRatio
			ctx = ctxvb;
			ctxNode = canvasNode
			const canvas = new WxCanvas(ctx, canvasId.value, true, canvasNode)
			echarts.setPlatformAPI({
				// Same with the old setCanvasCreator
				createCanvas() {
					return canvas;
				},
			});
			chart = echarts.init(canvas, null, {
				width: width,
				height: height,
				devicePixelRatio: pixelRatio
			});
			canvas.setChart(chart);
			chart.on('click', (e) => {
				emits('click', e)
			})
			emits("onInit", chart)
			if (typeof fun === 'function') {
				fun(chart)
			}
		})
		// #endif
		// #ifdef MP-WEIXIN || MP-QQ
		query.select('#canvasId')
			.fields({
				node: true,
				size: true,
				context: true
			})
			.exec((res) => {

				let canvasNode = {} as any;
				let ctxvb = {} as any;
				let canvas = {} as any;
				// #ifdef MP-WEIXIN
				canvasNode = res[0].node;
				ctxvb = canvasNode.getContext('2d')
				canvasNode.width = res[0].width * pixelRatio
				canvasNode.height = res[0].height * pixelRatio

				ctxvb.scale(pixelRatio, pixelRatio)
				ctx = ctxvb;
				ctxNode = canvasNode
				canvas = new WxCanvas(ctx, canvasId.value, true, canvasNode)
				echarts.setPlatformAPI({
					// Same with the old setCanvasCreator
					createCanvas() {
						return canvas;
					},
				});

				chart = echarts.init(canvas, null, {
					width: width,
					height: height,
					devicePixelRatio: pixelRatio
				});

				canvas.setChart(chart);
				chart.on('click', (e) => {
					emits('click', e)
				})
				emits("onInit", chart)

				// #endif
				// #ifdef MP-QQ
				ctxvb = res[0].context
				canvasNode.width = res[0].width * pixelRatio
				canvasNode.height = res[0].height * pixelRatio
				ctxvb.scale(pixelRatio, pixelRatio)
				ctx = ctxvb;
				canvas = new WxCanvas(ctx, canvasId.value, true, canvasNode)
				echarts.setPlatformAPI({
					// Same with the old setCanvasCreator
					createCanvas() {
						return canvas;
					},
				});
				chart = echarts.init(canvas, null, {
					width: width,
					height: height,
					devicePixelRatio: pixelRatio
				});
				canvas.setChart(chart);
				chart.on('click', (e) => {
					emits('click', e)
				})
				emits("onInit", chart)
				// #endif

				if (typeof fun === 'function') {
					fun(chart)
				}
			})
		// #endif


	}

	function getChart() : Promise<ECharts> {
		return new Promise((res, rej) => {
			if (is2d.value) {
				setTimeout(() => MpWeix_init(chart => res(chart)), 100)
			} else {
				setTimeout(() => appvueH5Other(chart => res(chart)), 50)
			}
		})
	}

	function getImg() {
		return new Promise((res, rej) => {
			if (!ctx) {
				console.error('tmChart没有初始化')
				rej('没有初始化')
				return
			}
			uni.canvasToTempFilePath({
				x: 0,
				y: 0,
				width: _width.value,
				height: _height.value,
				canvasId: canvasId.value,
				canvas: ctxNode,
				success: function (respone) {
					// 在H5平台下，tempFilePath 为 base64
					res(respone.tempFilePath);
				},
				fail: (respone) => {
					console.error(respone)
					rej(res);
				},
			});
		})
	}


	const getDomSize = () : Promise<{ width : number, height : number }> => {
		return new Promise((res, rej) => {
			uni.createSelectorQuery()
				.in(proxy)
				.select('.canvas')
				.boundingClientRect()
				.exec((result) => {
					let node = result[0]
					res({
						width: node.width,
						height: node.height
					})
				})
		})
	}


	defineExpose({ getChart, getImg })


	function touchStart(e : TouchEvent) {
		if (chart && e.touches.length > 0) {
			var touch = e.touches[0];
			var handler = chart.getZr().handler;
			handler.dispatch('mousedown', {
				zrX: touch.x,
				zrY: touch.y,
				preventDefault: () => { },
				stopPropagation: () => { }
			});
			handler.dispatch('mousemove', {
				zrX: touch.x,
				zrY: touch.y,
				preventDefault: () => { },
				stopPropagation: () => { }
			});
			handler.processGesture(wrapTouch(e), 'start');
			// emits('touchStart', e)
		}
	}

	function touchMove(e : TouchEvent) {
		if (chart && e.touches.length > 0) {
			var touch = e.touches[0];
			var handler = chart.getZr().handler;
			handler.dispatch('mousemove', {
				zrX: touch.x,
				zrY: touch.y,
				preventDefault: () => { },
				stopPropagation: () => { }
			});
			handler.processGesture(wrapTouch(e), 'change');
			// emits('touchMove', e)
		}
	}

	function touchEnd(e : TouchEvent) {
		if (chart) {
			const touch = e.changedTouches ? e.changedTouches[0] : {};
			var handler = chart.getZr().handler;
			handler.dispatch('mouseup', {
				zrX: touch.x,
				zrY: touch.y,
				preventDefault: () => { },
				stopPropagation: () => { }
			});
			handler.dispatch('click', {
				zrX: touch.x,
				zrY: touch.y
			});
			handler.processGesture(wrapTouch(e), 'end');
			// emits('touchEnd', e)
		}
	}

	function wrapTouch(event : TouchEvent) {
		for (let i = 0; i < event.touches.length; ++i) {
			const touch = event.touches[i];
			touch.offsetX = touch.x;
			touch.offsetY = touch.y;
		}
		return event;
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
<style lang="css" scoped></style>
<template>

	<!-- #ifndef MP-WEIXIN || MP-ALIPAY || MP-QQ || APP-NVUE -->
	<canvas v-if="!isPc" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :id="canvasId"
		:canvas-id="canvasId" class="canvas" :style="{ width: _width, height: _height }"></canvas>

	<canvas v-if="isPc" :id="canvasId" :canvas-id="canvasId" class="canvas"
		:style="{ width: _width, height: _height }"></canvas>
	<!-- #endif -->
	<!-- #ifdef MP-WEIXIN || MP-QQ -->
	<canvas @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" type="2d" id="canvasId"
		canvas-id="canvasId" class="canvas" :style="{ width: _width, height: _height }"></canvas>
	<!-- #endif -->
	<!-- #ifdef MP-ALIPAY -->
	<canvas @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" type="2d" :id="canvasId"
		:canvas-id="canvasId" class="canvas" :style="{ width: _width, height: _height }"></canvas>
	<!-- #endif -->

</template>