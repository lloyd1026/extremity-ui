// // pages/login.js
// import { useState } from 'react';
// import { useRouter } from 'next/router';

// const LoginPage = () => {
//   const router = useRouter();
  
//   // 表单状态
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 表单提交处理
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // 登录成功，重定向到首页或用户主页
//         router.push('/');
//       } else {
//         // 登录失败，显示错误信息
//         setError(data.message || '登录失败，请检查用户名和密码');
//       }
//     } catch (err) {
//       setError('网络错误，请稍后再试');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold text-center mb-6">登录</h2>

//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//         <div className="mb-4">
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">邮箱</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full mt-2 p-2 border border-gray-300 rounded-md"
//             placeholder="请输入邮箱"
//           />
//         </div>

//         <div className="mb-6">
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700">密码</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full mt-2 p-2 border border-gray-300 rounded-md"
//             placeholder="请输入密码"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full p-2 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
//         >
//           {loading ? '登录中...' : '登录'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;
const SignInPage = () => {
    return (
      <div>
        <h1>Sign In Page</h1>
      </div>
    );
  };
  
  export default SignInPage;