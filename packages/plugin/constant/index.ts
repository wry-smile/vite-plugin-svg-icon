import type { PluginOptions } from '../types'

export const SVG_ICONS_REGISTER_NAME = 'virtual:register-svg-icons'
export const SVG_ICONS_NAMES = 'virtual:svg-icons-names'
export const SVG_ICONS_REGISTER_NAME_ID = `\0${SVG_ICONS_REGISTER_NAME}`
export const SVG_ICONS_NAMES_ID = `\0${SVG_ICONS_NAMES}`
export const SVG_DOM_ID = '__svg__icons__dom__'
export const XMLNS = 'http://www.w3.org/2000/svg'
export const XMLNS_LINK = 'http://www.w3.org/1999/xlink'
export const NAMES_TYPE_NAME = 'SvgIconSymbolType'

export const DefaultOptions: PluginOptions = {
  symbolId: 'icon-[dir]-[name]',
  inject: 'body-last',
  customDomId: SVG_DOM_ID,
  dts: './svg-icon.d.ts',
}
