"use clients"
import { PhotoIcon} from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import request from "@/utils/request";
import { User } from '../info';
import { useAuth } from '../auth/authcontext';
import Loading from '../loading/loading';
import config from '@/config/baseurl_config';
interface TeamUserDetails {
  userId: number;
    position: string|null;
    personalBio: string|null;
    researchDirection: string|null;
    researchOverview: string|null;
  }
const TeamUserProfile = () => {
  const [image, setImage] = useState<File | null>(null); // 存储选择的图片
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 存储预览图片的URL
  const [account, setAccount] = useState<string>(''); // 存储姓名
  const [name, setName] = useState<string>(''); // 存储姓名
  const [gender, setGender] = useState<string>(''); // 存储性别
  const [phone, setPhone] = useState<string>(''); // 存储电话号码
  const [user, setUser] = useState<User |null>(null);
  const [teamUser,setTeamUser] = useState<TeamUserDetails|null>(null);
  const [position,setPosition] = useState<string|null>(null);
  const [researchDirection,setResearchDirection] = useState<string|null>(null);
  const [researchOverview,setResearchOverview] = useState<string|null>(null);
  const [personalBio,setPersonalBio] = useState<string|null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { auth } = useAuth();

  const fetchUser = async()=>{
    try{
          const response = await request.get(`/user/email`,{params:{email:auth?.account}})
          if(response.data.success){
            console.log(response.data.data)
            setUser(response.data.data);
          }
    }
    catch(error){
      console.log(error);      
      setUser(null);
    }
  }
  const fetchTeamUser = async()=>{
    try {
        const response = await request.get(`/team-user/id`,{params:{id:auth?.idUser}})
        if(response.data.success){
            setTeamUser(response.data.data)
        }
    } catch (error) {
        alert("获取团队成员错误")
    }
  }
  useEffect(()=>{
    fetchUser();
    fetchTeamUser();
    setIsMounted(true)
  },[auth])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreview(fileReader.result as string); // 设置图片预览
        
      };
      fileReader.readAsDataURL(file); // 读取图片文件为Data URL
    }
  };

  // 向后端发送头像、姓名、性别和电话号码
  const handleSave = async () => {
    if(auth?.idUser){
    const formData = new FormData();
    if (image) {
      formData.append('file', image); // 将图片文件添加到FormData
    }
    if (user?.email) {
      formData.append('email', user.email);
    }
    formData.append('account', account); // 添加姓名到FormData
    formData.append('name', name); // 添加姓名到FormData
    formData.append('sex', gender); // 添加性别到FormData
    formData.append('phone', phone); // 添加电话号码到FormData
    const teamUser1:TeamUserDetails = {
      userId:auth?.idUser,
            position:position,
            researchDirection:researchDirection,
            researchOverview:researchOverview,
            personalBio:personalBio
    }
    const response1 = await request.post('/team-user/upload-avatar',teamUser1)
    const response2 = await request.post('/user/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response1.data.success&&response2.data.success) {
        alert('修改信息成功');
      } else {
        alert('修改信息失败');
      }
  }
}
  const currentImage = () => {
    if (imagePreview === null) {
      if (user && user.avatarUrl) {
        return `${config.imageUrl}${user.avatarUrl}`;
      }
      return "/images/default-avatar.jpg"; // 默认头像
    } else {
      return imagePreview; // 直接返回 Data URL
    }
  }
  

  return (
      (isMounted&&user!==null)?
    (<div className="max-w-xl mx-auto p-6">

      <div className="col-span-full">
        <label htmlFor="photo" className="block text-sm font-medium text-gray-900">
          头像
        </label>

        <div className="mt-2 flex justify-center items-center gap-x-3">
            <Image
              src={currentImage() || "/images/default-avatar.jpg"}
              alt="Avatar Preview"
              className="h-24 w-24 rounded-full object-cover"
              width={96}
              height={96}
            />
        </div>

      </div>

      {/* 上传文件部分 - 调整大小 */}
      <div className="col-span-full mt-6">
        <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-900">
          修改头像
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-1.5 py-2">
          <div className="text-center">
            <PhotoIcon aria-hidden="true" className="mx-auto h-10 w-10 text-gray-300" />
            <div className="mt-4 flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>上传文件</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="p1-1">PNG, JPG, GIF 最大10MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* 姓名输入部分 */}
      <div className="col-span-full mt-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
          用户名
        </label>
        <input
          type="text"
          id="account"
          name="account"
          value={account||(user?.account)}
          onChange={(e) => setAccount(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="请输入您的用户名"
        />
      </div>

      {/* 姓名输入部分 */}
      <div className="col-span-full mt-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
          姓名
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name||user?.realName}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="请输入您的姓名"
        />
      </div>

      {/* 性别输入部分 */}
      <div className="col-span-full mt-6">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-900">
          性别
        </label>
        <select
          id="gender"
          name="gender"
          value={gender||user?.sex}
          onChange={(e) => setGender(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">请选择性别</option>
          <option value="1">男</option>
          <option value="0">女</option>
        </select>
      </div>

      {/* 电话号码输入部分 */}
      <div className="col-span-full mt-6">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
          电话号码
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone||user?.phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="请输入您的电话号码"
        />
      </div>
      <div className="col-span-full mt-6">
        <label htmlFor="position" className="block text-sm font-medium text-gray-900">
          职位
        </label>
        <input
          type="tel"
          id="position"
          name="position"
          value={position||teamUser?.position||""}
          onChange={(e) => setPosition(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="输入你的职位"
        />
      </div>
      <div className="col-span-full mt-6">
        <label htmlFor="researchDirection" className="block text-sm font-medium text-gray-900">
          研究方向
        </label>
        <input
          type="tel"
          id="researchDirection"
          name="researchDirection"
          value={researchDirection||teamUser?.researchDirection||""}
          onChange={(e) => setResearchDirection(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="输入你的研究方向"
        />
      </div>
      <div className="col-span-full mt-6">
  <label htmlFor="researchOverview" className="block text-sm font-medium text-gray-900">
    研究概述
  </label>
  <textarea
    id="researchOverview"
    name="researchOverview"
    value={researchOverview || teamUser?.researchOverview||""}
    onChange={(e) => setResearchOverview(e.target.value)}
    className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
    placeholder="输入研究概述"
    rows={4} // 控制文本框的行数
  />
</div>

<div className="col-span-full mt-6">
  <label htmlFor="personalBio" className="block text-sm font-medium text-gray-900">
    个人简介
  </label>
  <textarea
    id="personalBio"
    name="personalBio"
    value={personalBio || teamUser?.personalBio || ""}
    onChange={(e) => setPersonalBio(e.target.value)}
    className="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
    placeholder="输入个人简介"
    rows={4} // 控制文本框的行数
  />
</div>

      {/* 保存按钮 */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          保存
        </button>
      </div>
    </div>):
    (
      <Loading/>
    )
  );
};

export default TeamUserProfile;
