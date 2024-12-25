// src/components/UserAvatar.tsx
import React from 'react';
import config from "@/config/baseurl_config";
import { User } from "../info";

interface UserAvatarProps {
    user: User;
    size?: number;
    defaultAvatar?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 40, defaultAvatar = '/default-avatar.png' }) => {
    const avatarUrl = user.avatarUrl ? `${config.imageUrl}${user.avatarUrl}` : defaultAvatar;

    return (
        <img
            src={avatarUrl}
            alt={`${user.account}'s Avatar`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                marginRight: '10px',
            }}
        />
    );
};

export default UserAvatar;
