<script lang="ts" setup>
import iconsNames, { type SvgIconSymbolType } from 'virtual:svg-icons-names';

const icons: SvgIconSymbolType[] =iconsNames
 </script>

<template>  
  <template v-for="icon in icons" :key="icon">
    <svg style="color: red; fill: red;"> 
      <use :xlink:href="`#${icon}`" ></use>
    </svg>
  </template>
</template> 
 