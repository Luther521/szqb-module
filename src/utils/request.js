import axios from 'axios'
import qs from 'qs'

// 创建axios实例
const service = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [function(data) {
    // Do whatever you want to transform the data
    const request = qs.stringify({
      data: JSON.stringify(data)
    })
    return request
  }],
  // baseURL: process.env.BASE_API, // api的base_url
  baseURL: 'http://192.168.80.240:8083',
  timeout: 15000, // 请求超时时间
  responseType: 'json'
})

// request拦截器
service.interceptors.request.use(config => {
  // if (store.getters.token) {
  //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (Number(res.code) !== 200) {
      // 50008:非法的token 50012:其他客户端登录了  50014:Token 过期了
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  }
)

export default service
