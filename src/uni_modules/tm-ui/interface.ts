/*
 * Copyright (c) 2025. tmzdy by @https://tmui.design
 */

/**
 * 上传的文件状态
 * 0未上传，1上传中，2上传成功，3上传失败（网络错误），4已取消（终止，上到一半取消了）,5超过大小
 * 0 Not uploaded, 1 Uploading, 2 Upload successful, 3 Upload failed (network error), 4 Cancelled (terminated, canceled halfway), 5 Exceeds size limit,
 */
export enum TMUPLOAD_PHOTO_STATUS {
	NOT = 0,
	UPLOADING = 1,
	UPLOAD_SUCCESS = 2,
	UPLOAD_FAILED = 3,
	CANCELLED = 4,
	EXCEEDS_SIZE_LIMIT = 5,
}
declare global {
	/**
	 * TMUI3.2.x类型命名空间
	 * @author tmzdy
	 * @date 2024-8-1
	 */
	namespace TM {
		export type NAVIGATE_TYPE = 'navigate' | 'redirect' | 'switchTab' | 'reLaunch' | 'navigateBack';
		/** 按钮尺寸大小 */
		export type BUTTON_SIZE = "xs" | "s" | "m" | "n" | "g"
		/** 按钮或者标签的主题样式 */
		export type BUTTON_THEME = "thin" | "outlined" | "text" | "normal" | "dashed"
		/** 主题状态 */
		export type THEME_STATUS = "warn" | "success" | "info" | "error" | "error"
		/** 主题样式 */
		export type THEME_MODE = "auto" | "dark" | "light"

		export interface THEME_CONFIG {
			/** 主题模式 */
			mode: THEME_MODE,
			color: string,
			unit: 'rpx' | 'px',
			// 默认相对字号
			fontSizeBase: string | number,
			// 默认相对字号fontSizeBase倍数
			fontSizeScale: 1,
			buttonRadius: number | string,
			/** button默认的投影大小,none全局投影取消,但不影响局部值 */
			buttonShadow: number | string | Array<string>,

			sheetRadius: number | string | Array<string | number>,
			sheetShadow: number | string | Array<string>,
			sheetMargin: number | string | Array<string | number>,
			sheetPadding: number | string | Array<string | number>,

			//列表默认的圆角。
			cellRadius: number | string | Array<string | number>,


			/** 一般容器sheet的暗黑背景 */
			sheetDarkColor: string,
			/** 一般容器边线颜色如果你布局自己写了默认的边线色，但忘记填写组件上的暗黑线时，会取这里的值 */
			sheetDarkBorderColor: string[],

			/** 输入框,表单，常规灰背景待统一的二级暗黑背景 */
			inputDarkColor: string,
			/**输入框默认全局的亮系背景. */
			inputLightColor: string,
			/**输入框全局圆角 */
			inputRadius: number | string | Array<string | number>,
			/** 一般的表单，列表底的暗黑统一边线颜色 */
			borderDarkColor: string,
			/**对话框圆角 */
			modalRadius: number | string,
			/**形状圆角 */
			switchRadius: number | string,
			/**抽屉圆角 */
			drawerRadius: number | string,
			unRadioAndCheckBoxColor: string,

			/**部分组件统一的动画差值。 */
			animation: string,
			
			backgroundColorContentDark:string,
		}
		export type tmDateDayInfoType = {
			/** 年 */
			year: number,
			/** 月0-11 */
			month: number,
			/** 天 */
			day: number,
			/** 小时0-23 */
			hours: number,
			/** 分钟0-59 */
			minutes: number,
			/** 秒0-59 */
			seconds: number,
			/** 本年的第几周 */
			weeks: number,
			/** 本周星期几 */
			week: number,
			/** 本周星期几,中文名称 */
			weekCn: string,
			/** 格式化的日期字符串 */
			date: string,
			/** 是否渲染显示 */
			isRender?: boolean
		}

		/**
		 * 上传的文件类型
		 */
		export type TMUPLOAD_PHOTO_INFO = {
			id: string,
			/** 文件大小 */
			size?: number,
			/** 文件路径 */
			path: string,
			progress: number,
			statusText: string,
			status: TMUPLOAD_PHOTO_STATUS,
			response: any
		}
		export type FORM_RULE_TYPE = {
			/** 校验正则,如果同时提供了valid,以valid为准,默认为null */
			rule: RegExp|null,
			/** 校验失败提示,默认提示词:请正在选择/填写 */
			message: string,
			/**校验函数,如果不提供,默认以min,max来判断. */
			validator: null|((val: any) => boolean),
			/**
			 * 如果校验的值类型是数字是起作用,默认为1,至少要大于0
			 * 如果预期是数组,那长度至少要大于0
			 * 如果是字符串,长度要大于0
			 */
			min: number,
			//默认为-1最长/大值不限制
			max: number,
			//预期值的类型,如果不提供自动推断，不提供默认是auto
			type: "string" | "number" | "array" | "boolean" | "date" | "email" | "phone"|"auto",
			//必填项,是否校验本值
			required: boolean
		}
		export type FORM_RULE = { [Property in keyof FORM_RULE_TYPE]?: FORM_RULE_TYPE[Property] } & { required: boolean }
		export type FORM_RESULT_TYPE = { key: string, isPass: boolean, message: string, data: any }
		export type FORM_SUBMIT_RESULT = {
			/**是否校验通过 */
			isPass: boolean,
			/**校验不通过的第一条信息 */
			firstValid: FORM_RESULT_TYPE | null,
			/**校验结果集 */
			result: FORM_RESULT_TYPE[]
		}

		export type SKU_DATA_ITEM = {
			/** 产品id */
			id: string | number,
			/** 分类/规格名称 */
			title: string,
			/** 库存数量 */
			inventory_quantity?: number,
			/** 规格数组 */
			children?: Array<SKU_DATA_ITEM>,
			/** 自定义数据 */
			[p: string]: any
		}
		export type SKU_PRODUCT = {
			/** 唯一id值,必须是规格产品id组合,以 - 连接符连接,比如22-23-24 */
			id: string | number,
			/** 产品图片 */
			img: string,
			/** 库存数量 */
			inventory_quantity: number,
			/** 最大购买量 */
			max_buy_quantity: number,
			/** 最小购买量 */
			min_buy_quantity: number,
			/** 产品原价 */
			original_price: number,
			/** 产品现行售价 */
			price: number,
			/** 产品规格名称 */
			title: string,
			/** 自定义数据 */
			[p: string]: any
		}
		export type SKU_DATA = {
			/** 规格分组产品 */
			data: Array<SKU_DATA_ITEM>,
			/** 平铺产品列表 */
			product: SKU_PRODUCT[] | null
		}

		/**
		 * 底部导航项目信息tabbar
		 */
		export type TABBAR_ITEM_INFO = {
			/**
			 * 标题
			 * @type {string}
			 */
			title?: string;
			/**
			 * 图标
			 * @type {string}
			 */
			icon?: string;
			/**
			 * 被选中时的图标
			 * @type {string}
			 */
			selectedIcon?: string;
			/**
			 * 是否禁用
			 * @type {boolean}
			 */
			disabled?: boolean;

			/**
			 * 默认颜色
			 * @type {string}
			 */
			color?: string;
			/**
			 * 选中时的颜色
			 * @type {string}
			 */
			selectedColor?: string;

			/**
			 * 打开方式
			 * @type {NAVIGATE_TYPE}
			 */
			openType?: NAVIGATE_TYPE;
			/**
			 * 链接地址
			 * @type {string}
			 */
			url?: string;
			/**
			 * 是否显示角标。如果为dot，dotLabel不为空优先展示文本角标
			 * dot,
			 * label
			 */
			dotType?: string,
			/**
			 * 文本角标。空不展示。
			 */
			dotLabel?: string
		}

		export type TABBAR_ITEM = {
			title: string,
			icon: string,
			selectedIcon: string,
			disabled: boolean,
			color: string,
			selectedColor: string,
			openType: string,
			url: string,
			/**
			 * 是否显示角标。如果为dot，dotLabel不为空优先展示文本角标
			 * dot,
			 * label
			 */
			dotType?: string,
			/**
			 * 文本角标。空不展示。
			 */
			dotLabel?: string
		}

	}
}
export { }

