import { logger } from '@unibest/shared'
// import { mergeTemplates } from './template'

/**
 * 项目生成器核心函数
 * @param options 生成选项
 */
export async function generateProject(options: Record<string, any>): Promise<void> {
  logger.info('开始生成项目...')
  // TODO: 实现项目生成逻辑
  // await mergeTemplates({
  //   base: 'base',
  //   ui,
  //   features,
  //   targetDir: options.projectDir,
  // })
  // 处理平台配置
  // 安装依赖
  logger.success('项目生成完成')
}
