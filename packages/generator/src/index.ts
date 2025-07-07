import { logger } from '@unibest/shared'

/**
 * 项目生成器核心函数
 * @param options 生成选项
 */
export async function generateProject(options: Record<string, any>): Promise<void> {
  logger.info('开始生成项目...')
  // TODO: 实现项目生成逻辑
  logger.success('项目生成完成')
}
