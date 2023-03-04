<script setup lang="ts">
import MimicryButton from '@/components/MimicryUI/MimicryButton.vue'
import { ref, onMounted } from 'vue'
import { PopContentTool } from '@/components/PopContent'
import { setCss, toMove } from './utils'
import UserInfo from '@/views/ToolView/UserInfo/UserInfo.vue'
import ImageSettings from '@/views/ToolView/ImageSettings/ImageSettings.vue'
import FeedBack from '@/views/ToolView/FeedBack/FeedBack.vue'
import Setting from '@/views/ToolView/Setting/SettingConfig.vue'

let homeRef: any = null
let aMenus: any = null
const menus = [
  { name: '用户', class: 'iconfont icon-user', component: UserInfo },
  { name: '设置', class: 'iconfont icon-shezhi', component: Setting },
  {
    name: '主题',
    class: 'iconfont icon-bizhiputie',
    component: ImageSettings
  },
  { name: '帮助', class: 'iconfont icon-bangzhu', component: UserInfo },
  { name: '反馈', class: 'iconfont icon-fankui', component: FeedBack }
]

const menuOff = ref(true)

onMounted(() => {
  aMenus = document.getElementById('menu_list')?.querySelectorAll('.tool-item')
  homeRef = document.querySelector('#home') as HTMLElement

  setCss(homeRef, { $Transition: '0.5s ease all' })
  for (let i = 0; i < aMenus.length; i++) {
    aMenus[i].deg = (200 / (aMenus.length - 1)) * i - 10
  }
})

// 菜单按钮点击
const menuClick = () => {
  if (menuOff.value) {
    setCss(homeRef, { $Transform: 'rotate(-135deg)' })
  } else {
    setCss(homeRef, { $Transform: 'rotate(0deg)' })
  }
  for (let i = 0; i < aMenus.length; i++) {
    if (menuOff.value) toMove(aMenus[i], i * 100, menuOff.value)
    else toMove(aMenus[i], (aMenus.length - 1 - i) * 100, menuOff.value)
  }
  menuOff.value = !menuOff.value
}

// 每一项被点击
const itemClick = (i: number) => {
  PopContentTool.show({
    title: menus[i].name,
    currentCom: menus[i].component
  })
  setCss(aMenus[i], { animation: 'bounce .3s both' })
  setTimeout(function () {
    setCss(aMenus[i], { animation: 'none' })
  }, 300)
}
</script>

<template>
  <div id="menu">
    <div id="menu_list">
      <MimicryButton
        v-for="(item, i) in menus"
        :key="i"
        class="tool-item"
        @click="itemClick(i)"
      >
        <i :class="item.class"></i>
      </MimicryButton>
    </div>
    <MimicryButton id="home" @click="menuClick">
      <i class="iconfont icon-menu-s"></i>
    </MimicryButton>
  </div>
</template>

<style lang="scss" scoped>
#menu {
  width: 50px;
  height: 50px;
  position: fixed;
  right: 20px;
  bottom: 50%;
  z-index: 10;
  #menu_list {
    position: relative;
    margin: 4px;
    .tool-item {
      display: grid;
      place-content: center;
      position: absolute;
      left: 0;
      top: 0;
      height: 42px;
      width: 42px;
      border-radius: 50%;
      font-size: 20px;
    }
  }
  #home {
    display: grid;
    place-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 20px;
  }
}
</style>
