import * as fs from 'node:fs'
import * as path from 'node:path'

type DirectoryTraverse = (dir: string, dirCallback: (dir: string) => void, fileCallback: (file: string) => void) => void

export const preOrderDirectoryTraverse: DirectoryTraverse = (dir, dirCallback, fileCallback) => {
  for (const filename of fs.readdirSync(dir)) {
    if (filename === '.git')
      continue

    const fullpath = path.resolve(dir, filename)
    if (fs.lstatSync(fullpath).isDirectory()) {
      dirCallback(fullpath)
      if (fs.existsSync(fullpath))
        preOrderDirectoryTraverse(fullpath, dirCallback, fileCallback)

      continue
    }
    fileCallback(fullpath)
  }
}

export const postOrderDirectoryTraverse: DirectoryTraverse = (dir, dirCallback, fileCallback) => {
  for (const filename of fs.readdirSync(dir)) {
    if (filename === '.git')
      continue

    const fullpath = path.resolve(dir, filename)
    if (fs.lstatSync(fullpath).isDirectory()) {
      postOrderDirectoryTraverse(fullpath, dirCallback, fileCallback)
      dirCallback(fullpath)
      continue
    }
    fileCallback(fullpath)
  }
}
