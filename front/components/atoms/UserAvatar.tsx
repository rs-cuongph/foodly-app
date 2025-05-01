// RandomAvatar.tsx
import { bigSmile } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { User, UserProps } from '@heroui/react';
import { useEffect, useState } from 'react';

interface UserAvatarProps extends UserProps {
  id?: string;
}

export default function UserAvatar(props: UserAvatarProps) {
  const [avatarSrc, setAvatarSrc] = useState<string>('');

  const generateAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 15);

    const avatar = createAvatar(bigSmile, {
      seed: props.id ?? randomSeed,
      size: 32,
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
    });

    setAvatarSrc(avatar.toDataUri());
  };

  useEffect(() => {
    if (!props.avatarProps?.src) {
      generateAvatar();
    }
  }, []);

  return (
    <User
      {...props}
      avatarProps={{
        ...props.avatarProps,
        src: props.avatarProps?.src || avatarSrc,
      }}
      onClick={generateAvatar}
    />
  );
}
