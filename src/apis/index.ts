import { createAlova } from 'alova'
import fetchAdapter from 'alova/fetch'
import vueHook from 'alova/vue'
import { createApis, withConfigType } from './createApis'

export const alovaInstance = createAlova({
  baseURL: '',
  statesHook: vueHook,
  requestAdapter: fetchAdapter(),
  beforeRequest: (method) => {},
  responded: (res) => {
    return res.json().then(res => res.data)
  },
})

export const $$userConfigMap = withConfigType({})

const Apis = createApis(alovaInstance, $$userConfigMap)

export default Apis
