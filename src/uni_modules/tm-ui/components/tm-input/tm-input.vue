<template>
	<view class="tmInput" :style="{
        width: _width,
        height: _height,
        minHeight: _minHeight,
        color: _fontColor,
        
    }">
		<!-- 
        @slot 左侧插槽
        -->
		<slot name="left">
			<text v-if="_attrs.leftText !== ''" :style="{ marginRight: '24rpx', fontSize: _fontSize }">{{
                _attrs.leftText
            }}</text>
		</slot>

		<view class="tmInputWrap" :style="[
            {
                backgroundColor: _color,
                fontSize: _fontSize,
                height: '100%',
                borderRadius: _round,
               
            },
            _focusHighlight

        ]" :class="[_attrs.inputClass]">
			<!-- 
            @slot 输入框左侧图标插槽
            -->
			<slot name="leftIcon">
				<tm-icon :_style="`padding-left:${_inputPadding}`" v-if="_attrs.leftIcon" :size="_attrs.fontSize"
					:name="leftIcon" :color="_attrs.iconColor || config.color"></tm-icon>
			</slot>
			<view class="tmInputWrapBox" :style="[{ height: '100%',padding: `0 ${_inputPadding}` }]">
				<!-- :alwaysEmbed="_attrs.alwaysEmbed",:cursor="_attrs.cursor" -->
				<input v-if="_attrs.type != 'textarea'" @keyboardheightchange="onkeyboardheightchange"
					@confirm="onconfirm" @focus="onfocus" @blur="onblur" @input="oninput" :value="nowValue"
					@change="onchange" :password="_attrs.password&&showPasswordEye" :disabled="_attrs.disabled"
					:maxlength="_attrs.maxlength" :cursorSpacing="_attrs.cursorSpacing" :focus="_attrs.focus"
					:confirmType="_attrs.confirmType" :confirmHld="_attrs.confirmHold" :type="_attrs.type"
					:cursorColor="_currorColor" :selectionStart="_attrs.selectionStart"
					:selectionEnd="_attrs.selectionEnd" :adjustPosition="_attrs.adjustPosition"
					:autoBlur="_attrs.autoBlur" :ignoreCompositionEvent="_attrs.ignoreCompositionEvent"
					:holdKeyboard="_attrs.holdKeyboard" :safePasswordCertPath="_attrs.safePasswordCertPath"
					:safePasswordLength="_attrs.safePasswordLength"
					:safePasswordTimeStamp="_attrs.safePasswordTimeStamp" :safePasswordNonce="_attrs.safePasswordNonce"
					:safePasswordSalt="_attrs.safePasswordSalt" :safePasswordCustomHash="_attrs.safePasswordCustomHash"
					:randomNumber="_attrs.randomNumber" :controlled="_attrs.controlled"
					:alwaysSystem="_attrs.alwaysSystem" :inputmode="_attrs.inputmode" class="tmInputInput tmInputText"
					:placeholderStyle="`textAlign: ${_attrs.align};fontSize:${_fontSize};` + _attrs.placeholderStyle"
					:placeholder="_attrs.placeholder" :placeholderClass="_attrs.placeholderClass" :style="[
                        {
                            textAlign: _attrs.align,
                            color: _inputFontColor,
                            fontSize:_fontSize,
                            width: '100%',
                            height: '100%',
                        },
                        _attrs.inputStyle

                    ]" />
				<!-- @vue-ignore -->
				<textarea v-else @keyboardheightchange="onkeyboardheightchange" @confirm="onconfirm" @focus="onfocus"
					@blur="onblur" @input="oninput" @linechange="onlinechange" :autoHeight="_attrs.autoHeight"
					:fixed="_attrs.fixed" :showConfirmBar="_attrs.showConfirmBar" :value="nowValue"
					:disabled="_attrs.disabled" :maxlength="_attrs.maxlength" :cursorSpacing="_attrs.cursorSpacing"
					:focus="_attrs.focus" :confirmHld="_attrs.confirmHold" :cursor="_attrs.cursor"
					:cursorColor="_currorColor" :selectionStart="_attrs.selectionStart"
					:selectionEnd="_attrs.selectionEnd" :adjustPosition="_attrs.adjustPosition"
					:autoBlur="_attrs.autoBlur" :ignoreCompositionEvent="_attrs.ignoreCompositionEvent"
					:holdKeyboard="_attrs.holdKeyboard" :inputmode="_attrs.inputmode"
					:placeholderStyle="`textAlign: ${_attrs.align};fontSize:${_fontSize};` + _attrs.placeholderStyle"
					:placeholder="_attrs.placeholder" :placeholderClass="_attrs.placeholderClass"
					class="tmInputInput tmInputTextArea" :style="[
                        {
                            width: '100%',
                            height: '100%',
                            textAlign: _attrs.align,
                            color: _inputFontColor,
                            fontSize:_fontSize,
							padding: `16rpx 0 `

                        },
                        _attrs.autoHeight ? { minHeight: _attrs.autoHeight } : { height: _height },
                        _attrs.inputStyle
                        ]" />
				<!-- <view class="tmInputPlaceholder" :class="[showPlaceholder&&!isFocus?'tmInputPlaceholderOn':'tmInputPlaceholderOff',_attrs.placeholderClass]" :style="[
                    {
                        textAlign: _attrs.align,
                        fontSize: _fontSize,
                        lineHeight: _minHeight,
                        padding: `0px ${_inputPadding}`,
                    },
                    _attrs.placeholderStyle,
                ]">
                    {{ _attrs.placeholder }}
                </view> -->
				<view class="tmInputShowChar" v-if="_attrs.maxlength > -1 && _attrs.showCharCount">
					<!-- 
                    @slot 输入框右侧显示字数
                    -->
					<slot name="maxlength">
						{{ String(nowValue).length + '/' + _attrs.maxlength }}
					</slot>
				</view>
			</view>
			<tm-icon :size="_attrs.fontSize" @click="onclear" _style="padding:16rpx;" :color="_clearColor"
				v-if="_attrs.showClear" name="close-circle-fill"></tm-icon>
			<tm-icon v-if="_attrs.showEye" :size="_attrs.fontSize" @click="showPasswordEye = !showPasswordEye"
				_style="padding:16rpx;" :color="showPasswordEye?_clearColor:config.color"
				:name="showPasswordEye?'eye-off-line':'eye-line'"></tm-icon>
			<!-- 
            @slot 输入框内右侧图标
            -->
			<slot name="rightIcon">
				<tm-icon :size="_attrs.fontSize" v-if="_attrs.rightIcon"
					:_style="_attrs.showClear ? 'margin-right:24rpx' : 'margin:0 24rpx'" :name="rightIcon"
					:color="_attrs.iconColor || config.color"></tm-icon>
			</slot>
		</view>
		<!-- 
        @slot 输入框右侧
         -->
		<slot name="right">
			<text v-if="_attrs.rightText != ''" :style="{ marginLeft: '24rpx', fontSize: _fontSize }">{{
                _attrs.rightText
            }}</text>
		</slot>
	</view>
