<script setup lang="ts">
const emit = defineEmits(['dotClick'])
const props = defineProps({
  itemLen: {
    type: Number,
    default: 0
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  dotBgColor: {
    type: String,
    default: '#fff'
  }
})
const dotClick = (index: number) => {
  emit('dotClick', index)
}
</script>

<template>
  <div class="dot-wrapper">
    <div class="dot-item" v-for="item in props.itemLen" :key="item">
      <span
        class="dot-link"
        :style="{
          backgroundColor:
            currentIndex === item - 1 ? dotBgColor : 'rgba(255, 255, 255, .4)'
        }"
        @click="dotClick(item - 1)"
      ></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dot-wrapper {
  text-align: center;
  overflow-x: scroll;
  white-space: nowrap;
  /* 设置滚动条的样式 */
  &::-webkit-scrollbar {
    height: 5px;
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 20px;
    background: #d8d8d8;
    &:hover {
      background: #c2c2c2;
    }
    // &:active {
    //   background: $basic-color;
    // }
  }
  .dot-item {
    display: inline-block;
    .dot-link {
      display: block;
      width: 12px;
      height: 12px;
      margin: 4px 8px;
      border-radius: 50%;
      cursor: pointer;
      &:hover {
        background-color: rgba(255, 255, 255, 0.7) !important;
      }
    }
  }
}
</style>
