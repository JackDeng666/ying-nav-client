<template>
  <AppBackground />
  <div class="center" @click.right.prevent="">
    <AppSearch class="search" :class="{ active: !app.isNavFolderShow }" />
    <AppNav class="nav" v-if="app.isNavFolderShow" />
  </div>
  <FloatingTool />
</template>

<script setup lang="ts">
import AppBackground from './AppBackground/AppBackground.vue'
import AppSearch from './AppSearch/AppSearch.vue'
// import AppNav from './AppNav/AppNav.vue'
import AppNav from './AppNav/AppNav2.vue'
import FloatingTool from './FloatingTool/FloatingTool.vue'

import { useAppStore } from '@/stores/useAppStore'

const app = useAppStore()
</script>

<style lang="scss" scoped>
.center {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  .search {
    position: fixed;
    top: 200px;
    opacity: 0;
    pointer-events: none;
    &.active {
      opacity: 1;
      pointer-events: auto;
    }
  }
  .nav {
    pointer-events: auto;
  }
}
</style>
