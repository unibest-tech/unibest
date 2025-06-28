import type { Config } from '@alova/wormhole'

// For more config detailed visit:
// https://alova.js.org/tutorial/getting-started/extension-integration

export default <Config>{
  generator: [
    {
      /**
       * file input. support:
       * 1. openapi json file url
       * 2. local file
       */
      input: 'http://localhost:3001/api/api-docs-json',

      /**
       * input file platform. Currently only swagger is supported.
       * When this parameter is specified, the input field only needs to specify the document address without specifying the openapi file
       */
      platform: 'swagger',

      /**
       * output path of interface file and type file.
       * Multiple generators cannot have the same address, otherwise the generated code will overwrite each other.
       */
      output: 'src/apis',

      /**
       * the mediaType of the generated response data. default is `application/json`
       */
      // responseMediaType: 'application/json',

      /**
       * the bodyMediaType of the generated request body data. default is `application/json`
       */
      // bodyMediaType: 'application/json',

      /**
       * the generated api version. options are `2` or `3`, default is `auto`.
       */
      // version: 'auto',

      /**
       * type of generated code. The options are `auto/ts/typescript/module/commonjs`.
       */
      // type: 'auto',

      /**
       * exported global api name, you can access the generated api globally through this name, default is `Apis`.
       * it is required when multiple generators are configured, and it cannot be repeated
       */
      // global: 'Apis',

      /**
       * filter or convert the generated api information, return an apiDescriptor, if this function is not specified, the apiDescripor object is not converted
       */
      // handleApi: apiDescriptor => {
      //  return apiDescriptor;
      // }
    },
  ],

  /**
   * extension only
   * whether to automatically update the interface, enabled by default, check every 5 minutes, closed when set to `false`
   */
  // autoUpdate: true
}
