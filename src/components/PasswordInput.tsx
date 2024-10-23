// components/PasswordInput.tsx
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';
import classNames from 'classnames';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export const PasswordInput = ({ name, label = "Password", ...props }: PasswordInputProps) => {
  const { register, formState: { errors } } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Lock className="h-4 w-4 text-gray-500" />
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name)}
          id={name}
          type={showPassword ? "text" : "password"}
          className={classNames(
            "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-10 bg-white",
            {
              'border-red-500': errors[name],
              'border-gray-300': !errors[name]
            }
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};