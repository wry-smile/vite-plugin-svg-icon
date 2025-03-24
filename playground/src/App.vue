<script lang="ts" setup>
import type { SvgIconSymbolType } from 'virtual:svg-icons-names'
import iconsNames from 'virtual:svg-icons-names'

const icons: SvgIconSymbolType[] = iconsNames
</script>

<template>
  <template v-for="icon in icons" :key="icon">
    <svg style="color: red;">
      <use :xlink:href="`#${icon}`" />
    </svg>
  </template>
</template>
