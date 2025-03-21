import type { ParsedSVGContent } from '@iconify/utils'
import type { Config } from 'svgo'
import type { ItemOptionResult, PluginOption } from './types'
import { readFile, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { parseSVGContent } from '@iconify/utils'
import { isArray, randomHexString } from '@wry-smile/utils'
import fg from 'fast-glob'
import { optimize } from 'svgo'
import { DEFAULT_DTS_GEN_PATH, NAMES_TYPE_NAME, SVG_DOM_ID, XMLNS, XMLNS_LINK } from './constant'
import { error } from './utils'

const cache = new Map<string, Record<'symbol' | 'symbolId', string>>()

function normalizePath(inputPath: string) {
  return inputPath.replace(/\\/g, '/')
}

async function getSymbolName(path: string, dir: string, options: PluginOption) {
  const relativeName = normalizePath(path).replace(normalizePath(`${dir}/`), '')
  const symbolId = createSymbolId(relativeName, options)
  return symbolId
}

export async function complierIcons(options: PluginOption[]) {
  const ret: (ItemOptionResult & { option: PluginOption })[] = []
  for (const option of options) {
    const res = await complierItemOption(option)
    ret.push(Object.assign(res, { option }))
  }

  const names = ret.reduce((prev, next) => {
    return [...prev, ...next.names]
  }, [] as string[])

  const code = createModuleCode(ret)

  return {
    code: `${code}\nexport default {}`,
    namesArray: Array.from(names),
    names: `export default ${JSON.stringify(Array.from(names))}`,
  }
}

async function complierItemOption(option: PluginOption): Promise<ItemOptionResult> {
  let { iconDirs } = option
  iconDirs = isArray(iconDirs) ? iconDirs : [iconDirs!]

  let symbols = ''
  const names = new Set<string>()

  for (const dir of iconDirs) {
    if (!iconDirs)
      continue

    const svgStats = fg.sync('**/*.svg', {
      cwd: dir,
      stats: true,
      absolute: true,
    })

    for (const entry of svgStats) {
      const { path } = entry
      let symbolId: string
      let symbol: null | string
      const res = cache.get(path)
      if (res) {
        const { symbol: cacheSymbol, symbolId: cacheSymbolId } = res
        symbolId = cacheSymbolId
        symbol = cacheSymbol
      }
      else {
        symbolId = await getSymbolName(path, dir, option)
        symbol = await complierIcon(path, symbolId, option)
      }

      if (!symbol)
        continue

      symbols += symbol
      names.add(symbolId)

      cache.set(path, {
        symbol,
        symbolId,
      })
    }
  }

  return {
    symbols,
    names: Array.from(names),
  }
  // return {
  //   code: `${code}\nexport default {}`,
  //   idSets: Array.from(idSets),
  //   ids: `export default ${JSON.stringify(Array.from(idSets))}`,
  // }
}

async function complierIcon(file: string, symbolId: string, options: PluginOption) {
  if (!file)
    return null

  const { svgo: svgConfig } = options

  let content = await readFile(file, 'utf-8')

  let defaultConfig: Config | undefined = {
    plugins: [
      {
        name: 'prefixIds',
        params: {
          prefix: symbolId,
          prefixIds: true,
          prefixClassNames: true,
        },
      },
    ],
  }

  if (typeof svgConfig === 'boolean') {
    if (!svgConfig) {
      defaultConfig = undefined
    }
  }
  else {
    if (typeof svgConfig === 'object') {
      defaultConfig = svgConfig
    }
  }

  content = optimize(content, defaultConfig).data

  const parser = parseSVGContent(content)

  if (!parser) {
    error(`Can't transform ${file}`)
  }

  return transformToSvgSymbol(symbolId, parser!)
}

function transformToSvgSymbol(symbolId: string, parser: ParsedSVGContent) {
  const { body, attribs: { viewBox = '0 0 24 24' } } = parser
  return `<symbol id="${symbolId}" viewBox="${viewBox}">${body}</symbol>`
}

function createSymbolId(name: string, { symbolId }: PluginOption) {
  if (!symbolId)
    return name.replace(extname(name), '')

  let id = symbolId
  let fName = name

  const { fileName = '', dirName } = parseName(name)

  if (symbolId.includes('[dir]')) {
    id = id.replace(/\[dir\]/g, dirName)
    if (!dirName) {
      id = id.replace('--', '-')
    }
    fName = fileName
  }

  id = id.replace(/\[name\]/g, fName)
  return id.replace(extname(id), '')
}

function parseName(name: string) {
  if (!normalizePath(name).includes('/')) {
    return {
      fileName: name,
      dirName: '',
    }
  }

  const strList = name.split('/')
  const fileName = strList.pop()
  const dirName = strList.join('-')
  return {
    fileName,
    dirName,
  }
}

function createModuleCode(params: (ItemOptionResult & { option: PluginOption })[]) {
  const nameSet = new Set<string>()

  const executors = params.reduce((prev, next, index) => {
    const { symbols, option: { inject } } = next
    let { option: { customDomId = SVG_DOM_ID } } = next

    if (nameSet.has(customDomId)) {
      customDomId = customDomId + index
    }

    nameSet.add(customDomId)

    return `${prev};loadSvg('${customDomId}', ${JSON.stringify(symbols)}, '${inject}')`
  }, '')

  return `
if (typeof window !== 'undefined') {
  function loadSvg(customDomId, content, inject) {
    const body = document.body
    let svgDom = document.getElementById(customDomId)
    if (!svgDom) {
      svgDom = document.createElementNS('${XMLNS}', 'svg')
      svgDom.style.position = 'absolute'
      svgDom.style.width = '0'
      svgDom.style.height = '0'
      svgDom.id = customDomId
      svgDom.setAttribute('xmlns', '${XMLNS}')
      svgDom.setAttribute('xmlns:link', '${XMLNS_LINK}')
      svgDom.setAttribute('aria-hidden', true)
    }
    svgDom.innerHTML = content
    if (inject === 'body-first') {
      body.insertBefore(svgDom, body.firstChild)
    }
    else {
      body.insertBefore(svgDom, body.lastChild)
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSvg)
  }
  else {
    ${executors}
  }
}
  `
}

export async function createDtsFile(names: string[], dts: string | boolean = DEFAULT_DTS_GEN_PATH) {
  if (!dts || !names || !names?.length)
    return

  dts = typeof dts === 'boolean' ? DEFAULT_DTS_GEN_PATH : dts

  const code = `declare module 'virtual:register-svg-icons' {\n  const component: object\n  export default component\n}\n\ndeclare module 'virtual:svg-icons-names' {\n  export type ${NAMES_TYPE_NAME} = ${names.map(name => `'${name}'`).join(' | ')}\n\n  const iconsNames: ${NAMES_TYPE_NAME}[]\n  export default iconsNames\n}
  `
  await writeFile(dts, code, 'utf-8')
}

// export function parseSVGContent(content: string): ParsedSVGContent | undefined {
//   // Split SVG attributes and body
//   const match = content
//     .trim()
//     .match(
//       /(?:<(?:\?xml|!DOCTYPE)[^>]+>\s*)*<svg([^>]+)>([\s\S]+)<\/svg[^>]*>/,
//     )
//   if (!match) {
//     return
//   }
//   const body = match[2].trim()

//   // Split attributes
//   const attribsList = match[1].match(/[\w:-]+="[^"]*"/g)
//   const attribs = Object.create(null) as Record<string, string>
//   attribsList?.forEach((row) => {
//     const match = row.match(/([\w:-]+)="([^"]*)"/)
//     if (match) {
//       attribs[match[1]] = match[2]
//     }
//   })

//   return {
//     attribs,
//     body,
//   }
// }