</template>
<script setup lang="ts">
	import { computed, PropType, ref, watchEffect } from 'vue'
	import { arrayNumberValid, covetUniNumber } from '../../libs/tool'
	import { useTmConfig } from '../../libs/config'
	import { getDefaultColor, setTextColorLightByDark } from '../../libs/colors'

	/**
	 * @displayName 输入框
	 * @exportName tm-input
	 * @category 表单组件
	 * @description 可以全局配置圆角风格.
	 * @constant 平台兼容
	 *	| H5 | uniAPP | 小程序 | version |
		| --- | --- | --- | --- |
		| ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
	 */
	defineOptions({ name: "TmInput" });
	const { config } = useTmConfig();
	const emits = defineEmits([
		/**
		 * 输入框行数变化时触发(文本哉才有)
		 * @property {object} evt {height: 0, heightRpx: 0, lineCount: 0}
		 */
		'linechange',
		/**
		 * 键盘高度变化时触发
		 * @property {number} height 键盘高度
		 */
		'keyboardheightchange',
		/**
		 * 点击完成按钮时触发
		 * @property {string} value 输入的值
		 */
		'confirm',
		/**
		 * 失去焦点时触发
		 */
		'blur',
		/**
		 * 获取焦点时触发
		 */
		'focus',
		/**
		 * 清除事件
		 */
		'clear',
		/**
		 * 输入时候触发
		 * @property {string} value 输入的值
		 */
		"input",
		/**
		 * 等同v-model
		 * @property {string} value 输入的值
		 */
		"update:modelValue",
	]);
	const attrs = defineProps({
		/**
		 * 输入框的值
		 */
		modelValue: {
			type: [String, Number],
			default: "",
		},
		/**
		 * 输入框自定义的style样式
		 */
		inputStyle: {
			type: String,
			default: ""
		},
		/**
		 * 输入框自定义的class样式
		 */
		inputClass: {
			type: String,
			default: ""
		},
		/**
		 * 输入类型,可选值:text,number,idcard,digit,tel,safe-password,nickname,
		 * textarea:文本域
		 */
		type: {
			type: String as PropType<
				"text" | "number" | "idcard" | "digit" | "tel" | "safe-password" | "nickname" | "textarea"
			>,
			deffault: "",
		},
		/**
		 * 是否是密码框
		 */
		password: {
			type: Boolean,
			default: false,
		},
		/**
		 * 显示密码小眼睛
		 */
		showEye: {
			type: Boolean,
			default: false,
		},
		/**
		 * 输入框的占位文字
		 */
		placeholder: {
			type: String,
			default: "请输入或选择",
		},
		/**
		 * 输入框的占位文字样式
		 */
		placeholderStyle: {
			type: String,
			default: "color: #b1b1b1;",
		},
		/**
		 * 输入框的占位样式
		 */
		placeholderClass: {
			type: String,
			default: "",
		},
		/**
		 * 输入框的对齐方式,可选值:left,right,center
		 */
		align: {
			type: String as PropType<"left" | "right" | "center">,
			default: "left",
		},
		/**
		 * 输入框背景
		 */
		color: {
			type: String,
			default: "",
		},
		/**
		 * 输入框暗黑背景，空值取全局的配置
		 * 提供会覆盖全局的配色。默认是透明
		 */
		darkBgColor: {
			type: String,
			default: "transparent",
		},
		/**
		 * 输入框字体大小
		 */
		fontSize: {
			type: [String, Number],
			default: "32",
		},
		width: {
			type: [String, Number],
			default: "auto",
		},
		height: {
			type: [String, Number],
			default: "88",
		},
		minHeight: {
			type: [String, Number],
			default: "auto",
		},
		/**
		 * 输入框内的左右间隙
		 */
		inputPadding: {
			type: String,
			default: "24"
		},
		/**
		 * 输入框圆角,默认空值取全局的配置
		 */
		round: {
			type: [String, Number, Array<string | number>],
			default: ""
		},
		/**
		 * 是否显示清除按钮
		 */
		showClear: {
			type: Boolean,
			default: false
		},
		/**
		 * 清除按钮颜色
		 */
		clearColor: {
			type: String,
			default: "#b1b1b1"
		},
		/**
		 * 是否显示字符字统计
		 */
		showCharCount: {
			type: Boolean,
			default: false
		},
		/**
		 * 字体颜色
		 */
		fontColor: {
			type: String,
			default: "#333333"
		},
		/**
		 * 暗黑模式字体颜色,如果不填写自动反转
		 */
		darkFontColor: {
			type: String,
			default: ""
		},
		/**
		 * 激活时的字体颜色
		 * 空值取全局主题色,并且darkFontColor会失效.
		 * 如果填写none则不生效
		 */
		focusFontColor: {
			type: String,
			default: ""
		},
		/**
		 * 左图标的名称
		 */
		leftIcon: {
			type: String,
			default: ""
		},
		/**
		 * 左图标的颜色
		 * 默认空值取全局的主题色。
		 */
		iconColor: {
			type: String,
			default: ""
		},
		/**
		 * 右图标的名称
		 */
		rightIcon: {
			type: String,
			default: ""
		},
		/**
		 * 右文字
		 */
		rightText: {
			type: String,
			default: ""
		},
		/**
		 * 右文字
		 */
		leftText: {
			type: String,
			default: ""
		},
		/**
		 * 是否禁用
		 */
		disabled: {
			type: Boolean,
			default: false
		},
		/**
		 * 是否聚焦
		 */
		focus: {
			type: Boolean,
			default: false
		},
		/**
		 * 键盘右下解按钮文字,可以取值:send,search,next,done
		 * 只对input有效,对textarea无效
		 */
		confirmType: {
			type: String as PropType<"send" | "search" | "next" | "done">,
			default: "done"
		},
		/**
		 * 光标与键盘的距离，单位px
		 */
		cursorSpacing: {
			type: Number,
			default: 0
		},
		/**
		 * 输入框的最大长度
		 */
		maxlength: {
			type: Number,
			default: -1
		},
		confirmHold: {
			type: Boolean,
			default: false
		},
		/**
		 * 不可用，容易引起bug
		 */
		cursor: {
			type: Number,
			default: NaN
		},
		/**
		 * 光标颜色,默认空值取全局配置
		 */
		cursorColor: {
			type: String,
			default: ""
		},
		/**
		 * 光标起始位置
		 */
		selectionStart: {
			type: Number,
			default: -1
		},
		/**
		 * 光标结束位置
		 */
		selectionEnd: {
			type: Number,
			default: -1
		},
		/**
		 * 是否自动聚焦
		 */
		adjustPosition: {
			type: Boolean,
			default: true
		},
		/**
		 * 是否自动失焦
		 */
		autoBlur: {
			type: Boolean,
			default: false
		},
		ignoreCompositionEvent: {
			type: Boolean,
			default: true
		},
		/**
		 * 强制 input 处于同层状态,不可用，容易引起bug
		 */
		alwaysEmbed: {
			type: Boolean,
			default: true
		},
		/**
		 * focus时，点击页面的时候不收起键盘
		 */
		holdKeyboard: {
			type: Boolean,
			default: false
		},
		safePasswordCertPath: {
			type: String,
			default: "",
		},
		safePasswordLength: {
			type: Number,
			default: NaN
		},
		safePasswordTimeStamp: {
			type: Number,
			default: NaN
		},
		safePasswordNonce: {
			type: String,
			default: ''
		},
		safePasswordSalt: {
			type: String,
			default: ''
		},
		safePasswordCustomHash: {
			type: String,
			default: ''
		},
		randomNumber: {
			type: Boolean,
			default: false
		},
		controlled: {
			type: Boolean,
			default: false
		},
		alwaysSystem: {
			type: Boolean,
			default: false
		},
		/**
		 * input 输入模式
		 */
		inputmode: {
			type: String as PropType<"url" | "email" | "search" | "tel" | "text" | "numeric" | "none" | "decimal">,
			default: "text"
		},
		/**
		 * 尽量不要使用,客户大量手机机型反馈
		 * 部分手机在手写时会异常.最好固定高.
		 */
		autoHeight: {
			type: Boolean,
			default: false
		},
		fixed: {
			type: Boolean,
			default: false
		},
		showConfirmBar: {
			type: Boolean,
			default: false
		},
		/**
		 * 是否高亮聚焦当前输入框
		 * 会使用全局的主题色为边框色。
		 */
		focusHighlight: {
			type: [Boolean, String],
			default: true
		},
		/**
		 * 高亮聚焦当前输入框的样式
		 * 默认为自动全局2px solid 主题色,如果填写了以你的为准。
		 */
		focusHighlightStyle: {
			type: String,
			default: ''
		},
	});
	const _attrs = computed(() => attrs);
	const nowValue = ref<string | number>("");
	const isFocus = ref<boolean>(false);


	const showPlaceholder = computed(() => {
		return nowValue.value == "" ? true : false;
	});
	const showPasswordEye = ref(_attrs.value.password)
	const _color = computed(() => {
		let color = attrs.color;
		if (color == "") {
			color = config.inputLightColor
		}
		if (config.mode == "dark") {
			color = attrs.darkBgColor;
			if (color == "") {
				color = config.inputDarkColor;
			}
		}
		return getDefaultColor(color);
	});
	const _focusHighlight = computed(() => {
		let defaultsolid = 'border:solid 2px transparent;' + _attrs.value.inputStyle
		if (!isFocus.value) return defaultsolid;
		return attrs.focusHighlight ? (attrs.focusHighlightStyle || `border:solid 2px ${getDefaultColor(config.color)} !important`) : defaultsolid;
	})
	const _fontColor = computed(() => {
		let fontColor = attrs.fontColor;
		if (config.mode == "dark") {
			fontColor = attrs.darkFontColor;
			if (fontColor == "") {
				fontColor = setTextColorLightByDark(attrs.fontColor)
			}
		}
		return getDefaultColor(fontColor)
	})
	const _currorColor = computed(() => {
		return getDefaultColor(_attrs.value.cursorColor || config.color)
	})
	const _inputFontColor = computed(() => {
		if (!isFocus.value) return _fontColor.value
		if (attrs.fontColor == 'none') return _fontColor.value;
		return getDefaultColor(attrs.focusFontColor || config.color)
	})
	const _fontSize = computed(() => {
		return covetUniNumber(attrs.fontSize, config.unit);
	});
	const _width = computed(() => {
		return covetUniNumber(attrs.width, config.unit);
	});
	const _height = computed(() => {
		return covetUniNumber(attrs.height, config.unit);
	});
	const _minHeight = computed(() => {
		return covetUniNumber(attrs.minHeight, config.unit);
	});
	const _inputPadding = computed(() => {
		let padding = attrs.inputPadding.split(' ');
		padding = padding.map(item => {
			return covetUniNumber(item, config.unit);
		})
		return padding.join(' ');
	});
	const _round = computed(() : string | undefined => {
		let round = attrs.round;
		if (round === '' && config.inputRadius !== '') {
			round = config.inputRadius;
		}
		if (round === '') return undefined
		return arrayNumberValid(round, '0px').join(' ')
	});
	const _clearColor = computed(() => getDefaultColor(attrs.clearColor))
	const oninput = (evt : Event) => {
		// @ts-ignore
		let value : string | number = evt.detail.value;
		let pvalue = value
		if (attrs.type == "number" || attrs.type == "digit" || attrs.type == "tel") {
			pvalue = typeof pvalue == "number" ? pvalue.toString() : pvalue;
			try {
				let oladvalue = parseFloat(pvalue);
				if (isNaN(oladvalue) || /[^0-9.]+/.test(pvalue)) {
					pvalue = ''
				}
			} catch (_) {

			}
		}

		nowValue.value = pvalue;
		emits("input", pvalue);
		emits("update:modelValue", pvalue);
		return pvalue
	};
	const onclear = () => {
		nowValue.value = '';
		emits('update:modelValue', '')
		emits("clear")
	}
	const onfocus = () => {
		isFocus.value = true;
		emits("focus", nowValue.value)
	};
	const onblur = () => {
		isFocus.value = false;
		emits("blur", nowValue.value)
	};
	const onconfirm = (evt : any) => {
		emits("confirm", evt.detail.value);
	};
	const onkeyboardheightchange = (evt : any) => {
		emits('keyboardheightchange', evt.detail.height);
	};
	const onlinechange = (evt : any) => {
		emits('linechange', evt.detail);
	}
	const onchange = (evt : any) => {
		// 用来监测微信输入昵称的值。
		let val = evt.detail.value;
		if (_attrs.value.type == 'nickname' && val != nowValue.value && val) {
			nowValue.value = val;
			emits("input", val);
			emits("update:modelValue", val);
		}
	}
	watchEffect(() => {
		if (nowValue.value === attrs.modelValue) return;
		nowValue.value = attrs.modelValue;
	});
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

