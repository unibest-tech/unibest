import { defineConfig } from 'openapi-ts-request'

export default defineConfig([
  {
    describe: 'unibest-openapi-test',
    schemaPath: 'https://ukw0y1.laf.run/unibest-opapi-test.json',
    serversPath: './src/service',
    requestLibPath: `import request from '@/http/vue-query';\n import { CustomRequestOptions } from '@/http/types';`,
    requestOptionsType: 'CustomRequestOptions',
    isGenReactQuery: false,
    reactQueryMode: 'vue',
    isGenJavaScript: false,
  },
])
