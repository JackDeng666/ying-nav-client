import AddNav from './components/AddNav.vue'
import { ref, onMounted, computed, nextTick } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import antiShake from '@/umlib/antiShake'
import { getElementPosition, spArr } from '@/umlib'
import { LitlePopTool } from '@/components/LitlePop'
import { useNavStore, type NavData } from '@/stores/useNavStore'

import Flipping from 'flipping/dist/flipping.web'
const flipping = new Flipping({
  duration: 300
})

interface AreaData {
  id: number
  left: number
  top: number
  width: number
  height: number
}

export default function () {
  const navStore = useNavStore()
  const app = useAppStore()
  const navList = computed(() => {
    return spArr(navStore.navList, 15)
  })
  const navListIndex = ref(0)
  const currentNavOb = ref<NavData | null>(null)
  const dragId = ref(-1)
  const moveItemBgShow = ref(false)
  let dragStartTime = 0
  let dragIndex = navListIndex.value
  let swapReset = false
  const areaData: any[] = []
  let curentAreaData: AreaData | null = null,
    firtDragArea: AreaData | null = null
  let currentMoveItem: HTMLElement | null = null
  let navItems: NodeListOf<Element> | null = null // 当前显示的导航块
  let startX = 0,
    startY = 0,
    moveObStyle: CSSStyleDeclaration | null = null
  let canCalc = true
  const carouselRef = ref()
  const virtualNavItemRef = ref()

  onMounted(() => {
    navItems = document.querySelectorAll(`.nav-item`)
    calcAreaData()
  })

  // 视图方法
  const add = (e: Event) => {
    LitlePopTool.show(AddNav, { event: e, title: '添加' }).then(
      ({ res, onClose }) => {
        if (res.status) {
          navStore.navList.push(res.data) // 添加到当前视图
          nextTick(() => {
            navItems = document.querySelectorAll(`.nav-item`)
            calcAreaData() // 计算新位置
          })
        }
        onClose()
      }
    )
  }
  const itemRightClick = (e: Event, item: any) => {
    LitlePopTool.show(AddNav, { event: e, title: '编辑' }, { item }).then(
      ({ res, onClose }) => {
        if (res.status) {
          const findItem = navStore.navList.find(
            (el: any) => el.id == res.data.id
          ) // 当前修改的item
          if (findItem) {
            findItem.url = res.data.url
            findItem.title = res.data.title
            findItem.iconUrl = res.data.iconUrl
          }
        }
        onClose()
      }
    )
  }
  const hide = () => {
    app.hideNavFolder()
    app.hideCover()
  }
  const handleMousedown = (e: any, item: any) => {
    dragIndex = navListIndex.value
    dragId.value = item.id
    currentNavOb.value = item
    dragStartTime = Date.now()
    startX = e.x
    startY = e.y
    // 显示可拖动的虚拟dom
    curentAreaData = findCurrent(item.id, navListIndex.value)
    // 隐藏原内容块
    hideNavItem()
    firtDragArea = curentAreaData
    moveItemBgShow.value = false
    moveObStyle = virtualNavItemRef.value.style
    if (moveObStyle) {
      moveObStyle.cssText = `
        display: flex;
        left: ${curentAreaData?.left}px;
        top: ${curentAreaData?.top}px;
        z-index: 999;
        transition: none;
      `
    }
  }
  const handleMousemove = (e: any) => {
    if (dragId.value == -1) return
    const obx = firtDragArea?.left + e.x - startX,
      oby = firtDragArea?.top + e.y - startY
    if (moveObStyle) {
      moveObStyle.left = `${obx}px`
      moveObStyle.top = `${oby}px`
    }
    // 判断是否可以计算交换
    canCalc &&
      antiShake(() => {
        calcPosition(obx, oby)
      }, 300)
  }
  const handleMouseup = () => {
    if (Date.now() - dragStartTime < 100) {
      window.open(currentNavOb.value?.url)
    }
    dragId.value !== -1 && reset()
  }
  const carouselIndexChange = (index: number) => {
    navListIndex.value = index
    nextTick(() => {
      navItems = document.querySelectorAll(`.nav-item`)
      calcAreaData()
    })
  }
  const leftClick = () => {
    carouselRef.value.leftClick()
  }
  const rightClick = () => {
    carouselRef.value.rightClick()
  }
  const directMouseenter = (direct: number) => {
    if (dragId.value == -1) return
    canCalc = false
    antiShake(() => {
      direct == 0 ? leftClick() : rightClick()
      canCalc = true
    }, 500)
  }

  return {
    add,
    itemRightClick,
    navList,
    navListIndex,
    currentNavOb,
    moveItemBgShow,
    hide,
    handleMousedown,
    handleMousemove,
    handleMouseup,
    carouselIndexChange,
    leftClick,
    rightClick,
    directMouseenter,
    carouselRef,
    virtualNavItemRef
  }
  // 内部方法
  function calcPosition(obx: number, oby: number) {
    if (!curentAreaData) return
    // 计算交换位置
    if (dragId.value == -1) return
    let flag = 0
    let changeObIndex = 0 // 标识：1交换位置，2右推位置，目标：交换或右推的目标
    // 拖拽中点
    const obcx = obx + curentAreaData.width / 2,
      obcy = oby + curentAreaData.height / 2,
      len = areaData[navListIndex.value].length
    for (let i = 0; i < len; i++) {
      const el = areaData[navListIndex.value][i]
      const cobcx = el.left + el.width / 2,
        cobcy = el.top + el.height / 2
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
    // 计算changeObIndex处于一维数组位置
    changeObIndex = changeObIndex + navListIndex.value * 15
    if (flag) {
      // 交换数据
      let index = null
      navStore.navList.forEach(
        (el, i) => el.id == String(dragId.value) && (index = i)
      )
      if (index !== changeObIndex) {
        flipping.read()

        flag == 1 && swapArrItem(navStore.navList, index, changeObIndex) // 位于中心
        flag == 2 && moveArrItem(navStore.navList, index, changeObIndex) // 位于左侧

        // 等待虚拟dom渲染后再计算
        nextTick(() => {
          // 先把更新后的拖拽item变为隐藏
          navItems = document.querySelectorAll(`.nav-item`)
          hideNavItem()
          flipping.flip() // 执行动画
          calcAreaData() // 计算当前交换后的位置
          curentAreaData = findCurrent(dragId.value, navListIndex.value) // 更新当前拖拽位置
          swapReset = true // 添加交换位置后的重置位置标识
        })
      }
    }
  }

  function calcAreaData() {
    // 计算每块导航块所在位置
    navList.value.forEach((el, i) => {
      areaData[i] = []
      const calcNavItems = document.querySelectorAll(
        `.nav-content.nc-${navListIndex.value}.real .nav-item`
      )
      calcNavItems.forEach((el: any) => {
        const { left, top } = getElementPosition(el)
        areaData[i].push({
          id: el.attributes['data-flip-key'].value,
          rawleft: left,
          left: left - i * 660,
          top,
          width: el.offsetWidth,
          height: el.offsetHeight
        })
      })
    })
  }
  function findCurrent(value: any, i: number) {
    return areaData[i].find((ef: any) => ef.id == value)
  }
  function hideNavItem() {
    if (navItems) {
      currentMoveItem = Array.from(navItems).find(
        (el: any) => el.attributes['data-flip-key'].value == curentAreaData?.id
      ) as HTMLElement
      if (currentMoveItem) {
        currentMoveItem.style.transition = 'none'
        currentMoveItem.style.opacity = '0'
      }
    }
  }
  function reset() {
    if (!moveObStyle) return
    // 移动元素回到原来位置或者当前位置
    moveObStyle.transition = 'all .3s'
    moveObStyle.zIndex = '1'
    if (swapReset) {
      moveObStyle.left = `${curentAreaData?.left}px`
      swapReset = false
    } else {
      moveObStyle.left = `${
        Number(curentAreaData?.left) + (dragIndex - navListIndex.value) * 660
      }px`
    }
    moveObStyle.top = `${curentAreaData?.top}px`
    moveItemBgShow.value = true
    dragId.value = -1
    setTimeout(() => {
      if (!moveObStyle || !currentMoveItem) return
      currentMoveItem.style.transition = 'none'
      currentMoveItem.style.opacity = '1'
      moveObStyle.display = 'none'
    }, 300)
  }
}

function moveArrItem(arr: any[], cKey: any, oKey: any) {
  // arr目标数组  cKey移动元素下标，oKey目标元素下标
  if (cKey > oKey) {
    arr.splice(oKey, 0, arr[cKey]) // 移动到指定元素之前
    arr.splice(cKey + 1, 1) // 移除原来位置上的该元素
  } else {
    const temp = arr[cKey]
    arr.splice(cKey, 1) // 移除原来位置上的该元素
    arr.splice(oKey - 1, 0, temp) // 移动到指定元素之前
  }
}

function swapArrItem(arr: any[], cKey: any, oKey: any) {
  const temp = arr[cKey]
  arr[cKey] = arr[oKey]
  arr[oKey] = temp
}
