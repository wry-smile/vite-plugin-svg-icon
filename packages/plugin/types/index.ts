export interface PluginOptions {
  iconDirs?: string[] | string
  symbolId?: string
  inject?: DomInject
  customDomId?: string
  dts?: string
  registerFormIconify?: IconifyRegisterType
}

export type DomInject = 'body-last' | 'body-first'

export interface FileStats {
  relativeName: string
  mtimeMs?: number
  code: string
  symbolId?: string
}

export type IconifyRegisterType = Record<string, string[]>
