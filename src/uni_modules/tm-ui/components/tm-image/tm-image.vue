<template>
    <view @click="prevImage" class="tmImage" :class="[idBox]" ref="tmImage" :id="idBox"
        :style="{ width: _place_size.width, height: _place_size.height }">
        <!-- @vue-skip -->
        <view class="tmImageBox"
            :style="{ width: _img_box_size.width, height: _img_box_size.height, borderRadius: _round, pointerEvent: 'none' }">
            <view v-if="isLoading || isError" class="tmImagePlace" :style="{ backgroundColor: _placeBgColor }">
                <tm-icon :size="iconSize" v-if="isError" color="error" name="landscape-line"></tm-icon>
                <tm-icon :size="iconSize" v-if="isLoading" name="loader-line" color="primary" :spin="true"></tm-icon>
            </view>

            <image v-if="!isError" class="tmImageImg" :lazy-load="lazy" :draggable="draggable"
                :showMenuByLongpress="showMenuByLongpress"
                :class="[isLoading ? 'tmImageImgAbs' : '', fadeShow ? 'tmImageFadeShow' : '']" :mode="_model"
                :style="[_styleMap]" :src="_src" @error="imgError">
            </image>
        </view>
    </view>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, PropType, getCurrentInstance, onUpdated, nextTick } from 'vue';
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, arrayNumberValidByStyleBorderColor, linearValid, getUnit, getUid } from "../../libs/tool";
import { getDefaultColor, getDefaultColorObj, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
import { useTmConfig } from "../../libs/config";
import { onPageScroll } from '@dcloudio/uni-app';
/**
 * @displayName 图片
 * @exportName tm-image
 * @category 展示组件
 * @description 宽高可以设置，支持百分比，px,rpx，如果你用了auto,%这种就要注意：如果你把组件放到了容器中，容器设置为v-show,display:none,visible这种，
 * 那你一定要跟随vif组件，不然尺寸是不对的。因为小程序无法监测这种变化的情况，导致无法设置尺寸。如果你设定了固定尺寸则不用担心这个问题。
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
    | --- | --- | --- | --- |
    | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmBadge' });
const { config } = useTmConfig()
const props = defineProps({
    /** 
     * 宽度，默认100%
     * 18rpx,18px,15%支持这三种单位，如果只写"18"就表示18rpx
     */
    width: {
        type: [String, Number],
        default: "100%"
    },
    /** 
     * 高度,auto,%,rpx,px,string number
     * 18rpx,18px,15%支持这三种单位，如果只写"18"就表示18rpx
     */
    height: {
        type: [String, Number],
        default: "auto"
    },
    /** 图片源 */
    src: {
        type: String,
        default: ""
    },
    /** 
     * 模式
     * @link https://uniapp.dcloud.net.cn/uni-app-x/component/image.html#mode-values
     */
    model: {
        type: String as PropType<"fill" | "top" | "bottom" | "center" | "left" | "right" | "top left" | "top right" | "bottom left" | "bottom right" | "aspectFit" | "aspectFill" | "widthFix" | "heightFix" | "scaleToFill">,
        default: "scaleToFill"
    },
    /**
     * 点击后是否预览图片
     */
    preview: {
        type: Boolean,
        default: true
    },
    /**
     * 预览占位比例
     * 宽/高，当数据没加载前，如果你设置了一项值比如宽，高会自动根据这个比例计算
     * 当图片加载成功后，使用正确的原图片比例设置。
     * 默认是5/4=1.25
     */
    ratio: {
        type: Number,
        default: 1.25
    },
    /**
     * 圆角
     */
    round: {
        type: [String, Number],
        default: '0'
    },
    /**
     * 加载和失败时的图标大小。
     */
    iconSize: {
        type: [String, Number],
        default: "36"
    },
    /**
     * 占位背景色
     */
    placeBgColor: {
        type: String,
        default: "#F5F5F5"
    },
    /**
     * 点位暗黑时的背景，如果不填写默认填充inputDarkBgcolor
     */
    placeDarkBgColor: {
        type: String,
        default: ""
    },
    /**
     * 是否显示过渡动画
     */
    fadeShow: {
        type: Boolean,
        default: false
    },
    /**
     * 图片懒加载
     */
    lazy: {
        type: Boolean,
        default: true
    },
    /**
     * 是否允许拖动。
     */
    draggable: {
        type: Boolean,
        default: false
    },
    showMenuByLongpress: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits<{
    (e: 'click'): void
}>();

const id = ref(`tmImage-${getUid()}`);
const idBox = ref(`tmImage-${getUid()}`);
const isLoading = ref(true);
const isError = ref(false);
const reload = ref(0);
const imgrealWidth = ref(0);
const imgrealHeight = ref(0);
const boxWidth = ref(0);
const boxHeight = ref(0);

const isLoaded = ref(false);
const tid = ref(0);
const androidAndWebUrl = ref("");

const tid2 = ref(0);
const proxy = getCurrentInstance()?.proxy

const _model = computed(() => props.model);
const _placeBgColor = computed(() => {
    let bgcolor = props.placeBgColor;
    if (config.mode == 'dark') {
        bgcolor = props.placeDarkBgColor;
        if (props.placeDarkBgColor == '') {
            bgcolor = config.inputDarkColor;
        }
    }
    return getDefaultColor(bgcolor);
});

const _round = computed(() => covetUniNumber(props.round, config.unit));
const _src = computed(() => props.src);

const _place_size = computed(() => ({
    width: covetUniNumber(props.width, config.unit),
    height: covetUniNumber(props.height, config.unit),
}));



const _img_box_size = computed(() => {
    if (imgrealHeight.value > 0) {
        return _img_size.value;
    }

    let _w = props.width;
    let _h = props.height;
    let us_w = covetUniNumber(props.width, config.unit);
    let us_h = covetUniNumber(props.height, config.unit);

    if (typeof props.width == 'string' && props.width.lastIndexOf('%') > -1 || props.width == 'auto') {
        us_w = '100%';
        _w = '100%';
    }

    if (typeof props.height == 'string' && props.height.lastIndexOf('%') > -1 || props.height == 'auto' || isError.value) {
        if (boxHeight.value >= 5) {
            _h = `${boxHeight.value}px`;
        } else {
            if (typeof props.width == 'string' &&props.width.lastIndexOf('%') > -1 || props.width == 'auto') {
                if (props.height == '100%') {
                    _h = `${props.ratio * boxHeight.value}px`;
                } else {
                    _h = `${props.ratio * boxWidth.value}px`;
                }
            } else {
                _h = `${props.ratio * parseFloat(us_w)}${getUnit(us_w)}`;
            }
        }
		_w = us_w
        return { width: _w, height: _h };
    }

    return { width: us_w, height: us_h };
});

const _img_size = computed(() => {
    let us_w = covetUniNumber(props.width, config.unit);
    let us_h = covetUniNumber(props.height, config.unit);

    if (!isLoaded.value) {
        return { width: "300px", height: "300px" };
    }

    if (boxWidth.value > 0) {
        let ratio = boxWidth.value / imgrealWidth.value;

        if (props.height == 'auto') {
            us_h = `${ratio * imgrealHeight.value}px`;
        }

        if (props.width == 'auto') {
            us_w = `${boxWidth.value}px`;
        }

        if (typeof props.height == 'string'&&props.height.lastIndexOf('%') > -1) {
            us_h = `${boxHeight.value}px`;
        }
        if (typeof props.width == 'string'&&props.width.lastIndexOf('%') > -1) {
            us_w = `${boxWidth.value}px`;
        }
    }

    return { width: us_w, height: us_h };
});

const _styleMap = computed(() => {
    let styleMap: Record<string, any> = {}
    styleMap["width"] = _img_size.value.width
    styleMap["height"] = _img_size.value.height
    styleMap["transform"] = isLoading.value ? 'scale(0.1)' : 'scale(1)'
    styleMap["visibility"] = isLoading.value ? 'visible' : (!isError.value ? 'visible' : 'hidden')
    styleMap["opacity"] = isLoading.value ? '0' : '1'
    styleMap["border-radius"] = _round.value
    return styleMap;
});

const prevImage = () => {
    emit('click');
    if (props.preview) {
        uni.previewImage({
            current: props.src,
            urls: [props.src]
        });
    }
};


function toPngFile(data : string) : Promise<string> {
	let bdataBase64 = data.split(',')[1]
	let fileMg = wx.getFileSystemManager();
	let filepath = `${wx.env.USER_DATA_PATH}/${Math.random().toString(16).substring(4, 20)}.png`
	return new Promise((res, rej) => {
		fileMg.writeFile({
			filePath: filepath,
			data: bdataBase64,
			encoding: "base64",
			success() {
				res(filepath)
			},
			faile() {
				rej("")
			}
		})
	})
}
const imgLoad = async () => {
	// 检测是不是base64图片，小程序不支持直接用下面的函数读取。
	const isBase64 = (_src.value.substring(0,6)).toLocaleLowerCase() == 'data:'
	let  url = _src.value;
	// #ifdef MP
	if(isBase64){
		url = await toPngFile(_src.value)
	}
	// #endif
    uni.getImageInfo({
        src: url,
        fail(_) {
            console.log('error');
            isError.value = true;
            isLoading.value = false;
        },
        success(result: any) {
            isLoading.value = false;
            isError.value = false;
            isLoaded.value = true;
            imgrealWidth.value = result.width;
            imgrealHeight.value = result.height;
            androidAndWebUrl.value = result.path;
        }
    });
};

const imgError = () => {
    isError.value = true;
    isLoading.value = false;
};




const getNodes = (): Promise<any> => {
    return new Promise((res) => {
        uni.createSelectorQuery().in(proxy)
            .select(".tmImage")
            .boundingClientRect().exec((ret) => {
                let nodeinfo = ret[0] as UniApp.NodeInfo;
                boxWidth.value = nodeinfo.width!;
                boxHeight.value = nodeinfo.height!;
                res(true)
            });
    })
};

const resize = (): Promise<any> => {
    isLoaded.value = false;
    return new Promise((res) => {
        uni.createSelectorQuery().in(proxy)
            .select(".tmImage")
            .boundingClientRect().exec((ret) => {
                let nodeinfo = ret[0] as UniApp.NodeInfo;
                boxWidth.value = nodeinfo.width!;
                boxHeight.value = nodeinfo.height!;
                isLoaded.value = true;
                res(true)
            });
    })
};

onMounted(async () => {
    await getNodes();
    imgLoad();


});

onBeforeUnmount(() => {
    clearTimeout(tid.value);
    clearTimeout(tid2.value);
});

watch(() => props.src, () => {
    imgLoad();
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
<style scoped>
.tmImage {
    position: relative;
    overflow: hidden;
    display: inline-flex;
}

.tmImageBox {
    pointer-events: none;
    overflow: hidden;

}

.tmImageImg {
    opacity: 0;
}

@keyframes animateFadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.tmImageFadeShow {
    animation: animateFadeIn 0.2s linear forwards;
}

.tmImagePlace {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%
}

.tmImageImgAbs {
    position: absolute;

}
</style>