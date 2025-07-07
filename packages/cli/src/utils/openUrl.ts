import { exec } from 'node:child_process'
import { platform } from 'node:os'

const command
  = platform() === 'win32'
    ? 'start'
    : platform() === 'darwin' ? 'open' : 'xdg-open'
export function openUrl(url: string) {
  if (!url) {
    console.error('No URL provided to open.')
    return
  }
  setTimeout(() => {
    exec(`${command} ${url}`)
  }, 5000)
}
