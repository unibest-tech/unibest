import type { IDoubleTokenRes } from '@/api/types/login'
import type { CustomRequestOptions, HttpRequestResult, IResponse } from '@/http/types'
import { nextTick } from 'vue'
import { LOGIN_PAGE } from '@/router/config'
import { useTokenStore } from '@/store/token'
import { isDoubleTokenMode } from '@/utils'
import { ResultEnum } from './tools/enum'

// 刷新 token 状态管理
let refreshing = false // 防止重复刷新 token 标识
let taskQueue: { resolve: (value: any) => void, reject: (reason?: any) => void, options: CustomRequestOptions }[] = [] // 刷新 token 请求队列

/**
 * HTTP 请求函数
 * 根据 cancelRequestEnable 选项返回 Promise 或包含 promise 和 requestTask 的对象
 */
export function http<T>(options: CustomRequestOptions & { cancelRequestEnable: true }): HttpRequestResult<T>
export function http<T>(options: CustomRequestOptions): Promise<T>
export function http<T>(options: CustomRequestOptions) {
  const timeout = options.timeout || 30000 // 默认 30 秒超时
  let requestTask: UniApp.RequestTask | undefined
  let timeoutId: number | undefined
  let requestAborted = false
  let abortError: Error | null = null

  const promise = new Promise<T>((resolve, reject) => {
    // 设置超时定时器
    timeoutId = setTimeout(() => {
      requestTask?.abort()
      reject(new Error(`请求超时（${timeout}ms）`))
    }, timeout) as unknown as number

    // 检查请求是否已经被中止
    if (requestAborted && abortError) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
      return reject(abortError)
    }

    requestTask = uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success: async (res) => {
        // 清除超时定时器
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = undefined
        }

        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 处理业务逻辑错误
          const { code = 0, message = '', msg = '', data = null } = res.data as IResponse<T>
          // 0和200当做成功都很普遍，这里直接兼容两者，见 ResultEnum
          if (code !== ResultEnum.Success0 && code !== ResultEnum.Success200) {
            throw new Error(`请求错误[${code}]：${message || msg}`)
          }
          return resolve(data as T)
        }

        const resData: IResData<T> = res.data as IResData<T>
        if ((res.statusCode === 401) || (resData.code === 401)) {
          // 调用 token 刷新逻辑
          await handleTokenRefresh(res, resolve, reject, options)
        }
        else {
          // 其他错误 -> 根据后端错误信息轻提示
          if (!options.hideErrorToast) {
            uni.showToast({
              icon: 'none',
              title: (res.data as IResData<T>).msg || '请求错误',
            })
          }
          reject(res)
        }
      },
      // 响应失败
      fail(err: UniApp.RequestSuccessCallbackResult | UniApp.GeneralCallbackResult) {
        // 清除超时定时器
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = undefined
        }

        console.log(`🚀 - fail - err:`, err)
        // 如果是请求取消，则不显示错误提示
        if (err.errMsg === 'request:fail abort') {
          return reject(new Error('Request cancelled'))
        }
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })

  if (options.cancelRequestEnable) {
    // 创建标准的 abort 实现
    const createRequestTask = (): UniApp.RequestTask => {
      return {
        abort: () => {
          if (requestTask) {
            requestTask.abort()
          }
          else {
            // 如果真实的 requestTask 还不存在，标记请求为已中止
            requestAborted = true
            abortError = new Error('Request cancelled before initialization')
          }
        },
      } as UniApp.RequestTask
    }

    // 如果 requestTask 不存在，创建一个符合接口的模拟对象
    if (!requestTask) {
      requestTask = createRequestTask()
    }
    return { promise, requestTask }
  }
  return promise
}

/**
 * 处理 token 刷新逻辑
 */
