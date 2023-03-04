<script setup lang="ts">
import MimicryButton from '@/components/MimicryUI/MimicryButton.vue'

const exportData = async () => {
  const filehandle = await (window as any).showSaveFilePicker()
  console.log(filehandle)
  const file = new Blob([localStorage.getItem('navList') || ''], {
    type: 'application/json'
  })
  const stream = await filehandle.createWritable()
  stream.write(file)
  stream.close()
  // const fileUrl = URL.createObjectURL(file)
  // const linkElement = document.createElement('a')
  // linkElement.setAttribute('href', fileUrl)
  // linkElement.setAttribute('download', 'ying-nav-data.json')
  // linkElement.click()
}
const importData = async () => {
  let fileInput = document.createElement('input')
  fileInput.setAttribute('type', 'file')
  fileInput.click()
  fileInput.onchange = () => {
    const file = fileInput.files?.length ? fileInput.files[0] : null
    if (file?.type === 'application/json') {
      let reader = new FileReader()
      reader.onload = () => {
        localStorage.setItem('navList', reader.result as string)
      }
      reader.readAsText(file)
    } else {
      console.log('请导入正确的文件')
    }
  }
}
</script>

<template>
  <div class="setting-wrap">
    <MimicryButton @click="exportData">导出数据</MimicryButton>
    <MimicryButton @click="importData">导入数据</MimicryButton>
  </div>
</template>

<style lang="scss" scoped>
.setting-wrap {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
