import LitlePopConstructor from './LitlePop.vue'
import { createApp, type App, type Component } from 'vue'

export const LitlePopTool = {
  show(
    component: Component,
    popOptions: any = {},
    cOptions: any = {}
  ): Promise<any> {
    return new Promise((resolve) => {
      let div: Element | null = document.createElement('div')
      let root: App | null = null
      document.body.appendChild(div)
      const onClose = () => {
        root && (root as App).unmount()
        div && document.body.removeChild(div)
        root = null
        div = null
      }

      // 自定义传入得组件
      const returnData = (res: any) => {
        resolve({ res, onClose })
      }
      const content = createApp(component, { ...cOptions, returnData })

      root = createApp(LitlePopConstructor, {
        ...popOptions,
        onClose,
        returnData,
        contentApp: content
      })
      root.mount(div)
    })
  }
}
