import { http } from '@/http/http'

export function bar() {
  return http.Get('/foo', {
    params: {
      name: '菲鸽',
      page: 1,
      pageSize: 10,
    },
  })
}
