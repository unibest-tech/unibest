import type { TemplateList } from './type'
import { green } from 'kolorist'

export const templateList: TemplateList[] = [

  {
    title: `base ${green('(基于wot-ui)')}`,
    // description: `${red('(多TAB项目，最基础的模板)')}`,
    value: {
      type: 'base',
      branch: 'main',
      url: {
        gitee: 'https://gitee.com/feige996/unibest.git',
        github: 'https://github.com/feige996/unibest.git',
      },
    },
  },
  {
    title: `base-sard-ui ${green('(基于 sard-ui)')}`,
    // description: `${red('(多TAB项目，最基础的模板)')}`,
    value: {
      type: 'base-sard-ui',
      branch: 'base-sard-ui',
      url: {
        gitee: 'https://gitee.com/feige996/unibest.git',
        github: 'https://github.com/feige996/unibest.git',
      },
    },
  },
  {
    title: `base-uv-ui ${green('(基于 uv-ui)')}`,
    // description: `${red('(多TAB项目，最基础的模板)')}`,
    value: {
      type: 'base-uv-ui',
      branch: 'base-uv-ui',
      url: {
        gitee: 'https://gitee.com/feige996/unibest.git',
        github: 'https://github.com/feige996/unibest.git',
      },
    },
  },
  {
    title: `base-uview-plus ${green('(基于 uview-plus)')}`,
    // description: `${red('(多TAB项目，最基础的模板)')}`,
    value: {
      type: 'base-uview-plus',
      branch: 'base-uview-plus',
      url: {
        gitee: 'https://gitee.com/feige996/unibest.git',
        github: 'https://github.com/feige996/unibest.git',
      },
    },
  },
  {
    title: `i18n ${green('(多语言)')}`,
    // description: `${red('(多TAB多语言项目)')}`,
    value: {
      type: 'i18n',
      branch: 'i18n',
      url: {
        gitee: 'https://gitee.com/feige996/unibest.git',
        github: 'https://github.com/feige996/unibest.git',
      },
    },
  },

  {
    title: `demo ${green('(演示项目)')}`,
    // description: `${red('(多TAB演示项目)')}`,
    value: {
      type: 'demo',
      branch: 'main',
      url: {
        gitee: 'https://gitee.com/feige996/hello-unibest.git',
        github: 'https://github.com/feige996/hello-unibest.git',
      },
    },
  },

]
