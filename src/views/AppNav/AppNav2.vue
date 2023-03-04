<script setup lang="ts">
import YingDragGrid from '@/components/YingDragGrid/YingDragGrid.vue'
import MimicryButton from '@/components/MimicryUI/MimicryButton.vue'
import { useAppStore } from '@/stores/useAppStore'
import { useNavStore, type NavData } from '@/stores/useNavStore'
import { LitlePopTool } from '@/components/LitlePop'
import AddNav from './components/AddNav.vue'

const app = useAppStore()
const navStore = useNavStore()
function hide() {
  app.hideNavFolder()
  app.hideCover()
}

function handleClick(record: NavData) {
  window.open(record.url)
}

function updateList(list: any[]) {
  navStore.navList = list
}

function editNav(e: Event, item: NavData) {
  LitlePopTool.show(AddNav, { event: e, title: '编辑' }, { item }).then(
    ({ res, onClose }) => {
      if (res.status === 1) {
        const findItem = navStore.navList.find(
          (el: any) => el.id == res.data.id
        )
        if (findItem) {
          findItem.url = res.data.url
          findItem.title = res.data.title
          findItem.iconUrl = res.data.iconUrl
        }
      }
      if (res.status === 2) {
        navStore.navList = navStore.navList.filter(
          (el) => el.id !== res.data.id
        )
      }
      onClose()
    }
  )
}

function addNav(e: Event) {
  LitlePopTool.show(AddNav, { event: e, title: '添加' }).then(
    ({ res, onClose }) => {
      if (res.status === 1) {
        navStore.navList.push(res.data)
      }
      onClose()
    }
  )
}
</script>

<template>
  <div id="nav-box" @click.right="hide">
    <YingDragGrid
      :contentStyle="{ margin: '0 auto', width: '792px', maxHeight: '500px' }"
      :list="navStore.navList"
      @clickItem="handleClick"
      @updateList="updateList"
    >
      <template #girdItem="{ record, mousedownFunc }">
        <div class="nav-item">
          <MimicryButton
            class="wrap"
            hover-active
            @click.right.stop.prevent="editNav($event, record)"
            @mousedown.left="mousedownFunc($event, record)"
          >
            <img class="icon" :src="record.iconUrl || 'images/comical.png'" />
          </MimicryButton>
          <span class="text">{{ record.title }}</span>
        </div>
      </template>
      <template #extra>
        <div class="add-item">
          <MimicryButton class="wrap" hover-active @click.left="addNav">
            <div class="add">+</div>
          </MimicryButton>
          <span class="text">添加</span>
        </div>
      </template>
    </YingDragGrid>
  </div>
</template>

<style lang="scss" scoped>
#nav-box {
  width: 100%;
  height: 100%;
  padding-top: 230px;
  user-select: none;
  .nav-item {
    width: 132px;
    height: 122px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: none;
    font-size: 14px;
    .wrap {
      width: 80px;
      height: 80px;
      border-radius: 5px;
      margin-bottom: 8px;
      position: relative;
      padding: 0;
      cursor: pointer;
      .icon {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        background-color: #fff;
        padding: 8px;
        pointer-events: none;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .text {
      max-width: 132px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .add-item {
    width: 132px;
    height: 122px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: none;
    font-size: 14px;
    .wrap {
      width: 80px;
      height: 80px;
      border-radius: 5px;
      cursor: pointer;
      margin-bottom: 8px;
      padding: 0;
      .add {
        font-weight: 0;
        text-align: center;
        line-height: 80px;
        font-size: 50px;
      }
    }
  }
}
</style>
