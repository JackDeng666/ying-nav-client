<script setup lang="ts">
import MimicryInput from '@/components/MimicryUI/MimicryInput.vue'
import MimicryButton from '@/components/MimicryUI/MimicryButton.vue'
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/stores/useAppStore'

const app = useAppStore()
const buoyRef = ref()
const searchToRef = ref()
const searchStr = ref()
const iActive = ref(false)
const searchList = ref([
  {
    name: '百度',
    url: 'https://www.baidu.com/s?wd='
  },
  {
    name: 'CSDN',
    url: 'https://so.csdn.net/so/search?q='
  },
  {
    name: '淘宝',
    url: 'https://uland.taobao.com/sem/tbsearch?keyword='
  },
  {
    name: 'NPM',
    url: 'https://www.npmjs.com/search?q='
  }
])
const searchIndex = ref(0)
const keydownIndex = ref(0)
const searchRelateShow = ref(false)

const inputActive = computed(() => {
  return app.isCoverShow && iActive.value
})
const keydownLength = computed(() => {
  return searchRelateShow.value ? 2 : 1
})

watch(keydownIndex, () => {
  calcFocus()
  calcBuoyPosition()
})
watch(inputActive, (val) => {
  if (!val) {
    document.onkeyup = null
    hideBuoy()
  }
})

const focus = () => {
  iActive.value = true
  setKeyupEvent()
  app.showCover()
  setTimeout(() => {
    calcBuoyPosition()
    showBuoy()
  }, 300)
}
const search = () => {
  window.open(
    searchList.value[searchIndex.value].url + searchStr.value,
    '_blank'
  )
}
const setKeyupEvent = () => {
  document.onkeyup = (event) => {
    searchKeyup(event)
  }
}
const searchKeyup = (e: KeyboardEvent) => {
  if (e.keyCode == 13) {
    // enter
    search()
    return
  }
  // 键盘上下键切换选中光标
  if (e.keyCode == 40) {
    // ArrowDown
    keydownIndex.value++
    keydownIndex.value =
      keydownIndex.value > keydownLength.value ? 0 : keydownIndex.value
    return
  }
  if (e.keyCode == 38) {
    // ArrowUp
    keydownIndex.value--
    keydownIndex.value =
      keydownIndex.value < 0 ? keydownLength.value : keydownIndex.value
    return
  }
  // 左右
  if (keydownIndex.value == 1) {
    if (e.keyCode == 37) {
      // ArrowLeft
      searchIndex.value--
      searchIndex.value =
        searchIndex.value < 0 ? searchList.value.length - 1 : searchIndex.value
    }
    if (e.keyCode == 39) {
      // ArrowRight
      searchIndex.value++
      searchIndex.value =
        searchIndex.value > searchList.value.length - 1 ? 0 : searchIndex.value
    }
  }
}
const calcFocus = () => {
  const searchInputDom = document.querySelector('#search-input') as HTMLElement
  if (keydownIndex.value == 0) {
    searchInputDom.focus()
  } else {
    searchInputDom.blur()
  }
}
const showBuoy = () => {
  buoyRef.value.style.display = 'block'
  buoyRef.value.classList.add('animate_display')
  setTimeout(() => {
    buoyRef.value.classList.remove('animate_display')
  }, 500)
}
const hideBuoy = () => {
  buoyRef.value.classList.add('animate_close')
  setTimeout(() => {
    buoyRef.value.classList.remove('animate_close')
    buoyRef.value.style.display = 'none'
  }, 500)
}
// 计算浮标位置
const calcBuoyPosition = () => {
  let left, top, object

  if (keydownIndex.value == 0) {
    object = document.querySelector('#search-input') as HTMLElement
    left = object.offsetLeft - 20
    top = object.offsetTop + object.offsetHeight / 2 - 7
  }
  if (keydownIndex.value == 1) {
    object = searchToRef.value
    left = object.offsetLeft - object.offsetWidth / 2 - 20
    top = object.offsetTop + object.offsetHeight / 2 - 7
  }
  buoyRef.value.style.left = `${left}px`
  buoyRef.value.style.top = `${top}px`
}
const searchItemClick = (index: number) => {
  searchIndex.value = index
}
</script>

<template>
  <div class="search-box">
    <div class="buoy" ref="buoyRef">
      <i class="iconfont icon-arrow-r_fill"></i>
    </div>
    test
    <MimicryInput
      type="text"
      id="search-input"
      :class="{ active: inputActive }"
      @click="focus"
      v-model="searchStr"
      :placeholder="inputActive ? '' : '搜索'"
    />
    <div class="search-to" ref="searchToRef" :class="{ show: inputActive }">
      <MimicryButton
        v-for="(item, index) in searchList"
        :key="index"
        @click.stop="searchItemClick(index)"
        :active="searchIndex == index"
        class="search-to-item"
      >
        {{ item.name }}
      </MimicryButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-box {
  position: relative;
  margin: 0 auto;
  width: 100%;
  .buoy {
    display: none;
    position: absolute;
    color: var(--mimicry-text-color);
    transition: 0.2s;
  }
  #search-input {
    display: block;
    margin: 0 auto;
    height: 45px;
    width: 15%;
    border-radius: 30px;
    font-size: 16px;
    text-align: center;
    &:hover {
      width: 30%;
    }
    &.active {
      width: 40%;
    }
  }
  .search-to {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%);
    opacity: 0;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    &.show {
      top: 45px;
      opacity: 1;
      transition: all 0.1s 0.2s;
    }
    .search-to-item {
      margin-left: 5px;
      margin-right: 5px;
      border-radius: 20px;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
