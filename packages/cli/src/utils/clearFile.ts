import * as fs from 'node:fs'
import * as path from 'node:path'

export function clearDirectory(directoryPath: string): void {
  // 获取目录下的所有文件和子目录
  const files = fs.readdirSync(directoryPath)

  // 遍历所有文件和子目录
  for (const file of files) {
    const filePath = path.join(directoryPath, file)

    // 如果是子目录，则递归清空子目录
    if (fs.statSync(filePath).isDirectory()) {
      clearDirectory(filePath)
    }
    else {
      // 如果是文件，则删除文件
      fs.unlinkSync(filePath)
    }
  }
}
