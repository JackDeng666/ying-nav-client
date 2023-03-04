import { ref, reactive, computed, type Ref } from 'vue'
import type { AppError } from './types'

export interface UseFetchListOptions {
  immediate?: boolean
  pageSize?: number
  accumulation?: boolean
}

export interface UseFetchListLoadOptions {
  reload?: boolean
  pushDirect?: 'push' | 'unshift'
}

export interface PaginationData {
  page: number
  size: number
  total: number
}

export function useFetchList<T>(
  getList: (pageData: PaginationData) => Promise<T[]>,
  options: UseFetchListOptions = {},
  defaultValue: T[] = []
) {
  const { immediate = true, pageSize = 10, accumulation = false } = options
  const list = ref<T[]>(defaultValue) as Ref<T[]>
  const loading = ref(false)
  const listLoaded = ref(true)
  const error = ref<AppError>()

  const paginationData: PaginationData = reactive({
    page: 1,
    size: pageSize,
    total: 0
  })

  const pagination = computed({
    get: () => {
      return {
        ...paginationData
      }
    },
    set: (val) => {
      paginationData.page = val.page
      paginationData.size = val.size
      load()
    }
  })

  async function load(loadOptions: UseFetchListLoadOptions = {}) {
    try {
      loading.value = true
      error.value = undefined
      if (accumulation) {
        await accumulationLoad(loadOptions)
      } else {
        await pageLoad()
      }
    } catch (err: any) {
      if (err.code) {
        error.value = err as AppError
      } else {
        error.value = err
      }
    } finally {
      loading.value = false
    }
  }

  async function pageLoad() {
    listLoaded.value = false
    list.value = await getList({ ...paginationData })
    listLoaded.value = true
  }

  async function accumulationLoad(loadOptions: UseFetchListLoadOptions = {}) {
    const { reload, pushDirect = 'push' } = loadOptions
    if (reload) {
      paginationData.page = 1
    }
    listLoaded.value = false
    if (paginationData.page === 1) {
      list.value = await getList({ ...paginationData })
      if (list.value.length < paginationData.size) {
        listLoaded.value = true
      }
    } else {
      const listData = await getList({ ...paginationData })
      list.value[pushDirect](...listData)
      if (listData.length < paginationData.size) {
        listLoaded.value = true
      }
    }
    paginationData.page++
  }

  if (immediate) {
    load()
  }

  return {
    pagination,
    list,
    loading,
    listLoaded,
    load
  }
}
