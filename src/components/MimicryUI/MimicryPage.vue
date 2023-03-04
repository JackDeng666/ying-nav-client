<template>
  <div class="mimicry-page">
    <slot></slot>
  </div>
</template>

<style lang="scss">
:root {
  --mimicry-base-color: #ccd8e8;
  --mimicry-highlight-color: #d9e5f5;
  --mimicry-darkness-color: #abb5c2;
  --mimicry-text-color: #4a586b;
}
</style>

<style lang="scss" scoped>
.mimicry-page {
  width: 100%;
  height: 100%;
  background-color: var(--mimicry-base-color);
  box-shadow: 5px 5px 9px var(--mimicry-darkness-color),
    -5px -5px 9px var(--mimicry-highlight-color);
}
</style>
