import { reactive } from 'vue'

interface CssVariableMap {
  [arr: string]: string
}

const map: CssVariableMap = {
  mimicryBaseColor: '--mimicry-base-color',
  mimicryHighlightColor: '--mimicry-highlight-color',
  mimicryDarknessColor: '--mimicry-darkness-color',
  mimicryTextColor: '--mimicry-text-color'
}

const cssVariable: CssVariableMap = reactive({})
const root = getComputedStyle(document.documentElement)

Object.keys(map).forEach((key) => {
  cssVariable[key] = root.getPropertyValue(map[key])
})

export function useMimicryUIStyle() {
  const setGlobalstyle = (key: string, value: string) => {
    cssVariable[key] = value
    root.setProperty(map[key], value)
  }
  const getGlobalstyle = (str: string) => {
    return cssVariable[str]
  }

  return {
    setGlobalstyle,
    getGlobalstyle
  }
}
