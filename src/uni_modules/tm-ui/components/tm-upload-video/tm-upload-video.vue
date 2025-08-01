<template>
	<view class="tmUploadPhoto">

		<view class="tmUploadPhotoItem " v-if="_selectedCount && props.addPos == 'before'" @click="choose"
			:style="{ width: `calc(${_width} - ${_coloumn==1?0:guuterSpace}px)`, height: _height }">
			<!-- 
            @slot 上传按钮插槽
            -->
			<slot>
				<view class="tmUploadPhotoItemAdd" :style="{borderRadius:_round}">
					<tm-icon :color="config.color" size="52" name="add-line"></tm-icon>
				</view>
			</slot>
		</view>

		<view class="tmUploadPhotoItem"
			:style="{ width: `calc(${_width} - ${_coloumn==1?0:guuterSpace}px)`, height: _height,borderRadius:_round }"
			v-for="(item, index) in list" :key="index">
			<video :autoplay="false" :controls="false" @click="imagePreve(index)" :src="item.path" :mode="props.mode"
				style="width: 100%;height: 100%;"></video>
			<view class="tmUploadLabel" :style="{ color: STATUS_COLOR.get(item.status) || 'white' }">{{ item.statusText
                }}
			</view>
			<view @click="remove(index, item)" class="tmUploadDel"
				v-if="(item.status == TMUPLOAD_PHOTO_STATUS.UPLOAD_SUCCESS && _okFileIsDelete) || (item.status != TMUPLOAD_PHOTO_STATUS.UPLOAD_SUCCESS && item.status != TMUPLOAD_PHOTO_STATUS.UPLOADING)">
				<tm-icon color="error" size="36" name="close-circle-fill"></tm-icon>
			</view>
		</view>
		<view class="tmUploadPhotoItem " v-if="_selectedCount && props.addPos == 'after'" @click="choose"
			:style="{ width: `calc(${_width} - ${_coloumn==1?0:guuterSpace}px)`, height: _height }">
			<!-- 
            @slot 上传按钮插槽
            -->
			<slot>
				<view class="tmUploadPhotoItemAdd" :style="{borderRadius:_round}">
					<tm-icon :color="config.color" size="52" name="add-line"></tm-icon>
				</view>
			</slot>
		</view>

	</view>
</template>

