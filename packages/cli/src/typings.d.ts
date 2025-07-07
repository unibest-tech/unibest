import type { Ora } from 'ora'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DEBUG?: string
      UNIBEST_TEMPLATE?: string
    }
  }
}
