<script setup lang="ts">
import CarouselDot from './CarouselDot.vue'
import { ref, getCurrentInstance } from 'vue'
const emit = defineEmits(['indexChange'])

const props = defineProps({
  cIndex: {
    type: Number,
    default: 0
  },
  hasDot: {
    type: Boolean,
    default: true
  }
})
const currentIndex = ref(props.cIndex)
const itemLen = ref()
const instance = getCurrentInstance()
if (instance) {
  const { slots } = instance
  if (slots.default) {
    if (slots.default()[0].children) {
      itemLen.value = slots.default()[0].children?.length
    }
  }
}

const direction = ref('next')
const dotBgColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--basic-color'
)
const transformStyle = ref('')

const setIndex = (index: number) => {
  if (index < 0) index = itemLen.value - 1
  if (index > itemLen.value - 1) index = 0
  if (currentIndex.value > index) {
    direction.value = 'prev'
  } else {
    direction.value = 'next'
  }
  currentIndex.value = index
  transformStyle.value = `transform: translateX(-${index * 100}%);`
  emit('indexChange', index)
}
const leftClick = () => {
  setIndex(currentIndex.value - 1)
}
const rightClick = () => {
  setIndex(currentIndex.value + 1)
}
defineExpose({
  leftClick,
  rightClick
})
</script>

<template>
  <div class="carousel">
    <div class="inner" :style="transformStyle">
      <slot />
    </div>
    <CarouselDot
      :currentIndex="currentIndex"
      :itemLen="itemLen"
      :dotBgColor="dotBgColor"
      @dotClick="setIndex"
    />
  </div>
</template>

<style lang="scss" scoped>
.carousel {
  width: 660px;
  overflow: hidden;
  .inner {
    width: 100%;
    height: 100%;
    display: flex;
    // transform: translateX(-100%);
  }
}
</style>