<script setup lang="ts">
	import { PropType, computed, onMounted, ref, shallowRef, watch } from 'vue'
	import { covetUniNumber } from '../../libs/tool';
	import { TMUPLOAD_PHOTO_STATUS } from '../../interface';
	import { useTmConfig } from "../../libs/config";

	/**
	 * @displayName 视频上传
	 * @exportName tm-upload-video
	 * @category 表单组件
	 * @description 样式丰富塑造性好
	 * @constant 平台兼容
	 *	| H5 | uniAPP | 小程序 | version |
		| --- | --- | --- | --- |
		| ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
	 */
	defineOptions({ name: 'TmUploadVideo' });

	const { config } = useTmConfig()
	type BEFOREDELTYPE = (index : number, item : TM.TMUPLOAD_PHOTO_INFO) => Promise<boolean>
	type BEFORECOMPLETE = (res : any) => Promise<boolean>
	type CHOOSEFILE_FILES = {
		path : string,
		size : number
	}
	const STATUS_TEXT = new Map<TMUPLOAD_PHOTO_STATUS, string>([
		[0, '待上传'],
		[1, '上传中'],
		[2, '上传成功'],
		[3, '上传失败'],
		[4, '已取消'],
		[5, '超出大小限制']
	])
	const STATUS_COLOR = new Map<TMUPLOAD_PHOTO_STATUS, string>([
		[0, '#fff'],
		[1, '#F2F2F2'],
		[2, '#07d73d'],
		[3, '#f10226'],
		[4, '#F2F2F2'],
		[5, '#ffa61e']
	])
	const guuterSpace = uni.upx2px(10)
	const emit = defineEmits([
		/**
		 * 每次全部上传完时触发
		 * @param {TMUPLOAD_PHOTO_INFO[]} 列表数据 
		 */
		'complete',
		/**
		 * 变化时触发
		 * @param {TMUPLOAD_PHOTO_INFO[]} 列表数据 
		 */
		'change',
		/**
		 * 图片被删除时触发
		 * @param {TMUPLOAD_PHOTO_INFO[]} 列表数据 
		 */
		'delete',
		/**
		 * 点击项目预览视频,有的回显视频可能需要授权播放,返回的可能是个视频图片,因此你需要通过事件自行创建预览窗口.
		 */
		'preview',
		/**
		 * 同步文件列表。
		 */
		'update:modelValue'
	])

	const props = defineProps({
		/**
		 * 最大的可上传数量
		 */
		maxCount: {
			type: Number,
			default: 9
		},
		/**
	 * 图片项目圆角。
	 */
		round: {
			type: [String, Number],
			default: 10
		},
		/**
		 * 上传地址
		 */
		url: {
			type: String,
			default: "https://mockapi.eolink.com/LRViGGZ8e6c1e8b4a636cd82bca1eb15d2635ed8c74e774/admin/upload_pic/"
		},
		/**
		 * 上传到服务器的名称字段
		 */
		name: {
			type: String,
			default: "file"
		},
		/**
		 * 上传到服务器的头文件
		 */
		header: {
			type: Object as PropType<Record<string, any> | null>,
			default: null
		},
		/**
		 * 额外的表单数据。
		 */
		formData: {
			type: Object as PropType<Record<string, any> | null>,
			default: null
		},

		/**
		 * 图片高,此处不可使用%单位
		 */
		imgHeight: {
			type: String,
			default: "110"
		},
		/**
		 * 一行显示几列
		 */
		column: {
			type: Number,
			default: 5
		},
		/**
		 * 上传成功的文件是否允许删除
		 */
		okFileIsDelete: {
			type: Boolean,
			default: true
		},
		/**
		 * 上传中的文件是否允许删除
		 */
		uploadingFileIsDelete: {
			type: Boolean,
			default: true
		},
		/**
		 * 图片上传的限制大小，默认是30mb(可以开启压缩，最后可能比较小)
		 */
		maxFileSize: {
			type: Number,
			default: 1024 * 1024 * 30
		},
		/**
		 * 最大拍摄时长不能超过60秒默认建议30秒
		 */
		maxDuration: {
			type: Number,
			default: 30
		},
		/**
		 * 摄像头类型,前置还是后置
		 */
		camera: {
			type: String as PropType<'back' | 'front'>,
			default: 'back'
		},
		/**
		 * 开发者服务器响应码,默认是200表示上传成功.
		 */
		statusCode: {
			type: Number,
			default: 200
		},
		/**
		 * 等同v-model
		 */
		modelValue: {
			type: Array<Record<string, any> | string>,
			default: () => []
		},
		/**
		 * 用于回显时,如果你提供的数组数据是对象,需要指定图片的地址.
		 * 同时该对象数据会被保留到response字段中
		 */
		rangUrl: {
			type: String,
			default: 'url'
		},
		/**
		 * 图片被删除时触发
		 * 如果返回Promise<false>删除失败否则成功
		 * 类型null|(index:number,item:XUPLOADFILE_FILE_INFO)=>Promise<boolean>
		 */
		beforeDel: {
			type: [Function, Boolean],
			default: true
		},
		/**
		 * 你需要原路返回参数提供的item
		 * item可以自行修改响应内容，响应类型这样可以自己根据服务的内容判断
		 * 是成功还是失败或者没有权限。修改其中的status来达到成功还是失败TMUPLOAD_PHOTO_STATUS
		 */
		beforeComplete: {
			type: [Function, Boolean],
			default: true
		},
		/**
		 * 是否自动上传
		 */
		autoStart: {
			type: Boolean,
			default: true
		},
		/**
		 * 图片来源同官方的sourceType：
		 * 'album','camera'
		 */
		sourceType: {
			type: [Array<"album" | "camera">],
			default: () => ["album", "camera"]
		},
		/**
		 * 是否压缩
		 */
		compress: {
			type: Boolean,
			default: true
		},
		/**
		 * 添加图片的位置
		 * 'before'出现在前面
		 * 'after'出现在后面
		 */
		addPos: {
			type: String as PropType<'before' | 'after'>,
			default: "after"
		},
		/**
		 * 图片展示的缩放模式同官方.
		 */
		mode: {
			type: String,
			default: "scaleToFill"
		}
	})
	const list = ref<TM.TMUPLOAD_PHOTO_INFO[]>([])
	const _coloumn = computed(() => props.column)
	const _okFileIsDelete = computed(() => props.okFileIsDelete)
	const _height = computed(() => covetUniNumber(props.imgHeight))
	const _width = computed(() => 100 / props.column + '%')
	const _round = computed(() => covetUniNumber(props.round))

	const uploadIndex = ref(0);
	const uploading = ref(false)
	//可选择的图片数据。0表示已经达到最大数量
	const _selectedCount = computed(() => Math.max(0, Math.min(props.maxCount - list.value.length, 9)))
	const getUUID = () => Math.random() * 100 + '' + Date.now();
	/**
	 * 转换为待上传列表的文件列表。
	 * @param files 转换的数据
	 */
	const covertFileType = (files : CHOOSEFILE_FILES[]) => {
		let flist = files.map((item) : TM.TMUPLOAD_PHOTO_INFO => {
			let status = item.size > props.maxFileSize ? TMUPLOAD_PHOTO_STATUS.EXCEEDS_SIZE_LIMIT : TMUPLOAD_PHOTO_STATUS.NOT;
			return {
				path: item.path,
				id: getUUID(),
				status: status,
				progress: 0,
				statusText: STATUS_TEXT.get(status) || "",
				response: null
			}
		})
		return flist;
	}
	/**
	 * 转换外部文件.
	 * @param files 转换的数据
	 */
	const covertFileTypeByModelvalue = (files : Array<Record<string, any> | string>) => {
		let flist = files.map((item) : TM.TMUPLOAD_PHOTO_INFO => {
			let status = TMUPLOAD_PHOTO_STATUS.UPLOAD_SUCCESS;
			if (typeof item == 'string') {
				return {
					path: item,
					id: getUUID(),
					status: status,
					progress: 100,
					statusText: STATUS_TEXT.get(status) || "",
					response: item
				}
			}
			return {
				path: item[props.rangUrl] || item['path'] || "",
				id: getUUID(),
				status: status,
				progress: 100,
				statusText: STATUS_TEXT.get(status) || "",
				response: item?.response ?? item
			}
		})
		// let nowfilesrc = list.value.map(item => item.path)
		// let filst2 = flist.filter(item => !nowfilesrc.includes(item.path))
		return flist;
	}
	/**
	 * 选择图片
	 */
	const choose = () => {
		let resultfiles = [] as CHOOSEFILE_FILES[];
		let index = 0;
		// uni.showLoading({ title: '...' })
		uni.chooseVideo({
			count: _selectedCount.value,
			sourceType: props.sourceType,
			compressed: props.compress,
			maxDuration: props.maxDuration,
			camera: props.camera,
			fail(e) {
				// uni.hideLoading()

			},
			success(res) {
				console.log(res)
				let flist = [] as CHOOSEFILE_FILES[];
				flist.push({
					path: res.tempFilePath,
					size: res.size,
				})
				resultfiles = flist
				if (resultfiles.length == 0) {
					// uni.hideLoading()
					return;
				}
				compressImage()
			},
			complete() {

			}
		})



		function compressImage() {
			if (resultfiles.length == 0) return;
			list.value = [...list.value, ...covertFileType(resultfiles)]
			emit('change', JSON.parse(JSON.stringify(list.value.slice(0))))
			if (props.autoStart) {
				startUpload();
			}
		}

	}
	/**
	 * 手动上传
	 */
	const startUpload = () => {
		if (uploading.value) {
			return;
		}
		uploading.value = true;
		uploadIndex.value = 0;
		upload();
	}
	const upload = () => {
		//结束上传。
		if (uploadIndex.value >= list.value.length) {
			uploading.value = false;
			emit('complete', JSON.parse(JSON.stringify(list.value.slice(0))))
			emit('update:modelValue', JSON.parse(JSON.stringify(list.value.slice(0))))
			return;
		}
		let item = list.value[uploadIndex.value];
		// 跳过上传中或已经上传成功的图片。
		if (item.status == TMUPLOAD_PHOTO_STATUS.EXCEEDS_SIZE_LIMIT || item.status == TMUPLOAD_PHOTO_STATUS.UPLOADING || item.status == TMUPLOAD_PHOTO_STATUS.UPLOAD_SUCCESS) {
			uploadIndex.value += 1;
			upload();
			return;
		}
		item.status = TMUPLOAD_PHOTO_STATUS.UPLOADING
		item.statusText = STATUS_TEXT.get(item.status) || ''
		uni.uploadFile({
			url: props.url,
			filePath: item.path,
			name: props.name,
			formData: props.formData,
			header: props.header,
			success: async (res) => {
				let isComplete = true;
				if (typeof props.beforeComplete === 'function') {
					isComplete = await props.beforeComplete(res)
				}
				if (res.statusCode != 200 || !isComplete) {
					item.status = TMUPLOAD_PHOTO_STATUS.UPLOAD_FAILED;
					item.statusText = STATUS_TEXT.get(item.status) || ""
					item.response = res.data;
					uploadIndex.value += 1;
					upload();
					return;
				}

				item.status = TMUPLOAD_PHOTO_STATUS.UPLOAD_SUCCESS;
				item.response = res.data;
				item.statusText = STATUS_TEXT.get(item.status) || ""
				uploadIndex.value += 1;
				upload();
			},
			fail: (res) => {
				item.status = TMUPLOAD_PHOTO_STATUS.UPLOAD_FAILED;
				item.response = res.errMsg;
				item.statusText = STATUS_TEXT.get(item.status) || ""
				uploadIndex.value += 1;
				upload();
			}
		})


	}

	const remove = async (index : number, item : TM.TMUPLOAD_PHOTO_INFO) => {
		if (uploading.value) return;
		let isDele = true;
		if (typeof props.beforeDel === 'function') {
			isDele = await props.beforeDel(index, item)
		}
		if (!isDele) return;

		list.value.splice(index, 1);
		emit('change', JSON.parse(JSON.stringify(list.value.slice(0))))
		emit('update:modelValue', JSON.parse(JSON.stringify(list.value.slice(0))))
		emit('delete', JSON.parse(JSON.stringify(item)))
	}
	const imagePreve = (index : number) => {
		emit('preview', index)
	}
	watch(() => props.modelValue, (val) => {
		let temlist = covertFileTypeByModelvalue(props.modelValue).slice(0);
		if (temlist.length == 0) {
			list.value = []
			return;
		}
		// list.value = [...JSON.parse(JSON.stringify(list.value.slice(0))), ...temlist]
		list.value = temlist
	}, { immediate: true, deep: true })

	defineExpose({ startUpload, choose })
</script>
<script lang="ts">
	export default {
		options: {
			styleIsolation: "apply-shared",
			virtualHost: true,
			addGlobalClass: true,
			multipleSlots: true
		}
	}
</script>
<style scoped>
	.tmUploadDel {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		position: absolute;
		right: 0px;
		top: 0px;
		padding: 3px;
		z-index: 2;
	}

	.tmUploadLabel {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		padding: 2px 5rpx;

		background-color: rgba(6, 8, 15, 0.46);
		color: white;
		font-size: 11px;
		position: absolute;
		z-index: 1;
		left: 0rpx;
		bottom: 0rpx;
		width: 100%;
		pointer-events: none;
	}

	.tmUploadPhoto {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		box-sizing: border-box;
		gap: 5rpx;
	}

	.tmUploadPhotoItem {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
	}

	.tmUploadPhotoItemAdd {
		border: 1px solid #e6e7e7;
		background-color: #f3f3f3;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
		overflow: hidden;
		box-sizing: border-box;
	}
</style>