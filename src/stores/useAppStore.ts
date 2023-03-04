import { ref } from 'vue'
import { defineStore } from 'pinia'
import throttle from '@/umlib/throttle'

export const useAppStore = defineStore('app', () => {
  const isCoverShow = ref(false)
  const isNavFolderShow = ref(false)

  function showCover() {
    throttle(() => {
      isCoverShow.value = true
    }, 200)
  }

  function hideCover() {
    throttle(() => {
      isCoverShow.value = false
    }, 200)
  }

  function toggleCoverShow() {
    throttle(() => {
      if (isCoverShow.value) {
        isCoverShow.value = false
      } else {
        isCoverShow.value = true
      }
    }, 200)
  }

  function showNavFolder() {
    isNavFolderShow.value = true
  }

  function hideNavFolder() {
    isNavFolderShow.value = false
  }

  function toggleNavFolder() {
    if (isNavFolderShow.value) {
      isNavFolderShow.value = false
    } else {
      isNavFolderShow.value = true
    }
  }

  return {
    isCoverShow,
    isNavFolderShow,
    showCover,
    hideCover,
    toggleCoverShow,
    showNavFolder,
    hideNavFolder,
    toggleNavFolder
  }
})
