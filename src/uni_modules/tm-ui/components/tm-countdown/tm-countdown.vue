<script lang="ts" setup>
import { ref, watch, provide, getCurrentInstance, onBeforeUnmount, computed, inject, onMounted } from 'vue'
import { arrayNumberValid, arrayNumberValidByStyleMP, covetUniNumber, linearValid, getUnit, getUid } from "../../libs/tool";
import { useTmConfig } from "../../libs/config";
import { getDefaultColor, setTextColorLightByDark, getOutlineColorObj, getTextColorObj, getThinColorObj } from "../../libs/colors";
type TIME_OBJ = {
    ms: string,
    ss: string,
    mm: string,
    hh: string,
    dd: string,
    format: string
}

/**
 * @displayName 倒计时器
 * @exportName tm-countdown
 * @category 展示组件
 * @description 倒计时，可以精确到秒，毫秒
 * @constant 平台兼容
 *	| H5 | uniAPP | 小程序 | version |
	| --- | --- | --- | --- |
	| ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({ name: 'TmCountdown' });

const { config } = useTmConfig()
const props = withDefaults(defineProps<{
    time?: number,
    actions?: "pause" | "play" | "reset" | "",
    format?: string,
    autoStart?: boolean,
    unit?: "ss" | "ms",
    fontSize?: string,
    color?: string,
    /**
     * 是否使用验证码模式
     * 启用后,整个应用不管你用了多少个此组件,倒计时都是共用的
     * 直到结束某一个结束,其它的才可以启用,这样可以保证,任何时候切换页面验证发送
     * 都能保证在60秒内的间隔,防止刷验证码.
     */
    captcha?: boolean
}>(), {
    time: 0,
    actions: "",
    format: "DD天HH时MM分SS秒",
    autoStart: false,
    unit: "ss",
    fontSize: "16",
    color: "#333333",
    captcha:false,
});

const emit = defineEmits<{
    change: [time: number],
    pause: [],
    start: [],
    complete: []
}>();
const timeidLasttime = "tmCountdownId";

const interval = ref(0);
const status = ref<"initial" | "running" | "paused" | "finished">("initial");
const totalTime = ref(0);

const _label = computed((): TIME_OBJ => {
    return displayTime();
});

const _color = computed((): string => {
    return getDefaultColor(props.color);
});

const _fontSize = computed((): string => {
    return covetUniNumber(props.fontSize, config.unit);
});



function start() {
    let intms = props.unit == "ss" ? 1000 : 16;
    if (status.value === "initial" || status.value === "paused") {

        if(props.captcha){
            uni.setStorageSync(timeidLasttime,totalTime.value)
        }
        status.value = "running";
        emit("start");
        interval.value = setInterval(() => {
            totalTime.value -= intms;
            if(props.captcha){
                uni.setStorageSync(timeidLasttime,totalTime.value)
            }
            emit("change", totalTime.value);
            if (totalTime.value < 0) {
                totalTime.value = 0;
                if(props.captcha){
                    uni.setStorageSync(timeidLasttime,totalTime.value)

                }
                clearInterval(interval.value);
                status.value = "finished";
                emit("complete");
                return;
            }
        }, intms);
    }
}

function pause() {
    if (status.value === "running") {
        if(props.captcha){
            uni.setStorageSync(timeidLasttime,totalTime.value)
        }
        clearInterval(interval.value);
        status.value = "paused";
        emit("pause");
    }
}

function reset() {
    clearInterval(interval.value);
    status.value = "initial";
    totalTime.value = props.time;

    if(props.captcha){
        uni.setStorageSync(timeidLasttime,0)
    }
}

function displayTime(): TIME_OBJ {
    let milliseconds = totalTime.value;
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    milliseconds %= 1000;
    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    let day_str = days < 10 ? "0" + days.toString() : days.toString();
    let hours_str = hours < 10 ? "0" + hours.toString() : hours.toString();
    let minutes_str = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
    let seconds_str = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
    let milliseconds_str = milliseconds < 10 ? "0" + milliseconds.toString() : milliseconds.toString();

    let formattedTime = props.format.replace("DD", day_str);
    formattedTime = formattedTime.replace("HH", hours_str);
    formattedTime = formattedTime.replace("MM", minutes_str);
    formattedTime = formattedTime.replace("SS", seconds_str);
    formattedTime = formattedTime.replace("MS", milliseconds_str);

    return {
        ms: milliseconds_str,
        ss: seconds_str,
        mm: minutes_str,
        hh: hours_str,
        dd: day_str,
        format: formattedTime
    };
}

watch(() => props.time, () => {
    reset();
});

watch(() => props.actions, () => {
    if (props.actions == 'reset') {
        reset();
    } else if (props.actions == 'play') {
        start();
    } else if (props.actions == 'pause') {
        pause();
    }
});

onMounted(() => {
    totalTime.value = props.time;
    if(props.captcha){
        const getOldTime = uni.getStorageSync<number|null>(timeidLasttime)
        if(getOldTime!=null&&typeof getOldTime == "number"){
            if(getOldTime>0){
                totalTime.value = getOldTime
                start()
                return;
            }
        }
    }

    if (props.autoStart) {
        start();
    }
});

onBeforeUnmount(() => {
    clearInterval(interval.value);
    if(props.captcha&&status.value=='running'||status.value=='paused'){
        uni.setStorageSync(timeidLasttime,totalTime.value)
    }

});

defineExpose({
    /**
     * 开始计时
     */
    start,
    /**
     * 暂停计时
     */
    pause,
    /**
     * 重置
     */
    reset,
    /**
     * 获取当前状态
     */
    getStatus:():string=>{
        return status.value;
    }
})

</script>

<template>
    <view>
        <!--
         @slot 插槽
         @prop {string} status - 状态值可能为："initial" | "running" | "paused" | "finished"
         @prop {number} time - 当前剩余的时间：单位为毫秒
         @prop {number} label - 当前被属性format格式化后的文本
         @prop {number} ms - 剩余的毫秒数
         @prop {number} ss - 剩余的秒数
         @prop {number} mm - 剩余的分钟
         @prop {number} hh - 剩余的小时
         @prop {number} dd - 剩余的天数
         -->
        <slot :status="status" :time="totalTime" :label="_label.format" :ms="_label.ms" :ss="_label.ss" :mm="_label.mm"
              :hh="_label.hh" :dd="_label.dd">
            <text :style="{color:_color,fontSize:_fontSize}">{{_label.format}}</text>
        </slot>
    </view>
</template>

<style scoped>
</style>