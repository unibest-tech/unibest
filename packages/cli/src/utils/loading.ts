import process from 'node:process'
import { green, red } from 'kolorist'
import figures from 'prompts/lib/util/figures.js'

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
export class Ora {
  private message: string
  private interval: NodeJS.Timeout | null

  constructor(message: string) {
    this.message = message
    this.interval = null
  }

  private setFinishMessage(newMessage: string): string {
    // 确保差值不为负数
    const diff = Math.max(0, this.message.length - newMessage.length)
    return newMessage + ' '.repeat(diff)
  }

  start(): Ora {
    let i = 0
    this.interval = setInterval(() => {
      process.stdout.write('\r' + `${frames[i % 9]} ${this.message}`)
      i++
    }, 100)
    return this
  }

  fail(message: string): void {
    if (!this.interval)
      return
    clearInterval(this.interval)
    process.stdout.write('\r' + `${red(figures.cross)} ${this.setFinishMessage(message)}\n`)
  }

  succeed(message: string): void {
    if (!this.interval)
      return
    clearInterval(this.interval)
    process.stdout.write('\r' + `${green(figures.tick)} ${this.setFinishMessage(message)}\n`)
  }
}

export function ora(message: string) {
  return new Ora(message)
}
