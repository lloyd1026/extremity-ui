"use clients"
import userwithRoles from '@/interfaces/userwithRoles';
import getuserwithRoles from '@/utils/getuserwithRoles';
import { usePathname} from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<{ auth: userwithRoles | null | undefined, setAuth: React.Dispatch<React.SetStateAction<userwithRoles | null| undefined>> }>({ auth: null, setAuth: () => {} });
import { ReactNode } from 'react';

export const AuthProvider = ({ children }: {children:ReactNode}) => {
  const [auth, setAuth] = useState<userwithRoles|null|undefined>(undefined);
  const [isMounted,setIsMounted] = useState<boolean>(false);
  const pathname = usePathname();
  const getme = async ()=>{
    try{
        const response = await getuserwithRoles();
        console.log(response)
        if(response.data && response.data.success &&response.data.data.user){
            console.log("在context文件里"+response.data.data.user)
            setAuth(response.data.data.user);
        }else{
            setAuth(null);
        }
    }
    catch(error){
        console.log(error);
        setAuth(null);
        // if(error instanceof UnAuthenticatedError){
        //     console.log("进入login");
        //     router.push('/frontend/login');
        // }else{
        //     console.log("进入404");
        //     router.push('/404');
        // }
    }
  }

  useEffect(() => {
    if(localStorage.getItem('token')===null){
        console.log("token === null")
        setAuth(null)
    }
    getme();
    setIsMounted(true)
}, [pathname]);

  return (
    isMounted&&
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  return useContext(AuthContext);
};