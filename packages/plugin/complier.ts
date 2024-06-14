import { extname } from 'path'
import fg from 'fast-glob'
import { readFile, writeFile } from 'fs/promises'
import { DomInject, PluginOptions } from "./types"
import { ParsedSVGContent, parseSVGContent } from '@iconify/utils'
import { error } from './utils'
import { NAMES_TYPE_NAME, XMLNS, XMLNS_LINK } from './constant'

function normalizePath(inputPath: string) {
  return inputPath.replace(/\\/g, '/');
}

async function getSymbolName(path: string, dir: string, options: PluginOptions) {
  const relativeName = normalizePath(path).replace(normalizePath(dir + '/'), '')
  const symbolId = createSymbolId(relativeName, options)
  return symbolId
}

export async function complierIcons(options: PluginOptions) {
  const { iconDirs = [] } = options

  let symbols = ''
  const idSets = new Set<string>()

  for (const dir of iconDirs) {
    const svgStats = fg.sync('**/*.svg', {
      cwd: dir,
      stats: true,
      absolute: true
    })


    for (const entry of svgStats) {
      const { path, } = entry
      const symbolId = await getSymbolName(path, dir, options)
      const symbol = await complierIcon(path, symbolId)
      symbols += symbol
      idSets.add(symbolId)
    }
  }

  // const iconifySymbols = await loadIconifyFormRegister(options)

  // symbols += iconifySymbols

  const code = createModuleCode(symbols, options)

  return {
    code: `${code}\nexport default {}`,
    idSets: Array.from(idSets),
    ids: `export default ${JSON.stringify(Array.from(idSets))}`
  }
}


async function complierIcon(file: string, symbolId: string) {
  if (!file) return null

  let content = await readFile(file, 'utf-8')

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

function createSymbolId(name: string, { symbolId }: PluginOptions) {
  if (!symbolId) return name.replace(extname(name), '')

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
      dirName: ''
    }
  }

  const strList = name.split('/')
  const fileName = strList.pop()
  const dirName = strList.join('-')
  return {
    fileName,
    dirName
  }
}

const createModuleCode = (string: string, { customDomId, inject }: PluginOptions,) => {
  return `
         if (typeof window !== 'undefined') {
         function loadSvg() {
           var body = document.body;
           var svgDom = document.getElementById('${customDomId}');
           if(!svgDom) {
             svgDom = document.createElementNS('${XMLNS}', 'svg');
             svgDom.style.position = 'absolute';
             svgDom.style.width = '0';
             svgDom.style.height = '0';
             svgDom.id = '${customDomId}';
             svgDom.setAttribute('xmlns','${XMLNS}');
             svgDom.setAttribute('xmlns:link','${XMLNS_LINK}');
             svgDom.setAttribute('aria-hidden',true);
           }
           svgDom.innerHTML = ${JSON.stringify(string)};
           ${domInject(inject)}
         }
         if(document.readyState === 'loading') {
           document.addEventListener('DOMContentLoaded', loadSvg);
         } else {
           loadSvg()
         }
      }
  `
}

function domInject(inject: DomInject = 'body-last') {
  switch (inject) {
    case 'body-first':
      return 'body.insertBefore(svgDom, body.firstChild);'
    default:
      return 'body.insertBefore(svgDom, body.lastChild);'
  }
}


export async function createDtsFile(names: string[], options: PluginOptions,) {
  const { dts } = options

  if (!dts) return

  const code = `declare global {\n  type ${NAMES_TYPE_NAME} = ${names.map(item => `'${item}'`).join(' | ')}\n}\nexport {}`
  await writeFile(dts, code, 'utf-8')
}
