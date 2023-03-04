<template>
  <div ref="mimicryWrapRef" class="mimicry-wrap">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const mimicryWrapRef = ref()

defineExpose({
  domRef: mimicryWrapRef
})
</script>

<style lang="scss" scoped>
.mimicry-wrap {
  background-color: var(--mimicry-base-color);
  box-shadow: 3px 3px 9px var(--mimicry-darkness-color),
    -3px -3px 9px var(--mimicry-highlight-color);
  color: var(--mimicry-text-color);
  border-radius: 3px;
  transition: box-shadow 0.2s;
}
</style>
