import type { Ora } from './loading'
import { relative } from 'node:path'
import { bold, green } from 'kolorist'
import { getCommand } from './getCommand'

export function printFinish(
  root: string,
  cwd: string,
  packageManager: 'pnpm' | 'npm' | 'yarn',
  loading: Ora,
  type?: 'base' | 'demo' | 'i18n' | 'ucharts' | 'hbx-base' | 'hbx-demo  ',
) {
  loading.succeed(`${bold('模板创建完成！')}`)
  console.log()
  if (root !== cwd) {
    const cdProjectName = relative(cwd, root)
    console.log(
      `  ${bold(green(`cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`))}`,
    )
  }
  console.log(`  ${bold(green(getCommand(packageManager, 'i')))}`)
  if (type && type.startsWith('hbx-'))
    console.log(`  ${bold(green('请通过 HBuilderX 打开项目并运行！'))}`)
  else
    console.log(`  ${bold(green(getCommand(packageManager, 'dev')))}`)

  console.log()
}
