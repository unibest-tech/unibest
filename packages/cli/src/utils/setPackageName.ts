import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function replaceNameContent(filePath: string, projectName: string) {
  const fileContent = JSON.parse(readFileSync(filePath, 'utf8'))
  fileContent.name = projectName
  writeFileSync(filePath, JSON.stringify(fileContent, null, 2))
}

export function replaceProjectName(root: string, name: string) {
  const projectName = name.toLocaleLowerCase().replace(/\s/g, '-')
  const pkgPath = join(root, 'package.json')

  replaceNameContent(pkgPath, projectName)
}
