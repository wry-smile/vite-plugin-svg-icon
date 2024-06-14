import { readFile } from "fs/promises";
import { resolve } from "path";
import { warning } from "./utils";
import { getIconData } from '@iconify/utils'
import { PluginOptions } from "./types";

function checkIconifyExist() {
  try {
    import.meta.resolve('@iconify/json')
    return true
  } catch (error) {
    warning("Can't found @iconify/json, Are you sure you downloaded it?")
    return false
  }
}

export async function loadIconFromSet(category: string, name: string) {

  try {
    const result = await readFile(resolve(`node_modules/@iconify/json/json/${category}.json`), 'utf-8')
    const data = JSON.parse(result)
    const icon = getIconData(data, name)
    if (!icon) {
      warning(`Con't found ${category}-${name}`)
      return ''
    }

    return `<symbol id="${category}-${name}" viewBox="0 0 ${icon?.width || 24} ${icon?.height || 24}">${icon?.body}</symbol>`
  } catch (error) {
    warning(`Can't found ${category} icon category?`)
    return
  }
}

export async function loadIconifyFormRegister({ registerFormIconify = {} }: PluginOptions) {
  if (!checkIconifyExist()) return ''

  let symbols = ''
  for (const category of Object.keys(registerFormIconify)) {
    const names = registerFormIconify[category]

    for (const name of names) {
      const symbol = await loadIconFromSet(category, name)
      symbols += symbol
    }

  }

  return symbols
}
