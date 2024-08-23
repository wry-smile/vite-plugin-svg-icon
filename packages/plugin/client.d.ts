declare module 'virtual:register-svg-icons' {
  const component: object
  export default component
}

declare module 'virtual:svg-icons-names' {
  export type SvgIconSymbolType = 'icon-no-icon'

  const iconsNames: SvgIconSymbolType[]
  export default iconsNames
}
