import { dirname, normalize, relative } from 'node:path'
import type { Plugin } from 'vite'
import { name } from './package.json'
import { DefaultOptions, SVG_ICONS_NAMES, SVG_ICONS_NAMES_ID, SVG_ICONS_REGISTER_NAME, SVG_ICONS_REGISTER_NAME_ID } from './constant'
import type { PluginOptions } from './types'
import { error } from './utils'
import { complierIcons, createDtsFile } from './complier'

export function SvgIconPlugin(opt: PluginOptions): Plugin {
  const options: PluginOptions = {
    ...DefaultOptions,
    ...opt,
  }

  const { symbolId } = options

  if (!symbolId?.includes('[name]')) {
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
        const { code, idSets } = await complierIcons(options)
        createDtsFile(idSets, options)

        return {
          code,
        }
      }

      if (id === SVG_ICONS_NAMES_ID) {
        const { ids } = await complierIcons(options)

        return {
          code: ids,
        }
      }
    },
  }
}
