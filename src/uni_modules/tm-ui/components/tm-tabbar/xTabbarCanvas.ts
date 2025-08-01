/*
 * Copyright (c) 2025. tmzdy by @https://tmui.design
 */

export default class xTabbarCanvas {
	dom: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	tuqiSize: number = 60
	toQiSafeTop: number = 25
	dpr: number = 0
	loadimgs: string | null = null
	domWidth = 0
	domHeight = 0
	domOffsetWidth = 0
	domOffsetHeight = 0
	mp_context: any = null
	mp_boxRealWidth = 0

	constructor(dom: HTMLCanvasElement, content: CanvasRenderingContext2D, safeHeight: number, w: number, h: number, ofw: number, ofh: number, mpContext: any = null,boxwidht=0) {
		const dpr = uni.getWindowInfo().pixelRatio ?? 1
		this.domWidth = w
		this.domHeight = h
		this.domOffsetWidth = ofw
		this.domOffsetHeight = ofh

		this.dpr = dpr
		this.dom = dom
		this.ctx = content
		this.mp_context = mpContext
		this.mp_boxRealWidth = boxwidht
	}

	callback: () => void = () => {
	}

	addRestoredListener(fun: () => void) {
		this.callback = fun
	}

	/** 绘制背景颜色 */
	fillBgColor(color: string, activeIndex: number) {
		let ctx = this.ctx
		ctx.globalCompositeOperation = 'source-over'
		ctx.fillStyle = color
		ctx.fillRect(0, activeIndex > -1 ? this.toQiSafeTop : 0, this.domWidth, this.domHeight)
	}

	/** 绘制图片背景 */
	fillBgImage(color: string, activeIndex: number) {
		let ctx = this.ctx
		ctx.fillStyle = color
		ctx.fillRect(0, activeIndex > -1 ? this.toQiSafeTop : 0, this.domWidth, this.domHeight)
	}

	/** 绘制渐变 */
	fillBgLigren(color: string[], activeIndex: number) {
		let ctx = this.ctx


		ctx.globalCompositeOperation = 'source-over'
		let tuqiheight = activeIndex > -1 ? this.toQiSafeTop : 0
		let liner = ctx.createLinearGradient(0, (this.domHeight - tuqiheight) / 2, this.domWidth, (this.domHeight - tuqiheight) / 2)
		liner.addColorStop(0, color[1])
		liner.addColorStop(0.5, color[2])
		ctx.fillStyle = liner
		ctx.fillRect(0, tuqiheight, this.domWidth, this.domHeight)

	}

	setTuQi(count: number, activeIndex: number, mpimg?: Image) {
		let t = this
		if (activeIndex == -1) return
		let width = this.domOffsetWidth

		let height = this.domHeight
		let itemwidth = width / count

		let ctx = this.ctx
		let space = 2
		// ctx.fillStyle = "#ff0000"

		let size = this.tuqiSize + space * 2
		let r = size / 2
		ctx.globalCompositeOperation = 'xor'
		this.loadimgs = 'static/tabaarMasker.png'
		let x = itemwidth * (activeIndex + 1) - itemwidth / 2
		ctx.save()
		// #ifdef H5
		let img = new Image(164, 70)
		img.src = this.loadimgs
		img.onload = () => {
			ctx.drawImage(img, x - 82 / 2, this.toQiSafeTop, 82.5, 35)
		}
		// #endif
		// #ifdef MP-WEIXIN
		mpimg.src = '/static/tabaarMasker.png'
		mpimg.onload = () => {
			console.log(width)
			let ratio = width/t.mp_boxRealWidth;
			ctx.drawImage(mpimg,0,0,164,70, x - 82 / 2, this.toQiSafeTop, 82, 35)
		}
		// #endif

	}

	setTuQiTop(color: string[], count: number, activeIndex: number) {
		let t = this
		if (this.loadimgs != null) {
			this.loadimgs = null
		}
		if (activeIndex == -1) return
		let width = this.domOffsetWidth
		let height = this.domHeight
		let itemwidth = width / count

		let ctx = this.ctx

		// ctx.fillStyle = 'red'
		ctx.globalCompositeOperation = 'source-over'
		ctx.clearRect(0, 0, this.domWidth, this.domHeight)
		// ctx.fillRect(0,0,100,25)


		let space = 2
		let size = this.tuqiSize + space * 2
		let r = size / 2
		let x = itemwidth * (activeIndex + 1) - itemwidth / 2
		// ctx.globalCompositeOperation = 'source-atop'
		this.loadimgs = '/static/tabaarMaskerTop.png'
		ctx.save()
		// #ifdef H5
		let img = new Image(158, 50)
		img.src = this.loadimgs
		img.onload = () => {
			ctx.drawImage(img, x - 76 / 2, 0, 76, 25)
			ctx.restore()
			ctx.globalCompositeOperation = 'source-atop'
			let liner = ctx.createLinearGradient(0, this.toQiSafeTop / 2, this.domWidth, this.toQiSafeTop / 2)
			liner.addColorStop(0, color[1])
			liner.addColorStop(0.5, color[2])
			ctx.fillStyle = liner
			ctx.fillRect(0, 0, this.domWidth, this.toQiSafeTop)
		}
		// #endif
		// #ifndef H5
		ctx.drawImage(t.loadimgs!, x - 76 / 2, 0, 76, 25)
		ctx.restore()
		ctx.globalCompositeOperation = 'source-atop'
		let liner = ctx.createLinearGradient(0, this.toQiSafeTop / 2, this.domWidth, this.toQiSafeTop / 2)
		liner.addColorStop(0, color[1])
		liner.addColorStop(0.5, color[2])
		ctx.fillStyle = liner
		ctx.fillRect(0, 0, this.domWidth, this.toQiSafeTop)
		// #endif


	}

	destory() {

		this.loadimgs = null
	}
}