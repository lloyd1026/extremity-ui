// src/api/axiosInstance.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { UnAuthenticatedError } from '@/exceptions/CustomErrors';

// 获取刷新令牌
function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

// 保存令牌
function saveToken(token: string): void {
  localStorage.setItem('token', token);
}

// 保存刷新令牌
function saveRefreshToken(token: string): void {
  localStorage.setItem('refreshToken', token);
}

// 移除所有相关存储
function removeTokens(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('userInfo');
}

// 创建主 Axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/extremity/api/',  // 设置请求的基础 URL
  timeout: 10000, // 请求超时时间 10 秒
});

// 请求拦截器：在每个请求中添加 Authorization 头
instance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any): Promise<any> => {
    return Promise.reject(error);
  }
);

// 创建一个不含拦截器的 Axios 实例用于刷新令牌
const refreshInstance: AxiosInstance = axios.create({
  baseURL: instance.defaults.baseURL, // 使用相同的 baseURL
  timeout: 10000,
});

// 定义队列中每个请求的结构
interface FailedRequest {
  resolve: (value?: AxiosResponse<any>) => void;
  reject: (error: any) => void;
}

// 设置一个标志来防止多次刷新请求
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// 处理队列中的请求
const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// 响应拦截器：处理 401 错误并尝试刷新令牌
instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // 如果响应正常，直接返回
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 检查是否为 401 错误，并且原始请求未重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 标记该请求已经重试过
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // 如果没有刷新令牌，移除所有存储并抛出未认证错误
        removeTokens();
        return Promise.reject(new UnAuthenticatedError('刷新令牌不存在，请重新登录。'));
      }

      if (isRefreshing) {
        // 如果正在刷新，返回一个新的 Promise 并将请求加入队列
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
              }
              resolve(instance(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        // 发起刷新令牌请求
        const refreshResponse = await refreshInstance.post('/auth/refresh-token', { refreshToken });

        if (refreshResponse.status === 200 && refreshResponse.data?.success) {
          const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

          // 保存新的令牌
          saveToken(newToken);
          saveRefreshToken(newRefreshToken);

          // 处理队列中的所有请求
          processQueue(null, newToken);

          // 更新原始请求的 Authorization 头
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }

          // 重新发起原始请求
          return instance(originalRequest);
        } else {
          throw new UnAuthenticatedError('刷新令牌失败，请重新登录。');
        }
      } catch (refreshError: any) {
        // 处理刷新令牌失败的情况
        processQueue(refreshError, null);
        removeTokens();
        if (refreshError instanceof UnAuthenticatedError) {
          return Promise.reject(refreshError);
        }
        return Promise.reject(new UnAuthenticatedError('刷新令牌失败，请重新登录。'));
      } finally {
        isRefreshing = false;
      }
    }

    // 对于其他错误，直接拒绝
    return Promise.reject(error);
  }
);

// 封装的 Axios 实例
export default instance;