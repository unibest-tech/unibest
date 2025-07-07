#!/usr/bin/env node

import type { BaseTemplateList } from './question/template/type'
import type { Ora } from './utils'
import {
  existsSync,
  mkdirSync,
  rmdirSync,
  unlinkSync,
} from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { bold, green, red } from 'kolorist'
import minimist from 'minimist'
import prompts from 'prompts'
import figures from 'prompts/lib/util/figures.js'
import { question } from './question'
import filePrompt from './question/file'
import { templateList } from './question/template/templateDate'
import {
  canSkipEmptying,
  downloadTemplate,
  ora,
  printBanner,
  printFinish,
  replaceProjectName,
} from './utils'
import { beacon } from './utils/beacon'
import { postOrderDirectoryTraverse } from './utils/directoryTraverse'

let loading: Ora
async function init() {
  await printBanner()

  const argv = minimist(process.argv.slice(2), {
    alias: {
      templateType: ['t'],
    },
    string: ['_'],
  })
  const projectName = argv._[0]

  let result: {
    projectName?: string
    shouldOverwrite?: boolean
    templateType?: BaseTemplateList['value']
  } = {}

  if (!projectName) {
    try {
      result = await question()
      // console.log(`${red('没有项目名时的result: ')}`)
      // console.log(result)
      // {
      //   projectName: 'u8',
      //     templateType: {
      //        type: 'base',
      //        branch: 'base',
      //        url: {
      //           gitee: 'https://gitee.com/feige996/unibest.git',
      //           github: 'https://github.com/feige996/unibest.git'
      //     }
      //   }
      // }
    }
    catch (cancelled) {
      console.log((<{ message: string }>cancelled).message)
      process.exit(1)
    }
  }
  else {
    const templateType = templateList.find(item => item.value.type === argv?.t)?.value

    if (!templateType && argv?.templateType) {
      console.log(`${red(figures.cross)} ${bold(`未获取到${argv?.templateType}模板`)}`)
      process.exit(1)
    }

    const pp = async () => {
      const onCancel = () => {
        throw new Error(`${red(figures.cross)} ${bold('操作已取消')}`)
      }
      const step1 = filePrompt(projectName)
      try {
        const step2 = await prompts(step1, { onCancel })
        return step2.shouldOverwrite
      }
      catch (error) {
        console.log(`${red(figures.cross)} ${bold('操作已取消')}`)
        // 既然操作已经取消那就退出呀！
        process.exit(1)
      }
    }
    result = {
      projectName,
      shouldOverwrite: await canSkipEmptying(root)
        ? true
        : await pp(),
      templateType: templateType || {
        type: 'base',
        branch: 'base',
        url: {
          gitee: 'https://gitee.com/feige996/unibest.git',
          github: 'https://github.com/feige996/unibest.git',
        },
      },
    }
    // console.log(`${red('有项目名时的result: ')}`)
    // console.log(result)
    // {
    //   projectName: 'u7',
    //   shouldOverwrite: true,
    //   templateType: { type: 'custom' }
    // }
  }

  const cwd = process.cwd()
  const root = join(cwd, result.projectName!)

  // 结束加载动画并显示成功消息
  ora(`tip1`).start().succeed(`${green('unibest官方文档：https://unibest.tech\n')}`)
  // ora(`tip2`).start().succeed(`${bold('常见问题经常被提及，请点击查阅：https://unibest.tech/base/14-faq\n')}`)
  // ora(`tip3`).start().succeed(`${bold('如果对您有帮助，欢迎赞助、打赏：https://unibest.tech/advanced/rewards/rewards\n')}`)
  const startTime = Date.now()
  loading.start(`${bold('正在创建模板...')}`)
  // openUrl('https://unibest.tech/base/14-faq')
  // openUrl('https://oss.laf.run/ukw0y1-site/unibest-dashang.html')
  // 打开指定网页
  // try {
  //   await open('https://www.baidu.com')
  // }
  // catch (error) {
  //   console.error(`${red(figures.cross)} ${bold('打开网页失败: ')}`, error)
  // }

  // const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'
  const packageManager = 'pnpm'

  function emptyDir(dir: string) {
    if (!existsSync(dir))
      return

    postOrderDirectoryTraverse(
  dir,
  (file: string) => unlinkSync(file),
  (dir: string) => rmdirSync(dir),
)
  }

  if (existsSync(root) && result.shouldOverwrite)
    emptyDir(root)

  else if (!existsSync(root))
    mkdirSync(root)
  if (result.templateType!.type !== 'custom') {
    const { templateType, projectName } = result
    await downloadTemplate(templateType!, root)
    printFinish(projectName!)
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)
    loading.succeed(`总耗时: ${duration} 秒`)
    beacon({ event: 'create', template: templateType?.value, duration })
    return
  }

  type Callback = (dataStore: Record<string, any>) => void
  const callbacks: Callback[] = []

  const dataStore: Record<string, any> = {}
  // Process callbacks
  for (const cb of callbacks)
    await cb(dataStore)

  replaceProjectName(root, result.projectName!)

  printFinish(root, cwd, packageManager, loading)
}

init().catch((e) => {
  loading.fail(`${bold('模板创建失败！')}`)
  console.error(e)
})
