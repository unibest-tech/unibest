import type { PromptObject } from 'prompts'
import { templateList } from './templateDate'

export default (): PromptObject<string> => {
  return {
    name: 'templateType',
    type: 'select',
    message: '请选择 uni-app 模板？',
    hint: '使用方向键选择，回车确认',
    choices: [
      ...templateList,
    ],
    initial: 0,
  }
}
