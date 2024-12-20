// utils/AuthGuard.ts

class AuthGuard {
  // 用于获取 token 和 refreshToken
  static getToken() {
    return localStorage.getItem('token'); // 获取 token（你可以修改成从 Cookies 获取）
  }

  static getRefreshToken() {
    return localStorage.getItem('refreshToken'); // 获取 refreshToken
  }

//   // 验证 token 是否有效（可以进行更复杂的逻辑，比如 JWT 解析，检查过期时间等）
//   static verifyToken(token: string): boolean {
//     const tokenPayload = this.parseJwt(token);
//     console.log('Token Payload:', tokenPayload);  // 打印解析后的 token 数据
//     const currentTime = Date.now() / 1000; // 当前时间戳（秒）
//     console.log('Current Time:', currentTime);  // 打印当前时间
//     // 判断 token 是否过期
//     return tokenPayload.exp >= currentTime;
//   }

//   // 解析 JWT token
//   static parseJwt(token: string): any {
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace('-', '+').replace('_', '/');
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split('')
//           .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//           .join('')
//       );
//       return JSON.parse(jsonPayload);
//     } catch (e) {
//       return null;
//     }
//   }

  // 路由守卫：检查有没有token || 不需要检查是否过期
  static checkAuth(router: any): void {
    const token = this.getToken();
    if (!token) {
        router.push('/login'); // 重定向到登录页面
    }
  }
}

export default AuthGuard;