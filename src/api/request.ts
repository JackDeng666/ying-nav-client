import axios from 'axios'

const service = axios.create({
  baseURL: '/api'
})

service.interceptors.request.use((config) => {
  // console.log(config)
  return config
})

service.interceptors.response.use((res) => {
  return res.data
})

export default service
