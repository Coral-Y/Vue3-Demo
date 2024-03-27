import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: '', // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 处理异常的情况
    if (res.code !== 200) {
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
