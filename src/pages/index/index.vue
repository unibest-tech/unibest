<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <button @click="testco()">
      请求云对象的方法
    </button>
    <button @click="testco2()">
      请求云对函数的方法
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('hello')

async function testco() {
  // 注意异步
  const helloco = uniCloud.importObject('test-unicloud-ob') // 导入云对象
  try {
    const res = await helloco.testFn('unibest') // 导入云对象后就可以直接调用该对象的sum方法了，注意使用异步await
    console.log(res) // 结果是3
  }
  catch (e) {
    console.log(e)
  }
}
async function testco2() {
  try {
    // 注意异步
    const { result } = await uniCloud.callFunction({
      name: 'test-unicloud',
      data: { data: 'hello unibest' },
    })
    console.log(result)
  }
  catch (e) {
    console.log(e)
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
