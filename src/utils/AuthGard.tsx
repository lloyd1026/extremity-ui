// utils/AuthGuard.ts

class AuthGuard {
  // 用于获取 token 和 refreshToken
  static getToken() {
    return localStorage.getItem('token'); // 获取 token（你可以修改成从 Cookies 获取）
  }

  static getRefreshToken() {
    return localStorage.getItem('refreshToken'); // 获取 refreshToken
  }

  // 路由守卫：检查有没有token || 不需要检查是否过期
  static checkAuth(router: any): void {
    const token = this.getToken();
    if (!token) {
        router.push('/dashboard/login'); // 重定向到登录页面
    }
  }
}

export default AuthGuard;