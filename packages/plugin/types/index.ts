import type { Config } from 'svgo'

export interface PluginOptions {

  /**
   * @description read icon dir path
   */
  iconDirs?: string[] | string

  /**
   * @description symbolId Naming convention
   * @default icon-[dir]-[name]
   */
  symbolId?: string

  /**
   * @description inject timing
   * @default body-last
   */
  inject?: DomInject

  /**
   * @description inject dom id
   * @default __svg__icons__dom__
   */
  customDomId?: string

  /**
   * @description dts file name && write file path
   * @default ./svg-icon.d.ts
   */
  dts?: string | boolean

  /**
   * @description svgo configuration
   * @default - By default, id class in svg is prefixed with symbolId;
   */
  svgo?: boolean | Config
}

export type DomInject = 'body-last' | 'body-first'

export interface FileStats {
  relativeName: string
  mtimeMs?: number
  code: string
  symbolId?: string
}

export interface ParsedSVGContent {
  attribs: Record<string, string>
  body: string
}
