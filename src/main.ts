import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

document.addEventListener(
  'error',
  function (event: ErrorEvent) {
    const ev = event || window.event
    const elem = ev.target as HTMLImageElement
    if (elem?.tagName && elem.tagName.toLowerCase() == 'img') {
      elem.src = 'images/comical.png'
    }
  },
  true
)

createApp(App).use(createPinia()).mount('#app')
