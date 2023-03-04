import { nextTick, type Ref } from 'vue'
import { useFetchList, type PaginationData } from './useFetchList'
import { useVerticalScroll, VerticalScrollDirection } from './useVerticalScroll'

export interface UseScrollFetchListOptions {
  pageSize?: number
  captureDirection?: VerticalScrollDirection
}

export function useScrollFetchList<T>(
  dom: Ref<HTMLElement | null>,
  getList: (pageData: PaginationData) => Promise<T[]>,
  options: UseScrollFetchListOptions = {},
  defaultValue: T[] = []
) {
  const { pageSize = 10, captureDirection = VerticalScrollDirection.Bottom } =
    options
  const isTop = captureDirection === VerticalScrollDirection.Top
  const { list, loading, listLoaded, load } = useFetchList<T>(
    getList,
    {
      immediate: !isTop,
      pageSize,
      accumulation: true
    },
    defaultValue
  )

  async function firstLoad() {
    await load({ pushDirect: 'unshift' })
    initToBottom()
  }

  if (isTop) {
    firstLoad()
  }

  const { initToBottom, initToTop } = useVerticalScroll(dom, (direction) => {
    if (direction === captureDirection && !listLoaded.value && !loading.value) {
      load({
        pushDirect: isTop ? 'unshift' : 'push'
      })
      nextTick(() => {
        if (loading.value) {
          if (isTop) {
            initToTop()
          } else {
            initToBottom()
          }
        }
      })
    }
  })

  return {
    list,
    loading,
    listLoaded,
    load
  }
}
