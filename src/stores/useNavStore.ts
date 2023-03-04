import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { guid } from '@/umlib'

export interface NavData {
  id: string
  title: string
  url: string
  iconUrl: string
}

const initArr: NavData[] = [
  {
    id: guid(),
    title: '哔哩哔哩',
    url: 'https://www.bilibili.com/',
    iconUrl: 'https://www.bilibili.com/favicon.ico'
  },
  {
    id: guid(),
    title: '淘宝',
    url: 'https://www.taobao.com/',
    iconUrl: 'https://www.taobao.com/favicon.ico'
  },
  {
    id: guid(),
    title: 'GitHub',
    url: 'https://github.com/',
    iconUrl: 'https://github.githubassets.com/favicons/favicon.png'
  }
]

export const useNavStore = defineStore('nav', () => {
  const navList = ref(useLocalStorage<NavData[]>('navList', initArr))

  return {
    navList
  }
})
