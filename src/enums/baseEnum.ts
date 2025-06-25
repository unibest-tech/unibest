/**
 * 基础枚举
 * 与业务无关
 * @author cnguu
 */

import { enumUtil } from '@/utils/enumUtil'

/** 约定俗成的二极管 字符串型 */
export const FlagStringEnum = enumUtil({
  /** 是 */
  TRUE: {
    value: '1',
    label: '是',
  },
  /** 否 */
  FALSE: {
    value: '0',
    label: '否',
  },
} as const)

/** 约定俗成的二极管 数字型 */
export const FlagNumberEnum = enumUtil({
  /** 是 */
  TRUE: {
    value: 1,
    label: '是',
  },
  /** 否 */
  FALSE: {
    value: 0,
    label: '否',
  },
} as const)

/** 约定俗成的二极管 布尔型 */
export const FlagBooleanEnum = enumUtil({
  /** 是 */
  TRUE: {
    value: true,
    label: '是',
  },
  /** 否 */
  FALSE: {
    value: false,
    label: '否',
  },
} as const)

/** 性别 */
export const SexEnum = enumUtil({
  /** 男 */
  MAN: {
    value: '1',
    label: '男',
  },
  /** 女 */
  WOMAN: {
    value: '2',
    label: '女',
  },
} as const)
