import request from './request'

function getNavInfoByUrl(params: any) {
  return request({
    url: '/nav/getNavInfoByUrl',
    params
  })
}

export default {
  getNavInfoByUrl
}
