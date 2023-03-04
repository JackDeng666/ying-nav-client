import { watch, ref } from 'vue'
import type { Ref } from 'vue'

export const enum VerticalScrollDirection {
  Top,
  Bottom
}

export function useVerticalScroll(
  dom: Ref<HTMLElement | null | undefined>,
  onReach: (direction?: VerticalScrollDirection) => void = () => {}
) {
  let clientHeight: number = 0
  const scrollTop = ref(0)

  function handleScroll() {
    if (dom.value) {
      const scrollHeight = dom.value.scrollHeight
      scrollTop.value = dom.value.scrollTop

      if (scrollTop.value <= 0) {
        onReach(VerticalScrollDirection.Top)
      }

      const currentHeight = scrollTop.value + clientHeight
      if (currentHeight >= scrollHeight) {
        onReach(VerticalScrollDirection.Bottom)
      }
    }
  }

  const stopWatch = watch(dom, () => {
    if (dom.value) {
      clientHeight = dom.value.clientHeight

      dom.value.addEventListener('scroll', handleScroll)

      stopWatch()
    }
  })

  function initToBottom() {
    if (dom.value) {
      dom.value.scrollTo({
        top: dom.value.scrollHeight - clientHeight - 1,
        behavior: 'smooth'
      })
    }
  }

  function initToTop() {
    if (dom.value) {
      dom.value.scrollTo({
        top: 1,
        behavior: 'smooth'
      })
    }
  }

  return {
    initToBottom,
    initToTop,
    scrollTop
  }
}
