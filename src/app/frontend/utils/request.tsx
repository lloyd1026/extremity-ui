// utils/axios.js
import axios from 'axios';

// 创建 axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:8080/extremity/api/',  // 设置请求的基础 URL
  timeout: 10000,  // 设置请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
      // 确保 config 和 config.headers 都是有效的
      if (config && config.headers) {
        // 在请求头中添加 Authorization token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      // 处理请求错误
      return Promise.reject(error);
    }
  );
  

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response.data;  // 直接返回响应体
  },
  (error) => {
    // 对响应错误做些什么
    if (error.response) {
      // 请求已发出，服务器返回了状态码
      console.error(`Error: ${error.response.status}`);
    } else {
      // 请求没有发出，可能是网络问题
      console.error('Network Error');
    }
    return Promise.reject(error);
  }
);

// 封装的请求方法
export const request = {
  get: (url: string, params: any) => instance.get(url, { params }),
  post: (url: string, data: any) => instance.post(url, data),
  put: (url: string, data: any) => instance.put(url, data),
  delete: (url: string) => instance.delete(url),
};
