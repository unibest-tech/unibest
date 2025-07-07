import type { Ora } from 'ora'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DEBUG?: string
      UNIBEST_TEMPLATE?: string
    }
  }
}

declare module './utils' {
  export const ora: () => Ora
  export const printBanner: (projectName?: string) => Promise<void>
  export const postOrderDirectoryTraverse: (dir: string, callback: (file: string) => void) => void
  export const beacon: (data: Record<string, any>) => Promise<void>
  export const printFinish: (projectName: string) => void
  export const replaceProjectName: (dir: string, projectName: string) => void
  export const canSkipEmptying: (dir: string) => Promise<boolean>
  export const downloadTemplate: (templateType: string, targetDir: string) => Promise<void>
}
