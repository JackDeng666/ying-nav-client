<template>
  <div id="nav-box">
    <!-- 计算位置的虚拟dom -->
    <!-- <div class="nav-content virtual">
      <div
        class="nav-item"
        v-for="item in $store.state.navList[$store.state.navListIndex]"
        :data-flip-key="item.id"
      >
        <div class="wrap"></div>
        <span class="text">{{ item.title }}</span>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
#nav-box {
  width: 100%;
  user-select: none;
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
      // align-items: center;
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
}
</style>
