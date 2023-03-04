<template>
  <MimicryPage
    id="cover"
    :class="{ coverActive: app.isCoverShow }"
    @click.left="bgLeftClick"
    @click.right.prevent="bgRightClick"
  ></MimicryPage>
</template>

<script setup lang="ts">
import MimicryPage from '@/components/MimicryUI/MimicryPage.vue'
import { useAppStore } from '@/stores/useAppStore'
const app = useAppStore()

const bgRightClick = () => {
  if (!app.isCoverShow) {
    app.showCover()
    app.showNavFolder()
  }
}

const bgLeftClick = () => {
  if (!app.isNavFolderShow) {
    app.hideCover()
  }
}
</script>

<style lang="scss" scoped>
#cover {
  &.coverActive {
    user-select: none;
  }
}
</style>
