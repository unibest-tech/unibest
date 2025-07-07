import { defineConfig } from 'tsup'

// tsup配置文件，用于定义CLI工具的构建规则
export default defineConfig({
  // 入口文件路径
  entry: ['src/index.ts'],
  // 输出目录
  outDir: 'dist',
  // 生成的模块格式，同时支持CommonJS和ESModule
  format: ['cjs', 'esm'],
  // 是否生成类型声明文件
  dts: true,
  // 是否生成sourcemap
  sourcemap: false,
  // 构建前清空输出目录
  clean: true,
  // 目标环境
  target: 'node14',
  // 排除不需要打包的依赖
  external: ['prompts', 'ejs', 'fs-extra', 'path', 'child_process'],
})
