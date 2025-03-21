import type { Plugin } from 'vite'
import type { PluginOption } from './types'
import { isArray } from '@wry-smile/utils'
import { complierIcons, createDtsFile } from './complier'
import { DefaultOptions, SVG_ICONS_NAMES, SVG_ICONS_NAMES_ID, SVG_ICONS_REGISTER_NAME, SVG_ICONS_REGISTER_NAME_ID } from './constant'
import { name } from './package.json'
import { error } from './utils'

/**
 * @description
 * @param {PluginOption} opt - Svg Icon Plugin configuration options
 * @returns {Plugin}
 *
 * @Usage
 * ```ts
 * // append this in main.ts
 *
 * // import svg symbol
 * import 'virtual:register-svg-icons'
 *
 * // svg name
 * import iconName 'virtual:svg-icons-names'
 * ```
 *
 * ```ts
 * // append this to vite.config.ts
 * import { SvgIconPlugin } from '@wry-smile/vite-plugin-svg-icon'
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     SvgIconPlugin({
 *       symbolId: 'icon-[dir]-[name]',
 *       iconDirs: [
 *         join(cwd(), './src/assets/icons')
 *       ],
 *     })
 *   ],
 * })
 *
 * ```
 */
export function SvgIconPlugin(opt: PluginOption[] | PluginOption, dts: boolean | string = false): Plugin {
  const options: PluginOption[] = isArray(opt)
    ? opt.map(item => Object.assign({}, DefaultOptions, item))
    : [Object.assign({}, DefaultOptions, opt)]

  if (!options.every(item => item.symbolId?.includes('[name]'))) {
    error('SymbolId must contain [name] string!')
  }

  return {
    name,
    resolveId(id) {
      if (id === SVG_ICONS_REGISTER_NAME) {
        return SVG_ICONS_REGISTER_NAME_ID
      }
      if (id === SVG_ICONS_NAMES) {
        return SVG_ICONS_NAMES_ID
      }
    },
    async load(id) {
      if (id === SVG_ICONS_REGISTER_NAME_ID) {
        const { code, namesArray } = await complierIcons(options)
        try {
          createDtsFile(namesArray, dts)
        }
        catch (e) {
          error((e as Error)?.toString())
        }

        return code
      }

      if (id === SVG_ICONS_NAMES_ID) {
        const { names } = await complierIcons(options)

        return names
      }
    },
  }
}
