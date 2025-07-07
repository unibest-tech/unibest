import { existsSync, readdirSync } from 'node:fs'

export function canSkipEmptying(dir: string) {
  if (!existsSync(dir))
    return true

  const files = readdirSync(dir)
  if (files.length === 0)
    return true

  if (files.length === 1 && files[0] === '.git')
    return true

  return false
}
