import path from 'node:path'
import ejs from 'ejs'
// 新模板渲染逻辑示例
import fs from 'fs-extra'

export async function renderTemplate(templateName: string, targetDir: string, config: any) {
  const templatePath = path.resolve(__dirname, `../../../templates/${templateName}`)
  if (!fs.existsSync(templatePath)) {
    throw new Error(`模板 ${templateName} 不存在`)
  }

  // 递归复制并渲染模板文件
  await fs.copy(templatePath, targetDir, {
    filter: src => !src.includes('node_modules'),
    process: (content, srcPath) => {
      if (srcPath.endsWith('.ejs')) {
        return ejs.render(content.toString(), config)
      }
      return content
    },
  })
}
