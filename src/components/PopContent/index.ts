import { createPinia } from 'pinia'
import PopContentConstructor from './PopContent.vue'
import { createApp, type App } from 'vue'

export const PopContentTool = {
  show(options: any) {
    let div: Element | null = document.createElement('div')
    let root: App | null = null
    document.body.appendChild(div)
    const onClose = () => {
      root && (root as App).unmount()
      div && document.body.removeChild(div)
      root = null
      div = null
    }
    root = createApp(PopContentConstructor, { ...options, onClose })

    root.use(createPinia()).mount(div)
  }
}
