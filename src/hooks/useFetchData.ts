import { ref } from 'vue'
import type { AppError } from './types'

export interface UseFetchDataOptions {
  immediate?: boolean
}

export function useFetchData<T>(
  getData: () => Promise<T>,
  options: UseFetchDataOptions = {}
) {
  const { immediate = false } = options
  const data = ref<T>()
  const loading = ref(false)
  const loaded = ref(true)
  const error = ref<AppError>()

  async function load() {
    try {
      loading.value = true
      loaded.value = false

      data.value = await getData()

      error.value = undefined
    } catch (err: any) {
      if (err.code) {
        error.value = err as AppError
      } else {
        error.value = err.toString()
      }
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  if (immediate) {
    load()
  }

  return {
    data,
    loading,
    loaded,
    load
  }
}
