import type { Ora } from 'ora'
import { existsSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { blue, bold, green } from 'kolorist'
import _ora from 'ora'

/**
 * 创建ora加载实例
 * @returns Ora实例
 */
export function ora(text?: string): Ora {
  return _ora({ text, spinner: 'dots', color: 'blue' })
}

/**
 * 打印项目横幅
 * @param projectName 项目名称
 */
export async function printBanner(projectName?: string): Promise<void> {
  console.log(bold(green(`创建项目: ${projectName || 'unibest-project'}`)))
}

/**
 * 目录后序遍历
 * @param dir 目录路径
 * @param callback 文件处理回调
 */
export function postOrderDirectoryTraverse(dir: string, callback: (file: string) => void): void {
  // 实现目录遍历逻辑
}

/**
 * 发送统计信息
 * @param data 统计数据
 */
export async function beacon(data: Record<string, any>): Promise<void> {
  // 实现数据发送逻辑
}

/**
 * 替换项目名称
 * @param dir 目录
 * @param projectName 项目名称
 */
export function replaceProjectName(dir: string, projectName: string): void {
  // 实现项目名称替换逻辑
}

/**
 * 打印项目创建完成信息
 * @param projectName 项目名称
 */
export function printFinish(projectName: string): void {
  console.log(`\n${green('✓')} 项目创建成功: ${bold(projectName)}
`)
  console.log(`  ${blue('$')} cd ${projectName}`)
  console.log(`  ${blue('$')} pnpm install`)
  console.log(`  ${blue('$')} pnpm dev
`)
}

/**
 * 检查目录是否可以跳过清空
 * @param dir 目标目录
 * @returns 是否可以跳过
 */
export async function canSkipEmptying(dir: string): Promise<boolean> {
  if (!existsSync(dir))
    return true
  const files = readdirSync(dir)
  if (files.length === 0)
    return true
  // 实际实现需添加用户确认逻辑
  return false
}

/**
 * 下载项目模板（占位实现）
 * @param templateType 模板类型
 * @param targetDir 目标目录
 */
export async function downloadTemplate(templateType: string, targetDir: string): Promise<void> {
  const loading = ora(`正在下载 ${templateType} 模板...`).start()
  try {
    // 实际实现需添加模板下载逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.succeed('模板下载完成')
  }
  catch (err) {
    loading.fail('模板下载失败')
    throw err
  }
}

// 其他函数实现...
