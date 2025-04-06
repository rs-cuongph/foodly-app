import { useEffect, useState } from 'react';

import { EyeIcon, EyeSlashIcon } from './icons';
import MyInput, { MyInputProps } from './Input';

interface InputPasswordProps extends MyInputProps {
  showStrengthIndicator?: boolean;
}

export default function InputPassword({
  value,
  showStrengthIndicator = false,
  onChange,
  ...props
}: InputPasswordProps) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState(value);
  // Function to check password strength
  const checkPasswordStrength = (password: string) => {
    let strength = 0;

    // Check for uppercase letter
    if (/(?=.*?[A-Z])/.test(password)) {
      strength += 1;
    }

    // Check for lowercase letter
    if (/(?=.*?[a-z])/.test(password)) {
      strength += 1;
    }

    // Check for number
    if (/(?=.*?[0-9])/.test(password)) {
      strength += 1;
    }

    // Check for special character
    if (/(?=.*?[#?!@$%^&*-])/.test(password)) {
      strength += 1;
    }

    // Check for minimum length
    if (/.{8,}/.test(password)) {
      strength += 1;
    }

    return strength;
  };

  // Update password strength when value changes
  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  // Get color based on password strength
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return 'bg-gray-200';
      case 1:
        return 'bg-[#FF0000]';
      case 2:
        return 'bg-[#FE724C]';
      case 3:
        return 'bg-[#FAED43]';
      case 4:
        return 'bg-[#03FE03]';
      case 5:
        return 'bg-[#22C55E]';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="flex flex-col gap-1">
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
        onChange={handleChange}
      />

      {/* Password strength indicator */}
      {showStrengthIndicator && password && (
        <div className="flex flex-col gap-1">
          <div className="flex h-1 w-full gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-full flex-1 rounded-full ${
                  level <= passwordStrength ? getStrengthColor() : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
