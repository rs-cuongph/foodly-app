import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { EyeIcon, EyeSlashIcon } from './icons';
import MyInput, { MyInputProps } from './Input';

interface InputPasswordProps extends MyInputProps {}

export default function InputPassword({ ...props }: InputPasswordProps) {
  const tSignInModal = useTranslations('sign_in_modal');

  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <MyInput
      {...props}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={() => setIsShowPassword(!isShowPassword)}
        >
          {isShowPassword ? (
            <EyeIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <EyeSlashIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
      }
      size="md"
      type={isShowPassword ? 'text' : 'password'}
    />
  );
}
