import axios from 'axios';

const http = axios.create({
  baseURL: 'https:/v3pz.itndedu.com/v3pz',
  timeout: 10000,
  headers: {
    "terminal":'h5'
  }
});

// 添加请求拦截器
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('h5_token');
  // 不需要 token 的接口，直接返回 config
  const whiteUrl = ['/login']
  if (token && !whiteUrl.includes(config.url)) {
    config.headers['h-token'] = token;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('h5_token');
  // 判断请求的url是否是白名单中的，不需要 token 的接口，直接返回 config
  const whiteUrl = ['/login'];
  if (token && !whiteUrl.some(url => config.url.includes(url))) {
    config.headers['h-token'] = token;
    config.headers['x-token'] = '10ae9c772c7b7449f900d9568c2a2b5a';
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


export default http;