import { useState } from "react";

const useImageUpload = () => {
  const [image, setImage] = useState<File | null>(null); // 图片文件
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 预览 URL

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreview(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return {
    image,
    imagePreview,
    handleFileChange,
    resetImage,
  };
};

export default useImageUpload;