async function handleTokenRefresh<T>(
  res: UniApp.RequestSuccessCallbackResult,
  resolve: (value: T) => void,
  reject: (reason?: any) => void,
  options: CustomRequestOptions,
) {
  const tokenStore = useTokenStore()

  if (!isDoubleTokenMode) {
    tokenStore.logout()
    uni.navigateTo({ url: LOGIN_PAGE })
    return reject(res)
  }

  const { refreshToken } = tokenStore.tokenInfo as IDoubleTokenRes || {}

  if ((res.statusCode === 401 || (res.data as IResponse<T>).code === 401) && refreshToken) {
    taskQueue.push({ resolve, reject, options })
  }

  if ((res.statusCode === 401 || (res.data as IResponse<T>).code === 401) && refreshToken && !refreshing) {
    refreshing = true
    try {
      // 发起刷新 token 请求（使用 store 的 refreshToken 方法）
      await tokenStore.refreshToken()
      // 刷新 token 成功
      refreshing = false
      nextTick(() => {
        // 关闭其他弹窗
        uni.hideToast()
        uni.showToast({
          title: 'token 刷新成功',
          icon: 'none',
        })
      })
      // 将任务队列的所有任务重新请求
      taskQueue.forEach((task) => {
        const httpResult = http<T>(task.options)
        // 修复类型错误：添加类型检查
        if ('promise' in httpResult) {
          (httpResult.promise as Promise<T>).then(task.resolve, task.reject)
        }
        else if (httpResult instanceof Promise) {
          httpResult.then(task.resolve, task.reject)
        }
      })
    }
    catch (refreshErr) {
      console.error('刷新 token 失败:', refreshErr)
      refreshing = false
      // 刷新 token 失败，跳转到登录页
      nextTick(() => {
        // 关闭其他弹窗
        uni.hideToast()
        uni.showToast({
          title: '登录已过期，请重新登录',
          icon: 'none',
        })
      })
      // 清除用户信息
      await tokenStore.logout()
      // 跳转到登录页
      setTimeout(() => {
        uni.navigateTo({ url: LOGIN_PAGE })
      }, 2000)
    }
    finally {
      // 不管刷新 token 成功与否，都清空任务队列
      taskQueue = []
    }
  }
}

/**
 * 创建 HTTP 方法的通用工厂函数
 */
function createHttpMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE') {
  return function <T>(url: string, dataOrQuery?: Record<string, any>, query?: Record<string, any>, header?: Record<string, any>, options?: Partial<CustomRequestOptions>) {
    // 处理不同方法的参数差异
    const params = method === 'GET' || method === 'DELETE'
      ? { url, query: dataOrQuery, method, header, ...options }
      : { url, data: dataOrQuery, query, method, header, ...options }

    return http<T>(params) as Promise<T>
  }
}

/**
 * 创建带取消功能的 HTTP 方法工厂函数
 */
function createHttpMethodWithCancel(method: 'GET' | 'POST' | 'PUT' | 'DELETE') {
  return function <T>(url: string, dataOrQuery?: Record<string, any>, query?: Record<string, any>, header?: Record<string, any>, options?: Partial<CustomRequestOptions>) {
    // 处理不同方法的参数差异
    const params = method === 'GET' || method === 'DELETE'
      ? { url, query: dataOrQuery, method, header, ...options, cancelRequestEnable: true }
      : { url, data: dataOrQuery, query, method, header, ...options, cancelRequestEnable: true }

    // 修复类型错误：使用 unknown 作为中间类型进行转换
    return http<T>(params) as unknown as HttpRequestResult<T>
  }
}

// 然后定义所有 HTTP 方法（注意这里不再需要传入类型参数）
export const httpGet = createHttpMethod('GET')
export const httpPost = createHttpMethod('POST')
export const httpPut = createHttpMethod('PUT')
export const httpDelete = createHttpMethod('DELETE')

export const httpGetWithCancel = createHttpMethodWithCancel('GET')
export const httpPostWithCancel = createHttpMethodWithCancel('POST')
export const httpPutWithCancel = createHttpMethodWithCancel('PUT')
export const httpDeleteWithCancel = createHttpMethodWithCancel('DELETE')

// 支持与 axios 类似的API调用
http.get = httpGet
http.post = httpPost
http.put = httpPut
http.delete = httpDelete

// 支持与 alovaJS 类似的API调用
http.Get = httpGet
http.Post = httpPost
http.Put = httpPut
http.Delete = httpDelete

// 考虑到 95% 的场景都不需要 cancel 功能，所以为了减少耦合，cancel 单独提供
http.getWithCancel = httpGetWithCancel
http.postWithCancel = httpPostWithCancel
http.putWithCancel = httpPutWithCancel
http.deleteWithCancel = httpDeleteWithCancel
http.GetWithCancel = httpGetWithCancel
http.PostWithCancel = httpPostWithCancel
http.PutWithCancel = httpPutWithCancel
http.DeleteWithCancel = httpDeleteWithCancel
