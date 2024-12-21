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
  async (response) => {
    // 处理服务器返回的数据，检查是否是401状态
    console.log("进来了")
    console.log(response.data)
    if (response.data && response.data.code === 401) {
      console.log('错误信息:', response.data.message);
      console.log("Token 过期了");
      // 获取 refreshToken
      const refreshToken = getRefreshToken();

      try {
        // 请求刷新token
        const refreshResponse = await axios.post(response.config.baseURL+'/auth/refresh-token', { refreshToken });

        if (refreshResponse.data && refreshResponse.data.success) {
          console.log("刷新token成功");

          const { token, refreshToken: newRefreshToken } = refreshResponse.data.data; // 正确的解构
          
          // 保存新的 token 和 refreshToken
          saveToken(token);
          saveRefreshToken(newRefreshToken);

          // 更新请求头的 Authorization
          response.config.headers['Authorization'] = `Bearer ${token}`;

          // 重新发送原始请求
          return axios(response.config);
        } else {
          throw new Error("刷新token失败");
        }
      } catch (refreshError) {
        console.log("刷新失败", refreshError);
        
        // 清除本地存储的token和refreshToken
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        const errorMessage = (refreshError as Error).message;
        return Promise.reject(new UnAuthenticatedError(errorMessage));
      }
    }
    // 返回正常响应
    return response; 
  },
  error => {
    return Promise.reject(error);
  }
);

// 封装的请求方法
export default instance;
