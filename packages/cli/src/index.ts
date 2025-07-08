#!/usr/bin/env node
import type { InitialReturnValue } from 'prompts'
import { existsSync, mkdirSync, rmdirSync, unlinkSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { bold, green, red } from 'kolorist'
import minimist from 'minimist'
import prompts from 'prompts'
import figures from 'prompts/lib/util/figures.js'
import { ora, printBanner, printFinish } from './utils'
import { postOrderDirectoryTraverse } from './utils/directoryTraverse'

let loading

/**
 * 初始化项目创建流程
 * 处理命令行参数并执行交互式询问
 */
async function init() {
  await printBanner()
  const argv = minimist(process.argv.slice(2), {
    alias: { templateType: ['t'], platforms: ['p'], ui: ['u'] },
    string: ['_'],
    boolean: ['i18n'],
  })

  // 从命令行参数获取项目名称
  const projectName = argv._[0]
  if (!projectName) {
    console.log(`${red(figures.cross)} 请指定项目名称: create-unibest <project-name>`)
    process.exit(1)
  }

  // 项目根目录
  const cwd = process.cwd()
  const root = join(cwd, projectName)

  // 检查目录是否已存在
  if (existsSync(root) && !await canSkipEmptying(root)) {
    const { shouldOverwrite } = await prompts({
      type: 'confirm',
      name: 'shouldOverwrite',
      message: `目录 ${root} 已存在，是否覆盖?`,
      initial: false,
    })
    if (!shouldOverwrite)
      process.exit(0)
    emptyDir(root)
  }

  // 交互式询问配置
  const config = await promptForOptions(argv)

  // 开始创建项目
  loading = ora(`${bold('正在创建项目...')}`).start()
  try {
    // 这里会调用generator包的生成逻辑
    // await generateProject({
    //   projectName,
    //   root,
    //   ...config
    // })
    loading.succeed(`${green('项目创建成功!')}`)
    printFinish(projectName)
  }
  catch (error) {
    loading.fail(`${red('项目创建失败:')} ${(error as Error).message}`)
    process.exit(1)
  }
}

/**
 * 根据命令行参数或交互式询问获取项目配置
 * @param argv 命令行参数
 * @returns 项目配置对象
 */
async function promptForOptions(argv: minimist.ParsedArgs) {
  // 定义UI库及其支持的平台
  const uiLibraries = [
    { name: 'wot-ui', value: 'wot-ui', platforms: ['wechat', 'h5', 'app', 'alipay', 'toutiao'] },
    { name: 'sard-uniapp', value: 'sard-uniapp', platforms: ['wechat', 'h5', 'app'] },
    { name: 'uv-ui', value: 'uv-ui', platforms: ['wechat', 'h5', 'app', 'alipay'] },
    { name: 'uview-plus', value: 'uview-plus', platforms: ['wechat', 'h5', 'app'] },
  ]

  // 1. 平台选择
  const platforms = argv.platforms
    ? argv.platforms.split(',').map((p: string) => p.trim())
    : await prompts({
        type: 'multiselect',
        name: 'platforms',
        message: '请选择目标平台',
        choices: [
          { title: '微信小程序', value: 'wechat' },
          { title: 'H5', value: 'h5' },
          { title: 'APP', value: 'app' },
          { title: '支付宝小程序', value: 'alipay' },
          { title: '抖音小程序', value: 'toutiao' },
        ],
        hint: '空格键选择, 回车键确认',
      }).then(res => res.platforms as number[])

  // 2. UI库选择 (根据平台过滤)
  const filteredUiOptions = uiLibraries
    .filter(ui => ui.platforms.some(p => platforms.includes(p)))
    .map(ui => ({ title: ui.name, value: ui.value }))

  const uiLibrary = argv.ui || await prompts({
    type: 'select',
    name: 'uiLibrary',
    message: '请选择UI库',
    choices: filteredUiOptions,
    initial: filteredUiOptions.findIndex(ui => ui.value === 'wot-ui'),
  }).then(res => res.uiLibrary)

  // 3. 请求库选择
  const requestLibrary = await prompts({
    type: 'select',
    name: 'requestLibrary',
    message: '请选择请求库',
    choices: [
      { title: '内置 useRequest', value: 'useRequest' },
      { title: 'alovajs', value: 'alova' },
      { title: 'vue-query', value: 'vueQuery' },
    ],
    initial: 0,
  }).then(res => res.requestLibrary)

  // 4. 多语言支持
  const i18n = argv.i18n ?? await prompts({
    type: 'confirm',
    name: 'i18n',
    message: '是否需要多语言支持?',
    initial: false,
  }).then(res => res.i18n)

  // 5. Token策略选择
  const tokenStrategy = await prompts({
    type: 'select',
    name: 'tokenStrategy',
    message: '请选择Token策略',
    choices: [
      { title: '单token', value: 'single' },
      { title: '双token', value: 'double' },
    ],
    initial: 0,
  }).then(res => res.tokenStrategy)

  return {
    platforms,
    uiLibrary,
    requestLibrary,
    i18n,
    tokenStrategy,
  }
}

/**
 * 检查是否可以跳过目录清空
 * @param dir 目录路径
 * @returns 是否可以跳过
 */
async function canSkipEmptying(dir: string): Promise<boolean> {
  if (!existsSync(dir))
    return true
  const files = await readdir(dir)
  return files.length === 0
}

/**
 * 清空目录
 * @param dir 目录路径
 */
function emptyDir(dir: string) {
  if (!existsSync(dir))
    return
  postOrderDirectoryTraverse(
    dir,
    (file: string) => unlinkSync(file),
    (dir: string) => rmdirSync(dir),
  )
}

// 执行初始化
init().catch((e) => {
  console.error(`${red(figures.cross)} 初始化失败:`, e)
  process.exit(1)
})
