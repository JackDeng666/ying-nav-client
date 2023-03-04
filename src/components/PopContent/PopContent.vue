<template>
  <div class="pop-cover" :class="{ show: show }">
    <MimicryPage
      class="pop-box"
      :class="{ 'pre-close': preClose, show: show, close: !show }"
    >
      <div class="title">{{ title }}</div>
      <MimicryButton
        class="close"
        @mouseover="closeOver"
        @mouseout="closeOut"
        @click="colse"
        hover-active
      ></MimicryButton>
      <div class="pop-content">
        <div class="scroll-view">
          <component :is="currentCom" />
        </div>
      </div>
    </MimicryPage>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, type PropType, type Component } from 'vue'
import MimicryPage from '@/components/MimicryUI/MimicryPage.vue'
import MimicryButton from '@/components/MimicryUI/MimicryButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'title'
  },
  currentCom: {
    type: Object as PropType<Component>,
    default: () => {}
  },
  onClose: {
    type: Function,
    default: () => {}
  }
})

const show = ref(false)
const preClose = ref(false)

function closeOver() {
  preClose.value = true
}

function closeOut() {
  preClose.value = false
}

function colse() {
  show.value = false
  setTimeout(() => {
    props.onClose()
  }, 300)
}

nextTick(() => {
  show.value = true
})
</script>

<style lang="scss" scoped>
.pop-cover {
  opacity: 0;
  transition: 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 99;
  perspective: 1000px;
  backdrop-filter: blur(1px);
  &.show {
    opacity: 1;
  }
  .pop-box {
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 100;
    width: 600px;
    height: 500px;
    top: calc(50% - 250px);
    left: calc(50% - 300px);
    font-size: small;
    border-radius: 10px;
    overflow: hidden;
    transition: 0.25s;
    &.pre-close {
      transform: rotate3d(1, 1, 0, 5deg);
    }
    &.show {
      animation-duration: 0.4s;
      animation-name: pop-show-animate;
    }
    &.close {
      animation-duration: 0.2s;
      animation-fill-mode: both;
      animation-name: pop-close-animate;
    }
    .title {
      font-size: 20px;
      font-family: 'Microsoft Yahei Bold', 'Microsoft Yahei', Helvetica,
        sans-serif, 等线;
      text-align: center;
      padding: 15px 20px;
      font-weight: bold;
      color: var(--mimicry-text-color);
    }
    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;
      &::after,
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 25%;
        height: 1.5px;
        width: 50%;
        background-color: rgba(0, 0, 0, 0.8);
      }
      &::after {
        transform: rotate(-45deg);
      }
      &::before {
        transform: rotate(45deg);
      }
    }
    .pop-content {
      flex: 1;
      height: 1px;
      padding: 0 5px;
      .scroll-view {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        /* 设置滚动条的样式 */
        &::-webkit-scrollbar {
          width: 5px;
          // height: 12px;
        }
        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
          border-radius: 20px;
          background: #d8d8d8;
          &:hover {
            background: #c2c2c2;
          }
          &:active {
            background: $basic-color;
          }
        }
      }
    }
  }
}
</style>
