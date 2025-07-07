import { bold, red } from 'kolorist'
import prompts from 'prompts'

import figures from 'prompts/lib/util/figures.js'
import projectName from './name'
import template from './template'

export async function question() {
  const questions = [
    ...projectName(),
    template(),
  ]

  const onCancel = () => {
    throw new Error(`${red(figures.cross)} ${bold('操作已取消')}`)
  }

  const answers = await prompts(questions, { onCancel })

  return answers
}
