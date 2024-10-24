import React from "react";
import { useFormContext } from "react-hook-form";
import classNames from "classnames";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  icon?: React.ReactNode;
}

export const FormInput = ({
  name,
  label,
  icon,
  className,
  ...props
}: FormInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        {icon}
        {label}
      </label>
      <input
        {...register(name)}
        id={name}
        className={classNames(
          "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white",
          {
            "border-red-500": errors[name],
            "border-gray-300": !errors[name],
          },
          className
        )}
        {...props}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};
