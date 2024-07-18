import type { Config } from '@svgr/core'

export interface PluginOptions {
  iconDirs?: string[] | string
  symbolId?: string
  inject?: DomInject
  customDomId?: string
  dts?: string
  svgo?: boolean | Config['svgoConfig']
}

export type DomInject = 'body-last' | 'body-first'

export interface FileStats {
  relativeName: string
  mtimeMs?: number
  code: string
  symbolId?: string
}

export type IconifyRegisterType = Record<string, string[]>
