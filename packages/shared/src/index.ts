import process from 'node:process'
import { bgLightGreen, blue, bold, green, red, yellow } from 'kolorist'

/**
 * 日志工具函数，提供带颜色的日志输出
 */
export const logger = {
  /**
   * 输出信息日志（蓝色）
   * @param message 日志消息
   */
  info: (message: string) => console.log(blue(`[INFO] ${message}`)),

  /**
   * 输出成功日志（绿色）
   * @param message 日志消息
   */
  success: (message: string) => console.log(green(`[SUCCESS] ${message}`)),

  /**
   * 输出错误日志（红色）
   * @param message 日志消息
   */
  error: (message: string) => console.error(red(`[ERROR] ${message}`)),

  /**
   * 输出警告日志（黄色）
   * @param message 日志消息
   */
  warn: (message: string) => console.warn(yellow(`[WARN] ${message}`)),
}

/**
 * 延迟指定时间
 * @param ms 延迟毫秒数
 * @returns Promise<void>
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 生成带颜色的横幅文本
 * @param text 横幅内容
 * @returns 格式化后的横幅字符串
 */
export function generateBanner(text: string) {
  console.log()
  // 检查是否在支持颜色的终端中运行
  const supportsColor = () => {
    if (!process.stdout.isTTY)
      return false
    const colorDepth = process.stdout.getColorDepth()
    const colorterm = process.env.COLORTERM
    return colorDepth >= 8 || colorterm === 'truecolor' || colorterm === '24bit'
  }

  if (!supportsColor())
    return bgLightGreen(` ${text} `)

  let colorText = ''

  const startColor = { r: 0x3B, g: 0xD1, b: 0x91 }
  const endColor = { r: 0x2B, g: 0x4C, b: 0xEE }

  for (let i = 0; i < text.length; i++) {
    const ratio = i / (text.length - 1)
    const red = Math.round(startColor.r + (endColor.r - startColor.r) * ratio)
    const green = Math.round(startColor.g + (endColor.g - startColor.g) * ratio)
    const blue = Math.round(startColor.b + (endColor.b - startColor.b) * ratio)
    colorText += bold(`\x1B[38;2;${red};${green};${blue}m${text[i]}\x1B[0m`)
  }

  return colorText
}

class Ora {
  private message: string
  private interval: NodeJS.Timeout | null
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  private cross = '✖'
  private tick = '✔'

  constructor(message: string) {
    this.message = message
    this.interval = null
  }

  private setFinishMessage(newMessage: string): string {
    return newMessage + ' '.repeat(this.message.length - newMessage.length)
  }

  start(): Ora {
    let i = 0
    process.stdout.write('\r' + `${green(this.frames[i % 9])} ${this.message}`)
    this.interval = setInterval(() => {
      process.stdout.write('\r' + `${green(this.frames[i % 9])} ${this.message}`)
      i++
    }, 100)
    return this
  }

  fail(message: string): void {
    if (!this.interval)
      return
    clearInterval(this.interval)
    process.stdout.write('\r' + `${red(this.cross)} ${this.setFinishMessage(message)}\n`)
  }

  succeed(message: string): void {
    if (!this.interval)
      return
    clearInterval(this.interval)
    process.stdout.write('\r' + `${green(this.tick)} ${this.setFinishMessage(message)}\n`)
  }

  finish(): void {
    if (!this.interval)
      return
    clearInterval(this.interval)
    process.stdout.write('')
  }
}

export function ora(message: string) {
  return new Ora(message)
}
