<template>
  <div class="pop-wrap" @click.right.prevent="">
    <MimicryWrap
      ref="litlePopBoxRef"
      :class="[
        'litle-pop-box',
        visibility === 'visible' ? 'animate_bounce' : ''
      ]"
      :style="{ left, top }"
    >
      <div class="top-wrap">
        <div class="title">{{ title }}</div>
        <div class="del" @click="del"></div>
      </div>
      <div ref="contentWrapRef" class="content-wrap"></div>
    </MimicryWrap>
  </div>
</template>

<script setup lang="ts">
import MimicryWrap from '@/components/MimicryUI/MimicryWrap.vue'
import { ref, onMounted, type App, type PropType } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    default: () => {}
  },
  title: {
    type: String,
    default: '标题'
  },
  onClose: {
    type: Function,
    default: () => {}
  },
  contentApp: {
    type: Object as PropType<App>,
    default: null
  },
  returnData: {
    type: Function,
    default: () => {}
  }
})

const left = ref('')
const top = ref('')
const visibility = ref('hidden')
const litlePopBoxRef = ref()
const contentWrapRef = ref()

function calcPosition() {
  let targetRect = props.event.target.getBoundingClientRect()
  let targetTop = targetRect.top,
    targetLeft = targetRect.left,
    targetWidth = targetRect.width
  left.value = `${
    targetLeft + targetWidth / 2 - litlePopBoxRef.value.domRef.offsetWidth / 2
  }px`
  top.value = `${targetTop - litlePopBoxRef.value.domRef.offsetHeight - 10}px`
  visibility.value = 'visible'
}

function del() {
  props.returnData({ status: 0 })
}

onMounted(() => {
  if (props.contentApp) {
    props.contentApp.mount(contentWrapRef.value)
  }
  calcPosition()
})
</script>

<style lang="scss" scoped>
.pop-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  .top-wrap {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    .title {
      font-size: 15px;
    }
    .del {
      width: 30px;
      height: 30px;
      display: grid;
      place-content: center;
      cursor: pointer;
      background-color: var(--mimicry-base-color);
      box-shadow: 3px 3px 9px var(--mimicry-darkness-color),
        -3px -3px 9px var(--mimicry-highlight-color);
      position: relative;
      &:hover {
        box-shadow: 0 0 0 var(--mimicry-darkness-color),
          0 0 0 var(--mimicry-highlight-color),
          inset -3px -3px 9px var(--mimicry-highlight-color),
          inset 3px 3px 9px var(--mimicry-darkness-color);
      }
      &::after {
        content: '+';
        position: absolute;
        top: 0;
        left: 0;
        height: 30px;
        line-height: 28px;
        width: 30px;
        text-align: center;
        font-size: 28px;
        transform: rotate(45deg);
      }
    }
  }
  .litle-pop-box {
    position: fixed;
    font-size: small;
    border-radius: 10px;
    padding: 5px 16px;
    transition: none;
  }
}
</style>
