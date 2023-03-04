<script setup lang="ts">
import CarouselSwiper from '@/components/Carousel/CarouselSwiper.vue'
import CarouselItem from '@/components/Carousel/CarouselItem.vue'
import navMove from './navMove'

// 移动布局相关
const {
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
} = navMove()
</script>

<template>
  <div
    id="nav-box"
    @click.right="hide"
    @mousemove.left="handleMousemove"
    @mouseup.left="handleMouseup"
  >
    <div class="silde-container">
      <div
        class="click-item"
        @click="leftClick"
        @mouseenter="directMouseenter(0)"
      >
        <span>《</span>
      </div>
      <CarouselSwiper
        ref="carouselRef"
        :cIndex="navListIndex"
        :hasDot="true"
        @indexChange="carouselIndexChange"
      >
        <CarouselItem v-for="(citem, i) in navList" :key="i">
          <div :class="`nav-content nc-${i} real`">
            <div
              class="nav-item"
              v-for="item in citem"
              :key="item.id"
              :data-flip-key="item.id"
            >
              <div
                class="wrap"
                @click.right.stop.prevent="itemRightClick($event, item)"
                @mousedown.left="handleMousedown($event, item)"
              >
                <img class="icon" :src="item.iconUrl || 'images/comical.png'" />
              </div>
              <span class="text">{{ item.title }}</span>
            </div>
            <div v-if="navList[i].length < 15" class="add-item">
              <div class="wrap" @click.left="add">
                <div class="add">+</div>
              </div>
              <span class="text">添加</span>
            </div>
          </div>
        </CarouselItem>
      </CarouselSwiper>
      <div
        class="click-item"
        @click="rightClick"
        @mouseenter="directMouseenter(1)"
      >
        <span>》</span>
      </div>
    </div>
    <div class="virtual-nav-item" ref="virtualNavItemRef">
      <div :class="['wrap', moveItemBgShow ? 'show-bg' : '']">
        <img
          class="icon"
          :src="currentNavOb?.iconUrl || 'images/comical.png'"
        />
      </div>
      <span class="text">{{ currentNavOb?.title }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#nav-box {
  width: 100%;
  height: 100%;
  padding-top: 200px;
  user-select: none;
  .silde-container {
    width: 860px;
    height: 400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    .nav-content {
      margin: 0 auto;
      width: 660px;
      display: flex;
      flex-wrap: wrap;
      .nav-item {
        width: 132px;
        height: 122px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: none;
        color: #fff;
        font-size: 14px;
        .wrap {
          width: 80px;
          height: 80px;
          border-radius: 5px;
          background-color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          margin-bottom: 8px;
          position: relative;
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
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
        color: #fff;
        font-size: 14px;
        .wrap {
          width: 80px;
          height: 80px;
          border-radius: 5px;
          background-color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          margin-bottom: 8px;
          position: relative;
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          .add {
            font-weight: 0;
            text-align: center;
            line-height: 80px;
            font-size: 50px;
          }
        }
      }
    }
    .click-item {
      flex-shrink: 0;
      width: 100px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      background: rgba(255, 255, 255, 0);
      span {
        color: rgba(255, 255, 255, 0);
      }
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        span {
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
  .virtual-nav-item {
    width: 132px;
    height: 122px;
    position: fixed;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 14px;
    pointer-events: none;
    .wrap {
      width: 80px;
      height: 80px;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 0.1);
      cursor: pointer;
      margin-bottom: 8px;
      position: relative;
      &.show-bg {
        background-color: rgba(255, 255, 255, 0.7);
      }
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
}
</style>
