'use client'; // 确保这是一个 Client Component
import { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/authcontext';
import Loading from '../components/loading/loading';
import PrivateRoute from '../components/auth/privateroute';
import Profile from '../components/profile/profile';
import TeamUserProfile from '../components/profile/team-user-profile';

export default function ProfilePage() {
  const [mounted, setIsMounted] = useState(false);
  const {auth} =useAuth();



  useEffect(()=>{
    setIsMounted(true)
  },[auth])

  return (
    mounted&&
    <PrivateRoute roles={[4,3]}>
      {
        auth!==null&&auth!==undefined&&
        <div className="flex min-h-screen">
          <div className="flex-1 p-6">
          {auth.scope[0] === 4 ? <Profile /> : <TeamUserProfile />}
          
          </div>
        </div>
      }
      </PrivateRoute>
  );
}
