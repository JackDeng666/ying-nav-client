<template>
  <div
    :class="[
      'mimicry-button',
      props.active ? 'active' : '',
      props.hoverActive ? 'hover-active' : ''
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  hoverActive: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.mimicry-button {
  display: inline-block;
  padding: 8px 20px;
  background-color: var(--mimicry-base-color);
  box-shadow: 3px 3px 9px var(--mimicry-darkness-color),
    -3px -3px 9px var(--mimicry-highlight-color);
  color: var(--mimicry-text-color);
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  transition: box-shadow 0.2s;
  &:active {
    box-shadow: 0 0 0 var(--mimicry-darkness-color),
      0 0 0 var(--mimicry-highlight-color),
      inset -3px -3px 9px var(--mimicry-highlight-color),
      inset 3px 3px 9px var(--mimicry-darkness-color);
  }
  &.active {
    box-shadow: 0 0 0 var(--mimicry-darkness-color),
      0 0 0 var(--mimicry-highlight-color),
      inset -3px -3px 9px var(--mimicry-highlight-color),
      inset 3px 3px 9px var(--mimicry-darkness-color);
  }
  &.hover-active {
    &:hover {
      box-shadow: 0 0 0 var(--mimicry-darkness-color),
        0 0 0 var(--mimicry-highlight-color),
        inset -3px -3px 9px var(--mimicry-highlight-color),
        inset 3px 3px 9px var(--mimicry-darkness-color);
    }
  }
}
</style>
