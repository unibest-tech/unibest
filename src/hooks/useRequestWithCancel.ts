import type { Ref } from 'vue'
import type { HttpRequestResult } from '@/http/types'
import { ref } from 'vue'

interface IUseRequestOptions<T> {
  /** 是否立即执行 */
  immediate?: boolean
  /** 初始化数据 */
  initialData?: T
}

interface IUseRequestReturn<T, P = undefined> {
  loading: Ref<boolean>
  error: Ref<boolean | Error>
  data: Ref<T | undefined>
  run: (args?: P) => Promise<T | undefined>
  cancel: () => void
}

/**
 * useRequestWithCancel 是一个支持请求取消功能的定制化请求钩子。
 * @param func 一个执行异步请求的函数，可以返回 Promise<T> 或 HttpRequestResult<T>。
 * @param options 包含请求选项的对象 {immediate, initialData}。
 * @param options.immediate 是否立即执行请求，默认为false。
 * @param options.initialData 初始化数据，默认为undefined。
 * @returns 返回一个对象{loading, error, data, run, cancel}，包含请求的状态和操作方法。
 */
export default function useRequestWithCancel<T, P = undefined>(
  func: (args?: P) => Promise<T> | HttpRequestResult<T>,
  options: IUseRequestOptions<T> = { immediate: false },
): IUseRequestReturn<T, P> {
  const loading = ref(false)
  const error = ref<boolean | Error>(false)
  const data = ref<T | undefined>(options.initialData) as Ref<T | undefined>
  let requestTask: UniApp.RequestTask | undefined
  const isCancelled = ref(false)

  // 辅助函数：判断是否为 HttpRequestResult 类型
  const isHttpRequestResult = (value: any): value is HttpRequestResult<T> => {
    return value
      && typeof value === 'object'
      && 'promise' in value
      && 'requestTask' in value
  }

  const run = async (args?: P): Promise<T | undefined> => {
    loading.value = true
    error.value = false
    isCancelled.value = false

    try {
      const result = func(args)
      let promiseToReturn: Promise<T | undefined>

      if (isHttpRequestResult(result)) {
        // 直接处理 HttpRequestResult 类型
        requestTask = result.requestTask
        promiseToReturn = result.promise as Promise<T | undefined>
      }
      else {
        // 处理 Promise 类型
        promiseToReturn = result as Promise<T | undefined>
      }

      // 检查是否已取消
      if (isCancelled.value) {
        requestTask?.abort()
        throw new Error('Request cancelled')
      }

      // 等待结果并处理
      const res = await promiseToReturn
      if (isCancelled.value) {
        return undefined
      }

      data.value = res
      return data.value
    }
    catch (err) {
      if (!isCancelled.value) {
        error.value = err
        throw err
      }
      return undefined
    }
    finally {
      loading.value = false
    }
  }

  const cancel = () => {
    isCancelled.value = true
    if (requestTask) {
      requestTask.abort()
    }
    loading.value = false
    error.value = new Error('Request cancelled')
  }

  if (options.immediate) {
    run({} as P)
  }

  return { loading, error, data, run, cancel }
}
