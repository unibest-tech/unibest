import crypto from 'node:crypto'
import os from 'node:os'
import process from 'node:process'
import axios from 'axios'
import dayjs from 'dayjs'
import packageJSON from '../../package.json'
import getUnibestVersionGitee from './unibestVersion'

export async function beacon(template: string, duration: string) {
  try {
    // const unibestVersion = await getUnibestVersion()
    const unibestVersionGitee = await getUnibestVersionGitee()
    const deviceIdentifier = generateDeviceIdentifier()

    axios.post('https://ukw0y1.laf.run/create-unibest/beacon', {
      template,
      // unibestVersion,
      unibestVersion: unibestVersionGitee,
      createUnibestVersion: packageJSON.version,
      duration,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      nodeVersion: process.version,
      osPlatform: process.platform,
      cpuModel: os.cpus()[0]?.model || 'unknown',
      osRelease: os.release(),
      totalMem: Math.round(os.totalmem() / (1024 * 1024 * 1024)), // 四舍五入为整数 GB
      cpuArch: process.arch,
      uuid: deviceIdentifier, // 添加设备唯一标识符
    })
  }
  catch (error) {
    // 不需要打印
  }
}

async function getUnibestVersion(): Promise<string | null> {
  try {
    // 构建 package.json 文件的原始内容链接
    const url = 'https://raw.githubusercontent.com/feige996/unibest/main/package.json'
    // const url = 'https://gitee.com/api/v5/repos/feige996/unibest/contents/package.json';
    const response = await axios.get(url)
    const packageJson = response.data
    return packageJson.version
  }
  catch (error) {
    // console.error('Failed to get unibest version:', error);
    return null
  }
}

// 生成设备唯一标识符
function generateDeviceIdentifier(): string {
  const deviceInfo = [
    os.cpus()[0]?.model || '',
    os.totalmem().toString(),
    os.platform(),
    os.userInfo().username,
  ].join('|')

  const hash = crypto.createHash('sha256').update(deviceInfo).digest('hex')
  return hash
}
