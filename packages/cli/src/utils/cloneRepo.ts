import type { BaseTemplateList } from '../question/template/type'
import type { Ora } from './loading'
import { exec } from 'node:child_process'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { bold, red } from 'kolorist'
import { replaceProjectName } from './setPackageName'

async function removeGitFolder(localPath: string): Promise<void> {
  const gitFolderPath = join(localPath, '.git')
  await fs.rm(gitFolderPath, { recursive: true, force: true })
}

async function cloneRepo(gitUrls: string[], branch: string, localPath: string): Promise<void> {
  let lastError = null

  for (const gitUrl of gitUrls) {
    try {
      await new Promise<void>((resolve, reject) => {
        const execStr = `git clone -b ${branch} ${gitUrl} "${localPath}"`
        // const execStr = `npx degit feige996/unibest#${branch}`
        // console.log(`${green('execStr:')} ${execStr}`)

        exec(execStr, async (error) => {
          if (error) {
            console.error(`${red('exec error:')} ${error}`)
            reject(error)
            return
          }

          try {
            // console.log(`${green('removeGitFolder')} ${localPath}`)
            await removeGitFolder(localPath)
            resolve()
          }
          catch (error) {
            // console.error(`${red('removeGitFolder error:')} ${error}`)
            reject(error)
          }
        })
      })
      return
    }
    catch (error) {
      console.error(`${red('cloneRepo error:')} ${error}`)
      lastError = error
    }
  }

  if (lastError)
    throw new Error('All URLs failed')
}

function getRepoUrlList(url: BaseTemplateList['value']['url']) {
  const { github, gitee } = url
  return [gitee, github].filter(Boolean) as string[]
}

export async function downloadTemplate(data: BaseTemplateList['value'], name: string, root: string, loading: Ora) {
  const repoUrlList = getRepoUrlList(data.url)
  // console.log(`${green('获取到的仓库url:')} ${repoUrlList}`)

  try {
    // 如果填了branch则用对应的branch，否则使用 base， base 分支才是开发最需要的
    await cloneRepo(repoUrlList, data.branch || 'base', root)
  }
  catch (error) {
    loading.fail(`${bold('模板创建失败！')}`)
    process.exit(1)
  }

  replaceProjectName(root, name)
  data.callBack?.(root)
}
