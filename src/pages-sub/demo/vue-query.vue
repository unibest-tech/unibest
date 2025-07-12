<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { findPetsByStatusQueryOptions } from '@/service/app'

// 使用 vue-query 的 useQuery 来请求数据，只做参考，是否使用请根据实际情况而定
const {
  data,
  error,
  isLoading,
  refetch,
} = useQuery(findPetsByStatusQueryOptions({ params: { status: ['available'] } }))
</script>

<template>
  <view class="p-6 text-center">
    <!-- http://localhost:9000/#/pages/index/request -->
    <wd-button class="my-6" @click="refetch">
      发送请求
    </wd-button>
    <view class="h-16">
      <view v-if="isLoading">
        loading...
      </view>
      <block v-else>
        <view class="text-xl">
          请求数据如下
        </view>
        <view class="text-green leading-8">
          {{ JSON.stringify(data) }}
        </view>
      </block>
    </view>
  </view>
</template>