<style lang="scss" scoped>
	uni-input {
		min-height: auto;
	}

	.tmInputShowChar {
		font-size: 12px;
		position: absolute;
		right: 24rpx;
		bottom: 16rpx;
		pointer-events: none;
		opacity: 0.5;
	}

	.tmInput {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		overflow: hidden;
		box-sizing: border-box;

	}

	.tmInputWrap {
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		overflow: hidden;
		flex: 1;
		box-sizing: border-box;
		transition-property: border-color;
		transition-duration: 0.3s;
		transition-timing-function: linear;
		border-color: transparent;

	}

	.tmInputWrapBox {
		position: relative;
		height: 100%;
		flex: 1;
		box-sizing: border-box;

		.tmInputInput {
			height: 100%;
			width: 100%;
			box-sizing: border-box;
		}

		.tmInputPlaceholder {
			box-sizing: border-box;
			position: absolute;
			left: 0px;
			top: 0px;
			width: 100%;
			height: 100%;
			pointer-events: none;
			overflow: hidden;
			text-overflow: ellipsis;
			line-clamp: 1;
			-webkit-box-orient: vertical;
			display: -webkit-box;
			white-space: inherit;
			text-wrap: nowrap;
			opacity: 0;
			transition: all 0.2s cubic-bezier(.42, .38, .15, .93);

			&.tmInputPlaceholderOn {
				opacity: 1;
				transform: translateY(0%);
			}

			&.tmInputPlaceholderOff {
				opacity: 0;
				transform: translateY(50rpx);

			}
		}
	}
</style>