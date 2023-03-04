<script setup lang="ts">
import antiShake from '@/umlib/antiShake'
import { navApi } from '@/api'
import { reactive, watch } from 'vue'
import { guid } from '@/umlib'
import MimicryInput from '@/components/MimicryUI/MimicryInput.vue'
import MimicryButton from '@/components/MimicryUI/MimicryButton.vue'

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  returnData: {
    type: Function,
    default: () => {}
  }
})
const navOb = reactive({
  id: props.item?.id || guid(),
  iconUrl: props.item?.iconUrl,
  url: props.item?.url,
  title: props.item?.title
})

watch(
  () => {
    return navOb.url
  },
  (value) => {
    antiShake(() => {
      getData(value)
    }, 500)
  }
)
async function getData(url: string) {
  let res = await navApi.getNavInfoByUrl({ url })
  if (res.data) {
    navOb.title = res.data.title
    navOb.iconUrl = res.data.iconUrl
  }
}

function del() {
  props.returnData({ status: 2, data: navOb })
}

function submit() {
  if (navOb.title && navOb.url) {
    props.returnData({ status: 1, data: navOb })
  } else {
    alert('请输入地址标题')
  }
}
</script>

<template>
  <div class="add-nav-wrap" @click.stop="">
    <MimicryInput
      class="input"
      type="text"
      placeholder="网址"
      v-model="navOb.url"
    />
    <MimicryInput
      class="input"
      type="text"
      placeholder="标题-留空自动获取"
      v-model="navOb.title"
    />
    <MimicryInput
      class="input"
      type="text"
      placeholder="图标地址"
      v-model="navOb.iconUrl"
    />
    <div class="bottom">
      <img v-if="navOb.iconUrl" class="icon" :src="navOb.iconUrl" />
      <div class="tip" v-else>图标自动获取，或为默认图</div>
      <MimicryButton v-if="item" class="btn" @click="del">删除</MimicryButton>
      <MimicryButton class="btn" @click="submit">
        {{ item ? '保存' : '添加' }}
      </MimicryButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add-nav-wrap {
  .input {
    box-sizing: content-box;
    display: block;
    margin: 6px 0;
    padding: 8px 10px;
    width: 260px;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
  }
  .bottom {
    margin: 6px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: auto;
    }
    .tip {
      font-size: 12px;
      color: #606060;
    }
    .btn {
      box-sizing: content-box;
      border-radius: 6px;
      text-align: center;
      padding: 5px 10px;
      font-size: 14px;
      height: 20px;
      line-height: 20px;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
</style>
