import type { PromptObject } from 'prompts'
import filePrompt from './file'

export default (): PromptObject<string>[] => {
  return [
    {
      name: 'projectName',
      type: 'text',
      message: '请输入项目名称:',
      initial: 'unibest',
    },
    ...filePrompt(),
  ]
}
