import uniHelper from '@uni-helper/eslint-config'
import eslintConfigPrettier from '@vue/eslint-config-prettier'

export default uniHelper(
  {
    unocss: true,
    vue: true,
    typescript: true,
    markdown: false,
    formatters: {
      /**
       * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
       * By default uses Prettier
       */
      css: true,
      /**
       * Format HTML files
       * By default uses Prettier
       */
      html: true,
    },
    globals: {
      uni: 'readonly',
      plus: 'readonly',
      wx: 'readonly',
    },
    rules: {
      // 修改此行
      'no-console': 'off', // [!code --]
      'no-unused-vars': 'off',
      'vue/no-unused-refs': 'off',
      'unused-imports/no-unused-vars': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/require-returns-description': 'off',
      'ts/no-empty-object-type': 'off',
      'no-extend-native': 'off',
      'vue/block-order': [
        2,
        {
          order: [['script', 'template'], 'style'],
        },
      ], // 强制组件顶级元素的顺序
      'vue/html-self-closing': [
        0,
        {
          html: {
            void: 'never',
            normal: 'always',
            component: 'never',
          },
        },
      ],
      // 强制自结束样式
      'vue/custom-event-name-casing': [2, 'kebab-case'], // 对自定义事件名称强制使用特定大小写
      'vue/singleline-html-element-content-newline': 0, // 要求在单行元素的内容前后换行
      'vue/first-attribute-linebreak': 0, // 强制第一个属性的位置
      'vue/define-macros-order': [
        2,
        {
          order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots'],
          defineExposeLast: false,
        },
      ], // 强制执行定义限制和定义弹出编译器宏的顺序
      'vue/html-indent': 0, // 在《模板》中强制一致的缩进
      'vue/html-closing-bracket-newline': 0, // 要求或不允许在标记的右括号前换行
      // 'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    },
    // 添加 Prettier 兼容规则
    ignores: [
      'README.md',
      'src/types/shims-vue.d.ts',
      'src/uni_modules/',
      'dist',
      // unplugin-auto-import 生成的类型文件，每次提交都改变，所以加入这里吧，与 .gitignore 配合使用
      'auto-import.d.ts',
      // vite-plugin-uni-pages 生成的类型文件，每次切换分支都一堆不同的，所以直接 .gitignore
      'uni-pages.d.ts',
      // 插件生成的文件
      'src/pages.json',
      'src/manifest.json',
      // 忽略自动生成文件
      'src/service/app/**',
    ],
  },
  {
    ...eslintConfigPrettier,
  },
)
