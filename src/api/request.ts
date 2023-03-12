import axios from 'axios'
console.log(import.meta.env.VITE_BASE_API, 'VITE_BASE_API')
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API
})

service.interceptors.request.use((config) => {
  // console.log(config)
  return config
})

service.interceptors.response.use((res) => {
  return res.data
})

export default service
