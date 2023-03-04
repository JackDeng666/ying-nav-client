<template>
  <div
    class="gird-content"
    :style="contentStyle"
    ref="girdContentRef"
    @mousemove.left="handleMousemove"
    @mouseup.left="handleMouseup"
  >
    <div
      class="gird-item"
      v-for="item in navList"
      :key="item[dataKey]"
      :data-flip-key="item[dataKey]"
    >
      <slot
        name="girdItem"
        :record="item"
        :mousedownFunc="handleMousedown"
      ></slot>
      <template v-if="!slots.girdItem">
        <div class="default-wrap">{{ item[dataKey] }}</div>
      </template>
    </div>
    <slot name="extra"></slot>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  nextTick,
  useSlots,
  computed,
  watch,
  onScopeDispose
} from 'vue'
import type { CSSProperties, PropType } from 'vue'
import { getElementPosition, moveArrItem, swapArrItem } from '@/umlib'
import type { NavData } from '@/stores/useNavStore'
import antiShake from '@/umlib/antiShake'
import { useVerticalScroll } from '@/hooks/useVerticalScroll'

import Flipping from 'flipping/dist/flipping.web'
const flipping = new Flipping({
  duration: 300
})

const slots = useSlots()
const props = defineProps({
  contentStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => {}
  },
  dataKey: {
    type: String,
    default: 'id'
  },
  list: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})
const emit = defineEmits(['clickItem', 'updateList'])

interface AreaData {
  id: number
  left: number
  top: number
  width: number
  height: number
  topWithScroll: number
}

const girdContentRef = ref<HTMLElement>()
const navList = computed({
  get: () => {
    return props.list
  },
  set: () => {
    emit('updateList', navList.value)
  }
})

const stopWatch = watch(navList, () => {
  nextTick(calcAreaData)
})
onScopeDispose(stopWatch)

const areaData = ref<any[]>([])
const dragId = ref(-1)
const currentNavOb = ref<NavData | null>(null)
let dragStartTime = 0,
  startX = 0,
  startY = 0
let firtDragArea: AreaData | null = null
let currentMoveItem: HTMLElement | null = null
let currentMoveVirtualItem: HTMLElement | null = null
let canCalc = true

const { scrollTop } = useVerticalScroll(girdContentRef)

const curentAreaData = computed(() => {
  const findAreaData = areaData.value.find((el: any) => el.id == dragId.value)
  if (!findAreaData) return null
  findAreaData.topWithScroll = findAreaData.top - scrollTop.value
  return findAreaData
})

function handleMousedown(e: any, item: any) {
  dragId.value = item.id
  currentNavOb.value = item
  dragStartTime = Date.now()
  startX = e.x
  startY = e.y

  hideOriginGirdItem()
  firtDragArea = curentAreaData.value
  if (currentMoveItem && girdContentRef.value && curentAreaData) {
    currentMoveVirtualItem = currentMoveItem.cloneNode(true) as HTMLElement
    girdContentRef.value.appendChild(currentMoveVirtualItem)

    currentMoveVirtualItem.setAttribute('data-flip-key', '')
    currentMoveVirtualItem.style.cssText = `
      position: fixed;
      display: flex;
      left: ${curentAreaData.value.left}px;
      top: ${curentAreaData.value.topWithScroll}px;
      z-index: 999;
      transition: none;
    `
  }
}

function handleMouseup() {
  if (Date.now() - dragStartTime < 100) {
    emit('clickItem', currentNavOb.value)
  }
  dragId.value !== -1 && reset()
}

onMounted(calcAreaData)

function calcAreaData() {
  if (!girdContentRef.value) return
  areaData.value = []
  const girdItems = girdContentRef.value.querySelectorAll('.gird-item')
  girdItems.forEach((el: any) => {
    const { left, top } = getElementPosition(el)
    areaData.value.push({
      id: el.attributes['data-flip-key'].value,
      rawleft: left,
      left: left,
      top,
      width: el.offsetWidth,
      height: el.offsetHeight
    })
  })
}

function hideOriginGirdItem() {
  if (!girdContentRef.value) return
  const girdItems = girdContentRef.value.querySelectorAll(`.gird-item`)

  if (!girdItems) return
  currentMoveItem = Array.from(girdItems).find(
    (el: any) => el.attributes['data-flip-key'].value == curentAreaData.value.id
  ) as HTMLElement

  if (!currentMoveItem) return
  currentMoveItem.style.transition = 'none'
  currentMoveItem.style.opacity = '0'
}

function reset() {
  if (!currentMoveVirtualItem) return
  const moveObStyle = currentMoveVirtualItem.style
  // 移动元素回到原来位置或者当前位置
  moveObStyle.transition = 'all .3s'
  moveObStyle.zIndex = '1'
  moveObStyle.left = `${curentAreaData.value.left}px`
  moveObStyle.top = `${curentAreaData.value.topWithScroll}px`
  dragId.value = -1

  setTimeout(() => {
    if (!currentMoveVirtualItem || !currentMoveItem) return
    currentMoveItem.style.transition = 'none'
    currentMoveItem.style.opacity = '1'
    if (girdContentRef.value) {
      girdContentRef.value.removeChild(currentMoveVirtualItem as Node)
    }
  }, 300)
}

function handleMousemove(e: any) {
  if (dragId.value == -1 || !firtDragArea) return
  const obx = firtDragArea.left + e.x - startX,
    oby = firtDragArea.topWithScroll + e.y - startY
  if (currentMoveVirtualItem) {
    currentMoveVirtualItem.style.left = `${obx}px`
    currentMoveVirtualItem.style.top = `${oby}px`
  }
  canCalc &&
    antiShake(() => {
      calcPosition(obx, oby)
    }, 300)
}

function calcPosition(obx: number, oby: number) {
  if (!curentAreaData.value || dragId.value == -1) return
  canCalc = false
  let flag = 0 // 标识：0 无操作，1交换位置，2右推位置
  let changeObIndex = 0 // 目标：交换或右推的目标
  // 拖拽中点
  const obcx = obx + curentAreaData.value.width / 2,
    obcy = oby + curentAreaData.value.height / 2,
    len = areaData.value.length
  for (let i = 0; i < len; i++) {
    const el = areaData.value[i]
    const cobcx = el.left + el.width / 2,
      cobcy = el.top - scrollTop.value + el.height / 2
    if (
      obcx > cobcx - 25 &&
      obcx < cobcx + 25 &&
      obcy > cobcy - 25 &&
      obcy < cobcy + 25
    ) {
      flag = 1
      changeObIndex = i
      break
    }
    if (
      obcx > el.left - 25 &&
      obcx < el.left + 25 &&
      obcy > cobcy - 25 &&
      obcy < cobcy + 25
    ) {
      flag = 2
      changeObIndex = i
      break
    }
    flag = 0
  }
  if (flag) {
    let index = null
    navList.value.forEach(
      (el: any, i: number) => el.id == String(dragId.value) && (index = i)
    )
    if (index === changeObIndex) {
      canCalc = true
      return
    }
    flipping.read()
    flag == 1 && swapArrItem(navList.value, index, changeObIndex) // 位于中心
    flag == 2 && moveArrItem(navList.value, index, changeObIndex) // 位于左侧
    nextTick(() => {
      flipping.flip()
      calcAreaData()
      canCalc = true
    })
  } else {
    canCalc = true
  }
}
</script>

<style lang="scss" scoped>
.gird-content {
  display: flex;
  flex-wrap: wrap;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0;
  }
  .gird-item {
    .default-wrap {
      box-sizing: border-box;
      width: 132px;
      height: 122px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #000;
    }
  }
}
</style>
