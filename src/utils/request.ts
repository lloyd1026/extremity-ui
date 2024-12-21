import { UnAuthenticatedError } from '@/exceptions/CustomErrors';
import axios from 'axios';

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function saveToken(token: string): void {
  localStorage.setItem('token', token);
}
function saveRefreshToken(token:string):void {
  localStorage.setItem('refreshToken', token);
}

const instance = axios.create({
  baseURL: 'http://localhost:8080/extremity/api/',  // 设置请求的基础 URL
  timeout: 10000,  // 设置请求超时时间
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
      return Promise.reject(error);
    }
  );
  

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.data && error.response.data.code === "401" && !originalRequest._retry) {
      // 如果token过期，尝试使用refreshToken刷新token
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const response = await axios.post('/refresh-token', { refreshToken });
        if (response.data && response.data.success) {
          const {token, refreshToken} = response.data.data; // 正确的解构
          saveToken(token);
          saveRefreshToken(refreshToken);
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        }
      }

      catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        const errorMessage = (refreshError as Error).message;
        return Promise.reject(new UnAuthenticatedError(errorMessage));
      }

    }
    return Promise.reject(error);
  }
);

// 封装的请求方法
export default instance;
