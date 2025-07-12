// 监测src下有没有manifest.json文件，如果没有就生成

const fs = require('node:fs')
const path = require('node:path')

const { join } = path
const { existsSync, writeFileSync } = fs

const srcPath = join(__dirname, '../src')
const manifestPath = join(srcPath, 'manifest.json')
if (!existsSync(manifestPath)) {
// 只需要一个空对象即可
  writeFileSync(manifestPath, JSON.stringify({}, null, 2))
  console.log('manifest.json created in src directory.')
}
else {
  console.log('manifest.json already exists in src directory.')
}
